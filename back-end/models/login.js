import {database} from './config.js';
const { DataTypes } = require('sequelize');


export const Login = database.define('User', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
 
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

