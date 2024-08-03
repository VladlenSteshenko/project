// src/components/Chat/ChatView.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ChatPage.css';
import { sendMessage, updateChatMessage } from '../../thunks/chatThunks';


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
  const selectedChatMessages = useSelector((state) => state.chat.selectedChatMessages[selectedChat?._id] || []);
  const [messageText, setMessageText] = useState('');
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id;
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');

  if (!selectedChat) {
    return <div className="chat-view">Select a chat to view messages</div>;
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      dispatch(sendMessage({ chatID: selectedChat._id, text: messageText }));
      setMessageText('');
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.text);
  };

  const handleEditSubmit = (e, chatId, messageId) => {
    e.preventDefault();
    dispatch(updateChatMessage({ chatId, messageId, newText: editText }));
    setEditingMessageId(null);
  };

  return (
    <div className="chat-view">
      <h3>{selectedChat.title || 'Untitled Chat'}</h3>
      <ul>
        {selectedChatMessages.length > 0 ? (
          selectedChatMessages.map((message) => (
            <li key={message._id} className="message-item">
              <div className="message-avatar">
                <img src={message.owner?.avatar?.url || 'default-avatar.png'} alt="avatar" />
              </div>
              <div className="message-content">
                <span className="message-author">{message.owner?.nick}</span>
                {editingMessageId === message._id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, selectedChat._id, message._id)}>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingMessageId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <p className="message-text">{message.text}</p>
                    {message.owner._id === userId && (
                      <button onClick={() => handleEditMessage(message)}>Edit</button>
                    )}
                  </>
                )}
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


