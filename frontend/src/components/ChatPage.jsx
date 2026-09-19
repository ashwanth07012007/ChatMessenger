
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToConversation,
    sendMessage
} from "../services/websocket";

import {
    getMyConversations,
    createConversation
} from "../services/conversation";

import {
    getMessages
} from "../services/message";

import ChatWindow from "../components/ChatWindow";
import UserList from "../components/UserList";

import {
    getUsers
} from "../services/user";

import "./ChatPage.css";


function ChatPage() {

    const navigate = useNavigate();

    const [conversations, setConversations] =
        useState([]);

    const [messages, setMessages] =
        useState([]);

    const [content, setContent] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [currentUsername, setCurrentUsername] =
        useState("");

    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    const [profileImage, setProfileImage] = useState("");
    const [selectedUserBio, setSelectedUserBio] =
    useState("");


    // LOAD CONVERSATIONS
    useEffect(() => {

        const loadConversations = async () => {

            try {

                const data =
                    await getMyConversations();

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


    // GET CURRENT USERNAME
    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {

            const payload =
                JSON.parse(
                    atob(
                        token.split(".")[1]
                    )
                );

            setCurrentUsername(
                payload.sub
            );

        } catch (error) {

            console.error(
                "FAILED TO READ JWT:",
                error
            );

        }

    }, []);


    // CONNECT WEBSOCKET
    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        connectWebSocket(token);

        return () => {

            disconnectWebSocket();

        };

    }, []);


    // LOAD USERS
   useEffect(() => {

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

            // FIND LOGGED-IN USER
            const token =
                localStorage.getItem("token");

            if (token) {

                const payload =
                    JSON.parse(
                        atob(
                            token.split(".")[1]
                        )
                    );

                const username =
                    payload.sub;

                const currentUser =
                    data.find(
                        user =>
                            user.username === username
                    );

                if (currentUser) {

                    setCurrentUsername(
                        currentUser.username
                    );

                    setProfileImage(
                        currentUser.profileImage
                    );
                    setSelectedUserBio(
                        currentUser.bio
                    );
                }
            }

        } catch (error) {

            console.error(
                "FAILED TO LOAD USERS:",
                error
            );

        }

    };

    loadUsers();

}, []);


    // SELECT CONVERSATION
    const handleSelectConversation =
        async (conversation) => {

        console.log(
            "SELECTED CONVERSATION:",
            conversation
        );

        setSelectedConversation(
            conversation
        );

        setMessages([]);

        try {

            const data =
                await getMessages(
                    conversation.conversationId
                );

            setMessages(data);

        } catch (error) {

            console.error(
                "FAILED TO LOAD MESSAGES:",
                error
            );

        }

        subscribeToConversation(
            conversation.conversationId,
            (message) => {

                setMessages(
                    (previous) => [
                        ...previous,
                        message
                    ]
                );

            }
        );
    };


    // SELECT USER
    const handleSelectUser =
        async (user) => {

        try {

            console.log(
                "SELECTED USER:",
                user
            );

            setSelectedUserBio(
                user.bio || ""
            );

            const conversation =
                await createConversation(
                    user.id
                );

            setConversations(
                (previous) => {

                    const exists =
                        previous.some(
                            (item) =>
                                item.conversationId ===
                                conversation.conversationId
                        );

                    if (exists) {
                        return previous;
                    }

                    return [
                        ...previous,
                        conversation
                    ];

                }
            );

            await handleSelectConversation(
                conversation
            );

            // Close sidebar
            setSidebarOpen(false);

        } catch (error) {

            console.error(
                "FAILED TO CREATE CONVERSATION:",
                error
            );

        }

    };


    // SEND MESSAGE
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


    // LOGOUT
    const handleLogout = () => {

        disconnectWebSocket();

        localStorage.removeItem(
            "token"
        );

        navigate("/login");

    };



    return (

        <div className="chat-page">

            {/* TOP BAR */}

            <header className="chat-topbar">

                {/* MENU BUTTON */}

                <button
                    className="menu-button"
                    onClick={() =>
                        setSidebarOpen(
                            !sidebarOpen
                        )
                    }
                >
                    ☰
                </button>


                {/* APPLICATION TITLE */}

                
                <h2 className="app-logo">
                    <span>WhatsUp</span>
                </h2>



                {/* PROFILE + LOGOUT */}

                <div className="chat-user-area">

                    <div className="chat-profile">

                        <div className="chat-profile-avatar">

                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                />
                            ) : (
                                currentUsername
                                    ?.charAt(0)
                                    .toUpperCase()
                            )}

                        </div>

                        <span className="chat-profile-name">

                            {currentUsername}

                        </span>

                    </div>

                    <button
                        className="settings-button"
                        onClick={() => navigate("/settings")}
                    >
                        ⚙
                    </button>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* MAIN AREA */}

            <div className="chat-main">

                {/* SIDEBAR */}

                <aside
                    className={
                        `chat-sidebar ${
                            sidebarOpen
                                ? "sidebar-open"
                                : "sidebar-closed"
                        }`
                    }
                >

                    <UserList
                        users={users}
                        onSelectUser={
                            handleSelectUser
                        }
                        currentUsername={currentUsername}
                    />

                </aside>


                {/* CHAT WINDOW */}

                <main className="chat-content">

                    <ChatWindow
                        conversation={
                            selectedConversation
                        }
                        messages={messages}
                        content={content}
                        onContentChange={
                            setContent
                        }
                        onSend={handleSend}
                        currentUsername={
                            currentUsername
                        }
                        selectedUserBio={selectedUserBio}
                    />

                </main>

            </div>

        </div>

    );
}

export default ChatPage;

