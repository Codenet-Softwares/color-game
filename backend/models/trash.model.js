import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class MarketTrash extends Model { }

MarketTrash.init(
    {
        trashMarketId: {
            type: DataTypes.CHAR(150),
            allowNull: false,
        },
        trashMarkets : {
            type: DataTypes.JSON,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'MarketTrash',
        tableName: 'MarketTrash',
        timestamps: true,
      },
);

export default MarketTrash;
