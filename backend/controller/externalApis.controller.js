import {
  apiResponseErr,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import { statusCode } from "../helper/statusCodes.js";
import BetHistory from "../models/betHistory.model.js";
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import { Op, Sequelize, where } from "sequelize";
import Game from "../models/game.model.js";
import ProfitLoss from "../models/profitLoss.js";
import CurrentOrder from "../models/currentOrder.model.js";
import MarketBalance from "../models/marketBalance.js";
import userSchema from "../models/user.model.js";
import LotteryProfit_Loss from "../models/lotteryProfit_loss.model.js";
import axios from "axios";
import { sequelize } from "../db.js";
import WinningAmount from "../models/winningAmount.model.js";
import { user_Balance } from "./admin.controller.js";
import MarketListExposure from "../models/marketListExposure.model.js";

export const getExternalUserBetHistory = async (req, res) => {
  try {
    const { gameId, userName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { dataType, type } = req.query;

    let startDate, endDate;
    if (dataType === "live") {
      const today = new Date();
      startDate = new Date(today).setHours(0, 0, 0, 0);
      endDate = new Date(today).setHours(23, 59, 59, 999);
    } else if (dataType === "olddata") {
      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
      } else {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        startDate = new Date(oneYearAgo).setHours(0, 0, 0, 0);
        endDate = new Date().setHours(23, 59, 59, 999);
      }
    } else if (dataType === "backup") {
      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
        const maxAllowedDate = new Date(startDate);
        maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
        if (endDate > maxAllowedDate) {
          return res
            .status(statusCode.badRequest)
            .send(
              apiResponseErr(
                [],
                false,
                statusCode.badRequest,
                "The date range for backup data should not exceed 3 months."
              )
            );
        }
      } else {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        startDate = new Date(threeMonthsAgo.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
      }
    } else {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found.")
        );
    }

    let model

    const whereCondition = {
      userName: userName,
      gameId: gameId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (type === "void") {
      whereCondition.isVoid = true;
      model = BetHistory;
    } else if (type === "settle") {
      whereCondition.isVoid = false;
      model = BetHistory;
    } else if (type === "unsettle") {
      whereCondition.isWin = false;
      model = CurrentOrder;
    } else {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found.")
        );
    }

    const { count, rows } = await model.findAndCountAll({
      where: whereCondition,
      attributes: [
        "userId",
        "userName",
        "gameName",
        "marketName",
        "runnerName",
        "rate",
        "value",
        "type",
        "date",
      ],
      limit,
      offset: (page - 1) * limit,
    });

    const totalPages = Math.ceil(count / limit);
    const pageSize = limit;
    const totalItems = count;

    return res.status(statusCode.success).send(
      apiResponseSuccess(rows, true, statusCode.success, "Success", {
        totalPages,
        pageSize,
        totalItems,
        page,
      })
    );
  } catch (error) {
    console.log("error", error)
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

export const calculateExternalProfitLoss = async (req, res) => {
  try {
    const userName = req.params.userName;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const dataType = req.query.dataType;
    let startDate, endDate;
    if (dataType === "live") {
      const today = new Date();
      startDate = new Date(today).setHours(0, 0, 0, 0);
      endDate = new Date(today).setHours(23, 59, 59, 999);
    } else if (dataType === "olddata") {
      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
      } else {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        startDate = new Date(oneYearAgo).setHours(0, 0, 0, 0);
        endDate = new Date().setHours(23, 59, 59, 999);
      }
    } else if (dataType === "backup") {
      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
        const maxAllowedDate = new Date(startDate);
        maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
        if (endDate > maxAllowedDate) {
          return res
            .status(statusCode.badRequest)
            .send(
              apiResponseErr(
                [],
                false,
                statusCode.badRequest,
                "The date range for backup data should not exceed 3 months."
              )
            );
        }
      } else {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 2);
        startDate = new Date(threeMonthsAgo.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
      }
    } else {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found.")
        );
    }
    const searchGameName = req.query.search || "";

    const totalGames = await ProfitLoss.count({
      where: {
        userName: userName,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      distinct: true,
      col: "gameId",
    });

    const profitLossData = await ProfitLoss.findAll({
      attributes: [
        "gameId",
        [Sequelize.fn("SUM", Sequelize.col("profitLoss")), "totalProfitLoss"],
      ],
      include: [
        {
          model: Game,
          attributes: ["gameName"],
          where: searchGameName
            ? { gameName: { [Op.like]: `%${searchGameName}%` } }
            : {},
        },
      ],
      where: {
        userName: userName,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["gameId", "Game.gameName"],
      offset: (page - 1) * limit,
      limit: limit,
    });
    /*********************************Previous Logic***************************************************************************************************************** */
    // const lotteryProfitLossData = await LotteryProfit_Loss.findAll({
    //   attributes: [
    //     [Sequelize.fn("SUM", Sequelize.col("profitLoss")), "totalProfitLoss"],
    //   ],
    //   where: {
    //     userName: userName,
    //   },
    // });

    // if (profitLossData.length === 0 && lotteryProfitLossData.length === 0) {
    //   return res
    //     .status(statusCode.success)
    //     .send(
    //       apiResponseSuccess(
    //         [],
    //         true,
    //         statusCode.success,
    //         "No profit/loss data found for the given date range."
    //       )
    //     );
    // }

    const lotteryProfitLossData = await LotteryProfit_Loss.findAll({
      attributes: [
        "userId",
        [
          Sequelize.literal(`
            COALESCE((
              SELECT SUM(lp.profitLoss)
              FROM LotteryProfit_Loss lp
              WHERE lp.userId = LotteryProfit_Loss.userId
              AND lp.id IN (
                SELECT MIN(lp2.id) 
                FROM LotteryProfit_Loss lp2
                WHERE lp2.userId = lp.userId
                GROUP BY lp2.marketId
              )
            ), 0)
          `),
          "totalProfitLoss",
        ],
      ],
      where: {
        userName: userName,
      },
      group: ["userId"],
    });

    // if (lotteryProfitLossData.length === 0 ) {
    //   return res
    //     .status(statusCode.success)
    //     .send(
    //       apiResponseSuccess(
    //         [],
    //         true,
    //         statusCode.success,
    //         "No profit/loss data found for the given date range."
    //       )
    //     );
    // }

    const combinedProfitLossData = [
      ...profitLossData.map((item) => ({
        gameId: item.gameId,
        gameName: item.Game.gameName,
        totalProfitLoss: item.dataValues.totalProfitLoss,
      })),
      ...lotteryProfitLossData
        .filter((item) => item.dataValues.totalProfitLoss !== null && item.dataValues.totalProfitLoss !== undefined && item.dataValues.totalProfitLoss !== "")
        .map((item) => ({
          gameName: "Lottery",
          totalProfitLoss: item.dataValues.totalProfitLoss,
        })),
    ];

    const totalItems = combinedProfitLossData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedCombinedData = combinedProfitLossData.slice(
      (page - 1) * limit,
      page * limit
    );

    const paginationData = {
      page: page,
      limit,
      totalPages: totalPages,
      totalItems,
    };

    return res.status(statusCode.success).send(
      apiResponseSuccess(
        paginatedCombinedData,
        true,
        statusCode.success,
        "Success",

        paginationData
      )
    );
  } catch (error) {
    res
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

export const marketExternalProfitLoss = async (req, res) => {
  try {
    const { gameId, userName } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const searchMarketName = req.query.search || "";

    const distinctMarketIds = await ProfitLoss.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("marketId")), "marketId"],
      ],
      where: { userName: userName, gameId: gameId },
    });

    if (distinctMarketIds.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No profit/loss data found."
          )
        );
    }

    const marketsProfitLoss = await Promise.all(
      distinctMarketIds.map(async (market) => {
        const profitLossEntries = await ProfitLoss.findAll({
          attributes: [
            "marketId",
            [
              Sequelize.literal("CAST(profitLoss AS DECIMAL(10, 2))"),
              "profitLoss",
            ],
          ],
          where: {
            userName: userName,
            marketId: market.marketId,
          },
        });

        if (profitLossEntries.length === 0) {
          return res
            .status(statusCode.success)
            .send(
              apiResponseSuccess(
                [],
                true,
                statusCode.success,
                "No profit/loss data found for the given date range."
              )
            );
        }

        const marketQuery = {
          marketId: market.marketId,
        };

        if (searchMarketName) {
          marketQuery.marketName = { [Op.like]: `%${searchMarketName}%` };
        }

        const game = await Game.findOne({
          include: [
            {
              model: Market,
              where: marketQuery,
              attributes: ["marketName"],
            },
          ],
          attributes: ["gameName"],
          where: { gameId: gameId },
        });

        if (!game) return null;

        const gameName = game.gameName;
        const marketName = game.Markets[0].marketName;
        const totalProfitLoss = profitLossEntries.reduce(
          (acc, entry) => acc + parseFloat(entry.profitLoss),
          0
        );

        const formattedTotalProfitLoss = totalProfitLoss.toFixed(2);

        return {
          marketId: market.marketId,
          marketName,
          gameName,
          totalProfitLoss: formattedTotalProfitLoss,
          profitLoss: formattedTotalProfitLoss,
        };
      })
    );
    const filteredMarketsProfitLoss = marketsProfitLoss.filter(
      (item) => item !== null
    );

    if (filteredMarketsProfitLoss.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No matching markets found."
          )
        );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProfitLossData = filteredMarketsProfitLoss.slice(
      startIndex,
      endIndex
    );
    const totalItems = filteredMarketsProfitLoss.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginationData = {
      page: page,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedProfitLossData,
          true,
          statusCode.success,
          "Success",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error from API:", error.message);
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

export const runnerExternalProfitLoss = async (req, res) => {
  try {
    const { marketId, userName } = req.params;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const searchRunnerName = req.query.search || "";

    const profitLossEntries = await ProfitLoss.findAll({
      where: {
        userName: userName,
        marketId: marketId,
      },
    });

    if (profitLossEntries.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No profit/loss data found for the given date range."
          )
        );
    }

    const runnersProfitLoss = await Promise.all(
      profitLossEntries.map(async (entry) => {
        const game = await Game.findOne({
          where: { gameId: entry.gameId },
          include: [
            {
              model: Market,
              where: { marketId: marketId },
              include: [
                {
                  model: Runner,
                  where: searchRunnerName
                    ? { runnerName: { [Op.like]: `%${searchRunnerName}%` } }
                    : {},
                },
              ],
            },
          ],
        });

        if (!game) return null;

        const market = game.Markets[0];
        const runner = market.Runners.find(
          (runner) => runner.runnerId === entry.runnerId
        );

        if (!runner) {
          return apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            `Runner data not found for runnerId: ${entry.runnerId}`
          );
        }

        return {
          gameName: game.gameName,
          marketName: market.marketName,
          marketId: market.marketId,
          runnerName: runner.runnerName,
          runnerId: entry.runnerId,
          profitLoss: parseFloat(entry.profitLoss).toFixed(2),
          totalProfitLoss: parseFloat(entry.profitLoss).toFixed(2),
          isWin: runner.isWin,
          settleTime: entry.date.toISOString(),
          userName: entry.userName,
        };
      })
    );

    const filteredRunnersProfitLoss = runnersProfitLoss.filter(
      (item) => item !== null
    );

    if (filteredRunnersProfitLoss.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No matching runners found."
          )
        );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRunnersProfitLoss = filteredRunnersProfitLoss.slice(
      startIndex,
      endIndex
    );
    const totalItems = filteredRunnersProfitLoss.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginationData = {
      page: page,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedRunnersProfitLoss,
          true,
          statusCode.success,
          "Success",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error from API:", error.message);
    res
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

export const liveMarketBet = async (req, res) => {
  try {
    const { marketId, userName } = req.params;

    const baseURL = process.env.WHITE_LABEL_URL;
    const response = await axios.get(
      `${baseURL}/api/users-hierarchy/${userName}`
    );


    const { users } = response.data.data;
    const userIds = users.map((user) => user.userId);

    const marketDataRows = await Market.findAll({
      where: { marketId },
      include: [
        {
          model: Runner,
          required: false,
        },
      ],
    });

    if (marketDataRows.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            { runners: [] },
            true,
            statusCode.success,
            "Market not found with MarketId"
          )
        );
    }

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

    for (let runner of marketDataRows[0].Runners) {
      const totalBalance = await MarketBalance.sum("bal", {
        where: {
          marketId: marketDataRows[0].marketId,
          runnerId: runner.runnerId,
          userId: userIds,
        },
      });



      marketDataObj.runners.push({
        id: runner.id,
        runnerName: {
          runnerId: runner.runnerId,
          name: runner.runnerName,
          isWin: runner.isWin,
          bal: totalBalance ? Math.round(parseFloat(totalBalance)) : 0,
        },
        rate: [
          {
            back: runner.back,
            lay: runner.lay,
          },
        ],
      });
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(marketDataObj, true, statusCode.success, "Success")
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

export const getLiveBetGames = async (req, res) => {
  try {
    const currentOrders = await CurrentOrder.findAll({
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "userId",
        "userName",
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!currentOrders || currentOrders.length === 0) {
      return res.status(statusCode.success).send(
        apiResponseSuccess([], true, statusCode.success, "No data found.")
      );
    }

    const formattedResponse = currentOrders.map((order) => ({
      marketId: order.marketId,
      marketName: order.marketName,
      gameName: order.gameName,
      userId: order.userId,
      userName: order.userName,
    }));

    return res.status(statusCode.success).send(
      apiResponseSuccess(formattedResponse, true, statusCode.success, "Success")
    );
  } catch (error) {
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getExternalUserBetList = async (req, res) => {
  try {
    const { userName, marketId } = req.params;

    const rows = await BetHistory.findAll({
      where: {
        userName: userName,
        marketId: marketId,
      },
      attributes: [
        "userId",
        "userName",
        "gameName",
        "marketName",
        "runnerName",
        "rate",
        "value",
        "type",
        "matchDate",
        "placeDate",
        "bidAmount",
      ],
    });

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(rows, true, statusCode.success, "Success"));
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

export const liveUserBet = async (req, res) => {
  try {
    const { marketId } = req.params;

    // Fetch market data
    const marketDataRows = await Market.findAll({
      where: { marketId },
      include: [
        {
          model: Runner,
          required: false,
        },
      ],
    });

    if (marketDataRows.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            { runners: [] },
            true,
            statusCode.success,
            "Market not found with MarketId"
          )
        );
    }

    // Prepare market data object
    let marketDataObj = {
      marketId: marketDataRows[0].marketId,
      marketName: marketDataRows[0].marketName,
      participants: marketDataRows[0].participants,
      startTime: marketDataRows[0].startTime,
      endTime: marketDataRows[0].endTime,
      announcementResult: marketDataRows[0].announcementResult,
      isActive: marketDataRows[0].isActive,
      runners: [],
      usersDetails: [],
    };

    // Populate runners data
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

    // Fetch all current orders for the given market
    const currentOrdersRows = await CurrentOrder.findAll({
      where: { marketId },
    });

    // Organize orders by userName
    const userOrders = currentOrdersRows.reduce((acc, order) => {
      if (!acc[order.userName]) {
        acc[order.userName] = [];
      }
      acc[order.userName].push(order);
      return acc;
    }, {});

    // Fetch userId for each userName
    const userIds = await userSchema.findAll({
      where: { userName: Object.keys(userOrders) },
      attributes: ["userName", "userId"],
      raw: true,
    });

    // Create a map of userName -> userId
    const userNameToIdMap = userIds.reduce((map, user) => {
      map[user.userName] = user.userId;
      return map;
    }, {});

    // Calculate balances for all users
    for (const [userName, orders] of Object.entries(userOrders)) {
      const userMarketBalance = {
        userName,
        userId: userNameToIdMap[userName], // Fetch userId from the map
        marketId,
        runnerBalance: [],
      };

      marketDataObj.runners.forEach((runner) => {
        let runnerBalance = 0;
        orders.forEach((order) => {
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
          runnerName: runner.runnerName.name,
          bal: runnerBalance,
        });
      });

      marketDataObj.usersDetails.push(userMarketBalance);
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(marketDataObj, true, statusCode.success, "Success")
      );
  } catch (error) {
    console.error("Error fetching market data:", error);
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

export const getExternalLotteryP_L = async (req, res) => {
  try {
    const userName = req.params.userName;
    const { page = 1, limit = 10, search } = req.query;

    const currentPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (currentPage - 1) * parsedLimit;

    const whereClause = { userName };

    if (search) {
      whereClause.marketName = {
        [Op.like]: `%${search}%`
      };
    }

    const lotteryProfitLossRecords = await LotteryProfit_Loss.findAll({
      where: whereClause,
      attributes: ['gameName', 'marketName', 'marketId', 'profitLoss'],
    });

    const uniqueRecords = [];
    const marketIdSet = new Set();

    lotteryProfitLossRecords.forEach(record => {
      if (!marketIdSet.has(record.marketId)) {
        marketIdSet.add(record.marketId);
        uniqueRecords.push(record);
      }
    });

    const paginatedUniqueRecords = uniqueRecords.slice(offset, offset + parsedLimit);

    const totalPages = Math.ceil(uniqueRecords.length / parsedLimit);
    const pagination = {
      page: currentPage,
      limit: parsedLimit,
      totalPages,
      totalItems: uniqueRecords.length,
    };


    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedUniqueRecords,
          true,
          statusCode.success,
          "Success",
          pagination
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

export const getVoidMarket = async (req, res) => {
  try {
    const { marketId, userId } = req.body;
    if (!marketId) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "MarketId is required"
          )
        );
    }

    const users = await userSchema.findAll({
      where: { userId },
    });

    if (!users || users.length === 0) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.notFound,
            "No matching users found in the database"
          )
        );
    }

    for (const user of users) {
      const exposures = await MarketListExposure.findAll({
        where: {
          UserId: user.userId,
          MarketId: marketId,
        },
      });

      const totalExposureValue = exposures.reduce((sum, exp) => sum + exp.exposure, 0);

      if (totalExposureValue > 0) {
        await MarketListExposure.destroy({
          where: {
            UserId: user.userId,
            MarketId: marketId,
          },
        });
      }
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Balances updated successfully and market voided"
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

export const getRevokeMarket = async (req, res) => {
  try {
    const { marketId } = req.body;

    if (!marketId) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "MarketId is required"));
    }

    let usersFromProfitLoss = await LotteryProfit_Loss.findAll({
      where: { marketId },
      attributes: ["userId", "price", "profitLoss"],
      raw: true,
    });

    if (!usersFromProfitLoss.length) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.notFound,
            "No profit/loss data found"
          )
        );
    }

    // we are removing duplicate entries based on userId
    const userProfitLossMap = {};
    usersFromProfitLoss.forEach(({ userId, price, profitLoss }) => {
      if (!userProfitLossMap[userId]) {
        userProfitLossMap[userId] = {
          totalProfitLoss: 0,
          totalPrice: 0,
          exposurePrice: 0,
        };
      }
      userProfitLossMap[userId].totalProfitLoss +=
        Number(profitLoss) > 0 ? Number(profitLoss) : 0;
      userProfitLossMap[userId].totalPrice += Number(price);
      userProfitLossMap[userId].exposurePrice += Number(price);
    });

    const userIds = Object.keys(userProfitLossMap);
    const users = await userSchema.findAll({
      where: { userId: userIds },
      raw: true,
    });

    if (!users.length) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.notFound,
            "No matching users found"
          )
        );
    }

    for (const user of users) {
      const userId = user.userId;
      if (!userProfitLossMap[userId]) {
        console.log(`User ${userId} not found in profit/loss map.`);
        continue;
      }

      const { exposurePrice } = userProfitLossMap[userId];

      const existingExposure = await MarketListExposure.findOne({
        where: {
          UserId: userId,
          MarketId: marketId,
        },
      });

      if (existingExposure) {
        await MarketListExposure.update(
          {
            exposure: existingExposure.exposure + exposurePrice,
          },
          {
            where: {
              UserId: userId,
              MarketId: marketId,
            },
          }
        );
      } else {
        await MarketListExposure.create({
          UserId: userId,
          MarketId: marketId,
          exposure: exposurePrice,
        });
      }
    }

    await WinningAmount.destroy({ where: { marketId } });

    await LotteryProfit_Loss.destroy({ where: { marketId } });

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Market exposure updated successfully"
        )
      );
  } catch (error) {
    console.error("Error in getRevokeMarket:", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          statusCode.internalServerError,
          "An error occurred while revoking the market"
        )
      );
  }
};

