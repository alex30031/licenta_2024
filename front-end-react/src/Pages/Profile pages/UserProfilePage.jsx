import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './ProfilePage.css'
import { useState, useEffect } from 'react'
import axios from 'axios';




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

const handleRestDay = async(event) => {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const endDate = document.getElementById('endDate').value;
    const text = document.getElementById('reason').value;
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens')) || {};
    const activeUser = Object.keys(userTokens)[0] || null;
    const loginUserId = activeUser;
    console.log(date, endDate, text, loginUserId);
    const SERVER_URL = 'http://localhost:3000';
    try {
        const response = await axios.post(`${SERVER_URL}/restday`, {
            text: text,
            date: date,
            endDate: endDate,
            loginUserId: loginUserId
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
            }
        });
        console.log(response.data);
        console.log('Rest day submitted!');
    } catch (error) {
        console.error('Error submitting rest day:', error);
    }
}

const RestDayForm = () => {
    return(
        <div>
            <form className="restday-form" onSubmit={handleRestDay}>
                <h1>Rest day form</h1>
                <label htmlFor="date">Date</label >
                <input type="date" id="date" name="date" required></input>
                <label htmlFor="date">End Date</label >
                <input type ="date" id="endDate" name="endDate" required></input>
                <label htmlFor="reason">Reason</label>
                <textarea id="reason" name="reason" required></textarea>
                <button className="submit-rest" type="submit">Submit</button>
            </form>
      </div>
    )
}

const ListRestdaysRequested = ({ decodedToken }) => {
  const [restdays, setRestdays] = useState([]);
  const SERVER_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchRestdays = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/restday/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
          }
        });
        setRestdays(response.data);
      } catch (error) {
        console.error('Error fetching rest days:', error);
      }
    };

    fetchRestdays();
  }, [decodedToken]);

  return (
    <div className='restday-list'>
      <h1>Rest days list</h1>
        {restdays.map((restday) => (
          <div key={restday.id}>
            <p>Request ID: {restday.id}. Restday period: {new Date(restday.date).toLocaleDateString()}-{new Date(restday.endDate).toLocaleDateString()}</p>
            <p>Decison: {restday.status} </p>
          </div>
        ))}
    </div>
  );
};

const ProductivityGraph = () => {
    return (
        <div className="productivity-graph">
            <h1>Productivity</h1>
            <p>Coming soon...</p>
        </div>
    )
}


const UserProfilePage = ({ decodedToken }) => {
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
            case 'restDayForm':
                return <RestDayForm/>;
            case 'productivityGraph':
                return <ProductivityGraph/>;
            case 'restdayRequests':
                return <ListRestdaysRequested decodedToken={decodedToken}/>;
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
              <li onClick={() => switchFunc('restDayForm')}>Restday request</li>
              <li onClick={() => switchFunc('productivityGraph')}>Productivity</li>
              <li onClick={() => switchFunc('restdayRequests')}>Restday requests list</li>
            </ul>
          </div>
        </div>
      )
}


export default UserProfilePage