// src/components/Auth/Entry.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Entry = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
      {isRegister ? <Register /> : <Login />}
    </div>
  );
};

export default Entry;
