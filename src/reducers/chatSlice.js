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
    setSelectedChatMessages: (state, action) => {
      const { chatID, messages } = action.payload;
      const messageObject = messages.reduce((acc, message) => {
        acc[message._id] = message;
        return acc;
      }, {});
      state.selectedChatMessages[chatID] = messageObject;
    },
    addMessage: (state, action) => {
      const { chatID, message } = action.payload;
      if (state.selectedChatMessages[chatID]) {
        state.selectedChatMessages[chatID][message._id] = message;
      }
      if (state.chatList[chatID]) {
        state.chatList[chatID].lastMessage = message;
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


