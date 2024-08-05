// src/reducers/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
    updateUserNickname: (state, action) => {
      const { userId, newNick } = action.payload;
      for (let chatId in state.chatList) {
        const chat = state.chatList[chatId];
        chat.members = chat.members.map(member => 
          member._id === userId ? { ...member, nick: newNick } : member
        );
      }
      for (let chatId in state.selectedChatMessages) {
        const messages = state.selectedChatMessages[chatId];
        messages.forEach(message => {
          if (message.owner._id === userId) {
            message.owner.nick = newNick;
          }
        });
      }
    },
    updateMessage: (state, action) => {
      const { chatId, messageId, newText } = action.payload;
      const chat = state.chatList[chatId];
      if (chat && chat.messages) {
        const messageIndex = chat.messages.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          chat.messages[messageIndex].text = newText;
        }
      }
      const messages = state.selectedChatMessages[chatId];
      if (messages) {
        const messageIndex = messages.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          messages[messageIndex].text = newText;
        }
      }
    }
  },
});

export const {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChat,
  setSelectedChatMessages,
  addMessage,
  updateUserNickname,
  updateMessage
} = chatSlice.actions;

export default chatSlice.reducer;




