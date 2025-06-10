import bcrypt from "bcrypt";
import {
  apiResponseErr,
  apiResponsePagination,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import { statusPanelCodes, string } from "../constructor/string.js";
import userSchema from "../models/user.model.js";
import { statusCode } from "../helper/statusCodes.js";
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import { Op, Sequelize } from "sequelize";
import MarketBalance from "../models/marketBalance.js";
import CurrentOrder from "../models/currentOrder.model.js";
import Game from "../models/game.model.js";
import BetHistory from "../models/betHistory.model.js";
import ProfitLoss from "../models/profitLoss.js";
import { PreviousState } from "../models/previousState.model.js";
import axios from "axios";
import CustomError from "../helper/extendError.js";
import LotteryProfit_Loss from "../models/lotteryProfit_loss.model.js";
import { v4 as uuidv4 } from "uuid";
import { getISTTime } from "../helper/commonMethods.js";
import { user_Balance } from "./admin.controller.js";
import { sequelize, sql } from "../db.js";
import MarketListExposure from "../models/marketListExposure.model.js";
import Notification from "../models/notification.model.js";
import { db } from "../firebase-db.js";

// done
export const createUser = async (req, res) => {
  try {
    const { userId, userName, password } = req.body;
    const existingUser = await userSchema.findOne({ where: { userName } });
    if (existingUser) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "User already exists"
          )
        );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userSchema.create({
      userId,
      userName,
      password: hashedPassword,
      roles: string.User,
    });

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          newUser,
          true,
          statusCode.create,
          "User created successfully"
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

// done
export const userUpdate = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, userName, phoneNumber, password } = req.body;

  try {
    const user = await userSchema.findOne({ where: { userId } });

    if (!user) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.notFound, "User not found")
        );
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (userName) updateData.userName = userName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    await user.update(updateData);

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "User updated successfully"
        )
      );
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

