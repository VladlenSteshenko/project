// src/thunks/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout } from '../reducers/authSlice';
import { api } from '../api/api';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ login, password }, { dispatch }) => {
    const response = await api.endpoints.login.initiate({ login, password });
    const token = response.data.login;
    if (token) {
      dispatch(login(token));
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
