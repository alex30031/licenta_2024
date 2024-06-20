import { Event } from "../models/event.js";

const getEvents = async (req, res) => {
    const userId = req.params.userId;
    const events = await Event.findAll({ where: { userId } });
    res.status(200).json(events);
};

const createEvent = async (req, res) => {
    const { userId, year, month, day, note } = req.body;
    const event = await Event.create({ userId, year, month, day, note });
    res.status(200).json(event);
};

const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { note } = req.body;
    const event = await Event.update({ note }, { where: { eventId } });
    res.status(200).json(event);
};
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    await Event.destroy({ where: { eventId } });
    res.status(200).json({ message: 'Event deleted successfully.' });
};

export { getEvents, createEvent, updateEvent, deleteEvent };