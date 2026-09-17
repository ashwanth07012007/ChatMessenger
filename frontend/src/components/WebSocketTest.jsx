import { useEffect, useState } from "react";

import {
    connectWebSocket,
    disconnectWebSocket,
    sendMessage
} from "../services/websocket";

import {
    getMyConversations
} from "../services/conversation";

import {
    getMessages
} from "../services/message";


function WebSocketTest() {

    const [conversations, setConversations] =
        useState([]);

    const [messages, setMessages] =
        useState([]);

    const [content, setContent] =
        useState("");

    const [selectedConversation, setSelectedConversation] =
        useState(null);


    // Load conversations
    useEffect(() => {

        const loadConversations = async () => {

            try {

                const data =
                    await getMyConversations();

                console.log(
                    "MY CONVERSATIONS:",
                    data
                );

                setConversations(data);

            } catch (error) {

                console.error(
                    "FAILED TO LOAD CONVERSATIONS:",
                    error
                );
            }
        };

        loadConversations();

    }, []);


    // Connect WebSocket
    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        connectWebSocket(
            token,
            (message) => {

                console.log(
                    "RECEIVED MESSAGE:",
                    message
                );

                setMessages((previous) => [
                    ...previous,
                    message
                ]);
            }
        );

        return () => {

            disconnectWebSocket();

        };

    }, []);


    const handleSelectConversation = async (
    conversation
) => {

    console.log(
        "SELECTED CONVERSATION:",
        conversation
    );

    setSelectedConversation(
        conversation
    );

    try {

        const data =
            await getMessages(
                conversation.conversationId
            );

        console.log(
            "OLD MESSAGES:",
            data
        );

        setMessages(data);

    } catch (error) {

        console.error(
            "FAILED TO LOAD MESSAGES:",
            error
        );
    }
};


    const handleSend = () => {

        if (!selectedConversation) {
            return;
        }

        if (!content.trim()) {
            return;
        }

        sendMessage(
            selectedConversation.conversationId,
            content
        );

        setContent("");

    };


    return (

        <div>

            <h2>
                Chat Application
            </h2>


            <h3>
                My Conversations
            </h3>


            {conversations.map(
                (conversation) => (

                    <div
                        key={
                            conversation.conversationId
                        }
                        onClick={() =>
                            handleSelectConversation(
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
                            {conversation.username}
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


            <hr />


            {selectedConversation && (

                <div>

                    <h3>
                        Chat with{" "}
                        {
                            selectedConversation.username
                        }
                    </h3>


                    <div>

                        {messages.map(
                            (message) => (

                                <div
                                    key={message.id}
                                >

                                    <strong>
                                        {
                                            message.senderUsername
                                        }
                                    </strong>

                                    :

                                    {" "}

                                    {
                                        message.content
                                    }

                                </div>

                            )
                        )}

                    </div>


                    <br />


                    <input
                        type="text"
                        value={content}
                        placeholder="Type a message..."
                        onChange={(e) =>
                            setContent(
                                e.target.value
                            )
                        }
                    />


                    <button
                        onClick={handleSend}
                    >
                        Send
                    </button>

                </div>

            )}

        </div>
    );
}

export default WebSocketTest;