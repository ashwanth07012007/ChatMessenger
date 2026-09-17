package com.backend.Controller;

import com.backend.Dto.MessageResponse;
import com.backend.Dto.SendMessageRequest;
import com.backend.Entity.Message;
import com.backend.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Message sendMessage(
            @RequestBody SendMessageRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        return messageService.sendMessage(
                username,
                request
        );
    }

    @GetMapping("/{conversationId}")
    public List<MessageResponse> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication) {

        String username = authentication.getName();

        return messageService.getMessages(
                username,
                conversationId
        );
    }
}