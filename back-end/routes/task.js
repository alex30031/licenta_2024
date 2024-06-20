import express from 'express';
import * as taskController from '../controllers/task.js';

export const taskRouter = express.Router();

taskRouter.post('/task', taskController.createTask);
taskRouter.get('/tasks', taskController.getTasks);
taskRouter.put('/task/:id', taskController.updateTask);
taskRouter.get('/task/user/:id', taskController.getTasksByUserId);
taskRouter.delete('/task/:id', taskController.deleteTask);


