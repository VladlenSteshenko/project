// src/reducers/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList: {},
  },
  reducers: {
    setChatList(state, action) {
      state.chatList = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },

    addChat(state, action) { console.log(11111111111111111111111111111111111111111111,action)
      state.chatList.push(action.payload);
    }
  }
});

export const { setChatList, setSelectedChat, addChat } = chatSlice.actions;
export default chatSlice.reducer;

