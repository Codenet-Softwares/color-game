import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const WinningAmount = sequelize.define(
    'winningAmount',
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('win', 'loss'),
            allowNull: false,
          },
        marketId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        runnerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isVoidAfterWin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        
    },
    {
        timestamps: false,
    },
);

export default WinningAmount;
