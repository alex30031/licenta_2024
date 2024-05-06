import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';

export const Workday = database.define('workdays', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false
    },
    workDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dailyWage: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'logins',
            key: 'userId'
        }
    }
});


const queryInterface = database.getQueryInterface();

await syncDatabase();