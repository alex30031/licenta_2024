import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';

export const Event = database.define('events', {
    eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    ,userId: {
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