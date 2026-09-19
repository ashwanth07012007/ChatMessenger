import "./MessageInput.css";

function MessageInput({
    content,
    onContentChange,
    onSend
}) {

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            onSend();
        }
    };

    return (
        <div className="message-input-container">

            <input
                type="text"
                className="message-input"
                value={content}
                placeholder="Type a message..."
                onChange={(e) =>
                    onContentChange(
                        e.target.value
                    )
                }
                onKeyDown={handleKeyDown}
            />

            <button
                className="send-button"
                onClick={onSend}
                disabled={!content.trim()}
                aria-label="Send message"
            >
                ➤
            </button>

        </div>
    );
}

export default MessageInput;