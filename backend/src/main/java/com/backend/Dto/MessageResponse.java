package com.backend.Dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long id;

    private Long conversationId;

    private Long senderId;

    private String senderUsername;

    private String content;

    private String messageType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean edited;

    private boolean deleted;
}