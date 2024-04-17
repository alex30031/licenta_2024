import express from 'express';
import {router as usersRouter} from './users.js';
import {restdayRouter} from './restday.js';

export const router = express.Router();
router.use('/', usersRouter);
router.use('/', restdayRouter);