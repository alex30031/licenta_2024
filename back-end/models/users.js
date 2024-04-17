// users.js
import {database, syncDatabase} from './config.js';
import { DataTypes } from 'sequelize';
import { RestDayForm } from './restday.js';

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

await syncDatabase();
