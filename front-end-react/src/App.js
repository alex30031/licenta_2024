import Login from './Components/LoginPage/Login';
import Homepage from './Pages/Homepage'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import ProfilePage from './Pages/ProfilePage';
import {jwtDecode} from 'jwt-decode';



function App() {
  const [decodedToken, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken = jwtDecode(token);
      setUserData(decodedToken);
    }
  }, []);


  const handleLogin = (decodedToken) => {
    setUserData(decodedToken);
    localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
  };

  const handleSignup = (decodedToken) => {
    setUserData(decodedToken);
    localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={decodedToken ? <Homepage decodedToken={decodedToken} /> : null} />
        <Route path="/" element={<Login onLogin={handleLogin} onSignup={handleSignup} />} />
        <Route path="/profile" element={decodedToken ?<ProfilePage decodedToken={decodedToken} /> : null} />
      </Routes>
    </Router>
  );
}

export default App;
