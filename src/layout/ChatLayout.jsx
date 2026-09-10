import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

// ─────────────────────────────────────────────────────────────────────────────
// ChatLayout — composes the three visual regions of the app.
// No business logic lives here; it only arranges child components.
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Left sidebar — branding, new chat, settings */}
      <Sidebar />
      {/* Main content area — chat messages + input */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <ChatWindow />
        <ChatInput />
      </main>
    </div>
  );
}
