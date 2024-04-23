import { Productivity } from '../models/productivity.js';

const daysInThisMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

const resetProductivity = async (req, res) => {
  const userId = req.params.userId;
  const newData = req.body.data;
  try {
    await Productivity.update({ data: newData }, { where: { userId: userId } });
    res.json({ message: 'Productivity data reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error resetting productivity data' });
  }
}

const getProductivity = async (req, res) => {
  const userId = req.params.userId;
  try {
    let productivity = await Productivity.findOne({ where: { userId: userId } });
    if (!productivity) {
      productivity = await Productivity.create({ userId, data: Array(daysInThisMonth()).fill(0) });
    }
    res.json(productivity.data);
  } catch (error) {
    console.error('Error fetching productivity data:', error.message);
    res.status(500).json({ error: 'Error fetching productivity data' });
  }
};

const updateProductivity = async (req, res) => {
  const userId = req.params.userId;
  const { data } = req.body;
  try {
    const productivity = await Productivity.findOne({ where: { userId: userId } });
    if (productivity) {
      productivity.data = data;
      await productivity.save();
      res.json(productivity);
    } else {
      res.status(404).json({ error: 'Productivity data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating productivity data' });
  }
};

export {
  getProductivity,
  updateProductivity,
  resetProductivity,
};