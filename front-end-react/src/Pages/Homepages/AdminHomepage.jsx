import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';

const AdminHomepage = ({ decodedToken, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const SERVER_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/id:${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (decodedToken) {
      fetchUserData();
    }
  }, [decodedToken]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('userTokens');
      setUserData(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      {decodedToken && <Navbar decodedToken={decodedToken} onLogout={handleLogout} />}
      {userData && <h1>Welcome to the admin homepage, {userData.username}!</h1>}
      {!userData && <h1>Welcome to the admin homepage!</h1>}
    </div>
  );
};

export default AdminHomepage;
