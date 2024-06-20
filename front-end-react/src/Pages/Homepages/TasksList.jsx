import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './TasksList.css';

const TasksList = ({decodedToken}) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = decodedToken.userId;
                const response = await axios.get(`http://localhost:3000/task/user/${userId}`, {
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
                    }
                  });
                setTasks(response.data);
            } catch (error) {
                console.error('Eroare la preluarea task-urilor', error);
            }
        };

        fetchTasks();
    }, [decodedToken]);

    const moveToInProgress = async (event, taskId) => {
        event.stopPropagation();
        try {
            // Actualizați task-ul în backend
            await axios.put(`http://localhost:3000/task/${taskId}`, {
                status: 'in completion'
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
                }
            });
    
            setTasks(tasks.map(task => task.taskId === taskId ? {...task, status: 'in completion'} : task));
        } catch (error) {
            console.error('Eroare la actualizarea task-ului', error);
        }
    };
    
    const moveToCompleted = async (event, taskId) => {
        event.stopPropagation();
        try {
            // Actualizați task-ul în backend
            await axios.put(`http://localhost:3000/task/${taskId}`, {
                status: 'finished'
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
                }
            });
    
            // Actualizați starea locală
            setTasks(tasks.map(task => task.taskId === taskId ? {...task, status: 'finished'} : task));
        } catch (error) {
            console.error('Eroare la finalizarea task-ului', error);
        }
    };
    
    const deleteTask = async (event, taskId) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                // Ștergeți task-ul din backend
                await axios.delete(`http://localhost:3000/task/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('userTokens')}`
                    }
                });
    
                // Actualizați starea locală
                setTasks(tasks.filter(task => task.taskId !== taskId));
            } catch (error) {
                console.error('Eroare la ștergerea task-ului', error);
            }
        }
    };

    const newTasks = tasks.filter(task => task.status === 'new');
    const inCompletionTasks = tasks.filter(task => task.status === 'in completion');
    const finishedTasks = tasks.filter(task => task.status === 'finished');

    return (
        <div className='task-list-container'>
            <div className='new-tasks-container'>
                <h2 className='title-of-task-list1'>New Tasks</h2>
                <ul className='task-list-new'>
                    {newTasks.map((task) => (
                        <li id="new" className='task' key={task.id} onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}>
                            <p className="task-title">{task.name}</p>
                            {selectedTask === task.id && <p className='task-description'>{task.description}</p>}
                            <button className="button-in-progress" onClick={(event) => moveToInProgress(event, task.taskId)}>Start task</button>
                            </li>
                    ))}
                </ul>
            </div>
            <div className='in-progress-tasks-container'>
                <h2 className='title-of-task-list2'>In Completion</h2>
                <ul className='task-list-in-progress'>
                    {inCompletionTasks.map((task) => (
                        <li id="in-completion" className='task' key={task.id} onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}>
                            <p className="task-title">{task.name}</p>
                            {selectedTask === task.id && <p className='task-description'>{task.description}</p>}
                            <button className="button-completed" onClick={(event) => moveToCompleted(event, task.taskId)}>Finish task</button>
                            </li>
                    ))}
                </ul>
            </div>
            <div className='completed-tasks-container'>
                <h2 className='title-of-task-list3'>Finished</h2>
                <ul className='task-list-finished'>
                {finishedTasks.map((task) => (
                    <li id="completed" className='task' key={task.id} onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}>
                        <p className="task-title">{task.name}</p>
                        {selectedTask === task.id && <p className='task-description'>{task.description}</p>}
                        <button className="button-delete" onClick={(event) => deleteTask(event, task.taskId)}>Delete task</button>                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TasksList;