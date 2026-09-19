import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./components/Login";
import ChatPage from "./components/ChatPage";
import Settings from "./pages/Settings";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* LANDING PAGE */}

                <Route
                    path="/"
                    element={<LandingPage />}
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />


                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* DASHBOARD */}

                <Route
                    path="/dashboard"
                    element={<ChatPage />}
                />

                 <Route
                    path="/settings"
                    element={<Settings />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;