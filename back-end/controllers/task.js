import { Task } from "../models/task.js";

const createTask = async (req, res) => {
    const { userId, name, description } = req.body;
    try {
        const task = await Task.create({
            userId,
            name,
            description
        });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    try {
        await Task.update({
            status: status
        }, {
            where: {
                taskId: taskId
            }
        });
        const updatedTask = await Task.findOne({
            where: {
                taskId: taskId
            }
        });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTasksByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const tasks = await Task.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        await Task.destroy({
            where: {
                taskId: taskId
            }
        });
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createTask, updateTask, getTasks, getTasksByUserId, deleteTask }
