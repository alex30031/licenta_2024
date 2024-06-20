import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';
import { RestDayForm } from './restday.js';
import { Productivity } from './productivity.js';
import { Workday } from './workday.js';
import { Task } from './task.js';
import { Event } from './event.js';

export const User = database.define('logins', {
    userId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    accountType: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false
    },
    jobName:{
        type: DataTypes.STRING,
        allowNull: true
    }
    
},
    {
        indexes: [
            {
                unique: true,
                fields: ['username', 'email'],
            }
        ]
    });

User.hasMany(RestDayForm, {foreignKey: 'loginUserId', foreignKeyConstraint: true});
RestDayForm.belongsTo(User);

User.hasOne(Productivity, {foreignKey: 'userId', foreignKeyConstraint: true});
Productivity.belongsTo(User, {foreignKey: 'userId', foreignKeyConstraint: true});

User.hasMany(Workday, {foreignKey: 'userId', foreignKeyConstraint: true});
Workday.belongsTo(User, {foreignKey: 'userId', foreignKeyConstraint: true});

User.hasMany(Task, {foreignKey: 'userId', foreignKeyConstraint: true});
Task.belongsTo(User, {foreignKey: 'userId', foreignKeyConstraint: true});

User.hasOne(Event, {foreignKey: 'userId', foreignKeyConstraint: true});
Event.belongsTo(User, {foreignKey: 'userId', foreignKeyConstraint: true});

const queryInterface = database.getQueryInterface();
await syncDatabase();
