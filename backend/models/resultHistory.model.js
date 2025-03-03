import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

class ResultHistory extends Model { }

ResultHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gameId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gameName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marketId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marketName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      runnerId: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [],
      },
      runnerNames: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [], 
      },  
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM('Matched', 'Unmatched'),
        allowNull: false,
      },
      declaredByNames: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [], 
      },
      
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
},
 {
    sequelize,
    modelName: 'ResultHistory',
    timestamps: true,
    updatedAt: false,
    paranoid: true
  }
)


export default ResultHistory;