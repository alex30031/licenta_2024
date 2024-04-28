import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import "./Homepage.css"
import chatIcon from "../../Components/Assets/chat_icon.png"
import Chat from './Chat';


const UserHomepage = ({ decodedToken, onLogout }) => {
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ws, setWs] = useState(null);

  const SERVER_URL = 'http://localhost:3000';
  const WS_SERVER_URL = 'ws://localhost:8080';

  useEffect(() => {
    const ws = new WebSocket(WS_SERVER_URL);

    setWs(ws);
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

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
      {userData && <h1>Welcome to the homepage, {userData.username}!</h1>}
      {!userData && <h1>Welcome to the homepage!</h1>}
       <button 
      type='button' 
      className="chat-button" 
      onClick={() => setShowChat(!showChat)
      }>
        <img src={chatIcon} alt="Chat" />
      </button> 
       {<Chat ws={ws} decodedToken={decodedToken} showChat={showChat} />}
      </div>
  );
};

export default UserHomepage;
