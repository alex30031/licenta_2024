import express from 'express';
import {router as usersRouter} from './users.js';
import {restdayRouter} from './restday.js';
import {productivityRouter} from './productivity.js';

export const router = express.Router();
router.use('/', usersRouter);
router.use('/', restdayRouter);
router.use('/', productivityRouter);