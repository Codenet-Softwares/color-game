import { v4 as uuidv4 } from "uuid";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import CurrentOrder from "../models/currentOrder.model.js"
import MarketTrash from "../models/trash.model.js"
import sequelize from "../db.js";
import userSchema from "../models/user.model.js";
// import BetHistory from "../models/betHistory.model.js";
import BetHistory from "../models/betHistory.model.js";
import { Op, Sequelize } from 'sequelize';
import axios from "axios";
import ProfitLoss from "../models/profitLoss.js";
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import { log } from "console";
import { currentOrderSchema } from "../schema/commonSchema.js";
import { type } from "os";
// import ProfitLoss from "../models/profitLoss.js";
// import Market from "../models/market.model.js";
// import Runner from "../models/runner.model.js";
// import { PreviousState } from "../models/previousState.model.js";


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

    await getMarket.destroy({ transaction });

    const marketExposure = user.marketListExposure;

    let totalExposure = 0;
    marketExposure.forEach(market => {
      const exposure = Object.values(market)[0];
      totalExposure += exposure;
    });

    const dataToSend = {
      amount: user.balance,
      userId: userId,
      exposure: totalExposure
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

    const marketDataRows = await Market.findAll({
      where: { marketId },
      include: [
        {
          model: Runner,
          required: false,
        },
      ],
    });

    let marketDataObj = {
      marketId: marketDataRows[0].marketId,
      marketName: marketDataRows[0].marketName,
      participants: marketDataRows[0].participants,
      startTime: marketDataRows[0].startTime,
      endTime: marketDataRows[0].endTime,
      announcementResult: marketDataRows[0].announcementResult,
      isActive: marketDataRows[0].isActive,
      runners: [],
    };

    // Initialize runner data
    marketDataRows[0].Runners.forEach((runner) => {
      marketDataObj.runners.push({
        id: runner.id,
        runnerName: {
          runnerId: runner.runnerId,
          name: runner.runnerName,
          isWin: runner.isWin,
          bal: Math.round(parseFloat(runner.bal)),
        },
        rate: [
          {
            back: runner.back,
            lay: runner.lay,
          },
        ],
      });
    });

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

    // Calculate user market balance
    const userMarketBalance = {
      userId,
      marketId,
      runnerBalance: [],
    };

    marketDataObj.runners.forEach((runner) => {
      let runnerBalance = 0;
      remainingMarket.forEach((order) => {

        if (order.type === "back") {
          if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
            runnerBalance += Number(order.bidAmount);
          } else {
            runnerBalance -= Number(order.value);
          }
        } else if (order.type === "lay") {
          if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
            runnerBalance -= Number(order.bidAmount);
          } else {
            runnerBalance += Number(order.value);
          }
        }
      });

      userMarketBalance.runnerBalance.push({
        runnerId: runner.runnerName.runnerId,
        bal: runnerBalance,
      });

      runner.runnerName.bal = runnerBalance;
      const maxNegativeRunnerBalance = userMarketBalance.runnerBalance.reduce((max, current) => {
        return current.bal < max.bal ? current : max;
      }, { bal: 0 });

      const updatedExposure = { [marketId]: Math.abs(maxNegativeRunnerBalance.bal) };
      user.marketListExposure = [updatedExposure];
    });

    await user.update({
      marketListExposure: user.marketListExposure,
    }, { transaction });

    const marketListExposureData = user.marketListExposure || [];

    marketListExposureData.filter(market => {
      const [key, value] = Object.entries(market)[0];
      if (key === marketId) {
        user.balance -= value;
        return false;
      }
      return true;
    });

    await user.update({
      balance: user.balance,
    }, { transaction });

    await transaction.commit();

    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting live bet markets:", error);
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

// export const deleteAfterWinBetMarkets = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { marketId, runnerId, userId, betId } = req.body;

//         const getMarket = await BetHistory.findOne({ where: { marketId, runnerId, userId, betId } });
//         if (!getMarket) {
//             return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market not found"))
//         }

//         await MarketTrash.create({
//             trashMarkets: [getMarket.dataValues],
//             trashMarketId: uuidv4(),
//         }, { transaction });

//         await getMarket.destroy({ transaction });

//         // **LOGIC TO RETRIEVE REMAINING RUNNER BALANCE:**

//         const marketDataRows = await Market.findAll({
//             where: { marketId },
//             include: [
//                 {
//                     model: Runner,
//                     required: false,
//                 },
//             ],
//         });

//         let marketDataObj = {
//             marketId: marketDataRows[0].marketId,
//             marketName: marketDataRows[0].marketName,
//             participants: marketDataRows[0].participants,
//             startTime: marketDataRows[0].startTime,
//             endTime: marketDataRows[0].endTime,
//             announcementResult: marketDataRows[0].announcementResult,
//             isActive: marketDataRows[0].isActive,
//             runners: [],
//         };