export const getDeleteLiveMarket = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { marketId, userId, price } = req.body;
    if (!marketId) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "MarketId is required"
          )
        );
    }
    const userExposures = await MarketListExposure.findAll({
      where: { UserId: userId },
    });

    if (!userExposures || userExposures.length === 0) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.notFound,
            "No matching exposures found in the database"
          )
        );
    }
    const totalMarketExposures = userExposures.filter(
      (item) => item.MarketId === marketId
    );
    let totalExposureValue = 0;

    totalMarketExposures.forEach((item) => {
      totalExposureValue += Number(item.exposure);
    });

    const matchedExposure = await MarketListExposure.findOne({
      where: {
        UserId: userId,
        MarketId: marketId,
      },
    });

    if (matchedExposure) {
      let newExposure = matchedExposure.exposure - price;
      if (newExposure <= 0) {
        await matchedExposure.destroy({ transaction: t });
      } else {
        matchedExposure.exposure = newExposure;
        await matchedExposure.save({ transaction: t });
      }
    }

    await t.commit();
    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Balances updated successfully and market Deleted"
        )
      );
  } catch (error) {
    await t.rollback();
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

export const revokeLiveBet = async (req, res) => {
  try {
    const { marketId, userId, lotteryPrice } = req.body;

    const user = await userSchema.findOne({
      where: { userId },
    });

    if (!user || user.length === 0) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.notFound,
            "No matching users found in the database"
          )
        );
    }

    const newExposure = Math.abs(lotteryPrice);

    const existingExposure = await MarketListExposure.findOne({
      where: {
        UserId: userId,
        MarketId: marketId,
      },
    });

    if (existingExposure) {
      const existing = Number(existingExposure.dataValues.exposure);
      const newExposureValue = existing + Math.abs(Number(lotteryPrice));

      await existingExposure.update({
        exposure: newExposureValue,
      });
    } else {
      await MarketListExposure.create({
        UserId: userId,
        MarketId: marketId,
        exposure: Math.abs(Number(lotteryPrice)),
      });
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Market exposure updated successfully"
        )
      );
  } catch (error) {
    console.error("Error in getRevokeMarket:", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          statusCode.internalServerError,
          "An error occurred while revoking the market"
        )
      );
  }
};

