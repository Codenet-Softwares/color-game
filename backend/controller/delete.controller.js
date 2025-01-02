import { v4 as uuidv4 } from "uuid";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import CurrentOrder from "../models/currentOrder.model.js"
import MarketTrash from "../models/trash.model.js"
import sequelize from "../db.js";
import userSchema from "../models/user.model.js";
import BetHistory from "../models/betHistory.model.js";
import { Op, Sequelize } from 'sequelize';
import axios from "axios";

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

        const dataToSend = {
            amount: user.balance,
            userId: userId,
            exposure: updatedExposure
        };

        const baseURL = process.env.WHITE_LABEL_URL;
        await axios.post(
            `${baseURL}/api/admin/extrnal/balance-update`,
            dataToSend
        );

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

            const dataToSend = {
                amount: user.balance,
                userId: userId,
                exposure: Math.abs(totalRunnerBalance)
            };
            const baseURL = process.env.WHITE_LABEL_URL;
            await axios.post(
                `${baseURL}/api/admin/extrnal/balance-update`,
                dataToSend
            );

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


export const getMarket = async (req, res) => {
  try {
    let { page = 1, pageSize = 10 } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const existingMarket = await MarketTrash.findAll({
      attributes: ["trashMarkets"],
    });

    const allMarkets = [];
    existingMarket.forEach((record) => {
      const markets = record.trashMarkets;
      if (Array.isArray(markets)) {
        allMarkets.push(...markets);
      }
    });

    const uniqueMarkets = [
      ...new Map(
        allMarkets.map((m) => [
          m.marketId,
          { marketId: m.marketId, marketName: m.marketName },
        ])
      ).values(),
    ];

    const offset = (page - 1) * pageSize;

    const getAllMarkets = uniqueMarkets.slice(offset, offset + pageSize);

    const totalItems = uniqueMarkets.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationData = {
      page,
      pageSize,
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          getAllMarkets,
          true,
          statusCode.success,
          "Markets fetch successfully",
          paginationData
        )
      );
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          statusCode.internalServerError,
          error.message
        )
      );
  }
};

//Done 

export const getMarketDetails = async (req, res) => {
  try {

    let { page = 1, pageSize = 10 } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const { marketId } = req.params;
    const marketData = await MarketTrash.findAll({
      attributes: ["trashMarkets"],
      where: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("trashMarkets"),
          JSON.stringify([{ marketId }])
        ),
        true
      ),
    });

    const getData = marketData
      .map((item) => {
        const trashMarkets = item.trashMarkets;

        const parsedMarkets = Array.isArray(trashMarkets)
          ? trashMarkets
          : JSON.parse(trashMarkets);

        return parsedMarkets
          .filter((data) => data.marketId === marketId)
          .map((data) => ({
            marketName: data.marketName,
            marketId: data.marketId,
            runnerName: data.runnerName,
            runnerId: data.runnerId,
            userId: data.userId,
            rate: data.rate,
            type: data.type,
            bidAmount: data.bidAmount,
            value: data.value,
          }));
      })
      .flat();

    const offset = (page - 1) * pageSize;
    const getallmarkets = getData.slice(offset, offset + pageSize);
    const totalItems = getData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationData = {
      page,
      pageSize,
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          getallmarkets,
          true,
          statusCode.success,
          "Market details fetched successfully",
          paginationData
        )
      );
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          statusCode.internalServerError,
          error.message
        )
      );
  }
};
