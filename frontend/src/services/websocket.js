import { Client } from "@stomp/stompjs";

let client = null;

export const connectWebSocket = (
    token,
    onMessage
) => {

    client = new Client({

        brokerURL: "ws://localhost:8080/ws",

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        onConnect: () => {

            console.log(
                "WebSocket connected"
            );

            client.subscribe(
                "/topic/conversation/1",
                (message) => {

                    const data =
                        JSON.parse(
                            message.body
                        );

                    console.log(
                        "Received message:",
                        data
                    );

                    onMessage(data);
                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );
        }
    });

    client.activate();
};

export const disconnectWebSocket = () => {

    if (client) {

        client.deactivate();

        client = null;
    }
};

export const sendMessage = (
    conversationId,
    content
) => {

    if (!client || !client.connected) {

        console.error(
            "WebSocket is not connected"
        );

        return;
    }

    client.publish({
        destination: "/app/chat.send",

        body: JSON.stringify({
            conversationId: conversationId,
            content: content
        })
    });
};