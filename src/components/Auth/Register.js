// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useLoginMutation } from '../../api/api';
import { setAuth } from '../../reducers/authSlice';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [registerMutation] = useRegisterMutation();
  const [loginMutation] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerMutation({ login, password });
      if (data.UserUpsert) {
        // Perform login after successful registration
        const loginResponse = await loginMutation({ login, password });
        if (loginResponse.data.login) {
          const decodedToken = jwtDecode(loginResponse.data.login);
          dispatch(setAuth({ token: loginResponse.data.login, user: decodedToken }));
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error("Registration error", error);
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

