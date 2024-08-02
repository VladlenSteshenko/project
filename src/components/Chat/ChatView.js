// src/components/Chat/ChatView.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ChatPage.css';
import { sendMessage } from '../../thunks/chatThunks';

const mockMessages = [
  {
    id: 1,
    text: "Hello",
    author: "User 1",
    avatar: "https://via.placeholder.com/30",
    time: "10:00 AM",
  },
  {
    id: 2,
    text: "Hi",
    author: "User 2",
    avatar: "https://via.placeholder.com/30",
    time: "10:05 AM",
  },
];

const ChatView = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const selectedChatMessages = useSelector((state) => state.chat.selectedChatMessages[selectedChat?._id] || {});
  const [messageText, setMessageText] = useState('');

  if (!selectedChat) {
    return <div className="chat-view">Select a chat to view messages</div>;
  }

  const messagesArray = Object.values(selectedChatMessages).sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      dispatch(sendMessage({ chatID: selectedChat._id, text: messageText }));
      setMessageText('');
    }
  };

  return (
    <div className="chat-view">
      <h3>{selectedChat.title || 'Untitled Chat'}</h3>
      <ul>
        {messagesArray.length > 0 ? (
          messagesArray.map((message) => (
            <li key={message._id} className="message-item">
              <div className="message-avatar">
                <img src={message.owner?.avatar?.url || 'default-avatar.png'} alt="avatar" />
              </div>
              <div className="message-content">
                <span className="message-author">{message.owner?.nick}</span>
                <p className="message-text">{message.text}</p>
                <span className="message-time">{new Date(parseInt(message.createdAt)).toLocaleString()}</span>
              </div>
            </li>
          ))
        ) : (
          <li>No messages yet</li>
        )}
      </ul>
      <div className="send-message">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};


export default ChatView;