// done
export const eligibilityCheck = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { eligibilityCheck } = req.body;

    const user = await userSchema.findOne({ where: { userId } });

    if (!user) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "User not found")
        );
    }

    user.eligibilityCheck = eligibilityCheck;
    await user.save();

    return res.status(200).json({
      message: eligibilityCheck ? "User Eligible" : "User Not Eligible",
    });
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// DONE
export const resetPassword = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const user = req.user;
    const userId = user.userId;

    if (password !== confirmPassword) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Confirm Password does not match with Password"
          )
        );
    }

    const userData = await userSchema.findOne({ where: { userId } });

    if (!userData) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "User Not Found")
        );
    }

    const oldPasswordIsCorrect = await bcrypt.compare(
      oldPassword,
      userData.password
    );

    if (!oldPasswordIsCorrect) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Invalid old password"
          )
        );
    }

    const newPasswordIsCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (newPasswordIsCorrect) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "New password can't be same to existing password!"
          )
        );
    }

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);
    await userData.save();

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Password Reset Successfully"
        )
      );
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const userGame = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const searchQuery = req.query.search || "";

    const { count, rows } = await Game.findAndCountAll({
      attributes: ["gameId", "gameName", "description"],
      where: {
        gameName: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    if (!rows || rows.length === 0) {
      return res
        .status(statusCode.success)
        .json(
          apiResponseSuccess([], false, statusCode.success, "Data Not Found")
        );
    }

    const gameData = rows.map((game) => ({
      gameId: game.gameId,
      gameName: game.gameName,
      description: game.description,
    }));

    const totalPages = Math.ceil(count / pageSize);

    const paginationData = apiResponsePagination(page, totalPages, count);

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          gameData,
          true,
          statusCode.success,
          "Success",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error fetching games:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const userMarket = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : "";

    const { count, rows } = await Market.findAndCountAll({
      where: {
        gameId: gameId,
        marketName: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      // include: [
      //   {
      //     model: Game,
      //     attributes: ['gameId', 'gameName'],
      //   },
      // ],
    });

    const totalPages = Math.ceil(count / pageSize);

    const paginationData = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: count,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          rows,
          true,
          statusCode.success,
          "Success",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error fetching markets:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const userRunners = async (req, res) => {
  try {
    const marketId = req.params.marketId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.search || "";

    const whereConditions = {
      marketId: marketId,
      ...(searchQuery && {
        runnerName: {
          [Op.like]: `%${searchQuery}%`,
        },
      }),
    };

    const { rows: runners, count: totalItems } = await Runner.findAndCountAll({
      where: whereConditions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const transformedRunners = runners.map((runner) => ({
      runnerId: runner.runnerId,
      runnerName: runner.runnerName,
      rates: [
        {
          back: runner.back,
          lay: runner.lay,
        },
      ],
    }));

    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationData = apiResponsePagination(page, totalPages, totalItems);

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          transformedRunners,
          true,
          statusCode.success,
          "success",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error fetching runners:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const getAllGameData = async (req, res) => {
  try {
    const gameData = await Game.findAll({
      attributes: ["gameId", "gameName", "description", "isBlink", "createdAt"],
      include: [
        {
          model: Market,
          attributes: [
            "marketId",
            "marketName",
            "participants",
            "startTime",
            "endTime",
            "announcementResult",
            "hotGame",
            "isActive",
            "hideMarketWithUser",
            "isVoid",
            "isDeleted",
            "createdAt",
          ],
          include: [
            {
              model: Runner,
              attributes: [
                "runnerId",
                "runnerName",
                "isWin",
                "bal",
                "back",
                "lay",
                "hideRunnerUser",
                "createdAt",
              ],
            },
          ],
        },
      ],
    });

    const formattedGameData = gameData
      .map((game) => ({
        gameId: game.gameId,
        gameName: game.gameName,
        description: game.description,
        isBlink: game.isBlink,
        createdAt: game.createdAt, // Ensure createdAt is included
        markets: game.Markets.filter(
          (market) =>
            market.hideMarketWithUser &&
            !market.isVoid &&
            market.announcementResult === false &&
            market.isDeleted === false
        )
          .sort((a, b) => {
            // First prioritize hotGame === true, then sort by createdAt DESC
            if (b.hotGame === true && a.hotGame !== true) return 1;
            if (a.hotGame === true && b.hotGame !== true) return -1;
            // return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .map((market) => ({
            marketId: market.marketId,
            marketName: market.marketName,
            participants: market.participants,
            startTime: market.startTime,
            endTime: market.endTime,
            announcementResult: market.announcementResult,
            isActive: market.isActive,
            isVoid: market.isVoid,
            hotGame: market.hotGame,
            runners: market.Runners.filter((runner) => !runner.hideRunnerUser)
              .map((runner) => ({
                runnerId: runner.runnerId,
                runnerName: runner.runnerName,
                isWin: runner.isWin,
                bal: runner.bal,
                rate: [
                  {
                    back: runner.back,
                    lay: runner.lay,
                  },
                ],
              })),
          })),
      }))


    const baseURL = process.env.LOTTERY_URL;

    const response = await axios.get(`${baseURL}/api/get-active-market`);
    const data = response.data.data;
    const foramtedData = [
      {
        gameName:
          data[0]?.gameName === "Lottery" ? data[0]?.gameName : "Lottery",
        markets: data.map((game) => ({
          marketId: game.marketId,
          marketName: game.marketName,
          group_start: game.group_start,
          group_end: game.group_end,
          series_start: game.series_start,
          series_end: game.series_end,
          number_start: game.number_start,
          number_end: game.number_end,
          start_time: game.start_time,
          end_time: game.end_time,
          date: game.date,
          price: game.price,
          hotGame: game.hotGame,
          isActive: game.isActive,
          isWin: game.isWin,
          isVoid: game.isVoid,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
        })),
      },
    ];

    const combinedData = [...foramtedData, ...formattedGameData];

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(combinedData, true, statusCode.success, "Success")
      );
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
// done
export const filteredGameData = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const gameData = await Game.findAll({
      where: { gameId },
      attributes: ["gameId", "gameName", "description", "isBlink"],
      include: [
        {
          model: Market,
          attributes: [
            "marketId",
            "marketName",
            "participants",
            "startTime",
            "endTime",
            "createdAt",
            "announcementResult",
            "hideMarketWithUser",
            "isActive",
            "isDeleted",
            "isVoid",
          ],
          where: {
            isVoid: false,
          },
          include: [
            {
              model: Runner,
              attributes: [
                "runnerId",
                "runnerName",
                "isWin",
                "bal",
                "back",
                "lay",
              ],
            },
          ],
        },
      ],
    });

    gameData.forEach((game) => {
      if (game.Markets && Array.isArray(game.Markets)) {
        game.Markets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
    });

    if (!gameData) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Game not found"
      );
    }

    const formattedGameData = gameData.map((game) => ({
      gameId: game.gameId,
      gameName: game.gameName,
      description: game.description,
      isBlink: game.isBlink,
      markets: game.Markets.filter(
        (market) =>
          market.hideMarketWithUser &&
          !market.isVoid &&
          market.announcementResult === false &&
          market.isDeleted === false
      ).map((market) => ({
        marketId: market.marketId,
        marketName: market.marketName,
        participants: market.participants,
        startTime: market.startTime,
        endTime: market.endTime,
        createdAt: market.createdAt,
        announcementResult: market.announcementResult,
        isActive: market.isActive,
        runners: market.Runners.map((runner) => ({
          runnerName: {
            runnerId: runner.runnerId,
            runnerName: runner.runnerName,
            isWin: runner.isWin,
            bal: runner.bal,
          },
          rate: [
            {
              back: runner.back,
              lay: runner.lay,
            },
          ],
        })),
      })),
    }));

    // Send the formatted response
    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          formattedGameData,
          true,
          statusCode.success,
          "Success"
        )
      );
  } catch (error) {
    console.error("Error retrieving game data:", error);
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
// done
export const userGif = async (req, res) => {
  try {
    const gifData = await gifSchema.findAll({
      attributes: ["imageId", "image", "text", "headingText", "isActive"],
    });

    res
      .status(statusCode.success)
      .send(apiResponseSuccess(gifData, true, statusCode.success, "success"));
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const getUserWallet = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userData = await userSchema.findOne({ where: { userId } });

    if (!userData) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.notFound, "User not found")
        );
    }

    const userBalance = await user_Balance(userId, true);

    const balance = userBalance?.[0]?.[0]?.UserBalance ?? 0;

    const exposureList = userBalance?.[1] ?? [];

    const marketListExposure = exposureList.map((exposure) => ({
      [exposure.MarketId]: exposure.exposure,
    }));

    const getBalance = {
      walletId: userData.walletId,
      balance,
      marketListExposure,
    };

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(getBalance, true, statusCode.success, "success")
      );
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

// done
export const transactionDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const { count, rows: transactionData } =
      await transactionRecord.findAndCountAll({
        where: { userId },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: [["createdAt", "DESC"]],
      });

    if (count === 0) {
      throw apiResponseErr(
        null,
        statusCode.badRequest,
        false,
        "User Not Found or No Transactions Found"
      );
    }

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginationData = apiResponsePagination(page, totalPages, totalItems);

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          transactionData,
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
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};
// done
export const filterMarketData = async (req, res) => {
  try {
    const marketId = req.params.marketId;
    const userId = req.body?.userId;

    // Fetch market data
    const marketDataRows = await Market.findAll({
      where: {
        marketId,
        hideMarketWithUser: true,
        isVoid: false,
        announcementResult: false,
      },
      include: [
        {
          model: Runner,
          required: false,
        },
      ],
    });

    console.log("Market Data Rows:", marketDataRows);

    // const currentTime = getISTTime();

    // await Market.update(
    //   { isActive: false },
    //   {
    //     where: {
    //       [Op.or]: [
    //         { startTime: { [Op.gt]: currentTime } },
    //         { endTime: { [Op.lt]: currentTime } }
    //       ]
    //     },
    //   }
    // );

    // await Market.update(
    //   { isActive: true, hideMarketWithUser: false },
    //   {
    //     where: {
    //       startTime: { [Op.lte]: currentTime },
    //       endTime: { [Op.gte]: currentTime },
    //     },
    //   }
    // );

    const markets = await Market.findOne({
      where: { marketId },
    });

    if (!markets) {
      return res
        .status(statusCode.success)
        .json(
          apiResponseSuccess(
            { runners: [] },
            false,
            statusCode.success,
            "No active markets"
          )
        );
    }

    if (markets.isVoid) {
      throw new CustomError(`Market is void`, null, 0, statusPanelCodes.void);
    }

    if (!markets.hideMarketWithUser) {
      throw new CustomError(
        `Market is announcement`,
        null,
        0,
        statusPanelCodes.announcement
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

    if (userId) {
      // Fetch current orders
      const currentOrdersRows = await CurrentOrder.findAll({
        where: {
          userId,
          marketId,
          isLiveDeleted: false,
        },
      });

      // Calculate user market balance
      const userMarketBalance = {
        userId,
        marketId,
        runnerBalance: [],
      };

      marketDataObj.runners.forEach((runner) => {
        let runnerBalance = 0;
        currentOrdersRows.forEach((order) => {
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

        // Update the runner balance in marketDataObj
        runner.runnerName.bal = runnerBalance;
      });

      // Clear existing MarketBalance entries for the user and market
      const deleteResult = await MarketBalance.destroy({
        where: {
          userId,
          marketId,
        },
      });

      // Save or update the balances in MarketBalance
      for (const balance of userMarketBalance.runnerBalance) {
        await MarketBalance.create({
          userId,
          marketId,
          runnerId: balance.runnerId,
          bal: balance.bal,
        });
      }
    }

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(marketDataObj, true, statusCode.success, "Success")
      );
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message,
          error.panelStatusCode ?? statusCode.internalServerError
        )
      );
  }
};

export const createBid = async (req, res) => {
  const {
    userId,
    gameId,
    marketId,
    runnerId,
    value,
    bidType,
    marketListExposure,
  } = req.body;

  try {
    if (!userId) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "User ID is required"
      );
    }

    if (value < 0) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Bid value cannot be negative"
      );
    }

    if (value < 100) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Bid value cannot be less than 100"
      );
    }

    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "User Not Found"
      );
    }

    if (user.balance < value) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Insufficient balance. Bid cannot be placed."
      );
    }

    const game = await Game.findOne({
      where: { gameId },
      include: {
        model: Market,
        as: "Markets",
      },
    });

    if (!game) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Game Not Found"
      );
    }

    const market = game.Markets.find(
      (market) => String(market.marketId) === String(marketId)
    );
    if (!market) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Market Not Found"
      );
    }

    if (market.isRevoke) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Bid cannot be placed! Market is Suspended."
      );
    }

    const currentTime = getISTTime();

    if (currentTime < market.startTime) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Market has not opened yet."
      );
    }

    if (currentTime > market.endTime) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Market is closed."
      );
    }

    const runner = await Runner.findOne({ where: { marketId, runnerId } });
    if (!runner) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Runner Not Found"
      );
    }

    const gameName = game.gameName;
    const marketName = market.marketName;
    const runnerName = runner.runnerName;
    const userName = user.userName;

    if (bidType === "back" || bidType === "lay") {
      const adjustedRate = runner[bidType.toLowerCase()] - 1;
      const mainValue = Math.round(adjustedRate * value);
      const betAmount = bidType === "back" ? value : mainValue;

      // Create Bid
      await CurrentOrder.create({
        betId: uuidv4(),
        userId,
        userName,
        gameId,
        gameName,
        marketId,
        marketName,
        runnerId,
        runnerName,
        type: bidType,
        value,
        rate: runner[bidType.toLowerCase()],
        date: new Date(),
        bidAmount: mainValue,
      });

      if (marketListExposure && Array.isArray(marketListExposure)) {
        for (const exposureObj of marketListExposure) {
          for (const [marketId, exposureValue] of Object.entries(exposureObj)) {
            const record = await MarketListExposure.findOne({
              where: { UserId: userId, MarketId: marketId },
            });

            if (record) {
              record.exposure = exposureValue;
              await record.save();
            } else {
              await MarketListExposure.create({
                UserId: userId,
                MarketId: marketId,
                exposure: exposureValue,
              });
            }
          }
        }
      }
      await user.save();
    }

    await Runner.update({ isBidding: true }, { where: { marketId } });

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Bid placed successfully"
        )
      );
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

