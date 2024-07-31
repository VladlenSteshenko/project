// src/reducers/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList: {},
    selectedChat: null,
    selectedChatMessages: {},
  },
  reducers: {
    setChatList(state, action) {
      state.chatList = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    addChat(state, action) {
      const chat = action.payload;
      state.chatList[chat._id] = chat;
    },
    updateLastMessage(state, action) {
      const { chatId, lastMessage } = action.payload;
      if (state.chatList[chatId]) {
        state.chatList[chatId].lastMessage = lastMessage;
      }
    },
    setSelectedChatMessages(state, action) {
      const { chatId, messages } = action.payload;
      state.selectedChatMessages[chatId] = messages;
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      if (state.selectedChatMessages[chatId]) {
        state.selectedChatMessages[chatId].push(message);
      } else {
        state.selectedChatMessages[chatId] = [message];
      }
    },
  },
});

export const {
  setChatList,
  setSelectedChat,
  addChat,
  updateLastMessage,
  setSelectedChatMessages,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;


