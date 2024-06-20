import express from 'express';
import * as eventController from '../controllers/event.js';

export const eventRouter = express.Router();

eventRouter.get('/event/:userId', eventController.getEvents);
eventRouter.post('/event', eventController.createEvent);
eventRouter.put('/event/:eventId', eventController.updateEvent);
eventRouter.delete('/event/:eventId', eventController.deleteEvent);