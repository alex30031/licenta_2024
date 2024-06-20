import express from 'express';
import {router as usersRouter} from './users.js';
import {restdayRouter} from './restday.js';
import {productivityRouter} from './productivity.js';
import {workdayRouter} from './workday.js';
import {taskRouter} from './task.js';
import {eventRouter} from './event.js';

export const router = express.Router();
router.use('/', usersRouter);
router.use('/', restdayRouter);
router.use('/', productivityRouter);
router.use('/', workdayRouter);
router.use('/', taskRouter);
router.use('/', eventRouter);