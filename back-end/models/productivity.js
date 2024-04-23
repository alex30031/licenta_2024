import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';

export const Productivity = database.define('productivity', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'logins', 
        key: 'userId'
      }
    },
  data:{
      type: DataTypes.JSON,
      allowNull: false
      }
  });

const queryInterface = database.getQueryInterface();

await syncDatabase();