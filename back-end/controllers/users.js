import { Op } from "sequelize";
import { User } from "../models/users.js";


const getUserByEmail = async (req,res) => {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: `Nu am găsit niciun utilizator cu adresa de email ${email}.` });
    }
}

const login = async (req, res) => {
  console.log("am ajuns aici")
  const { email, password } = req.body;

  try {
  
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) {
      res.status(200).json({ message: 'Autentificare reușită!' });
    } else {
      res.status(401).json({ message: 'Adresa de email sau parola incorectă.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la autentificare.' });
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
const createUser = async (req, res) => {
    const { name, email, password, accountType } = req.body;
  
    try {
      const newUser = await User.create({
        username: name,
        email,
        password,
        accountType
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la înregistrare.' });
    }
  };


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



export{
    login,
    getUsers,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}


