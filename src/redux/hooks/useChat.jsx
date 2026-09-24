import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { sendChatMessage } from "../../APIs/chatApi";

import {
  addMessage,
  setPending,
  setError,
  resetChat as resetChatAction,
} from "../slices/chatSlice";

export function useChat() {
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages);
  const model = useSelector((state) => state.chat.model);
  const conversationId = useSelector(
    (state) => state.chat.conversationId
  );
  const isPending = useSelector((state) => state.chat.isPending);

  const chatMutation = useMutation({
    mutationFn: (newMessages) =>
      sendChatMessage({
        messages: newMessages,
        model,
      }),

    onSuccess: (reply) => {
      dispatch(
        addMessage({
          role: "assistant",
          content: reply,
          id: crypto.randomUUID(),
        })
      );

      dispatch(setPending(false));
    },

    onError: (error) => {
      dispatch(
        addMessage({
          role: "assistant",
          content: `⚠️ Error: ${error.message}`,
          id: crypto.randomUUID(),
        })
      );

      dispatch(setError(error.message));
      dispatch(setPending(false));
    },
  });

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || isPending) return;

      const userMessage = {
        role: "user",
        content: text.trim(),
        id: crypto.randomUUID(),
      };

      dispatch(addMessage(userMessage));
      dispatch(setPending(true));
      dispatch(setError(null));

      const updatedMessages = [...messages, userMessage];

      const apiMessages = updatedMessages.map(
        ({ role, content }) => ({
          role,
          content,
        })
      );

      chatMutation.mutate(apiMessages);
    },
    [messages, isPending, chatMutation]
  );

  const resetChat = useCallback(() => {
    dispatch(resetChatAction());
  }, [dispatch]);

  return {
    messages,
    model,
    conversationId,
    isPending,
    sendMessage,
    resetChat,
  };
}