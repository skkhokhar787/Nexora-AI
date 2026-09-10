import { useState, useEffect } from 'react';
import { Sparkles, Plus, ChevronDown, Thermometer, MessageSquare, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchModels } from '../APIs/chatApi';
import { useChatContext } from '../context/ChatContext';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/dataStoring';

function ChatHistoryList() {
  const { conversationId, setConversationId, resetChat } = useChatContext();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = [];
      snapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() });
      });
      setConversations(convos);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'conversations', id));
      if (conversationId === id) {
        resetChat();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all chats?")) return;
    try {
      const promises = conversations.map(conv => deleteDoc(doc(db, 'conversations', conv.id)));
      await Promise.all(promises);
      resetChat();
    } catch (error) {
      console.error("Error clearing conversations:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-1 mb-2">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Recent Chats
        </label>
        {conversations.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-medium tracking-wider"
            title="Clear all chats"
          >
            Clear All
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="text-xs text-slate-500 px-1">No recent chats</div>
      ) : (
        <div className="flex flex-col gap-1">
      {conversations.map((conv) => {
        const isActive = conv.id === conversationId;
        const date = conv.updatedAt?.toDate() || new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);

        return (
          <div
            key={conv.id}
            onClick={() => {
              setConversationId(conv.id);
              localStorage.setItem("conversationId", conv.id);
            }}
            className={`group relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
              isActive 
                ? 'bg-slate-800 text-slate-200' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <div className="flex items-start gap-3 overflow-hidden text-left">
              <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium">Chat {conv.id.slice(0, 5)}</span>
                <span className="text-[10px] text-slate-500">{formattedDate}</span>
              </div>
            </div>

            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded-md transition-all shrink-0"
              title="Delete chat"
            >
              <X className="h-4 w-4 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        );
      })}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — UI with Dynamic Models via React Query
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { model, setModel, resetChat } = useChatContext();

  // Fetch models from Groq API
  const { data: models, isLoading, isError } = useQuery({
    queryKey: ['groqModels'],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour to avoid spamming the API
  });

  return (
    <aside className="flex w-72 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5">
      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          Nexora AI
        </span>
      </div>

      {/* ── New Chat ────────────────────────────────────────────────────── */}
      <button onClick={resetChat} className="group relative flex items-center justify-center gap-2 rounded-lg p-[1px]">
        {/* gradient border trick */}
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 opacity-70 transition-opacity group-hover:opacity-100" />
        <span className="relative flex w-full items-center justify-center gap-2 rounded-[7px] bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors group-hover:bg-slate-900">
          <Plus className="h-4 w-4" />
          New Chat
        </span>
      </button>

      {/* ── Chat History ──────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
        <ChatHistoryList />
      </div>

      {/* ── Settings ────────────────────────────────────────────────────── */}
      <div className="space-y-5 border-t border-slate-800 pt-5">
        {/* Model selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full cursor-pointer rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
          >
            {isLoading && <option value={model}>Loading models...</option>}
            {isError && <option value={model}>Error loading models</option>}
            {!isLoading && !isError && models?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature slider */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <Thermometer className="h-3.5 w-3.5" />
            Temperature
            <span className="ml-auto font-mono text-violet-400">0.70</span>
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            defaultValue={0.7}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
