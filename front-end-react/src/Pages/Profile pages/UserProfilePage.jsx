import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './ProfilePage.css'
import { useState, useEffect } from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import * as $ from 'jquery';
import { useForm } from 'react-hook-form';
import { jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';


const SERVER_URL = 'http://localhost:3000';

const ProfileInfo = ({ decodedToken}) => { 
  console.log(decodedToken)
    return(
        <ul className="profile-form">
            <h1>Profile info</h1>
            <li>Username: {decodedToken && decodedToken.username}</li>
            <li>Email: {decodedToken && decodedToken.email}</li>
            <li>Account Type: {decodedToken && decodedToken.accountType}</li>
            <li>Job: {decodedToken && decodedToken.jobName}</li>
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

  const Payslip = ({ decodedToken }) => {
    const [workday, setWorkday] = useState(null);
  
    useEffect(() => {
      const fetchWorkday = async () => {
        const date = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = String(monthNames[date.getMonth()]);
        
        try {
          const response = await axios.get(`${SERVER_URL}/workday/${decodedToken.userId}`, { params: { month } });
          setWorkday(response.data);
        } catch (error) {
          console.error('Error fetching workday:', error);
        }
      };
  
      if (decodedToken.userId) {
        fetchWorkday();
      }
    }, [decodedToken.userId]);
  
    const exportPDF = () => {
      const input = document.getElementById('payslip-container');
      const inputWidth = input.offsetWidth;
      const inputHeight = input.offsetHeight;
  
      // Increase the scale for better resolution
      html2canvas(input, { scale: 2 })
          .then((canvas) => {
              const imgWidth = 210; // A4 width in mm
              const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate the height to maintain aspect ratio
              const imgData = canvas.toDataURL('image/png');
  
              // Initialize jsPDF in portrait or landscape mode based on content size
              const pdf = new jsPDF(inputWidth > inputHeight ? 'l' : 'p', 'mm', 'a4');
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
  
              // Calculate positions to center the image
              const x = (pdfWidth - imgWidth) / 2;
              const y = (pdfHeight - imgHeight) / 2;
  
              pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
              pdf.save("payslip.pdf");
          });
  }
  
    if (!workday) {
      return <p className='loading-message'>Loading...</p>;
    }
    const overtimeWagePerHour = workday.dailyWage * 2 / 8;
    const grossSalary = workday.workDays * workday.dailyWage + overtimeWagePerHour * workday.overtimeHours;
    const cas = grossSalary * 25 / 100;
    const cass = grossSalary * 10 / 100;
    const netIncome = grossSalary - cas - cass;
    const incomeTax = netIncome * 10 / 100;
    const netSalary = netIncome - incomeTax;
    const foodStamps = 30 * workday.workDays;
  
    return (
      <div><h1 className='payslip-title'>Payslip</h1>
      <div className="payslip-container" id="payslip-container"> 
        <div className='payslip-get'>
          <p>User: {decodedToken.username}</p>
          <p>----------------------------</p>
          <p>Month: {workday.month}</p>
          <p>Worked Days: {workday.workDays}</p>
          <p>Overtime hours: {workday.overtimeHours}</p>
          <p>Overtime wage per hour: {overtimeWagePerHour}</p>
          <p>Daily Wage: {workday.dailyWage}</p>
          <p>----------------------------</p>
          <p>Gross Salary: {grossSalary}</p>
          <p>CAS 25% : {cas}</p>
          <p>CASS 10% : {cass}</p>
          <p>----------------------------</p>
          <p>Net Income : {netIncome}</p>
          <p>Income Tax : {incomeTax}</p>
          <p>----------------------------</p>
          <p>Net Salary: {netSalary}</p>
          <p>Food stamps : {foodStamps}</p>
        </div>
        
      </div>
      <button className="button-pdf"onClick={exportPDF}>Export as PDF</button>
      </div>
    );
  };


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
                return <ProductivityGraph decodedToken={decodedToken}/>;
            case 'restdayRequests':
                return <ListRestdaysRequested decodedToken={decodedToken}/>;
            case 'payslip':
                return <Payslip decodedToken={decodedToken}/>;
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
              <li onClick={() => switchFunc('payslip')}>Payslip</li>
            </ul>
          </div>
        </div>
      )
}


export default UserProfilePage