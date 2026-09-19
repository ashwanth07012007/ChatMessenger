package com.backend.Controller;

import com.backend.Dto.UpdateProfileRequest;
import com.backend.Dto.UserResponse;
import com.backend.Entity.User;
import com.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getUsers() {

        return userService.getUsers();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        String currentUsername =
                authentication.getName();

        String newToken =
                userService.updateProfile(
                        currentUsername,
                        request
                );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "token", newToken
                )
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        String username =
                authentication.getName();

        User user =
                userService.getProfile(username);

        return ResponseEntity.ok(user);
    }
}