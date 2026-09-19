import { useEffect, useRef } from "react";
import "./MessageList.css";

function MessageList({
    messages,
    currentUsername
}) {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    return (
        <div className="message-list">

            {messages.length === 0 && (
                <p className="no-messages">
                    No messages yet.
                </p>
            )}

            {messages.map((message) => {

                const isMine =
                    message.senderUsername ===
                    currentUsername;

                return (
                    <div
                        key={message.id}
                        className={
                            `message-row ${
                                isMine
                                    ? "mine"
                                    : "theirs"
                            }`
                        }
                    >

                        <div className="message-bubble">

                            <span className="message-sender">
                                {message.senderUsername}
                            </span>

                            <span className="message-content">
                                {message.content}
                            </span>

                        </div>

                    </div>
                );

            })}
            <div ref={bottomRef} />

        </div>
    );
}

export default MessageList;