import { Workday } from "../models/workday.js";

const getWorkdaysInMonth = (month, year) => {
  let count = 0;
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    date.setDate(date.getDate() + 1);
  }
  return count;
};

const createWorkdayForUser = async (req, res) => {
  const userId = req.params.userId;
  const { month, dailyWage } = req.body;
  try {
    const date = new Date();
    const year = date.getFullYear();
    const monthIndex = date.toLocaleString('default', { month: 'long' }).toLowerCase() === month.toLowerCase() ? date.getMonth() : new Date(Date.parse(month +" 1, 2012")).getMonth();
    const workDays = getWorkdaysInMonth(monthIndex, year);
    const workday = await Workday.create({
      userId,
      month,
      workDays,
      dailyWage
    });
    res.json(workday);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating workday for user' });
  }
};

const getWorkdayForUser = async (req, res) => {
  const userId = req.params.userId;
  const { month } = req.query;
  try {
    const workday = await Workday.findOne({
      where: {
        userId,
        month
      }
    });
    if (!workday) {
      res.status(404).json({ error: 'Workday not found' });
    } else {
      res.json(workday);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching workday for user' });
  }
};

export {
  createWorkdayForUser,
  getWorkdayForUser
};