package com.backend.Repository;

import com.backend.Entity.Conversation;
import com.backend.Entity.ConversationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationMemberRepository
        extends JpaRepository<ConversationMember, Long> {
    List<ConversationMember> findByUserId(Long userId);
    List<ConversationMember> findByConversationId(Long conversationId);

    boolean existsByConversationIdAndUserId(
            Long conversationId,
            Long userId
    );

    @Query("""
    SELECT cm.conversation
    FROM ConversationMember cm
    WHERE cm.user.id IN (:user1Id, :user2Id)
    AND cm.conversation.type = com.backend.Entity.Conversation.ConversationType.PRIVATE
    GROUP BY cm.conversation
    HAVING COUNT(DISTINCT cm.user.id) = 2
""")
    Optional<Conversation> findPrivateConversation(
            Long user1Id,
            Long user2Id
    );
}