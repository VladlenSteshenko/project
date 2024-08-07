// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/User/UserProfile';
import Entry from './components/Auth/Entry';
import ChatPage from './components/Chat/ChatPage';


const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);

export default App;

