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
    }
  }
});

export const { setChatList } = chatSlice.actions;
export default chatSlice.reducer;
