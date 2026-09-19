package com.backend.Dto;

import com.backend.Entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String profileImage;

    private String bio;
    private User.UserStatus status;
}