// done
export const getUserBetHistory = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const { gameId } = req.params;
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

    const whereCondition = {
      userId: userId,
      gameId: gameId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    };

    let model;

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
      whereCondition.isVoid = false;
      model = BetHistory;
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

    res.status(statusCode.success).send(
      apiResponseSuccess(rows, true, statusCode.success, "Success", {
        totalPages,
        pageSize,
        totalItems,
        page,
      })
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
// done
export const currentOrderHistory = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const marketId = req.params.marketId;
    // const page = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 5;

    if (!marketId) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            statusCode.badRequest,
            false,
            "Market Id is required"
          )
        );
    }

    const { rows } = await CurrentOrder.findAndCountAll({
      where: {
        userId,
        marketId,
      },
      attributes: ["runnerName", "rate", "value", "type", "bidAmount"],
      // limit,
      // offset: (page - 1) * limit,
    });

    // const totalPages = Math.ceil(count / limit);
    // const pageSize = limit;
    // const totalItems = count;
    res
      .status(statusCode.success)
      .send(apiResponseSuccess(rows, true, statusCode.success, "Success"));
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const calculateProfitLoss = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;
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

    const searchGameName = req.query.search || "";

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
        userId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["gameId", "Game.gameName"],
      offset: (page - 1) * limit,
      limit: limit,
    });
    /***********************************Previous logic************************************************************* */
    // const lotteryProfitLossData = await LotteryProfit_Loss.findAll({
    //   attributes: [
    //     [Sequelize.fn("SUM", Sequelize.col("profitLoss")), "totalProfitLoss"],
    //   ],
    //   where: {
    //     userId: userId,
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
        userId: userId,
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
        .filter(
          (item) =>
            item.dataValues.totalProfitLoss !== null &&
            item.dataValues.totalProfitLoss !== undefined &&
            item.dataValues.totalProfitLoss !== ""
        )
        .map((item) => ({
          gameName: "Lottery",
          totalProfitLoss: item.dataValues.totalProfitLoss,
        })),
    ];

    if (combinedProfitLossData.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No profit/loss data found!"
          )
        );
    }

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
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const marketProfitLoss = async (req, res) => {
  try {
    const userId = req.user.userId;
    const gameId = req.params.gameId;
    let { page = 1, limit = 10, search = "" } = req.query;
    page = Math.max(parseInt(page, 10), 1);
    limit = Math.max(parseInt(limit, 10), 1);

    const distinctMarketIds = await ProfitLoss.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("marketId")), "marketId"],
      ],
      where: { userId, gameId },
    });

    if (distinctMarketIds.length === 0) {
      return res.status(statusCode.success).send(
        apiResponseSuccess(
          [],
          true,
          statusCode.success,
          "No profit/loss data found.",
          {
            page,
            limit,
            totalItems: 0,
            totalPages: 0,
          }
        )
      );
    }

    let marketsProfitLoss = await Promise.all(
      distinctMarketIds.map(async (market) => {
        const profitLossEntries = await ProfitLoss.findAll({
          attributes: [
            "marketId",
            [
              Sequelize.literal("CAST(profitLoss AS DECIMAL(10, 2))"),
              "profitLoss",
            ],
          ],
          where: { userId, marketId: market.marketId },
        });

        if (profitLossEntries.length === 0) return null;

        const game = await Game.findOne({
          include: [
            {
              model: Market,
              where: { marketId: market.marketId },
              attributes: ["marketName"],
            },
          ],
          attributes: ["gameName"],
          where: { gameId },
        });

        if (!game || !game.Markets.length) return null;

        const gameName = game.gameName;
        const marketName = game.Markets[0].marketName;
        const totalProfitLoss = profitLossEntries.reduce(
          (acc, entry) => acc + parseFloat(entry.profitLoss),
          0
        );

        return {
          marketId: market.marketId,
          marketName,
          gameName,
          totalProfitLoss: totalProfitLoss.toFixed(2),
        };
      })
    );

    marketsProfitLoss = marketsProfitLoss.filter(Boolean);

    if (search) {
      marketsProfitLoss = marketsProfitLoss.filter((item) =>
        item.marketName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = marketsProfitLoss.length;
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      page = Math.max(totalPages, 1);
    }

    const offset = (page - 1) * limit;

    const paginatedResults = marketsProfitLoss.slice(offset, offset + limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedResults,
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

export const runnerProfitLoss = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const marketId = req.params.marketId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const searchRunnerName = req.query.search || "";

    const profitLossEntries = await ProfitLoss.findAll({
      where: {
        userId: userId,
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
          runnerName: runner.runnerName,
          runnerId: entry.runnerId,
          profitLoss: parseFloat(entry.profitLoss).toFixed(2),
          isWin: runner.isWin,
          settleTime: entry.date.toISOString(),
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

export const userMarketData = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;

    const getCurrentMarket = await CurrentOrder.findAll({
      where: { userId },
      include: [
        { model: Market, as: "market", attributes: ["marketId", "marketName"] },
      ],
    });

    const currentMarketSet = new Set();

    getCurrentMarket.forEach((item) => {
      currentMarketSet.add(
        JSON.stringify({
          marketId: item.market.marketId,
          marketName: item.market.marketName,
        })
      );
    });

    const currentMarketArray = Array.from(currentMarketSet).map((item) =>
      JSON.parse(item)
    );

    const getBetHistory = await BetHistory.findAll({
      where: { userId },
      include: [
        { model: Market, as: "market", attributes: ["marketId", "marketName"] },
      ],
    });

    const betHistorySet = new Set();

    getBetHistory.forEach((item) => {
      betHistorySet.add(
        JSON.stringify({
          marketId: item.market.marketId,
          marketName: item.market.marketName,
        })
      );
    });

    const betHistoryArray = Array.from(betHistorySet).map((item) =>
      JSON.parse(item)
    );

    const responseData = {
      currentMarket: currentMarketArray,
      betHistory: betHistoryArray,
    };

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(responseData, true, statusCode.success, "Success")
      );
  } catch (error) {
    console.error("Error fetching user market data:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const userBetHistoryGames = async (req, res) => {
  try {
    const distinctGames = await BetHistory.findAll({
      attributes: ["gameId", "gameName"],
      group: ["gameId", "gameName"],
    });

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(distinctGames, true, statusCode.success, "Success")
      );
  } catch (error) {
    console.error("Error fetching user market data:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const accountStatement = async (req, res) => {
  try {
    const userName = req.user.userName;
    const { page = 1, pageSize = 10, startDate, endDate } = req.query;
    const dataType = req.query.dataType;

    const params = {
      userName,
      startDate,
      endDate,
      pageSize,
      page,
      dataType,
    };
    const baseURL = process.env.WHITE_LABEL_URL;
    const response = await axios.get(
      `${baseURL}/api/user-colorGame-account-statement/${userName}`,
      { params }
    );
    if (!response.data.success) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Failed to fetch data"
          )
        );
    }

    const { data, pagination } = response.data;

    const paginationData = {
      page: pagination?.page || page,
      totalPages: pagination?.totalPages || 1,
      totalItems: pagination?.totalItems || data.length,
      limit: pagination?.limit,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          data,
          true,
          statusCode.success,
          "Success",
          paginationData
        )
      );
  } catch (error) {
    console.error(
      "Error from API:",
      error.response ? error.response.data : error.message
    );
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

export const getUserBetList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;

    const user = req.user;
    const userId = user.userId;
    const runnerId = req.params.runnerId;

    const whereClause = {
      userId: userId,
      runnerId: runnerId,
    };

    if (search) {
      whereClause[Op.or] = [{ marketName: { [Op.like]: `%${search}%` } }];
    }

    const rows = await BetHistory.findAll({
      where: whereClause,
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

    const offset = (page - 1) * pageSize;
    const totalItems = rows.length;
    const getallData = rows.slice(offset, offset + pageSize);
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationData = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          getallData,
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

export const getUserCurrentOrderGames = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;

    const distinctGames = await CurrentOrder.findAll({
      where: { userId },
      attributes: ["marketId", "marketName"],
      group: ["marketId", "marketName"],
    });

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(distinctGames, true, statusCode.success, "Success")
      );
  } catch (error) {
    console.error("Error fetching user market data:", error);
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const activityLog = async (req, res) => {
  try {
    const user = req.user;
    const loginDateTime = user.lastLoginTime;
    const loginStatus = user.loginStatus;
    let clientIP = req.ip;
    const forwardedFor = req.headers["x-forwarded-for"];
    if (forwardedFor) {
      const forwardedIps = forwardedFor.split(",");
      clientIP = forwardedIps[0].trim();
    }
    const data = await fetch(`http://ip-api.com/json/${clientIP}`);
    const collect = await data.json();

    const logData = {
      loginDateTime,
      loginStatus,
      ip: {
        iP: clientIP,
        country: collect.country,
        region: collect.regionName,
        timezone: collect.timezone,
        isp: collect.isp,
      },
    };

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          logData,
          true,
          statusCode.success,
          "Login activity logged successfully."
        )
      );
  } catch (error) {
    res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const userActiveInactive = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, locked } = req.body;

    const existingUser = await userSchema.findOne({ where: { userId } });

    if (!existingUser || existingUser.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "No user found!.")
        );
    }

    if (isActive === true) {
      existingUser.isActive = true;
      existingUser.locked = true;
    } else if (isActive === false) {
      if (locked === false) {
        existingUser.locked = false;
        existingUser.isActive = false;
      } else {
        existingUser.isActive = false;
        existingUser.locked = true;
      }
    }

    existingUser.save();

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          existingUser,
          true,
          statusCode.success,
          "User update successfully."
        )
      );
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          error.data ?? null,
          false,
          error.responseCode ?? statusCode.internalServerError,
          error.errMessage ?? error.message
        )
      );
  }
};

