import { useState } from "react";
import Login from "./components/Login";
import WebSocketTest from "./components/WebSocketTest";

function App() {

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    return (
        <>
            {!loggedIn ? (
                <Login onLogin={() => setLoggedIn(true)} />
            ) : (
                <WebSocketTest />
            )}
        </>
    );
}

export default App;