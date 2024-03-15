import { Op } from "sequelize";
import { User } from "../models/users.js";

const login = async (req, res) => {
  console.log("am ajuns aici");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) {
      res.status(200).json({ message: 'Autentificare reușită!', user}); // Send user ID in the response
    } else {
      res.status(401).json({ message: 'Adresa de email sau parola incorectă.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la autentificare.' });
  }
};
const createUser = async (req, res) => {
  const { username, email, password, accountType } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
      accountType
    });
    res.status(200).json({user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la înregistrare.' });
  }
};

const getUsers = async (req, res) => {
    const usernameQuery = req.query.username;
    const where = usernameQuery ? { username: { [Op.like]: `%${usernameQuery}%` } } : {};
    const usersList = await User.findAll({ where: where });
    res.status(200).send({records: usersList});
}

const getUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({ where: { userId: userId } }); 
  if (user) {
      res.status(200).send(user);
  } else {
      res.status(404).send({ message: `Nu am găsit niciun utilizator cu id-ul ${userId}.` });
  }
}




  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const user = req.body;
    try {
        const updatedUser = await User.update(user, { where: { userId: userId } });
        if (updatedUser) {
            res.status(200).send({ message: `Utilizatorul cu id-ul ${userId} a fost actualizat.` });
        } else {
            res.status(404).send({ message: `Nu am găsit niciun utilizator cu id-ul ${userId}.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A apărut o eroare la actualizarea utilizatorului.' });
    }
}


const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const deletedUser = await users.destroy({ where: { userId: userId } });
    if (deletedUser) {
        res.status(200).send({ message: `Utilizatorul cu id-ul ${userId} a fost șters.` });
    } else {
        res.status(404).send({ message: `Nu am găsit niciun utilizator cu id-ul ${userId}.` });
    }
  }

  const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'A apărut o eroare la delogare.' });
    } else {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Delogare reușită!' });
    }
  });
  res.status(200).json({ message: 'Logout successful' });
  }


export{
    login,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    logout
}


