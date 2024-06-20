import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';

export const Task = database.define('tasks', {
    taskId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('new', 'in completion', 'finished'),
        allowNull: false,
        defaultValue: 'new'
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