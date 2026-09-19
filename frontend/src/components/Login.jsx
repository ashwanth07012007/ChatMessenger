import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { BASE_URL } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response =
                await axios.post(
                    `${BASE_URL}/api/auth/login`,
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

            console.log(
                "JWT SAVED"
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "LOGIN FAILED:",
                error
            );

            setError(
                error.response?.data ||
                "Invalid username or password"
            );
        }
    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Welcome Back
                </h1>

                <p className="login-subtitle">
                    Login to continue chatting.
                </p>


                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        required
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />


                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}


                    <button type="submit">
                        Login
                    </button>

                </form>


                <p className="login-register">

                    Don't have an account?

                    <span
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Register
                    </span>

                </p>

            </div>

        </div>
    );
}

export default Login;