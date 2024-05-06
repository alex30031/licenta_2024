import express from 'express';
import * as workdayController from '../controllers/workday.js';

export const workdayRouter = express.Router();

workdayRouter.post('/workday/:userId', workdayController.createWorkdayForUser);
workdayRouter.get('/workday/:userId', workdayController.getWorkdayForUser);