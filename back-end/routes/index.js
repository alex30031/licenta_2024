import express from 'express';
import {router as usersRouter} from './users.js';
import {restdayRouter} from './restday.js';
import {productivityRouter} from './productivity.js';
import {workdayRouter} from './workday.js';

export const router = express.Router();
router.use('/', usersRouter);
router.use('/', restdayRouter);
router.use('/', productivityRouter);
router.use('/', workdayRouter);