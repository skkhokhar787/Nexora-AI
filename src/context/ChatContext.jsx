import { createContext, useContext, useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../APIs/chatApi';

const ChatContext = createContext(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('openai/gpt-oss-120b');

  const chatMutation = useMutation({
    mutationFn: (newMessages) => sendChatMessage({ messages: newMessages, model }),
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, id: crypto.randomUUID() }]);
    },
    onError: (error) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ Error: ${error.message}`, id: crypto.randomUUID() }]);
    }
  });
  const sendMessage = useCallback((text) => {
    if (!text.trim() || chatMutation.isPending) return;

    const userMessage = { role: 'user', content: text.trim(), id: crypto.randomUUID() };
    
    
    // Add user message to local state immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    


    // Filter out the unique `id` we added for React keys before sending to API
    const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));
    
    chatMutation.mutate(apiMessages);
  }, [messages, chatMutation, model]);

  const resetChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        model,
        setModel,
        sendMessage,
        resetChat,
        isPending: chatMutation.isPending
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
