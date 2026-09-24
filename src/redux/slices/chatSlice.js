import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  model: "openai/gpt-oss-120b",
  conversationId: localStorage.getItem("conversationId") || null,
  isPending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    setModel: (state, action) => {
      state.model = action.payload;
    },

    setConversationId: (state, action) => {
      state.conversationId = action.payload;

      if (action.payload) {
        localStorage.setItem("conversationId", action.payload);
      } else {
        localStorage.removeItem("conversationId");
      }
    },

    setPending: (state, action) => {
      state.isPending = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    resetChat: (state) => {
      state.messages = [];
      state.conversationId = null;
      state.error = null;

      localStorage.removeItem("conversationId");
    },
  },
});

export const {
  addMessage,
  setMessages,
  setModel,
  setConversationId,
  setPending,
  setError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;