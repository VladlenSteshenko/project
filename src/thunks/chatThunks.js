// src/reducers/chatThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setChatList,
  addChat,
  updateLastMessage,
  setChatMessages,
  addMessage,
  updateMessage
} from '../reducers/chatSlice';
import io from 'socket.io-client';
import { api } from '../api/api';

const socket = io("ws://chat.ed.asmer.org.ua");

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

    socket.on('msg', (data) => {
      console.log('Received message data:', data);

      // Check if data is an object and has the expected properties
      if (typeof data === 'object' && data !== null) {
        const { _id: messageId, text, chat: { _id: chatId }, owner } = data;

        if (chatId && text && owner) {
          const message = {
            _id: messageId,
            text,
            owner,
            createdAt: data.createdAt,
          };

          dispatch(addMessage({ chatId, message }));
          
        } else {
          console.error('Received message data does not contain expected properties:', data);
        }
      } else {
        console.error('Received message data is not an object:', data);
      }
    });

  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatId, offset }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.getMessages.initiate({ chatID:chatId, offset })).unwrap();
      dispatch(setChatMessages({ chatId, messages: response.MessageFind }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, text }, { dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.MessageUpsert.initiate({ chatID:chatId, text })).unwrap();
      //dispatch(addMessage({ chatId, message: response.MessageUpsert }));
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
      //dispatch(updateMessage({ chatId, message: response.MessageUpsert }));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }
);
