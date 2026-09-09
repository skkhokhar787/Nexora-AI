import { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

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

// ChatWindow
export default function ChatWindow() {
  const { messages, setMessages, isPending, conversationId, setConversationId } = useChatContext();

  const bottomRef = useRef(null);

  // Prevent saving the same message multiple times
  const lastSavedMessageId = useRef(null);

  // React Query

  const {
    data,
    isLoading: isQueryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chatInitialData"],
    queryFn: fetchInitialData,
  });

  // Create conversation

  useEffect(() => {
    const createNewConversation = async () => {
      try {
        if (conversationId) return;

        // Create a new conversation
        const conversationRef = await addDoc(
          collection(db, "conversations"),
          {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        const newConversationId = conversationRef.id;

        // Save conversation ID locally
        localStorage.setItem(
          "conversationId",
          newConversationId
        );

        setConversationId(newConversationId);

        console.log(
          "Conversation created:",
          newConversationId
        );
      } catch (error) {
        console.error(
          "Error creating conversation:",
          error
        );
      }
    };

    createNewConversation();
  }, [conversationId, setConversationId]);

  // Load messages from Firestore when conversationId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;
      try {
        const { getDocs, query, collection, orderBy } = await import("firebase/firestore");
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        
        const loadedMessages = [];
        querySnapshot.forEach((doc) => {
          loadedMessages.push({ id: doc.id, ...doc.data() });
        });
        
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
          lastSavedMessageId.current = loadedMessages[loadedMessages.length - 1].id;
        } else if (messages.length > 0 && conversationId === localStorage.getItem("conversationId")) {
          // Keep current messages if they exist and we just created this conversation
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [conversationId, setMessages]);

  // Save messages to localStorage

  useEffect(() => {
    if (messages.length === 0) return;

    localStorage.setItem(
      "converssion",
      JSON.stringify(messages)
    );
  }, [messages]);

  // Save latest message to Firestore

  useEffect(() => {
    if (!conversationId || messages.length === 0) {
      return;
    }

    const latestMessage =
      messages[messages.length - 1];

    // Don't save the same message again
    if (
      latestMessage.id === lastSavedMessageId.current
    ) {
      return;
    }

    const saveMessage = async () => {
      try {
        // Use the message ID as the Firestore document ID
        const messageRef = doc(
          db,
          "conversations",
          conversationId,
          "messages",
          latestMessage.id
        );

        await setDoc(messageRef, {
          role: latestMessage.role,
          content: latestMessage.content,
          createdAt: serverTimestamp(),
        });

        // Update conversation timestamp
        await setDoc(
          doc(db, "conversations", conversationId),
          {
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        // Remember that this message was saved
        lastSavedMessageId.current =
          latestMessage.id;

        console.log(
          "Message saved:",
          latestMessage.content
        );
      } catch (error) {
        console.error(
          "Error saving message:",
          error
        );
      }
    };

    saveMessage();
  }, [messages, conversationId]);

  // Auto-scroll on new messages

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isPending]);

  // Chat history

  if (messages.length > 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-32">
        <div className="mx-auto max-w-3xl space-y-6">

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
            />
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

  // Loading state

  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-violet-400">
        <Loader2 className="h-8 w-8 animate-spin" />

        <span className="text-sm font-medium">
          Loading Nexora AI...
        </span>
      </div>
    );
  }

  // Error state

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

  // Empty state

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