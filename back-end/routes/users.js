import express from 'express';
import * as userController from '../controllers/users.js';

export const router = express.Router();

router.post('/login', userController.login);
router.get('/login', userController.login);
router.post('/signup', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/id::userId', userController.getUserById);





