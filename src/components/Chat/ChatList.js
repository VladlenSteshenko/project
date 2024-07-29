// src/components/Chat/ChatList.js
import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserChatsQuery, useChatUpsertMutation} from '../../api/api';
import './ChatPage.css';

const mockChats = [
  { _id: 1, title: "Chat 1", lastMessage: { text: "Hello" }, lastModified: "1620196188000", avatar: { url: "https://via.placeholder.com/50" } },
  { _id: 2, title: "Chat 2", lastMessage: { text: "Hi" },lastModified: "1620196188000", avatar: { url: "https://via.placeholder.com/50" } },
];

const ChatList = () => {
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id;
  const chats = useSelector((state) => state.chat.chatList) || mockChats;
  const [createChat] = useChatUpsertMutation();
  const [newChatTitle, setNewChatTitle] = useState('');

  const handleCreateChat = async () => {
    if (!newChatTitle) return;

    try {
      await createChat({ title: newChatTitle, ownerId: userId }).unwrap();
      setNewChatTitle('');
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-actions">
        <input
          type="text"
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder="New chat title"
        />
        <button onClick={handleCreateChat}>Create New Chat</button>
      </div>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => alert(`Chat ID: ${chat._id}, Name: ${chat.title || 'Untitled Chat'}`)}>
            <div className="chat-avatar">
              <img src={chat.avatar?.url || 'default-avatar.png'} alt="avatar" />
            </div>
            <div className="chat-info">
              <h3>{chat.title || 'Untitled Chat'}</h3>
              <p>{chat.lastMessage?.text}</p>
              <span>{chat.lastModified ? new Date(parseInt(chat.lastModified)).toLocaleString() : ''}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;

