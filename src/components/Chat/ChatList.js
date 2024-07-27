// src/components/Chat/ChatList.js
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserChatsQuery } from '../../api/api';
import './ChatPage.css';

const mockChats = [
  { id: 1, name: "Chat 1", lastMessage: "Hello", lastMessageTime: "10:00 AM", image: "https://via.placeholder.com/50" },
  { id: 2, name: "Chat 2", lastMessage: "Hi", lastMessageTime: "11:00 AM", image: "https://via.placeholder.com/50" },
];

const hardcodedUserId = "5e0b45f346d29f39453971d3";

const ChatList = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading } =  useUserChatsQuery({ members: hardcodedUserId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chats</div>;

  const chats = data?.ChatFind || [];

  return (
    <div className="chat-list">
      <button className="create-chat-button">Create New Chat</button>
      <button className="join-chat-button">Join Chat</button>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => alert(`Chat ID: ${chat._id}, Name: ${chat.title || 'Untitled Chat'}`)}>
            <div className="chat-avatar">
              <img src={chat.members[0]?.avatar?.url || 'default-avatar.png'} alt="avatar" />
            </div>
            <div className="chat-info">
              <h3>{chat.title || 'Untitled Chat'}</h3>
              <p>{chat.lastMessage?.text}</p>
              <span>{new Date(parseInt(chat.lastMessage?.createdAt)).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;

