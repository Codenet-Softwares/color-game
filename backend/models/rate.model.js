import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
import Runner from './runner.model.js';

class rateSchema extends Model {}

rateSchema.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    runnerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    back: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    lay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
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
    modelName: 'rateSchema',
    tableName: 'rate',
    timestamps: false,
    sequelize,
    modelName: 'rateSchema',
    tableName: 'rate',
    timestamps: false,
    indexes: [
      {
        name: 'rate_runnerId_idx',
        fields: ['runnerId'],
      },
    ],
  },
);

rateSchema.belongsTo(Runner, { foreignKey: 'runnerId', targetKey: 'runnerId' });

export default rateSchema;
