import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/slices/chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});