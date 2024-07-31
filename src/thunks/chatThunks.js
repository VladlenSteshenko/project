// src/reducers/chatThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setChatList,
  addChat,
  updateLastMessage,
  setSelectedChatMessages,
  addMessage,
} from '../reducers/chatSlice';
import { io} from 'socket.io-client';

export const connectSocket = createAsyncThunk(
  'auth/connectSocket',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log(11111111111111,token)
    // Connect to socket and authenticate
    const socket = io("ws://chat.ed.asmer.org.ua")
    socket.emit('jwt', token);

    // Receive updates for chats of user
    socket.on('chat', (chats) => {
      const chatMap = {};
      chats.forEach(chat => {
        chatMap[chat._id] = chat;
      });
      dispatch(setChatList(chatMap));
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

/*export const fetchMessagesForChat = createAsyncThunk(
  'chat/fetchMessagesForChat',
  async (chatId, { dispatch }) => {
    // Request messages for the selected chat
    socket.emit('getChatMessages', chatId);
  }
);
*/
