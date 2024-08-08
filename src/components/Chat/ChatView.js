// src/components/Chat/ChatView.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, updateChatMessage, fetchChatMessages } from '../../thunks/chatThunks';
import { Avatar, Box, Button, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import './ChatPage.css';

const ChatView = () => {
  const dispatch = useDispatch();
  let selectedChatId = useSelector((state) => state.chat.selectedChatId);
  let selectedChat = useSelector((state) => state.chat.chatList[selectedChatId]);
  const [messageText, setMessageText] = useState('');
  const user = useSelector((state) => state.auth.payload);
  const userId = user?.sub?.id;
  const [editingMessageId, setEditingMessageId] = useState(null);
  const chatList = useSelector((state) => state.chat.chatList) || {};
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (selectedChatId) {
      dispatch(fetchChatMessages({ chatId: selectedChatId, offset: 0 }));
      console.log(55555555555555555555,chatList)
    }
  }, [selectedChatId, dispatch]);

  if (!selectedChat) {
    return <Typography>Select a chat to view messages</Typography>;
  }

  let selectedChatMessages = selectedChat.messages || [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      dispatch(sendMessage({ chatId: selectedChatId, text: messageText }));
      setMessageText('');
      console.log(11111111111111,chatList)
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.text);
    console.log(22222222222222,chatList)
  };

  const handleEditSubmit = (e, chatId, messageId) => {
    e.preventDefault();
    dispatch(updateChatMessage({ chatId, messageId, newText: editText }));
    setEditingMessageId(null);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>{selectedChat.title || 'Untitled Chat'}</Typography>
      <List>
        {selectedChatMessages.length > 0 ? (
          selectedChatMessages.map((message) => (
            <ListItem key={message._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={message.owner?.avatar?.url || 'default-avatar.png'} alt="avatar" />
              </ListItemAvatar>
              <ListItemText
                primary={message.owner?.nick}
                secondary={
                  <>
                    {editingMessageId === message._id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, selectedChatId, message._id)}>
                        <TextField
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          fullWidth
                        />
                        <Button type="submit">Save</Button>
                        <Button onClick={() => setEditingMessageId(null)}>Cancel</Button>
                      </form>
                    ) : (
                      <>
                        <Typography>{message.text}</Typography>
                        {message.owner._id === userId && (
                          <IconButton onClick={() => handleEditMessage(message)}>
                            <EditIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                    <Typography variant="body2" color="textSecondary">{new Date(parseInt(message.createdAt)).toLocaleString()}</Typography>
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography>No messages yet</Typography>
        )}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message"
          fullWidth
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ChatView;
