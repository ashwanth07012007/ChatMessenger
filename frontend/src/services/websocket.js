import { Client } from "@stomp/stompjs";

let client = null;
let subscription = null;

let pendingConversationId = null;
let pendingOnMessage = null;


// ==========================================
// CONNECT
// ==========================================

export const connectWebSocket = (token) => {

    if (client && client.active) {
        return;
    }

    client = new Client({

        brokerURL:
            "ws://whatsup-backend-gf2k.onrender.com/ws",

        connectHeaders: {
            Authorization:
                `Bearer ${token}`
        },

        reconnectDelay: 5000,

        onConnect: () => {

            console.log(
                "WebSocket connected"
            );


            // If user selected a conversation
            // before WebSocket connected
            if (pendingConversationId) {

                subscribeToConversation(
                    pendingConversationId,
                    pendingOnMessage
                );

            }

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


// ==========================================
// SUBSCRIBE
// ==========================================

export const subscribeToConversation = (
    conversationId,
    onMessage
) => {

    pendingConversationId =
        conversationId;

    pendingOnMessage =
        onMessage;


    // WebSocket not connected yet
    if (!client || !client.connected) {

        console.log(
            "Waiting for WebSocket connection..."
        );

        return;
    }


    // Remove old subscription
    if (subscription) {

        subscription.unsubscribe();

        subscription = null;
    }


    const destination =
        `/topic/conversation/${conversationId}`;


    console.log(
        "SUBSCRIBING TO:",
        destination
    );


    subscription =
        client.subscribe(
            destination,

            (message) => {

                const data =
                    JSON.parse(
                        message.body
                    );


                console.log(
                    "RECEIVED MESSAGE:",
                    data
                );


                onMessage(data);

            }
        );
};


// ==========================================
// DISCONNECT
// ==========================================

export const disconnectWebSocket = () => {

    if (subscription) {

        subscription.unsubscribe();

        subscription = null;
    }


    pendingConversationId = null;
    pendingOnMessage = null;


    if (client) {

        client.deactivate();

        client = null;
    }
};


// ==========================================
// SEND MESSAGE
// ==========================================

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

        destination:
            "/app/chat.send",

        body: JSON.stringify({

            conversationId:
                conversationId,

            content:
                content

        })

    });
};