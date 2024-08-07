// src/components/User/UserProfile.js
import { useSelector, useDispatch } from 'react-redux';
import { useUserFindOneQuery, useSetUserNickMutation } from '../../api/api';
import { setProfile, logout } from '../../reducers/authSlice';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateUserNickname } from '../../reducers/chatSlice';
import { Button, Container, Typography, TextField, CircularProgress, Avatar, Box, Paper } from '@mui/material';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.payload);
  const profile = useSelector((state) => state.auth.profile);
  const userId = user?.sub?.id;

  const { data, isLoading, error, refetch } = useUserFindOneQuery({ _id: userId });
  const [setUserNick] = useSetUserNickMutation();

  const [nick, setNick] = useState("");

  useEffect(() => {
    if (data && data.UserFindOne) {
      dispatch(setProfile(data.UserFindOne));
      setNick(data.UserFindOne.nick || "");
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNickChange = async (e) => {
    e.preventDefault();
    try {
      await setUserNick({ _id: userId, nick });
      dispatch(updateUserNickname({ userId, newNick: nick })); // Dispatch the action to update nick in chats
      refetch(); // Refetch user data after nickname change
    } catch (error) {
      console.error("Error updating nickname", error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString(); // You can customize the format here
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching user data</Typography>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        {profile ? (
          <Box>
            <Typography variant="h6">Login: {profile.login}</Typography>
            <Typography variant="h6">Nick: {profile.nick}</Typography>
            <Typography variant="h6">Created At: {formatDateTime(profile.createdAt)}</Typography>
            {profile.avatar && (
              <Avatar alt="avatar" src={profile.avatar.url} style={{ width: 100, height: 100, margin: '1rem auto' }} />
            )}
            <form onSubmit={handleNickChange} style={{ marginTop: '1rem' }}>
              <TextField
                label="Change Nickname"
                variant="outlined"
                fullWidth
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Update Nickname
              </Button>
            </form>
            <Box display="flex" justifyContent="space-between" marginTop="1rem">
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="contained" onClick={() => navigate('/chat')}>
                Back to Chat
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No user data found</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
