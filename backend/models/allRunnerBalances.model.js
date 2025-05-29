import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const AllRunnerBalance =  sequelize.define('AllRunnerBalances', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    RunnerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MarketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
},
    {
        timestamps: true,
    }
)

export default AllRunnerBalance