import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Settings.css";

function Settings() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [bio, setBio] =
        useState("");

    const [profileImage, setProfileImage] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // LOAD CURRENT PROFILE

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadProfile = async () => {

            try {

                const response =
                    await axios.get(
                        "http://localhost:8080/api/user/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                    console.log(response.data);

                setUsername(
                    response.data.username
                );

                setBio(
                    response.data.bio || ""
                );

                setProfileImage(
                    response.data.profileImage || ""
                );

            } catch (error) {

                console.error(
                    "FAILED TO LOAD PROFILE:",
                    error
                );

            }
        };

        loadProfile();

    }, [navigate]);


    // SAVE PROFILE

    const handleSave = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    const token =
        localStorage.getItem("token");

    try {

        const response = await axios.put(
            "http://localhost:8080/api/user/profile",
            {
                username: username,
                bio: bio,
                profileImage: profileImage
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(response.data);
        // Save the new JWT
        localStorage.setItem(
            "token",
            response.data.token
        );

        setMessage(
            "Profile updated successfully"
        );

    } catch (error) {

        console.error(
            "FAILED TO UPDATE PROFILE:",
            error
        );

        setError(
            typeof error.response?.data === "string"
                ? error.response.data
                : "Failed to update profile"
        );
    }
};


    return (

        <div className="settings-page">

            <div className="settings-card">

                <h1>
                    Settings
                </h1>

                <p className="settings-subtitle">
                    Update your profile information
                </p>


                {/* PROFILE IMAGE */}

                <div className="settings-profile">

                    <div className="settings-avatar">

                        {profileImage ? (

                            <img
                                src={profileImage}
                                alt="Profile"
                            />

                        ) : (

                            username
                                ?.charAt(0)
                                .toUpperCase()

                        )}

                    </div>

                </div>


                <form onSubmit={handleSave}>

                    {/* USERNAME */}

                    <div className="settings-field">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* BIO */}

                    <div className="settings-field">

                        <label>
                            Bio
                        </label>

                        <textarea
                            value={bio}
                            placeholder="Tell something about yourself..."
                            maxLength={500}
                            onChange={(e) =>
                                setBio(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* PROFILE IMAGE URL */}

                    <div className="settings-field">

                        <label>
                            Profile Image URL
                        </label>

                        <input
                            type="url"
                            value={profileImage}
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) =>
                                setProfileImage(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {message && (

                        <p className="settings-success">
                            {message}
                        </p>

                    )}


                    {error && (

                        <p className="settings-error">
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        className="settings-save"
                    >
                        Save Changes
                    </button>

                </form>


                <button
                    className="settings-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to Chat
                </button>

            </div>

        </div>
    );
}

export default Settings;