// src/components/Chat/ChatList.js
import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserChatsQuery, useChatUpsertMutation} from '../../api/api';
import './ChatPage.css';

const mockChats = [
  { id: 1, name: "Chat 1", lastMessage: "Hello", lastMessageTime: "10:00 AM", image: "https://via.placeholder.com/50" },
  { id: 2, name: "Chat 2", lastMessage: "Hi", lastMessageTime: "11:00 AM", image: "https://via.placeholder.com/50" },
];

const hardcodedUserId = "66881c5cadf3bd0ee7be9879";

const ChatList = () => {
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id || hardcodedUserId; 
  console.log(userId )
  const { data, error, isLoading } = useUserChatsQuery({ members: userId });
  const [createChat] = useChatUpsertMutation();
  const [newChatTitle, setNewChatTitle] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chats</div>;
  console.log(data)
  const chats = data?.ChatFind || [];

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

