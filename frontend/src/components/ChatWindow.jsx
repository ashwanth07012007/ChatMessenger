import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import "./ChatWindow.css";

function ChatWindow({
    conversation,
    messages,
    content,
    onContentChange,
    onSend,
    currentUsername,
    selectedUserBio
}) {

    if (!conversation) {

        return (
            <div className="chat-window">

                <div className="chat-empty">

                    <p>
                        Select a conversation to start chatting.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="chat-window">

            <div className="chat-header">

                <h3>
                    {conversation.username}
                </h3>
                <p className="target-user-bio">
                    {selectedUserBio || "No bio available"}
                </p>

            </div>

            <MessageList
                messages={messages}
                currentUsername={currentUsername}
            />

            <MessageInput
                content={content}
                onContentChange={
                    onContentChange
                }
                onSend={onSend}
            />

        </div>
    );
}

export default ChatWindow;