import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MessageSquare,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useChatContext } from "../context/ChatContext";
import NexoraLogo from "./NexoraLogo";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase/dataStoring";

function ChatHistoryList() {
  const { conversationId, setConversationId, resetChat } = useChatContext();
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();

  // Track the logged-in user and get their name
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setUserName(user ? (user.displayName || user.email || "User") : null);
      setUserPhoto(user ? (user.photoURL || null) : null);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      resetChat();
      localStorage.removeItem("conversationId");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Only subscribe to this user's conversations
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      return;
    }

    const q = query(
      collection(db, "users", userId, "conversations"),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = [];
      snapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() });
      });
      setConversations(convos);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!userId) return;
    try {
      const messagesRef = collection(db, "users", userId, "conversations", id, "messages");
      const messagesSnap = await getDocs(messagesRef);
      const deletePromises = messagesSnap.docs.map((msgDoc) => deleteDoc(msgDoc.ref));
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "users", userId, "conversations", id));
      if (conversationId === id) {
        resetChat();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleClearAll = async () => {
    if (!userId) return;
    if (!window.confirm("Are you sure you want to delete all chats?")) return;
    try {
      const promises = conversations.map(async (conv) => {
        const messagesRef = collection(db, "users", userId, "conversations", conv.id, "messages");
        const messagesSnap = await getDocs(messagesRef);
        const deleteMsgs = messagesSnap.docs.map((msgDoc) => deleteDoc(msgDoc.ref));
        await Promise.all(deleteMsgs);
        return deleteDoc(doc(db, "users", userId, "conversations", conv.id));
      });
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
        <div className="text-xs text-slate-500 px-1">
          {userId ? "No recent chats" : "Log in to see your chats"}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {conversations.map((conv) => {
            const isActive = conv.id === conversationId;
            const date = conv.updatedAt?.toDate() || new Date();
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
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
                    ? "bg-slate-800 text-slate-200"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                <div className="flex items-start gap-3 overflow-hidden text-left">
                  <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">
                      {conv.title || "New Chat"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formattedDate}
                    </span>
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

      {/* ── User Profile ──────────────────────────────────────────────── */}
      {userId && (
        <div className="group/profile mt-auto pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/home/profile")}
              title={userName}
              className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-xs font-semibold text-white">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : userName ? (
                  userName[0].toUpperCase()
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <span className="truncate opacity-0 transition-opacity group-hover/profile:opacity-100">
                {userName}
              </span>
            </button>

            {/* Logout button — visible on hover */}
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover/profile:opacity-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — UI with Dynamic Models via React Query
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { resetChat } = useChatContext();

  return (
    <aside className="flex w-72 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5">
      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-2.5">
        <NexoraLogo className="w-9 h-9" textClassName="text-lg" />
      </div>

      {/* ── New Chat ────────────────────────────────────────────────────── */}
      <button
        onClick={resetChat}
        className="group relative flex items-center justify-center gap-2 rounded-lg p-[1px]"
      >
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
    </aside>
  );
}
