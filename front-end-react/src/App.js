import Login from './Components/LoginPage/Login';
import Homepage from './Pages/Homepages/Homepage'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React, { useState } from 'react';
import ProfilePage from './Pages/Profile pages/ProfilePage';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [decodedTokens, setDecodedTokens] = useState(() => {
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens')) || {};
    const decodedTokens = {};
    for (let key in userTokens) {
      const token = userTokens[key];
      if (token) {
        decodedTokens[key] = jwtDecode(token);
      }
    }
    return decodedTokens;
  });

  const [activeUser, setActiveUser] = useState(() => {
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens')) || {};
    return Object.keys(userTokens)[0] || null;
  });

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens')) || {};
    userTokens[decodedToken.userId] = token;
    sessionStorage.setItem('userTokens', JSON.stringify(userTokens));
    setDecodedTokens(prevTokens => ({ ...prevTokens, [decodedToken.userId]: decodedToken }));
    setActiveUser(decodedToken.userId);
};

const handleSignup = (token) => {
    const decodedToken = jwtDecode(token);
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens')) || {};
    userTokens[decodedToken.userId] = token;
    sessionStorage.setItem('userTokens', JSON.stringify(userTokens));
    setDecodedTokens(prevTokens => ({ ...prevTokens, [decodedToken.userId]: decodedToken }));
    setActiveUser(decodedToken.userId);
};
  return (
    <Router>
      <Routes>
        <Route path="/home" element={decodedTokens ? <Homepage decodedTokens={decodedTokens} activeUser={activeUser}/> : null} />
        <Route path="/" element={<Login onLogin={handleLogin} onSignup={handleSignup} />} />
        <Route path="/profile" element={decodedTokens ? <ProfilePage decodedTokens={decodedTokens} activeUser={activeUser} /> : null} />
      </Routes>
    </Router>
  );
}

export default App;
