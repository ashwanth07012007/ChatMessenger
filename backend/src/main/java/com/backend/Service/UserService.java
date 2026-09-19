package com.backend.Service;

import com.backend.Dto.UpdateProfileRequest;
import com.backend.Dto.UserResponse;
import com.backend.Entity.User;
import com.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public List<UserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(user ->
                        UserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .profileImage(user.getProfileImage())
                                .bio(user.getBio())
                                .status(user.getStatus())
                                .build()
                )
                .toList();
    }

    public User getProfile(String username) {

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }

    public String updateProfile(
            String currentUsername,
            UpdateProfileRequest request) {

        User user =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        if (request.getUsername() != null &&
                !request.getUsername().trim().isEmpty()) {

            String newUsername =
                    request.getUsername().trim();

            if (!newUsername.equals(
                    user.getUsername())) {

                if (userRepository
                        .existsByUsername(newUsername)) {

                    throw new RuntimeException(
                            "Username already exists"
                    );
                }

                user.setUsername(newUsername);
            }
        }

        if (request.getBio() != null) {

            user.setBio(
                    request.getBio().trim()
            );
        }

        if (request.getProfileImage() != null) {

            user.setProfileImage(
                    request.getProfileImage().trim()
            );
        }

        User updatedUser =
                userRepository.save(user);

        // Create new JWT using the updated username
        return jwtService.generateToken(
                updatedUser.getUsername()
        );
    }

    public void setOnline(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user != null) {

            user.setStatus(User.UserStatus.ONLINE);
            user.setLastSeen(null);

            userRepository.save(user);
        }
    }

    public void setOffline(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user != null) {

            user.setStatus(User.UserStatus.OFFLINE);
            user.setLastSeen(LocalDateTime.now());

            userRepository.save(user);
        }
    }
}