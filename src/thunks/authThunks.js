// src/thunks/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout } from '../reducers/authSlice';
import { api } from '../api/api';
import { setChatList } from '../reducers/chatSlice';
import { jwtDecode } from 'jwt-decode';
import { setAuth } from '../reducers/authSlice';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ login, password }, { dispatch }) => {
    const response = await api.endpoints.login.initiate({ login, password });
    if (response.data && response.data.login) {
      const token = response.data.login;
      const payload = jwtDecode(token);
      const decodedToken = jwtDecode(response.data.login);
      dispatch(setAuth({ token: response.data.login, user: decodedToken }));
     
      console.log(111111111111111)
      // Fetch user profile and chat data after successful login
      dispatch(fetchAboutMeThunk());
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ login, password }, { dispatch }) => {
    const response = await api.endpoints.register.initiate({ login, password });
    if (response.data) {
      await dispatch(loginThunk({ login, password }));
    }
  }
);

export const fetchAboutMeThunk = createAsyncThunk(
  'auth/fetchAboutMe',
  async (_, { dispatch, getState }) => {
    console.log(222222222222)
    const state = getState();
    console.log(33333333333333)
    const userId = state.auth.payload.sub.id;
    console.log(4444444444444,userId)
    const response = await api.endpoints.actionAboutMe.initiate({ _id: userId });
    console.log(555555555555,response.data)

    if (response.data) {
      const { UserFindOne } = response.data;
      dispatch(setChatList(UserFindOne.chats));
    }
  }
);
