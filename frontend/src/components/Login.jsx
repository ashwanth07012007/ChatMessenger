import { useState } from "react";
import axios from "axios";

function Login({onLogin}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    username: username,
                    password: password
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            localStorage.setItem(
                "token",
                response.data.token
            );
            onLogin();

            console.log(
                "JWT SAVED"
            );

        } catch (error) {

            console.error(
                "LOGIN FAILED:",
                error
            );
        }
    };

    return (
        <div>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;