//         marketDataRows[0].Runners.forEach((runner) => {
//             marketDataObj.runners.push({
//                 id: runner.id,
//                 runnerName: {
//                     runnerId: runner.runnerId,
//                     name: runner.runnerName,
//                     isWin: runner.isWin,
//                     bal: Math.round(parseFloat(runner.bal)),
//                 },
//                 rate: [
//                     {
//                         back: runner.back,
//                         lay: runner.lay,
//                     },
//                 ],
//             });
//         });

//         const remainingMarket = await BetHistory.findAll({
//             where: {
//                 marketId,
//                 [Op.or]: [
//                     { runnerId: runnerId },
//                     { betId: { [Op.ne]: betId } }
//                 ]
//             },
//             transaction
//         });

//         const userMarketBalance = {
//             userId,
//             marketId,
//             runnerBalance: [],
//         };


//         marketDataObj.runners.forEach((runner) => {
//             let runnerBalance = 0;
//             remainingMarket.forEach((order) => {
//                 if (order.type === "back") {
//                     if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
//                         runnerBalance += Number(order.bidAmount);
//                     } else {
//                         runnerBalance -= Number(order.value);
//                     }
//                 } else if (order.type === "lay") {
//                     if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
//                         runnerBalance -= Number(order.bidAmount);
//                     } else {
//                         runnerBalance += Number(order.value);
//                     }
//                 }
//             });

//             userMarketBalance.runnerBalance.push({
//                 runnerId: runner.runnerName.runnerId,
//                 bal: runnerBalance,
//             });

//             runner.runnerName.bal = runnerBalance;
//         });

//         console.log("userMarketBalance..........01", userMarketBalance)

//         const previousStates = await PreviousState.findAll({
//             where: { marketId, runnerId },
//             transaction,
//         });

//         for (const prevState of previousStates) {
//             const user = await userSchema.findOne({
//                 where: { userId: prevState.userId },
//                 transaction,
//             });

//             if (user) {
//                 const marketListExposure = JSON.parse(prevState.marketListExposure);
//                 const allRunnerBalances = JSON.parse(prevState.allRunnerBalances);
//                 const runnerBalance = allRunnerBalances[runnerId];

//                 const marketExposureEntry = marketListExposure.find(
//                     (item) => Object.keys(item)[0] === marketId
//                 );

//                 if (!marketExposureEntry) continue;

//                 const marketExposureValue = Number(marketExposureEntry[marketId]);
//                 console.log("marketExposureValue", marketExposureValue)
//                 console.log("marketExposureValue", runnerBalance)

//                 if (runnerBalance > 0) {
//                     user.balance -= Number(runnerBalance + marketExposureValue);
//                     console.log(" prev user.balance", user.balance)

//                 } else { 
//                     user.balance -= Number(runnerBalance + marketExposureValue);
//                 }

//                 await user.save({ transaction });
//             }
//         }


//         // **LOGIC TO HANDLE WINNING RUNNER:**

//         // Fetch the winning runner
//         // Fetch the winning runner from the Runner table
//         const winningRunner = await Runner.findOne({
//             where: { marketId: userMarketBalance.marketId, isWin: 1 },
//             transaction,
//         });

//         if (!winningRunner) {
//             console.log("No winning runner found for marketId:", userMarketBalance.marketId);
//             return;
//         }

//         // Loop through userMarketBalance.runnerBalance to adjust balance based on winning runner
//         for (const runnerBalance of userMarketBalance.runnerBalance) {
//             if (runnerBalance.runnerId === winningRunner.runnerId) {
//                 console.log("Winning runner balance adjustment", runnerBalance);

//                 const user = await userSchema.findOne({ where: { userId: userMarketBalance.userId }, transaction });
//                 if (user) {
//                     // Adjust user balance based on the winning runner's balance
//                     console.log("runnerBalance.bal", runnerBalance.bal);

//                     if (runnerBalance.bal < 0) {
//                         user.balance += runnerBalance.bal; // Deduct if negative
//                     } else {
//                         user.balance += runnerBalance.bal; // Add if positive
//                     }

//                     console.log("Updated user balance:", user.balance);
//                     await user.save({ transaction });
//                 }
//             }
//         }


//         await transaction.commit();
//         return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));

//     } catch (error) {
//         await transaction.rollback();
//         res.status(statusCode.internalServerError).send(
//             apiResponseErr(null, false, statusCode.internalServerError, error.message)
//         );
//     }
// };


