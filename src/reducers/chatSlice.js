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
    setChatList: (state, action) => {
      const chatList = action.payload.reduce((acc, chat) => {
        acc[chat._id] = chat;
        return acc;
      }, {});
      state.chatList = chatList;
    },
    addChat: (state, action) => {
      const chat = action.payload;
      state.chatList[chat._id] = chat;
    },
    updateLastMessage: (state, action) => {
      const { chatId, lastMessage } = action.payload;
      if (state.chatList[chatId]) {
        state.chatList[chatId].lastMessage = lastMessage;
      }
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      const { chatID, messages } = action.payload;
      state.selectedChatMessages[chatID] = messages;
    },
    addMessage: (state, action) => {
      const { chatID, message } = action.payload;
      if (state.selectedChatMessages[chatID]) {
        state.selectedChatMessages[chatID].push(message);
      } else {
        state.selectedChatMessages[chatID] = [message];
      }
      if (state.chatList[chatID]) {
        state.chatList[chatID].lastMessage = message;
      }
    },
  },
});

export const {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChat,
  setSelectedChatMessages,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;



