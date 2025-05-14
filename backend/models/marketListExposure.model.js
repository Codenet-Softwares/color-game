import { DataTypes } from "sequelize";
import { write_db } from "../../config/database.js";

const MarketListExposuer = write_db.define('MarketListExposuers', {
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
    exposuer: {
        type: DataTypes.NUMBER,
        allowNull: false,
    }
},
    {
        timestamps: true,
    }
)

export default MarketListExposuer