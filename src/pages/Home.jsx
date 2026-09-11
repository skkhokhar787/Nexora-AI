import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";
import ProfilePage from "./ProfilePage";

function Home() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default Home;
