// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/api';
import { setAuth } from '../../reducers/authSlice';
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { console.log(2222222222222222222,login,password)
      const { data } = await loginMutation({ login, password });
      if (data.login) {
        const decodedToken = jwtDecode(data.login);
        dispatch(setAuth({ token: data.login, user: decodedToken }));
        console.log(111111111111111,data.login)
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error", error);
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

  

