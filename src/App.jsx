import { Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

export default function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/signup" element={<SignUpPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/login " element={<LoginPage />} />
      </Routes>
    </ChatProvider>
  );
}
