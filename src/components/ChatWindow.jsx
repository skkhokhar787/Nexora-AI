import { useRef, useEffect, useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { fetchInitialData } from "../APIs/chatApi";
import { useChatContext } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/dataStoring";
// ============= ====== ChatWindow ====== ==============

export default function ChatWindow() {
  const { messages, isPending } = useChatContext();

  const bottomRef = useRef(null);

  // Current Firestore conversation ID
  const [conversationId, setConversationId] = useState(null);

  // React Query - Empty State Data

  const {
    data,
    isLoading: isQueryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chatInitialData"],
    queryFn: fetchInitialData,
  });

  // ============= ====== Create / Get Conversation ====== ==============

  useEffect(() => {
    const setupConversation = async () => {
      try {
        // Create a new conversation in Firestore
        const conversationRef = await addDoc(collection(db, "conversations"), {
          messages: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const newConversationId = conversationRef.id;

        // Store conversation ID locally
        localStorage.setItem("conversationId", newConversationId);

        setConversationId(newConversationId);

        console.log("New conversation created:", newConversationId);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    setupConversation();
  }, []);

  // ============= ====== Save Messages to LocalStorage ====== ==============

  useEffect(() => {
    if (messages.length === 0) return;

    localStorage.setItem("converssion", JSON.stringify(messages));
  }, [messages]);

  // ============= ====== Save / Update Conversation in Firestore ====== ==============

  useEffect(() => {
    if (!conversationId || messages.length === 0) {
      return;
    }

    const saveConversation = async () => {
      try {
        // Convert messages array into an object
        const messagesObject = messages.reduce((acc, message) => {
          acc[message.id] = {
            role: message.role,
            content: message.content,
          };

          return acc;
        }, {});

        const conversationRef = doc(db, "conversations", conversationId);

        await setDoc(
          conversationRef,
          {
            messages: messagesObject,
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          },
        );

        console.log("Conversation saved successfully");
      } catch (error) {
        console.error("Error saving conversation:", error);
      }
    };

    saveConversation();
  }, [messages, conversationId]);

  // ============= ====== Auto Scroll ====== ==============

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isPending]);

  //  ============= ====== Chat History ====== ==============

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

  // Loading State

  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-violet-400">
        <Loader2 className="h-8 w-8 animate-spin" />

        <span className="text-sm font-medium">Loading Nexora AI...</span>
      </div>
    );
  }

  // Error State

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center text-red-400">
        <AlertCircle className="h-8 w-8" />

        <span className="text-sm font-medium">
          Error loading data: {error.message}
        </span>
      </div>
    );
  }

  // Empty State

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 ring-1 ring-violet-500/20">
          <Sparkles className="h-7 w-7 text-violet-400" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {data?.greeting}
        </h1>

        <p className="max-w-md text-sm text-slate-400">{data?.description}</p>
      </div>
    </div>
  );
}
