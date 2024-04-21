import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './ProfilePage.css'
import { useState, useEffect } from 'react'
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000';

const RestdayRequests = () => {
  const [requests, setRequests] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
      const fetchRequests = async () => {
          try {
              const response = await axios.get(`${SERVER_URL}/restday`);
              setRequests(response.data);

              const usernamesMap = {};
              for(const request of response.data){
                const usernameResponse = await axios.get(`${SERVER_URL}/id:${request.loginUserId}`);
                usernamesMap[request.loginUserId] = usernameResponse.data.username;
              }
              setUsername(usernamesMap);
          } catch (error) {
              console.error('Error fetching restday requests:', error);
          }
      };

      fetchRequests();
  }, []);

  const handleRequest = async (requestId, status) => {
      try {
          await axios.put(`${SERVER_URL}/restday/${requestId}`, { status });
          const response = await axios.get(`${SERVER_URL}/restday`);
          setRequests(response.data);
          console.log(response.data);
      } catch (error) {
          console.error('Error handling request:', error);
      }
  };

  const deleteRequest = async (requestId) => {
      try {
          await axios.delete(`${SERVER_URL}/restday/${requestId}`);
          const response = await axios.get(`${SERVER_URL}/restday`);
          setRequests(response.data);
      } catch (error) {
          console.error('Error deleting request:', error);
      }
  };

  // const fetchUsername = async () => {
  //   try {
  //     const response = await axios.get(`${SERVER_URL}/id:${requests.loginUserId}`);
  //     setUsername(response.data);
  //   } catch (error) {
  //     console.error('Error fetching username:', error);
  //     return '';
  //   }
  // };
  // fetchUsername();
  return (
      <div className="restday-requests">
          <h1>Restday Requests</h1>
          {requests.map(request => (
              <div key={request.id}>
                  <p>Employee : {username[request.loginUserId]}</p>
                  <p>Reason: {request.text} </p>
                  <p>Start Date: {new Date(request.date).toLocaleDateString()}</p>
                  <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
                  <button onClick={()=>deleteRequest(request.id)}> Delete</button>
                  <button onClick={() => handleRequest(request.id, 'accepted')}>Accept</button>
                  <button onClick={() => handleRequest(request.id, 'rejected')}>Reject</button>
              </div>
          ))}
      </div>
  );
};

const ProfileInfo = ({ decodedToken}) => { 
    return(
        <ul className="profile-form">
            <h1>Profile info</h1>
            <li>Username: {decodedToken && decodedToken.username}</li>
            <li>Email: {decodedToken && decodedToken.email}</li>
            <li>Account Type: {decodedToken && decodedToken.accountType}</li>
        </ul>
    )
}


const ProductivityGraph = () => {
    return (
        <div className="productivity-graph">
            <h1>Productivity</h1>
            <p>Coming soon...</p>
        </div>
    )
}

const AdminProfilePage = ({ decodedToken }) => {
    const [activeFunc, setActiveFunc] = useState('profileInfo');
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

    const switchFunc = (func) => {
        setActiveFunc(func);
    };

    const renderFunc = () => {
        switch(activeFunc) {
            case 'profileInfo':
                return <ProfileInfo decodedToken={decodedToken}/>;
            case 'productivityGraph':
                return <ProductivityGraph/>;
            case 'restdayRequests':
                return <RestdayRequests/>;
            default:
                return <ProfileInfo decodedToken={decodedToken}/>;
        }
    };

    return (
        <div>
          {decodedToken && <Navbar decodedToken={decodedToken}/>}
          <div className="profile-info">{renderFunc()}</div>
          <div className="sidebar">
            <ul>
              <li onClick={() => switchFunc('profileInfo')}>Profile Info</li>
              <li onClick={() => switchFunc('productivityGraph')}>Productivity</li>
              <li onClick={() => switchFunc('restdayRequests')}>Restday Requests</li>
            </ul>
          </div>
        </div>
      )
}


export default AdminProfilePage