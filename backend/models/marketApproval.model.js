import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class MarketDeleteApproval extends Model { }

MarketDeleteApproval.init(
    {
        approvalMarketId: {
            type: DataTypes.CHAR(150),
            allowNull: false,
        },
        approvalMarkets : {
            type: DataTypes.JSON,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'MarketDeleteApproval',
        tableName: 'MarketDeleteApproval',
        timestamps: true,
      },
);

export default MarketDeleteApproval;
