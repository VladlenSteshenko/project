// src/components/User/UserProfile.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUserFindOneQuery, useUserUpsertMutation } from '../../api/api';
import { setUser } from '../../reducers/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.payload);
  const { data, loading, error } = useUserFindOneQuery({
    variables: { query: `[{ "_id": "${user?._id}" }]` }
  });

  useEffect(() => {
    if (data && data.UserFindOne) {
      dispatch(setUser(data.UserFindOne));
    }
  }, [data, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>ID: {user._id}</p>
          <p>Login: {user.login}</p>
          <p>Nick: {user.nick}</p>
          <p>Created At: {user.createdAt}</p>
          {user.avatar && (
            <div>
              <img src={user.avatar.url} alt="avatar" />
            </div>
          )}
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default UserProfile;


