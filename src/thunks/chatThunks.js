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
    console.log(11111111111111,token)
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    // Connect to socket and authenticate
    
    socket.emit('jwt', token);

    // Receive updates for chats of user
    socket.on('chat', (chat) => {
      console.log(3333333333333333333333,chat)
      /*const chatMap = {};
      chats.forEach(chat => {
        chatMap[chat._id] = chat;
      });
      dispatch(setChatList(chatMap));*/
      dispatch(addChat(chat));

    });

    // Receive messages for selected chat
    socket.on('msg', ({ chatId, messages }) => {
      dispatch(setSelectedChatMessages({ chatId, messages }));
    });

    // Receive last messages for all user chats
    socket.on('lastMessage', ({ chatId, lastMessage }) => {
      dispatch(updateLastMessage({ chatId, lastMessage }));
    });

    // Handle new message
    socket.on('newMessage', ({ chatId, message }) => {
      dispatch(addMessage({ chatId, message }));
    });
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatID, offset }, { dispatch }) => {
    console.log(123123)
    try {
      const response = await api.endpoints.getMessages.initiate({ chatID, offset });
      console.log('aaaaaaaaaa:', response);
      const data = await response.data;
      console.log('API Response:', data);
      dispatch(setSelectedChatMessages({ chatID, messages: data.MessageFind }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error; // Re-throw the error to be handled by the calling code
    }
  }
);

