// src/reducers/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList: [],
  },
  reducers: {
    setChatList(state, action) {
      state.chatList = action.payload;
    },
    addChat(state, action) { console.log(11111111111111111111111111111111111111111111,action)
      state.chatList.push(action.payload);
    }
  }
});

export const { setChatList, addChat } = chatSlice.actions;
export default chatSlice.reducer;

