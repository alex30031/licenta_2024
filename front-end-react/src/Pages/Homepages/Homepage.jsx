import React from 'react';
import UserHomepage from './UserHomepage';
import AdminHomepage from './AdminHomepage';

const Homepage = ({ decodedTokens, activeUser }) => {
  const activeToken = decodedTokens[activeUser];

  return (
    <div>
      {activeToken && activeToken.accountType === 'user' && <UserHomepage key={activeUser} decodedToken={activeToken} />}
      {activeToken && activeToken.accountType === 'admin' && <AdminHomepage key={activeUser} decodedToken={activeToken} />}
    </div>
  );
};

export default Homepage;
