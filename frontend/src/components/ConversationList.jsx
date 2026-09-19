function ConversationList({
    conversations,
    selectedConversation,
    onSelectConversation
}) {

    return (
        <div>

            <h3>
                My Conversations
            </h3>

            {conversations.length === 0 && (
                <p>
                    No conversations found.
                </p>
            )}

            {conversations.map(
                (conversation) => (

                    <div
                        key={
                            conversation.conversationId
                        }
                        onClick={() =>
                            onSelectConversation(
                                conversation
                            )
                        }
                        style={{
                            cursor: "pointer",
                            padding: "10px",
                            border: "1px solid black",
                            marginBottom: "5px"
                        }}
                    >

                        <strong>
                            {
                                conversation.username
                            }
                        </strong>

                        <br />

                        Conversation ID:
                        {" "}
                        {
                            conversation.conversationId
                        }

                    </div>
                )
            )}

        </div>
    );
}

export default ConversationList;