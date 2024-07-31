// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/api';
import { setAuth, setProfile } from '../../reducers/authSlice';
import { jwtDecode } from "jwt-decode";
import { loginThunk } from '../../thunks/authThunks';
import { connectSocket } from '../../thunks/chatThunks';

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ login, password })).unwrap();
      await dispatch(connectSocket()).unwrap();
      navigate("/chat");
      // Redirect or handle successful login
    } catch (err) {
      console.error('Failed to login:', err);
      // Handle login failure
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Login</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;


  

