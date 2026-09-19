package com.backend.Service;

import com.backend.Dto.ConversationResponse;
import com.backend.Dto.CreateConversationRequest;
import com.backend.Entity.Conversation;
import com.backend.Entity.ConversationMember;
import com.backend.Entity.User;
import com.backend.Repository.ConversationMemberRepository;
import com.backend.Repository.ConversationRepository;
import com.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;

    public ConversationService(UserRepository userRepository, ConversationRepository conversationRepository, ConversationMemberRepository conversationMemberRepository) {
        this.userRepository = userRepository;
        this.conversationMemberRepository = conversationMemberRepository;
        this.conversationRepository = conversationRepository;
    }

    public ConversationResponse createConversation(
            String username,
            CreateConversationRequest req) {

        User currentUser =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                ));

        User targetUser =
                userRepository.findById(req.getUserid())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Optional<Conversation> existingConversation =
                conversationMemberRepository
                        .findPrivateConversation(
                                currentUser.getId(),
                                targetUser.getId()
                        );

        Conversation conversation;

        if (existingConversation.isPresent()) {

            conversation =
                    existingConversation.get();

        } else {

            conversation =
                    Conversation.builder()
                            .type(
                                    Conversation.ConversationType
                                            .PRIVATE
                            )
                            .build();

            ConversationMember currentMember =
                    ConversationMember.builder()
                            .conversation(conversation)
                            .user(currentUser)
                            .role(
                                    ConversationMember.MemberRole
                                            .MEMBER
                            )
                            .build();

            ConversationMember targetMember =
                    ConversationMember.builder()
                            .conversation(conversation)
                            .user(targetUser)
                            .role(
                                    ConversationMember.MemberRole
                                            .MEMBER
                            )
                            .build();

            conversationRepository.save(
                    conversation
            );

            conversationMemberRepository.save(
                    currentMember
            );

            conversationMemberRepository.save(
                    targetMember
            );
        }

        return ConversationResponse.builder()
                .conversationId(
                        conversation.getId()
                )
                .type(
                        conversation.getType().name()
                )
                .name(
                        conversation.getName()
                )
                .userid(
                        targetUser.getId()
                )
                .username(
                        targetUser.getUsername()
                )
                .build();
    }

    public List<ConversationResponse> getMyConversations(
            String username) {

        User currentUser =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                ));

        List<ConversationMember> memberships =
                conversationMemberRepository
                        .findByUserId(currentUser.getId());

        return memberships.stream()
                .map(member -> {

                    Conversation conversation =
                            member.getConversation();

                    List<ConversationMember> members =
                            conversationMemberRepository
                                    .findByConversationId(
                                            conversation.getId()
                                    );

                    ConversationMember otherMember =
                            members.stream()
                                    .filter(m ->
                                            !m.getUser()
                                                    .getId()
                                                    .equals(
                                                            currentUser.getId()
                                                    )
                                    )
                                    .findFirst()
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Other user not found"
                                            ));

                    User otherUser =
                            otherMember.getUser();

                    return ConversationResponse.builder()
                            .conversationId(conversation.getId())
                            .type(conversation.getType().name())
                            .name(conversation.getName())
                            .userid(otherUser.getId())
                            .build();
                })
                .toList();
    }
}