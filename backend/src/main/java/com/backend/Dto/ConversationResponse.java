package com.backend.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long conversationId;

    private String type;

    private String name;

    private Long userid;
    private String username;
}