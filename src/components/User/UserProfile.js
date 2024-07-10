// src/components/User/UserProfile.js
import { useSelector, useDispatch } from 'react-redux';
import { useUserFindOneQuery, useUserUpsertMutation } from '../../api/api';
import { setUser, logout } from '../../reducers/authSlice';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = localStorage.getItem("id");
  
  //const { data, loading, error } = useUserFindOneQuery({ _id: userId });
  const { data, loading, error } = useUserFindOneQuery({ variables: { _id: userId } });

    const user = useSelector((state) => state.auth.payload);
  
    useEffect(() => {
      if (data && data.UserFindOne) {
        dispatch(setUser(data.UserFindOne));
      }
    }, [data, dispatch]);
  
    const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching user data</div>;
  
    return (
      <div>
        <h1>User Profile</h1>
        {user ? (
          <div>
            <p>Login: {user.login}</p>
            <p>Nick: {user.nick}</p>
            <p>Created At: {user.createdAt}</p>
            {user.avatar && (
              <div>
                <img src={user.avatar.url} alt="avatar" />
              </div>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>No user data found</div>
        )}
      </div>
    );
  };
  
  export default UserProfile;
  
  




