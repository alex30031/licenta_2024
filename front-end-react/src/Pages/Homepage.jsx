import React from 'react';
import Navbar from '../Components/Navbar/Navbar';

const Homepage = ({ decodedToken }) => {
  return (
    <div>
      {decodedToken && <Navbar decodedToken={decodedToken}/>}
      <h1>Welcome to the homepage, {decodedToken.username}!</h1>
    </div>
  );
};

export default Homepage;
