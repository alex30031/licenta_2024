import express from 'express';
import * as userController from '../controllers/users.js';



export const router = express.Router();


router.post('/login', userController.login);
router.post('/signup', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);





