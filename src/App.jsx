import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatProvider } from './context/ChatContext';
import ChatLayout from './layout/ChatLayout';

// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — ROUTING & PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ChatLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChatProvider>
    </QueryClientProvider>
  );
}
