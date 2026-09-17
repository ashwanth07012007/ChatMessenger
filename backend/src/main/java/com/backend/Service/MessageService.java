package com.backend.Service;

import com.backend.Dto.MessageResponse;
import com.backend.Dto.SendMessageRequest;
import com.backend.Entity.Conversation;
import com.backend.Entity.Message;
import com.backend.Entity.User;
import com.backend.Repository.ConversationMemberRepository;
import com.backend.Repository.ConversationRepository;
import com.backend.Repository.MessageRepository;
import com.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;
    private final MessageRepository messageRepository;

    public Message sendMessage(
            String username,
            SendMessageRequest request) {
        User currentUser =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                ));
        Conversation conversation =
                conversationRepository
                        .findById(request.getConversationId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conversation not found"
                                ));

        boolean isMember =
                conversationMemberRepository
                        .existsByConversationIdAndUserId(
                                conversation.getId(),
                                currentUser.getId()
                        );

        if (!isMember) {
            throw new RuntimeException(
                    "User is not a member of this conversation"
            );
        }

        Message message =
                Message.builder()
                        .conversation(conversation)
                        .sender(currentUser)
                        .content(request.getContent())
                        .messageType(Message.MessageType.TEXT)
                        .build();
        return messageRepository.save(message);

    }

    public List<MessageResponse> getMessages(
            String username,
            Long conversationId) {

        User currentUser =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                ));

        Conversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conversation not found"
                                ));

        boolean isMember =
                conversationMemberRepository
                        .existsByConversationIdAndUserId(
                                conversationId,
                                currentUser.getId()
                        );

        if (!isMember) {
            throw new RuntimeException(
                    "User is not a member of this conversation"
            );
        }

        List<Message> messages =
                messageRepository
                        .findByConversationIdOrderByCreatedAtAsc(
                                conversationId
                        );

        return messages.stream()
                .map(message ->
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
                                .build()
                )
                .toList();
    }
}