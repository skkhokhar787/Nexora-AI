import { useRef, useEffect } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { fetchInitialData, generateChatTitle } from "../APIs/chatApi";
import { useChat } from "../redux/hooks/useChat";
import { setMessages } from "../redux/slices/chatSlice";
import ChatMessage from "./ChatMessage";
import { db, auth } from "../firebase/dataStoring";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";


// ChatWindow
function ChatWindow() {
  const {
    messages,
    isPending,
    conversationId,
    setConversationId,
  } = useChat();

  const bottomRef = useRef(null);

  // Prevent saving the same message multiple times
  const lastSavedMessageId = useRef(null);

  // --------------------------------
  // React Query
  // --------------------------------

  const {
    data,
    isLoading: isQueryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chatInitialData"],
    queryFn: fetchInitialData,
  });

  // --------------------------------
  // Create conversation
  // --------------------------------

  useEffect(() => {
    const createNewConversation = async () => {
      const user = auth.currentUser;

      // User is not logged in
      if (!user) {
        console.log("No authenticated user");
        return;
      }

      // Conversation already exists
      if (conversationId) {
        return;
      }

      try {
        // users/{userId}/conversations
        const conversationsRef = collection(
          db,
          "users",
          user.uid,
          "conversations",
        );

        // Create conversation
        const conversationRef = await addDoc(conversationsRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const newConversationId = conversationRef.id;

        // Save conversation ID locally
        localStorage.setItem("conversationId", newConversationId);

        // Update context
        setConversationId(newConversationId);

        console.log("Conversation created:", newConversationId);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    createNewConversation();
  }, [conversationId, setConversationId]);

  // --------------------------------
  // Load messages from Firestore
  // --------------------------------

  useEffect(() => {
    const loadMessages = async () => {
      const user = auth.currentUser;

      if (!user || !conversationId) {
        return;
      }

      try {
        /*
          users/{userId}/conversations/{conversationId}/messages
        */

        const messagesRef = collection(
          db,
          "users",
          user.uid,
          "conversations",
          conversationId,
          "messages",
        );

        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const querySnapshot = await getDocs(q);

        const loadedMessages = [];

        querySnapshot.forEach((messageDoc) => {
          loadedMessages.push({
            id: messageDoc.id,
            ...messageDoc.data(),
          });
        });

        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);

          lastSavedMessageId.current =
            loadedMessages[loadedMessages.length - 1].id;
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [conversationId, setMessages]);

  // --------------------------------
  // Save messages to localStorage
  // --------------------------------

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    localStorage.setItem("conversation", JSON.stringify(messages));
  }, [messages]);

  // --------------------------------
  // Save latest message to Firestore
  // --------------------------------

  useEffect(() => {
    const saveLatestMessage = async () => {
      const user = auth.currentUser;

      if (!user || !conversationId || messages.length === 0) {
        return;
      }

      const latestMessage = messages[messages.length - 1];

      // Don't save same message twice
      if (latestMessage.id === lastSavedMessageId.current) {
        return;
      }

      try {
        /*
          users/{userId}
            /conversations/{conversationId}
              /messages/{messageId}
        */

        const messageRef = doc(
          db,
          "users",
          user.uid,
          "conversations",
          conversationId,
          "messages",
          latestMessage.id,
        );

        // Save message
        await setDoc(messageRef, {
          role: latestMessage.role,
          content: latestMessage.content,
          createdAt: serverTimestamp(),
        });

        // Update conversation
        const conversationRef = doc(
          db,
          "users",
          user.uid,
          "conversations",
          conversationId,
        );

        // Generate title if this is the first user message
        let titleUpdate = {};
        if (messages.length === 1 && latestMessage.role === 'user') {
          const title = await generateChatTitle(latestMessage.content);
          titleUpdate = { title };
        }

        await setDoc(
          conversationRef,
          {
            updatedAt: serverTimestamp(),
            ...titleUpdate,
          },
          {
            merge: true,
          },
        );

        // Remember saved message
        lastSavedMessageId.current = latestMessage.id;

        console.log("Message saved:", latestMessage.content);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    };

    saveLatestMessage();
  }, [messages, conversationId]);

  // --------------------------------
  // Auto-scroll
  // --------------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isPending]);

  // --------------------------------
  // Chat messages
  // --------------------------------

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

  // --------------------------------
  // Loading state
  // --------------------------------

  if (isQueryLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-violet-400">
        <Loader2 className="h-8 w-8 animate-spin" />

        <span className="text-sm font-medium">Loading Nexora AI...</span>
      </div>
    );
  }

  // --------------------------------
  // Error state
  // --------------------------------

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

  // --------------------------------
  // Empty state
  // --------------------------------

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      {/* Hero */}

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 ring-1 ring-violet-500/20">
          <Sparkles className="h-7 w-7 text-violet-400" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {data?.greeting || "Hello! How can I help you?"}
        </h1>

        <p className="max-w-md text-sm text-slate-400">
          {data?.description || "Ask me anything and I'll do my best to help."}
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
