import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './ProfilePage.css'
import { useState, useEffect } from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import * as $ from 'jquery';
import { useForm } from 'react-hook-form';

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


const ProductivityGraph = ({decodedToken}) => {

  const [fetched, setFetched] = useState(false);

  const daysInThisMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const options = {
    scales: {
        x: {
            type: 'linear',
            position: 'bottom'
        },
        y: {
            beginAtZero: true,
        },
    },
};

    var month_names = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];
    var date = new Date();
    var month = month_names[date.getMonth()];
    const { register, handleSubmit, } = useForm();
    const [datasets, setDatasets] = useState(
      {
        label: 'Your Productivity',
        data: Array(daysInThisMonth()).fill(0),
        fill: false,
        backgroundColor: 'rgb(60, 51, 92)',
        borderColor: 'rgba(60, 51, 92, 0.3)',
      },
    )

    const data = {
      labels: Array.from({length: daysInThisMonth()}, (_, i) => i + 1),
      datasets: [datasets],
  };            

  useEffect(() => {
    if (decodedToken && !fetched) {
      axios.get(`${SERVER_URL}/productivity/${decodedToken.userId}`)
        .then(response => {
          const productivityData = response.data;
          setDatasets(prevState => ({
            ...prevState,
            data: productivityData,
          }));
          setFetched(true);
        })
        .catch(error => {
          console.error('Error fetching productivity data:', error);
        });
    }
  }, [decodedToken, fetched]);

  const onSubmit = (d) => {
    const prodValues = data.datasets[0].data.slice();
    prodValues[d.day-1] = d.prod;
  
    setDatasets(prevState => ({
      ...prevState,
      data: prodValues,
    }));
  
    axios.put(`${SERVER_URL}/productivity/${decodedToken.userId}`, { data: prodValues })
      .catch(error => {
        console.error('Error updating productivity data:', error);
      });
  
    $('#productivity-form').trigger("reset");
  };

  const reset = () => {
    var conf = window.confirm('Are you sure you want to reset the entire chart? We recommend doing it on the 1st of each month so that you can start fresh for that month!');
    if (conf === true) {
      const newData = Array(daysInThisMonth()).fill(0);
      axios.put(`${SERVER_URL}/productivity/reset/${decodedToken.userId}`, { data: newData })
        .then(response => {
          setDatasets(prevState => ({
            ...prevState,
            data: newData,
          }));
        })
        .catch(error => {
          console.error('Error resetting productivity data:', error);
        });
    }
  };

    return (
        <div className='productivity-container'>
            <h2 style={{textAlign: 'center'}}>Productivity For {month}</h2>
            <form noValidate id="productivity-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='inputs-productivity' style={{textAlign:'center'}}>
                        <input
                            placeholder="Enter Day Number"
                            name="day"
                            id="day-input"
                            type='number'
                            defaultValue={date.getDate()} 
                            {...register("day",{
                                required: {value: true, message: ""},
                                min: {value: 1,  message: ""},
                                max: {value: daysInThisMonth(),  message: ""},
                            })} >
                        </input>
                        <input className="tick" type='submit' value='&#10003;'></input>
                    </div>
                    <div className='inputs-productivity' style={{textAlign:'center'}}>
                        <input
                            placeholder="Productivity Value"
                            name="prod"
                            id="prod-input"
                            type='number' 
                            {...register("prod",{
                                required: {value: true, message: ""},
                                min: {value: 0,  message: ""},
                                max: {value: 10,  message: ""},
                            })} >
                        </input>
                        <input className="tick" type='submit' value='&#10003;'></input>
                    </div>
                </form>  
                <div style={{textAlign:'center'}}>
                  <button onClick={reset} >Reset Full Chart</button>
                </div>
                <div className='line-chart'>
                    <Line data={data} options={options} />
                </div>
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
                return <ProductivityGraph decodedToken={decodedToken}/>;
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