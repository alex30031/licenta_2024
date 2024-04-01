import express from 'express';
import {router as usersRouter} from './users.js';

export const router = express.Router();
router.use('/', usersRouter);