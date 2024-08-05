// src/reducers/chatThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChatMessages,
  addMessage,
  updateMessage
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

    socket.emit('jwt', token);

    socket.on('chat', (chat) => {
      dispatch(addChat(chat));
    });

    socket.on('msg', ({ chatId, messages }) => {
      console.log(messages)
      dispatch(setSelectedChatMessages({ chatID: chatId, messages }));
    });
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatID, offset }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.getMessages.initiate({ chatID, offset })).unwrap();
      dispatch(setSelectedChatMessages({ chatID, messages: response.MessageFind }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatID, text }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.MessageUpsert.initiate({ chatID, text })).unwrap();
      dispatch(addMessage({ chatID, message: response.MessageUpsert }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
);

export const updateChatMessage = createAsyncThunk(
  'chat/updateChatMessage',
  async ({ chatId, messageId, newText }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.MessageUpdate.initiate({ text: newText, messageid: messageId })).unwrap();
      const updatedMessage = response.MessageUpsert;
      dispatch(updateMessage({ chatId, messageId, newText: updatedMessage.text }));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }
);