export const userLiveBte = async (req, res) => {
  try {
    const { marketId } = req.params;

    const currentOrders = await CurrentOrder.findAll({
      where: { marketId },
      attributes: [
        "userName",
        "userId",
        "marketName",
        "marketId",
        "runnerId",
        "runnerName",
        "rate",
        "value",
        "type",
      ],
    });

    if (currentOrders.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No current orders found"
          )
        );
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(currentOrders, true, statusCode.success, "Success")
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

export const getAllLotteryMarket = async (req, res) => {
  try {
    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/get-active-market`);
    const data = response.data.data;
    res
      .status(statusCode.success)
      .json(apiResponseSuccess(data, true, statusCode.success, "Success"));
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json(
          apiResponseErr(
            null,
            false,
            error.response.status,
            error.response.data.message || error.response.data.errMessage
          )
        );
    } else {
      return res
        .status(statusCode.internalServerError)
        .json(
          apiResponseErr(
            null,
            false,
            statusCode.internalServerError,
            error.message
          )
        );
    }
  }
};

export const getExposure = async (req, res) => {
  try {
    const { userId } = req.params;
    const userBalance = await user_Balance(userId, true);
    const exposureList = userBalance?.[1] ?? [];
    const marketListExposure = exposureList.map((exposure) => ({
      [exposure.MarketId]: exposure.exposure,
    }));
    res.json({ marketListExposure });
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .json(
        apiResponseErr(
          null,
          false,
          statusCode.internalServerError,
          error.message
        )
      );
  }
};

export const deleteBetAfterWin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      marketId,
      userId,
      sem,
      prizeAmount,
      prizeCategory,
      complementaryPrize,
      price,
    } = req.body;

    let subtractAmount;
    if (prizeCategory === "First Prize") {
      subtractAmount = prizeAmount - price;
    } else if (complementaryPrize > 0) {
      subtractAmount = complementaryPrize - price;
    } else {
      subtractAmount = sem * prizeAmount - price;
    }
    const winningAmount = await WinningAmount.findOne({
      where: { userId, marketId },
      transaction: t,
    });

    if (!winningAmount) {
      await t.rollback();
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Winning amount not found"
          )
        );
    }

    const updatedAmount = winningAmount.amount - subtractAmount;
    await WinningAmount.update(
      { amount: updatedAmount },
      { where: { userId, marketId, type: "win" }, transaction: t }
    );

    const profitLossAmount = await LotteryProfit_Loss.findOne({
      where: { userId, marketId },
      transaction: t,
    });

    if (!profitLossAmount) {
      await t.rollback();
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "profitLossAmount not found"
          )
        );
    }

    const updatedProfitLoss = profitLossAmount.profitLoss - subtractAmount;
    await LotteryProfit_Loss.update(
      { profitLoss: updatedProfitLoss },
      { where: { userId, marketId }, transaction: t }
    );

    await t.commit();
    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Balances updated successfully and bet deleted"
        )
      );
  } catch (error) {
    await t.rollback();
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

export const afterWinVoidMarket = async (req, res) => {
  try {
    const { marketId, userId } = req.body;
    if (!Array.isArray(userId) || userId.length === 0) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Invalid userId format"
          )
        );
    }

    await WinningAmount.update(
      { amount: 0 },
      {
        where: {
          userId: userId,
          marketId,
          type: "win",
        },
      }
    );

    await WinningAmount.update(
      { isVoidAfterWin: true },
      { where: { marketId } }
    );

    await LotteryProfit_Loss.destroy({
      where: { marketId, userId },
    });

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Balance updated successfully!"
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
