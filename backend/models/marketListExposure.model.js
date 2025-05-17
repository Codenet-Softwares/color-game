import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const MarketListExposure = sequelize.define('MarketListExposuers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MarketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    exposure: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
},
    {
        timestamps: true,
    }
)

export default MarketListExposure