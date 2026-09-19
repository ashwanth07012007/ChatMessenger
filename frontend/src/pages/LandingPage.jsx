import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="landing-page">

            <div className="landing-content">

                <h1>
                    Chat Application
                </h1>

                <p>
                    Connect with your friends and
                    chat with them in real time.
                </p>

                <div className="landing-buttons">

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                    <button
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LandingPage;