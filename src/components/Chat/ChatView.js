// src/components/Chat/ChatView.js
import React from 'react';
import './ChatPage.css';

const mockMessages = [
  { id: 1, text: "Hello", author: "User 1", avatar: "https://via.placeholder.com/30", time: "10:00 AM" },
  { id: 2, text: "Hi", author: "User 2", avatar: "https://via.placeholder.com/30", time: "10:05 AM" },
];

const ChatView = ({ selectedChat }) => {
  const messages = mockMessages; // Replace with actual data fetching logic

  return (
    <div className="chat-view">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message-item">
            <img src={message.avatar} alt={message.author} />
            <div>
              <h5>{message.author}</h5>
              <p>{message.text}</p>
              <span>{message.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input type="text" placeholder="Type a message..." />
        <button>Add Media</button>
      </div>
    </div>
  );
};

export default ChatView;
