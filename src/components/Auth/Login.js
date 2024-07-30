// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/api';
import { setAuth, setProfile } from '../../reducers/authSlice';
import { jwtDecode } from "jwt-decode";
import { loginThunk } from '../../thunks/authThunks';
import { io } from 'socket.io-client';



const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginThunk({ login, password })).unwrap();
      
      const socket = io('ws://chat.ed.asmer.org.ua'); 
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


  

