// src/reducers/chatThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChatMessages,
  addMessage,
} from '../reducers/chatSlice';
import io from 'socket.io-client';
import { api } from '../api/api';

const socket = io("ws://chat.ed.asmer.org.ua")

export const connectSocket = createAsyncThunk(
  'auth/connectSocket',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    // Connect to socket and authenticate
    
    socket.emit('jwt', token);

    // Receive updates for chats of user
    socket.on('chat', (chat) => {
      dispatch(addChat(chat));

    });

    socket.on('msg', ({ chatId, messages }) => {
      console.log(messages)
      if (state.chat.chatList[chatId]) {
        dispatch(setSelectedChatMessages({ chatId, messages }));
      }
    });
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatID, offset }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.getMessages.initiate({ chatID, offset }));
      const data = await response.data;
      dispatch(setSelectedChatMessages({ chatID, messages: data.MessageFind }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error; // Re-throw the error to be handled by the calling code
    }
  }
);


export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatID, text }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.MessageUpsert.initiate({ chatID, text })).unwrap();
      // Unwrap the data object manually
      const message = response.MessageUpsert;
      dispatch(addMessage({ chatID, message }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
);




