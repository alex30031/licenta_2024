import { Op } from "sequelize";
import { RestDayForm } from "../models/restday.js";

const createRestdayRequest = async (req, res) => {
    const { text, date, endDate, loginUserId } = req.body;
    try {
        const restday = await RestDayForm.create({
            text,
            date,
            endDate,
            loginUserId
        });
        res.status(200).json(restday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleRestdayRequest = async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;
    try {
        await RestDayForm.update({
            status: status
        }, {
            where: {
                id: requestId
            }
        });
        const updatedRestday = await RestDayForm.findOne({
            where: {
                id: requestId
            }
        });
        res.status(200).json(updatedRestday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRestdayRequests = async (req, res) => {
    try {
        const restday = await RestDayForm.findAll();
        res.status(200).json(restday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRestdayRequestsByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const restday = await RestDayForm.findAll({
            where: {
                loginUserId: userId
            }
        });
        res.status(200).json(restday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRestdayRequest = async (req, res) => {
    const requestId = req.params.id;
    try {
        const restday = await RestDayForm.destroy({
            where: {
                id: requestId
            }
        });
        res.status(200).json(restday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export{
    createRestdayRequest,
    getRestdayRequests,
    deleteRestdayRequest,
    getRestdayRequestsByUserId,
    handleRestdayRequest

}