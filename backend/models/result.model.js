import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

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
      runnerId: {
        type: DataTypes.CHAR(36),
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
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM('Matched', 'unMatched'),
        allowNull: false,
        defaultValue: 'unMatched', 
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
  


export default ResultRequest;