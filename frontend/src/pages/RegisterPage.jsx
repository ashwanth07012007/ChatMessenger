import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./RegisterPage.css";
import { BASE_URL } from "../services/api";

function RegisterPage() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await axios.post(
                `${BASE_URL}/api/auth/register`,
                {
                    username,
                    email,
                    password
                }
            );

            navigate("/login");

        } catch (error) {

            console.error(
                "REGISTER FAILED:",
                error
            );

            setError(
                error.response?.data ||
                "Registration failed"
            );
        }
    };


    return (
        <div className="register-page">

            <div className="register-card">

                <h1>
                    Create Account
                </h1>

                <p className="register-subtitle">
                    Create your account to start chatting.
                </p>


                <form onSubmit={handleRegister}>

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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
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
                        <p className="register-error">
                            {error}
                        </p>
                    )}


                    <button type="submit">
                        Register
                    </button>

                </form>


                <p className="register-login">

                    Already have an account?

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </span>

                </p>

            </div>

        </div>
    );
}

export default RegisterPage;