import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';
import Game from './game.model.js';
import Market from './market.model.js';
import Runner from './runner.model.js';

class ResultRequest extends Model { }

ResultRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    marketId: {
      type: DataTypes.CHAR(150),
      allowNull: false,
    },
    marketName : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    runnerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    runnerName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    isWin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    declaredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    declaredById: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ResultRequest',
    timestamps: true,
    updatedAt: false,
    paranoid: true,
    deletedAt: 'deletedAt',
  }
);

ResultRequest.belongsTo(Game, { foreignKey: 'gameId', targetKey: 'gameId' });
ResultRequest.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId' });
ResultRequest.belongsTo(Runner, { foreignKey: 'runnerId', targetKey: 'runnerId' });


export default ResultRequest;