// src/components/Chat/ChatInfo.js
import React from 'react';
import './ChatPage.css';

const mockChatInfo = {
  name: "Chat 1",
  createdAt: "2024-07-10",
  description: "This is a sample chat",
  users: [
    { id: 1, name: "User 1", avatar: "https://via.placeholder.com/30" },
    { id: 2, name: "User 2", avatar: "https://via.placeholder.com/30" },
  ],
};

const ChatInfo = ({ selectedChat }) => {
  const chatInfo = selectedChat ? selectedChat : mockChatInfo; // Replace with actual data fetching logic

  return (
    <div className="chat-info">
      <h3>{chatInfo.name}</h3>
      <p>Created At: {chatInfo.createdAt}</p>
      <p>{chatInfo.description}</p>
      <h4>Users</h4>
      <div className="users">
        {chatInfo.users.map(user => (
          <div key={user.id} className="user-item">
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInfo;
