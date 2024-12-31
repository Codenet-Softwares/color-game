import { v4 as uuidv4 } from "uuid";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import CurrentOrder from "../models/currentOrder.model.js"
import MarketTrash from "../models/trash.model.js"
import sequelize from "../db.js";
import userSchema from "../models/user.model.js";
import BetHistory from "../models/betHistory.model.js";
import { Op } from 'sequelize';

export const deleteLiveBetMarkets = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { marketId, runnerId, userId, betId } = req.body;

        const getMarket = await CurrentOrder.findOne({ where: { marketId, runnerId, betId } });
        if (!getMarket) {
            return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market or Runner not found"));
        }

        await MarketTrash.create({
            trashMarkets: [getMarket.dataValues],
            trashMarketId: uuidv4(),
        }, { transaction });

        await getMarket.destroy({ transaction });

        const user = await userSchema.findOne({ where: { userId }, transaction });
        if (!user) {
            return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "User not found"));
        }

        const marketListExposure = user.marketListExposure || [];
        const updatedExposure = marketListExposure.filter(market => {
            const [key, value] = Object.entries(market)[0];
            if (key === marketId) {
                user.balance += value;
                return false;
            }
            return true;
        });

        await user.update({
            marketListExposure: updatedExposure,
            balance: user.balance,
        }, { transaction });

        const remainingMarket = await CurrentOrder.findAll({
            where: {
                marketId,
                [Op.or]: [
                    { runnerId: runnerId },
                    { betId: { [Op.ne]: betId } }
                ]
            },
            transaction
        });

        if (remainingMarket.length > 0) {
            let totalRunnerBalance = 0;
            remainingMarket.map((market) => {
                const runnerKey = market.runnerId;
                let runnerBalance = 0;

                if (market.type === "back") {
                    if (String(runnerKey) === String(getMarket.runnerId)) {
                        runnerBalance += Number(market.bidAmount);
                    } else {
                        runnerBalance -= Number(market.value);
                    }
                } else if (market.type === "lay") {
                    if (String(runnerKey) === String(getMarket.runnerId)) {
                        runnerBalance -= Number(market.bidAmount);
                    } else {
                        runnerBalance += Number(market.value);
                    }
                }

                totalRunnerBalance += runnerBalance;
                user.balance += runnerBalance;
            });

            const updatedExposure = { [marketId]: Math.abs(totalRunnerBalance) };

            user.marketListExposure = [updatedExposure];

            await user.update({
                marketListExposure: user.marketListExposure,
                balance: user.balance,
            }, { transaction });
        }

        await transaction.commit();

        return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting live bet markets:", error);
        return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
    }
};

// export const deleteBetMarkets = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { marketId, userId } = req.body;

//         const getMarket = await BetHistory.findOne({ where: { marketId } });
//         if (!getMarket) {
//             return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market not found"))
//         }

//         await MarketTrash.create({
//             trashMarkets: [getMarket.dataValues],
//             trashMarketId: uuidv4(),
//         }, { transaction });

//         await getMarket.destroy({ transaction });


//         await transaction.commit();
//         return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));

//     } catch (error) {
//         res
//             .status(statusCode.internalServerError)
//             .send(
//                 apiResponseErr(
//                     null,
//                     false,
//                     statusCode.internalServerError,
//                     error.message,
//                 )
//             );
//     }
// };