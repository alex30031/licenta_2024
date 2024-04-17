import express from 'express';
import * as restdayController from '../controllers/restday.js';

export const restdayRouter = express.Router();

restdayRouter.post('/restday', restdayController.createRestdayRequest);
restdayRouter.get('/restday', restdayController.getRestdayRequests);
restdayRouter.delete('/restday/:id', restdayController.deleteRestdayRequest);
restdayRouter.get('/restday/:id', restdayController.getRestdayRequestsByUserId);
restdayRouter.put('/restday/:id', restdayController.handleRestdayRequest);