import React, { useEffect, useState } from 'react';
import './Chat.css';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000';


const Chat = ({ showChat, decodedToken, ws }) => {
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/users`);
        const users = response.data.records;
        setUsers(users);

        const initialUserMessages = users.reduce((acc, user) => {
          acc[user.username] = [];
          return acc;
        }, {});
        setUserMessages(initialUserMessages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setUserMessages((prevUserMessages) => {
          if (!prevUserMessages[message.recipient]) {
            prevUserMessages[message.recipient] = [];
          }
          return {
            ...prevUserMessages,
            [message.sender]: [...(prevUserMessages[message.sender] || []), message],
            [message.recipient]: [...prevUserMessages[message.recipient], message],
          };
        });
      };

      ws.onopen = () => {
        console.log('WebSocket connection established.');
        const initMessage = {
          type: 'init',
          sender: decodedToken.username,
        };
        ws.send(JSON.stringify(initMessage));
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }, [ws, decodedToken.username]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        sender: decodedToken.username,
        recipient: selectedUser.username,
        text: newMessage,
      };
      ws.send(JSON.stringify(message));
      setUserMessages((prevUserMessages) => ({
        ...prevUserMessages,
        [message.sender]: [...prevUserMessages[message.sender], message],
        [message.recipient]: [...(prevUserMessages[message.recipient] || []), message],
      }));
    }
    setNewMessage('');
  };

  if (!showChat) {
    return null;
  }

  const messages = userMessages[selectedUser?.username] || [];

  return (
    <div className={`chat-container ${showChat ? 'visible' : ''}`}>
      <div className="user-list">
        <h2>Lista de utilizatori</h2>
        <ul className="list">
          {users.map((user) => (
            <li className="list-items" key={user.userId} onClick={() => setSelectedUser(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        <h2>{selectedUser ? selectedUser.username : 'Select a user'}</h2>
        <div className="messages">
  {messages.map((message, index) => {
    const previousMessage = messages[index - 1];
    const showSender = index === 0 || message.sender !== previousMessage.sender;

    return (
      <div key={index}>
        {showSender && (
          <p className={message.sender === decodedToken.username ? 'right' : 'left'}>
            <strong>{message.sender === decodedToken.username ? 'You' : message.sender}</strong>
          </p>
        )}
        <p className={message.sender === decodedToken.username ? 'right' : 'left'}>
          {message.text}
        </p>
      </div>
    );
  })}
</div>
        <form onSubmit={handleSendMessage}>
          <input type="text" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} />
          <button type="submit">Trimite</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
