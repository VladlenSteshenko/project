// src/components/Chat/ChatInfo.js
import React from 'react';
import './ChatPage.css';
import { useSelector } from 'react-redux';
const mockChatInfo = {
  name: "Chat 1",
  createdAt: "2024-07-10",
  description: "This is a sample chat",
  users: [
    { id: 1, name: "User 1", avatar: "https://via.placeholder.com/30" },
    { id: 2, name: "User 2", avatar: "https://via.placeholder.com/30" },
  ],
};

const ChatInfo = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  if (!selectedChat) {
    return <div className="chat-info">Select a chat to see details</div>;
  }

  return (
    <div className="chat-info">
      <h3>{selectedChat.title || 'Untitled Chat'}</h3>
      <p>Last Modified: {selectedChat.lastModified ? new Date(parseInt(selectedChat.lastModified)).toLocaleString() : ''}</p>
      <div className="chat-avatar">
        <img src={selectedChat.avatar?.url || 'default-avatar.png'} alt="avatar" />
      </div>
      <h4>Members</h4>
      <div className="users">
        {selectedChat.members.map(user => (
          <div key={user._id} className="user-item">
            <img src={user.avatar?.url || 'https://via.placeholder.com/30'} alt={user.nick} />
            <span>{user.nick}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ChatInfo;
