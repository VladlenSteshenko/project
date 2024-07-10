// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const initialState = {
  token: localStorage.getItem("token") || null,
  payload: localStorage.getItem("payload")
    ? JSON.parse(localStorage.getItem("payload"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {console.log(33333333333333,action.payload.token)
      const decodedToken = jwtDecode(action.payload.token);
      state.token = action.payload.token;
      state.payload = decodedToken;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("payload", JSON.stringify(decodedToken));
      localStorage.setItem("id", decodedToken.id)
      console.log(444444444444444444,JSON.stringify(decodedToken))
    },
    setUser(state, action) {
      state.payload = action.payload;
    },
    logout(state) {
      state.token = null;
      state.payload = null;
      localStorage.removeItem("token");
      localStorage.removeItem("payload");
      localStorage.removeItem("id");
    },
  },
});

export const { setAuth, setUser, logout } = authSlice.actions;

export default authSlice.reducer;


  

