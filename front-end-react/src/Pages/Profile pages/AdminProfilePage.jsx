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

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/users`);
        setUsers(response.data.records);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ul className='ul-info'>
      {users.map((user) => (
        <li className='li-info' key={user.id}>
         User ID: {user.userId} - Username: {user.username} - Email: {user.email} - Job: {user.jobName}
        </li>
      ))}
    </ul>
  );
};

const CreateTask = () => {
  const [userId, setUserId] = useState('');
  const [name, setTaskName] = useState('');
  const [description, setTaskDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/task`, {name, description , userId });
      console.log(response.data);
      alert('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  return (
    <form className='task-form' onSubmit={handleSubmit}>
      <label>
        User ID:
        <input className='task-input' type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </label>
      <label>
        Task Name:
        <input className='task-input' type="text" value={name} onChange={(e) => setTaskName(e.target.value)} required />
      </label>
      <label>
        Task Description:
        <input className='task-input' type="text" value={description} onChange={(e) => setTaskDescription(e.target.value)} required />
      </label>
      <button className='task-submit' type="submit">Create Task</button>
    </form>
  );
};

const UserTaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
    <h1 className="title-for-tasks">All Tasks</h1>
    <div className='tasks-list-users'>
      {tasks.map((task) => (
        <div key={task.taskId}>
          <h2>Task Name: {task.name}</h2>
          <p>Description: {task.description}</p>
          <p>Status: {task.status}</p>
          <p>User ID: {task.userId}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

const SetInfo = () => {
  const [userId, setUserId] = useState('');
  const [job, setJob] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      window.location.reload();
      const response = await axios.put(`${SERVER_URL}/job/${userId}`, { job });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className='info-form' onSubmit={handleSubmit}>
      <label>
        User ID:
        <input className='info-input' type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <label>
        Job:
        <input className='info-input' type="text" value={job} onChange={(e) => setJob(e.target.value)} />
      </label>
      <button className='info-submit' type="submit">Set Job</button>
    </form>
  );
};



const Payslip = () => {
  const [userId, setUserId] = useState('');
  const [month, setMonth] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');

  useEffect(() => {
    const date = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonth = String(monthNames[date.getMonth()]);
    setMonth(currentMonth);
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await axios.post(`${SERVER_URL}/workday/${userId}`, { month, dailyWage, overtimeHours });
      alert('Payslip created successfully');
    } catch (error) {
      alert('Failed to create payslip');
    }
  };

  const handleUpdate = async (event) => {
    try {
      await axios.put(`${SERVER_URL}/workday/${userId}`, { month, dailyWage, overtimeHours });
      alert('Payslip updated successfully');
    } catch (error) {
      alert('Failed to update payslip');
    }
  }

  return (
      <form className='payslip-form' onSubmit={handleSubmit} >
          <label>
              User ID:
              <input className='payslip-input' type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </label>
          <label>
              Month:
              <input className='payslip-input' type="text" value={month} onChange={(e) => setMonth(e.target.value)} required />
          </label>
          <label>
              Daily Wage:
              <input className='payslip-input' type="number" value={dailyWage} onChange={(e) => setDailyWage(e.target.value)} required />
          </label>
          <label>
              Overtime Hours:
              <input className='payslip-input' type='number' value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} required />
          </label>
          <input className='payslip-button' onSubmit={handleSubmit} type="submit" value="Create Payslip" />
          <input className='payslip-button' onClick={handleUpdate} type="submit" value="Update Payslip" />
      </form>
  );
};

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
            case 'payslip':
                return <Payslip/>;
            case 'setInfo':
                return <SetInfo/>;
            case 'userList':
                return <UserList/>;
            case 'createTask':
                return <CreateTask/>;
            case 'userTaskList':
                return <UserTaskList/>;
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
              <li onClick={() => switchFunc('payslip')}>Payslip</li>
              <li onClick={() => switchFunc('setInfo')}>Set User Info</li>
              <li onClick={() => switchFunc('userList')}>User List</li>
              <li onClick={() => switchFunc('createTask')}>Create Task</li>
              <li onClick={() => switchFunc('userTaskList')}>User Task List</li>
            </ul>
          </div>
        </div>
      )
}


export default AdminProfilePage