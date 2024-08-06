// src/components/Chat/ChatView.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ChatPage.css';
import { sendMessage, updateChatMessage, fetchChatMessages } from '../../thunks/chatThunks';

const ChatView = () => {
  const dispatch = useDispatch();
  let selectedChatId = useSelector((state) => state.chat.selectedChatId);
  let selectedChat = useSelector((state) => state.chat.chatList[selectedChatId]);
  const [messageText, setMessageText] = useState('');
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id;
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (selectedChatId) {
      dispatch(fetchChatMessages({ chatId: selectedChatId, offset: 0 }));
    }
  }, [selectedChatId, dispatch]);


  if (!selectedChat) {
    return <div className="chat-view">Select a chat to view messages</div>;
  }

  let selectedChatMessages = selectedChat.messages || [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      dispatch(sendMessage({ chatId: selectedChatId, text: messageText }));
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
                  <form onSubmit={(e) => handleEditSubmit(e, selectedChatId, message._id)}>
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