export const getMarket = async (req, res) => {
  try {
    let { page = 1, pageSize = 10, search } = req.query;

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


    if (allMarkets.length === 0) {
      return apiResponseErr(
        null,
        false,
        statusCode.notFound,
        "No markets found",
        res
      );
    }

    const filteredMarkets = search
      ? allMarkets.filter(
          (market) =>
            market.userName?.toLowerCase().includes(search.toLowerCase()) ||
            market.marketName?.toLowerCase().includes(search.toLowerCase())
        )
      : allMarkets;

      if (filteredMarkets.length === 0) {
        return apiResponseErr(
          null,
          false,
          statusCode.notFound,
          "No markets match the search criteria",
          res
        );
      }

      const uniqueMarkets = [
        ...new Map(
          filteredMarkets.map((m) => [
            m.marketId,
            { marketId: m.marketId, marketName: m.marketName, userName: m.userName },
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

export const getTrashMarketDetails = async (req, res) => {
  try {
    let { page = 1, pageSize = 10 } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const { marketId } = req.params;
    const marketData = await MarketTrash.findAll({
      attributes: ["trashMarkets", "trashMarketId"],
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
            trashMarketId: item.trashMarketId,
            marketName: data.marketName,
            marketId: data.marketId,
            runnerName: data.runnerName,
            runnerId: data.runnerId,
            userId: data.userId,
            userName: data.userName,
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

export const deleteMarketTrash = async (req, res) => {
  try {
    const { trashMarketId } = req.params
    const trashData = await MarketTrash.findOne({ where: { trashMarketId } });

    if (!trashData) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            'Market trash data not found'
          )
        );
    }
    await MarketTrash.destroy({ where: { trashMarketId } });
    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          'Market trash data deleted successfully'
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
}


export const restoreMarketData = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();
    const { trashMarketId } = req.params

    const trash_data = await MarketTrash.findOne({ where: { trashMarketId } });
        
    if (!trash_data) {return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, 'Market trash data not found'))}

    const trash_markets = trash_data.dataValues.trashMarkets;

    console.log("trash_markets", trash_markets);

    const map_trash_data = trash_markets.map((data) => ({
      userId: data.userId,
      userName: data.userName,
      gameId: data.gameId,
      gameName: data.gameName,
      marketId: data.marketId,
      marketName: data.marketName,
      runnerId: data.runnerId,
      runnerName: data.runnerName,
      rate: parseFloat(data.rate),
      value: parseFloat(data.value),
      type: data.type,
      date: (data.date),
      bidAmount: parseFloat(data.bidAmount),
      isWin: data.isWin,
      profitLoss: data.profitLoss,
      exposure: parseFloat(data.exposure),
      betId: data.betId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }));

    console.log("map_trash_data", map_trash_data);

    const new_orders = await CurrentOrder.bulkCreate(map_trash_data);

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


    const marketExposure = user.marketListExposure;

    let totalExposure = 0;
    marketExposure.forEach(market => {
      const exposure = Object.values(market)[0];
      totalExposure += exposure;
    });

    const dataToSend = {
      amount: user.balance,
      userId: userId,
      exposure: totalExposure
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

    const marketDataRows = await Market.findAll({
      where: { marketId },
      include: [
        {
          model: Runner,
          required: false,
        },
      ],
    });

    let marketDataObj = {
      marketId: marketDataRows[0].marketId,
      marketName: marketDataRows[0].marketName,
      participants: marketDataRows[0].participants,
      startTime: marketDataRows[0].startTime,
      endTime: marketDataRows[0].endTime,
      announcementResult: marketDataRows[0].announcementResult,
      isActive: marketDataRows[0].isActive,
      runners: [],
    };

    // Initialize runner data
    marketDataRows[0].Runners.forEach((runner) => {
      marketDataObj.runners.push({
        id: runner.id,
        runnerName: {
          runnerId: runner.runnerId,
          name: runner.runnerName,
          isWin: runner.isWin,
          bal: Math.round(parseFloat(runner.bal)),
        },
        rate: [
          {
            back: runner.back,
            lay: runner.lay,
          },
        ],
      });
    });

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

    // Calculate user market balance
    const userMarketBalance = {
      userId,
      marketId,
      runnerBalance: [],
    };

    marketDataObj.runners.forEach((runner) => {
      let runnerBalance = 0;
      remainingMarket.forEach((order) => {

        if (order.type === "back") {
          if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
            runnerBalance += Number(order.bidAmount);
          } else {
            runnerBalance -= Number(order.value);
          }
        } else if (order.type === "lay") {
          if (String(runner.runnerName.runnerId) === String(order.runnerId)) {
            runnerBalance -= Number(order.bidAmount);
          } else {
            runnerBalance += Number(order.value);
          }
        }
      });

      userMarketBalance.runnerBalance.push({
        runnerId: runner.runnerName.runnerId,
        bal: runnerBalance,
      });

      runner.runnerName.bal = runnerBalance;
      const maxNegativeRunnerBalance = userMarketBalance.runnerBalance.reduce((max, current) => {
        return current.bal < max.bal ? current : max;
      }, { bal: 0 });

      const updatedExposure = { [marketId]: Math.abs(maxNegativeRunnerBalance.bal) };
      user.marketListExposure = [updatedExposure];
    });

    await user.update({
      marketListExposure: user.marketListExposure,
    }, { transaction });

    const marketListExposureData = user.marketListExposure || [];

    marketListExposureData.filter(market => {
      const [key, value] = Object.entries(market)[0];
      if (key === marketId) {
        user.balance -= value;
        return false;
      }
      return true;
    });

    await user.update({
      balance: user.balance,
    }, { transaction });

    await transaction.commit();

    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));

    const delete_trash_data = await MarketTrash.destroy({ where: { trashMarketId } })

  } catch (error) {
    await transaction.rollback();
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
}
