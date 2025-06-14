import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const PreviousState = sequelize.define('PreviousState', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  runnerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  runnerBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isReverted: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false,     
  },
  createdAt: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
  },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPermanentDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isLiveDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
      isLivePermanentDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
}, {
  tableName: 'PreviousState',
  timestamps: false,
});
