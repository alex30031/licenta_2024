const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
    try {
        const user = await login.findOne({ where: { email } });
        return user;
      } catch (error) {
        console.error(error);
        return null;
      }
};

const comparePasswords = async (password) => {
  try {
    const match = await bcrypt.compare(password, user.password);
    return match;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const authMiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Autentificare eșuată: utilizatorul nu există.' });
    }

    const passwordMatches = await comparePasswords(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Autentificare eșuată: parola este incorectă.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la autentificare.' });
  }
};


module.exports = authMiddleware;