package com.backend.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String username;

    private String bio;

    private String profileImage;
}