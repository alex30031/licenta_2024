import Login from './Components/LoginPage/Login';
import Homepage from './Pages/Homepage'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React, { useState, useEffect } from 'react';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogin = (userData) => {
    setUserData(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUserData(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={userData ? <Homepage userData={userData} /> : null} />
        <Route path="/" element={<Login onLogin={handleLogin} onSignup={handleSignup} />} />
      </Routes>
    </Router>
  );
}

export default App;
