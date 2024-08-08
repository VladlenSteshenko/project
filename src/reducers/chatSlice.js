// src/reducers/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { current } from "immer";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatList: {},
    selectedChatId: null,
  },
  reducers: {
    setChatList: (state, action) => {
      const payload = action.payload;
      let chats = [];

      // Check if payload is an array
      if (Array.isArray(payload)) {
        chats = payload;
      } else if (typeof payload === "object" && payload !== null) {
        // Search for chats array within the payload
        const findChats = (obj) => {
          for (let key in obj) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
              const result = findChats(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };

        chats = findChats(payload) || [];
      }

      // Convert chats array to an object
      const chatList = chats.reduce((acc, chat) => {
        acc[chat._id] = chat;
        return acc;
      }, {});

      state.chatList = chatList;
    },

    addChat: (state, action) => {
      const chatData = action.payload;

      // Make sure to properly handle nested chat data
      const chat = chatData.ChatUpsert || chatData;

      // Only add the chat if it has a valid _id
      if (chat._id) {
        // Create a new chat object with members and messages arrays
        const newChat = {
          ...chat,
          members: chat.members || [],
          messages: chat.messages || [],
        };

        state.chatList[chat._id] = newChat;
      } else {
        console.error("Invalid chat data, missing _id:", chat);
      }
    },

    updateLastMessage: (state, action) => {
      const { chatId, lastMessage } = action.payload;
      if (state.chatList[chatId]) {
        state.chatList[chatId].lastMessage = lastMessage;
      }
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setChatMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (state.chatList[chatId]) {
        state.chatList[chatId].messages = messages;
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;

      if (state.chatList[chatId]) {
        const messages = state.chatList[chatId].messages;
        const index = messages.findIndex((msg) => msg._id === message._id);

        if (index !== -1) {
          messages[index] = message;
        } else {
          messages.push(message);
        }

        state.chatList[chatId].lastMessage = message;
      }
    },

    updateUserNickname: (state, action) => {
      const { userId, newNick } = action.payload;

      for (let chatId in state.chatList) {
        const chat = state.chatList[chatId];

        // Update the nickname in the members list
        if (chat.members) {
          chat.members = chat.members.map((member) =>
            member._id === userId ? { ...member, nick: newNick } : member
          );
        }

        // Update the nickname in the messages list
        if (chat.messages) {
          chat.messages = chat.messages.map((message) => {
            if (message.owner && message.owner._id === userId) {
              return {
                ...message,
                owner: {
                  ...message.owner,
                  nick: newNick,
                },
              };
            }
            return message;
          });
        }
      }
    },

    updateMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const messages = state.chatList[chatId].messages;
      const index = messages.findIndex((msg) => msg._id === message._id);
      if (index !== -1) {
        messages[index] = message;
      }
    },
  },
});

export const {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChatId,
  setChatMessages,
  addMessage,
  updateUserNickname,
  updateMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
