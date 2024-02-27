import React, { useState, useEffect } from "react";
import axios from "axios";

const Homepage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const userId = 0; // Replace "your_user_id" with the actual user ID

    useEffect(() => {
        axios.get('http://localhost:3000/users/1') // Replace '1' with the actual user ID
            .then(response => {
                setCurrentUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user information:", error);
            });
    }, []);
    

    return (
        <div className="div">
            <h1>Welcome to our website!</h1>
            {currentUser ? (
                <p>Welcome, {currentUser.username || 'Guest'}!</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Homepage;
