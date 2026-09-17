package com.backend.Controller;

import com.backend.Dto.MessageResponse;
import com.backend.Dto.SendMessageRequest;
import com.backend.Entity.Message;
import com.backend.Service.MessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(
            SendMessageRequest request,
            Principal principal) {

        System.out.println(
                "WEBSOCKET PRINCIPAL: "
                        + principal
        );

        String username =
                principal.getName();

        Message message =
                messageService.sendMessage(
                        username,
                        request
                );

        MessageResponse response =
                MessageResponse.builder()
                        .id(message.getId())
                        .conversationId(
                                message.getConversation().getId()
                        )
                        .senderId(
                                message.getSender().getId()
                        )
                        .senderUsername(
                                message.getSender().getUsername()
                        )
                        .content(message.getContent())
                        .messageType(
                                message.getMessageType().name()
                        )
                        .createdAt(message.getCreatedAt())
                        .updatedAt(message.getUpdatedAt())
                        .edited(message.isEdited())
                        .deleted(message.isDeleted())
                        .build();

        messagingTemplate.convertAndSend(
                "/topic/conversation/"
                        + request.getConversationId(),
                response
        );
    }
}