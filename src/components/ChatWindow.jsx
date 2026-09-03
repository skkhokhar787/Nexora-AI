import { useRef, useEffect } from 'react';
import { Sparkles, Code, FileText, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInitialData } from '../APIs/chatApi';
import { useChatContext } from '../context/ChatContext';
import ChatMessage from './ChatMessage';

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow — Renders either Empty State (React Query) or Chat History (Context)
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatWindow() {
  const { messages, isPending, sendMessage } = useChatContext();
  const bottomRef = useRef(null);

  // Fetch initial empty-state data
  const { data, isLoading: isQueryLoading, isError, error } = useQuery({
    queryKey: ['chatInitialData'],
    queryFn: fetchInitialData,
  });
  

  localStorage.setItem("converssion", JSON.stringify(messages))

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  // 1. If we have messages, render the chat history
  if (messages.length > 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-32">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {/* Typing indicator */}
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
              Nexora is thinking…
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    );
  }

  // 2. Otherwise, render the empty state
  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-violet-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm font-medium">Loading Nexora AI...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-red-400 px-6 text-center">
        <AlertCircle className="h-8 w-8" />
        <span className="text-sm font-medium">Error loading data: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 ring-1 ring-violet-500/20">
          <Sparkles className="h-7 w-7 text-violet-400" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {data.greeting}
        </h1>
        <p className="max-w-md text-sm text-slate-400">
          {data.description}
        </p>
      </div>
    </div>
  );
}
