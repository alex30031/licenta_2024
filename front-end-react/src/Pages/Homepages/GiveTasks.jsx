import React, { useState } from 'react';

const GiveTasks = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Logic to handle the submission of the form
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Select User:
                <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </label>
            <label>
                Task Name:
                <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} />
            </label>
            <label>
                Task Description:
                <input type="text" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default GiveTasks;