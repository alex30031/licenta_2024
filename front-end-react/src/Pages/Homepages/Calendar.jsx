import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './Calendar.css';

const Calendar = ({decodedToken}) => {
    const date = new Date();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [notes, setNotes] = useState({});
    const userId = decodedToken.userId;
    const SERVER_URL = 'http://localhost:3000'; 

    useEffect(() => {
        axios.get(`${SERVER_URL}/event/${userId}`)
            .then(response => {
                const fetchedNotes = response.data.reduce((acc, event) => {
                    acc[event.year] = acc[event.year] || {};
                    acc[event.year][event.month] = acc[event.year][event.month] || {};
                    acc[event.year][event.month][event.day] = event.note;
                    return acc;
                }, {});
                setNotes(fetchedNotes);
            })
            .catch(error => console.error(error));
    }, []);
    const handleNoteChange = (day, note) => {
        axios.post(`${SERVER_URL}/event`, { userId, year: currentYear, month: currentMonth, day, note })
            .then(response => {
                setNotes(prevNotes => ({
                    ...prevNotes,
                    [currentYear]: {
                        ...prevNotes[currentYear],
                        [currentMonth]: {
                            ...prevNotes[currentYear]?.[currentMonth],
                            [day]: note
                        }
                    }
                }));
            })
            .catch(error => console.error(error));
    };
    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth > 0 ? prevMonth - 1 : 11));
        setCurrentYear(prevYear => (currentMonth === 0 ? prevYear - 1 : prevYear));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth < 11 ? prevMonth + 1 : 0));
        setCurrentYear(prevYear => (currentMonth === 11 ? prevYear + 1 : prevYear));
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleModalClose = () => {
        setSelectedDay(null);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    return (
        <div className='calendar-container'>
            <div className='calendar-header'>
                <button className="calendar-prev" onClick={handlePrevMonth}>Previous month</button>
                <h1 className='calendar-title'>{monthNames[currentMonth]} - {currentYear}</h1>
                <button className="calendar-next" onClick={handleNextMonth}>Next month</button>
            </div>
            <div className='calendar-grid'>
            {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => {
                const date = new Date(currentYear, currentMonth, day);
                const dayOfWeek = dayNames[date.getDay()];

                return (
                <div key={day} className={`calendar-day ${today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear ? 'current-day' : ''}`} onClick={() => handleDayClick(day)}>
                    <h3 style={{ position: 'relative' }}>{day} ({dayOfWeek})
                    {notes[currentYear]?.[currentMonth]?.[day] && <div className='note-indicator'></div>}
                    </h3>
                </div>
                );
            })}
            </div>
            {selectedDay && (
                <div className='modal'>
                    <h2>Day {selectedDay}</h2>
                    <textarea
                        value={notes[currentYear]?.[currentMonth]?.[selectedDay] || ''}
                        onChange={e => handleNoteChange(selectedDay, e.target.value)}
                    />
                    <button onClick={handleModalClose}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Calendar;