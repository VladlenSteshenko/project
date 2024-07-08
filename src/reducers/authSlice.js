// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
function jwtDecode(token) {
  try {
    const [, data] = token.split(".");
    const json = atob(data);
    const result = JSON.parse(json);
    return result;
  } catch (e) {}
}

const initialState = {
  token: localStorage.getItem("token") || null,
  payload: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
        
      state.token = action.payload.token;
      console.log(jwtDecode(state.token))
    },
    setUser(state, action) {
      state.payload = action.payload;
    },
    logout(state) {
      state.token = null;
      state.payload = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
