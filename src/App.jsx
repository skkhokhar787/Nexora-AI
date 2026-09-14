import { Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <ChatProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route
          path="/login/signup"
          element={<Navigate to="/signup" replace />}
        />

        <Route
          path="/signup/login"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </ChatProvider>
  );
}

