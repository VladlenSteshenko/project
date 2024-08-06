// src/components/Chat/ChatList.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserChatsQuery, useChatUpsertMutation } from '../../api/api';
import './ChatPage.css';
import { setChatList, setSelectedChatId, addChat } from '../../reducers/chatSlice';
import { sendMessage, updateChatMessage, fetchChatMessages } from '../../thunks/chatThunks';

const mockChats = [
  { _id: 1, title: "Chat 1", lastMessage: { text: "Hello" }, lastModified: "1620196188000", avatar: { url: "https://via.placeholder.com/50" } },
  { _id: 2, title: "Chat 2", lastMessage: { text: "Hi" }, lastModified: "1620196188000", avatar: { url: "https://via.placeholder.com/50" } },
];

const ChatList = () => {
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id;
  const chatList = useSelector((state) => state.chat.chatList) || {};
  const chats = Object.values(chatList) || mockChats;
  const [createChat] = useChatUpsertMutation();
  const [newChatTitle, setNewChatTitle] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, error, isLoading } = useUserChatsQuery({ _id: userId });
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  useEffect(() => {
    if (selectedChatId) {
      dispatch(fetchChatMessages({ chatId: selectedChatId, offset: 0 }));
    }
  }, [dispatch, selectedChatId]);


  const handleCreateChat = async () => {
    if (!newChatTitle) return;

    try {
      const newChat = await createChat({ title: newChatTitle }).unwrap();
      dispatch(addChat(newChat));
      setNewChatTitle('');
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const handleChatClick = (chat) => {
    console.log(7777777777,chatList)
    dispatch(setSelectedChatId(chat._id));
    dispatch(fetchChatMessages({ chatId: chat._id, offset: 0 }));
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chats</div>;

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
        <button onClick={handleGoToProfile}>My Profile</button>
      </div>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => handleChatClick(chat)}>
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
};

export default ChatList;
