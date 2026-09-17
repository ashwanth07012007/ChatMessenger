package com.backend.Controller;

import com.backend.Dto.CreateConversationRequest;

import com.backend.Entity.Conversation;
import com.backend.Entity.User;
import com.backend.Service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("api/conversation")
public class ConversationController {

    private  final ConversationService conversationService;

    public ConversationController(ConversationService conversationService){
        this.conversationService=conversationService;
    }

    @PostMapping("/create")
    public Conversation createConversation(@RequestBody CreateConversationRequest req, Authentication auth){
        String email=auth.getName();
        return conversationService.createConversation(email,req);
    }

    @GetMapping
    public ResponseEntity<?> getMyConversations(
            Authentication auth) {

        String username = auth.getName();

        return ResponseEntity.ok(
                conversationService
                        .getMyConversations(username)
        );
    }
}
