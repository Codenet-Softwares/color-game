import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class Runner extends Model { }

Runner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marketId: {
      type: DataTypes.CHAR(150),
      allowNull: false,
      references: {
        model: 'market',
        key: 'marketId',
      },
    },
    runnerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
    },
    runnerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isWin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    bal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    back: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },
    lay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },
    hideRunner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hideRunnerUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBidding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isRunnerCreate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    clientMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  },
  {
    sequelize,
    modelName: 'Runner',
    tableName: 'runner',
    timestamps: true,
    updatedAt: false,
    paranoid: true, 
    deletedAt: 'deletedAt',
  },
);

export default Runner;
