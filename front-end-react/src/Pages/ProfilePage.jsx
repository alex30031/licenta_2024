import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import './ProfilePage.css'
import { useState } from 'react'

const ProfileInfo = ({ decodedToken }) => { 
    return(
        <ul className="profile-form">
            <h1>Profile info</h1>
            <li>Username: {decodedToken.username}</li>
            <li>Email: {decodedToken.email}</li>
            <li>Account Type: {decodedToken.accountType}</li>
        </ul>
    )
}

const RestDayForm = () => {
    return(
        <div>
           
            <form className="restday-form">
                <h1>Rest day form</h1>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" name="date" required></input>
                <label htmlFor="reason">Reason</label>
                <textarea id="reason" name="reason" required></textarea>
                <button className="submit-rest" type="submit">Submit</button>
            </form>
      </div>
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

const ProfilePage = ({ decodedToken }) => {
    const [activeFunc, setActiveFunc] = useState('profileInfo');

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
                </ul>
            </div>
        </div>
    )
}


export default ProfilePage