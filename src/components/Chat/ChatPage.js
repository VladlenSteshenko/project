// src/components/Chat/ChatPage.js
import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatView from './ChatView';
import ChatInfo from './ChatInfo';
import './ChatPage.css';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chat-page">
      <ChatList onSelectChat={setSelectedChat} />
      <ChatView selectedChat={selectedChat} />
      <ChatInfo selectedChat={selectedChat} />
    </div>
  );
};

export default ChatPage;