export const profitLoss = async (req, res) => {
  try {
    const { dataType } = req.query;
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
    const [sportsUsers, lotteryUsers] = await Promise.all([
      ProfitLoss.findAll({
        attributes: ["userId", "userName"],
        group: ["userId", "userName"],
        raw: true,
      }),
      LotteryProfit_Loss.findAll({
        attributes: ["userId", "userName"],
        group: ["userId", "userName"],
        raw: true,
      }),
    ]);

    const allUsersMap = new Map();
    [...sportsUsers, ...lotteryUsers].forEach((user) => {
      if (!allUsersMap.has(user.userId)) {
        allUsersMap.set(user.userId, {
          userId: user.userId,
          userName: user.userName || "Unknown",
        });
      }
    });
    const allUsers = Array.from(allUsersMap.values());

    const usersWithProfitLoss = await Promise.all(
      allUsers.map(async (user) => {
        const [sportsRecords, lotteryRecords] = await Promise.all([
          ProfitLoss.findAll({
            where: {
              userId: user.userId,
              date: {
                [Op.between]: [startDate, endDate],
              },
            },
            attributes: ["marketId", "profitLoss"],
            raw: true,
          }),
          LotteryProfit_Loss.findAll({
            where: {
              userId: user.userId,
              date: {
                [Op.between]: [startDate, endDate],
              },
            },
            attributes: ["marketId", "profitLoss"],
            raw: true,
          }),
        ]);

        const getUniqueMarketProfitLoss = (records) => {
          const marketMap = new Map();
          records.forEach((record) => {
            if (!marketMap.has(record.marketId)) {
              marketMap.set(record.marketId, record.profitLoss);
            }
          });
          return Array.from(marketMap.values()).reduce(
            (sum, val) => sum + parseFloat(val),
            0
          );
        };

        const sportsTotal =
          sportsRecords.length > 0
            ? getUniqueMarketProfitLoss(sportsRecords)
            : 0;
        const lotteryTotal =
          lotteryRecords.length > 0
            ? getUniqueMarketProfitLoss(lotteryRecords)
            : 0;
        const combinedTotal = sportsTotal + lotteryTotal;

        return {
          userId: user.userId,
          userName: user.userName,
          profitLoss: combinedTotal.toFixed(2),
        };
      })
    );

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          usersWithProfitLoss,
          true,
          statusCode.success,
          "Successfully fetched all users profit/loss"
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

export const calculateExternalProfitLoss = async (req, res) => {
  try {
    const { userId } = req.body;
    const { dataType, startDate, endDate } = req.query;
    const existingUsers = await userSchema.findAll({
      where: { userId },
    });
    if (!existingUsers || existingUsers.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "User not found")
        );
    }
    const userIds = existingUsers.map((user) => user.userId);
    const user = userIds.join(",");
    let datestart, dateend;
    if (startDate && endDate) {
      datestart = startDate;
      dateend = endDate;
    } else {
      datestart = null;
      dateend = null;
    }
    const [results] = await sql.query(`CALL calculateProfitLoss(?, ?, ?, ?)`, [
      user,
      dataType,
      datestart,
      dateend,
    ]);
    const data = results[0];
    return res.status(statusCode.success).send(data);
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const getExternalTotalProfitLoss = async (req, res) => {
  try {
    const { userId } = req.body;
    const { type, dataType, startDate, endDate } = req.query;
    const existingUsers = await userSchema.findAll({ where: { userId } });
    if (!existingUsers || existingUsers.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "User not found")
        );
    }

    const userIds = existingUsers.map((user) => user.userId);
    const user = userIds.join(",");

    let datestart, dateend;
    if (startDate && endDate) {
      datestart = startDate;
      dateend = endDate;
    } else {
      datestart = null;
      dateend = null;
    }

    const [response] = await sql.query(
      "CALL calculateMarketWiseProfitLoss(?,?,?,?,?)",
      [user, dataType, type, datestart, dateend]
    );

    const data = response[0];
    return res.status(statusCode.success).send(data);
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const getAllUserTotalProfitLoss = async (req, res) => {
  try {
    const { userId } = req.body;
    const { marketId } = req.params;
    const { dataType, startDate, endDate } = req.query;

    const existingUsers = await userSchema.findAll({ where: { userId } });
    if (!existingUsers || existingUsers.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "User not found")
        );
    }

    const userIds = existingUsers.map((user) => user.userId);
    const user = userIds.join(",");

    let datestart, dateend;
    if (startDate && endDate) {
      datestart = startDate;
      dateend = endDate;
    } else {
      datestart = null;
      dateend = null;
    }

    const [response] = await sql.query(
      "CALL getAllUserTotalProfitLoss(?,?,?,?,?)",
      [user, dataType, marketId, datestart, dateend]
    );

    const data = response[0];

    return res.status(statusCode.success).send(data);
  } catch (error) {
    console.log("error", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const updateFCMToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fcm_token } = req.body;

    if(!fcm_token)
    {
        return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Fcm token not found!"));
    }

    const user = await userSchema.findAll({
      where: { userId }
    });

    if (!user) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess([], true, statusCode.success, "User not found"));
    }

    const [updatedRows] = await userSchema.update({
      fcm_token: fcm_token
    },
      { where: { userId } }
    )

    if (updatedRows === 0) {
          return res.status(statusCode.success).send(apiResponseSuccess([], true, statusCode.success, "FCM token Not update!"));
    }

    return res.status(statusCode.success).send(apiResponseSuccess(updatedRows, true, statusCode.success, "FCM token updated successfully"));
  } catch (error) {
    console.error('Error updating FCM token:', error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "User not found")
        );
    }

    const notifications = await Notification.findAll({
      where: { UserId: user.userId },
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          notifications,
          true,
          statusCode.success,
          "User notifications fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};

export const getInPlayMarket = async (req, res) => {
  try {
    const existingMarket = await Market.findAll({
      attributes: [
        "gameId",
        "marketId",
        "marketName",
        "hotGame",
        "isActive",
        "hideMarketWithUser",
        "startTime",
        "endTime",
      ],
      where: {
        isActive: true,
        hideMarketWithUser: true,
      },
      include: [
        {
          model: Game,
          attributes: ["gameId", "gameName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!existingMarket || existingMarket.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No in-play markets found"
          )
        );
    }

    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/user/in-play-market`);
    const data = response.data?.data;

    if (!data) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No in-play markets found"
          )
        );
    }

    const gameMap = new Map();

    for (const apiGame of data) {
      const gameName = apiGame.gameName;

      if (!gameMap.has(gameName)) {
        gameMap.set(gameName, {
          gameName: gameName,
          markets: [],
        });
      }

      gameMap.get(gameName).markets.push({
        marketId: apiGame.marketId,
        marketName: apiGame.marketName,
        hotGame: apiGame.hotGame,
        isActive: apiGame.isActive,
        inactiveGame: apiGame.inactiveGame,
        start_Time: apiGame.start_Time,
        end_Time: apiGame.end_Time,
      });
    }

    for (const item of existingMarket) {
      const market = item.toJSON();
      const gameId = market.gameId;

      if (!gameMap.has(gameId)) {
        gameMap.set(gameId, {
          gameName: market.Game?.gameName || "Unknown",
          markets: [],
        });
      }

      gameMap.get(gameId).markets.push({
        marketId: market.marketId,
        marketName: market.marketName,
        hotGame: market.hotGame,
        isActive: market.isActive,
        startTime: market.startTime,
        endTime: market.endTime,
        createdAt: market.createdAt,
        updatedAt: market.updatedAt,
      });
    }

    for (const gameEntry of gameMap.values()) {
      const hotGames = gameEntry.markets.filter(
        (market) => market.hotGame === true
      );
      const nonHotGames = gameEntry.markets.filter(
        (market) => market.hotGame !== true
      );
      gameEntry.markets = [...hotGames, ...nonHotGames];
    }

    const finalData = Array.from(gameMap.values());

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          finalData,
          true,
          statusCode.success,
          "In-play market fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching in-play market:", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
};


export const updateNotificationRead = async (req,res) => {
  try {

    const { userId } = req.user;
    const { isRead } = req.body;

    const existingData = await Notification.findAll({
      where: { UserId: userId, isRead: false },
    });

    if (!existingData || existingData.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "No unread notifications found"
          )
        );
    }

    await Notification.update(
      { isRead: isRead },
      { where: { UserId: userId, isRead: false } }
    );

     const marketLottery = db.collection("color-game-notification").doc(userId);

        await marketLottery.set(
          {
            //isRead: isRead,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );


      const marketColorGame = db.collection("lottery-notification").doc(userId);

        await marketColorGame.set(
          {
            //isRead: isRead,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Notifications marked as read"
        )
      );
  } catch (error) {
    console.error("Error fetching in-play market:", error);
    return res
      .status(statusCode.internalServerError)
      .send(
        apiResponseErr(
          null,
          false,
          error.responseCode || statusCode.internalServerError,
          error.errMessage || error.message
        )
      );
  }
}
