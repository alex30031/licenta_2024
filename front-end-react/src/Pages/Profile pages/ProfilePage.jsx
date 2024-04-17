import React from 'react';
import AdminProfilePage from './AdminProfilePage';
import UserProfilePage from './UserProfilePage';

const ProfilePage = ({ decodedTokens, activeUser }) => {
  const activeToken = decodedTokens[activeUser];

  return (
    <div>
      {activeToken && activeToken.accountType === 'user' && <UserProfilePage key={activeUser} decodedToken={activeToken} />}
      {activeToken && activeToken.accountType === 'admin' && <AdminProfilePage key={activeUser} decodedToken={activeToken} />}
    </div>
  );
};

export default ProfilePage;
