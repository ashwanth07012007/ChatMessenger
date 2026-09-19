package com.backend.Controller;

import com.backend.Dto.LoginRequest;
import com.backend.Dto.RegisterRequest;
import com.backend.Entity.User;
import com.backend.Repository.UserRepository;
import com.backend.Service.EmailService;
import com.backend.Service.JwtService;

import com.backend.Service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserService userService;


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(
                request.getUsername())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }


        if (userRepository.existsByEmail(
                request.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }


        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .build();


        userRepository.save(user);

        emailService.sendRegistrationNotification(
                user.getUsername(),
                user.getEmail()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }


        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatches) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        userService.setOnline(user.getUsername());

        // Generate JWT
        String token =
                jwtService.generateToken(
                        user.getUsername()
                );
        emailService.sendLoginNotification(
                user.getUsername()
        );


        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username", user.getUsername(),
                        "email", user.getEmail()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            Authentication authentication) {

        String username = authentication.getName();

        userService.setOffline(username);

        return ResponseEntity.ok(
                "Logged out successfully"
        );
    }
}