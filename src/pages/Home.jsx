import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";

function Home() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default Home;
