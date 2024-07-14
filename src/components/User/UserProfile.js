// src/components/User/UserProfile.js
import { useSelector, useDispatch } from 'react-redux';
import { useUserFindOneQuery ,useSetUserNickMutation} from '../../api/api';
import { setProfile, logout } from '../../reducers/authSlice';
import React, { useEffect,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.payload);
  const profile = useSelector((state) => state.auth.profile);
  const userId = user?.sub?.id;

  const { data, loading, error } = useUserFindOneQuery({ _id: userId });
  const [setUserNick] = useSetUserNickMutation();

  const [nick, setNick] = useState("");
  useEffect(() => {
    if (data && data.UserFindOne) {
      dispatch(setProfile(data.UserFindOne))
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
    } catch (error) {
      console.error("Error updating nickname", error);
    }
  };


  const formatDateTime = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString(); // You can customize the format here
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {profile ? (
        <div>
          <p>Login: {profile.login}</p>
          <p>Nick: {profile.nick}</p>
          <p>Created At: {formatDateTime(profile.createdAt)}</p>
          {profile.avatar && (
            <div>
              <img src={profile.avatar.url} alt="avatar" />
            </div>
          )}
          <form onSubmit={handleNickChange}>
            <label>Change Nickname</label>
            <input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
            />
            <button type="submit">Update Nickname</button>
          </form>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default UserProfile;


  
  




