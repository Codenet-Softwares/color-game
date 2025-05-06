import { DataTypes } from "sequelize";
import { write_db } from "../../config/database.js";

const AllRunnerBalance = write_db.define('AllRunnerBalances', {
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
        type: DataTypes.NUMBER,
        allowNull: false,
    }
},
    {
        timestamps: true,
    }
)

export default AllRunnerBalance