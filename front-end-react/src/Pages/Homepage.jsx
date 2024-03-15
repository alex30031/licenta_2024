// Homepage.js
import React from 'react';
import Navbar from '../Components/Navbar/Navbar';

const Homepage = ({ userData }) => {
  
  return (
    <div>
      {userData && <Navbar userData={userData}/>}

    </div>
  );
};

export default Homepage;
