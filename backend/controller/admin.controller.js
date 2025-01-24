import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  apiResponseErr,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import { statusCode } from "../helper/statusCodes.js";
import admins from "../models/admin.model.js";
import { string } from "../constructor/string.js";
import marketSchema from "../models/market.model.js";
import userSchema from "../models/user.model.js";
import Sequelize from "../db.js";
import transactionRecord from "../models/transactionRecord.model.js";
import Runner from "../models/runner.model.js";
import Market from "../models/market.model.js";
import MarketBalance from "../models/marketBalance.js";
import ProfitLoss from "../models/profitLoss.js";
import CurrentOrder from "../models/currentOrder.model.js";
import BetHistory from "../models/betHistory.model.js";
import { Op } from "sequelize";
import axios from "axios";
import Game from "../models/game.model.js";
import InactiveGame from "../models/inactiveGame.model.js";
import CustomError from "../helper/extendError.js";
import { PreviousState } from "../models/previousState.model.js";
import sequelize from "../db.js";

dotenv.config();
const globalName = [];
// done
export const createAdmin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const existingAdmin = await admins.findOne({ where: { userName } });

    if (existingAdmin) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Admin already exists"
          )
        );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await admins.create({
      adminId: uuidv4(),
      userName,
      password: hashedPassword,
      roles: string.Admin,
    });

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.create,
          "Admin created successfully"
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

export const getAllUsers = async (req, res) => {
  try {
    // Destructure with defaults
    let { page = 1, pageSize = 10, search = "" } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (page < 1 || pageSize < 1) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Invalid pagination parameters")
      );
    }

    const searchQuery = search.toLowerCase();

    const totalItems = await userSchema.count({
      where: {
        userName: { [Op.like]: `%${searchQuery}%` },
      },
    });

    if (totalItems === 0) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "data not found")
      );
    }

    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;

    const users = await userSchema.findAll({
      where: {
        userName: { [Op.like]: `%${searchQuery}%` },
      },
      limit: pageSize,
      offset: offset,
    });

    const paginationData = {
      page,
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          users,
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
          error.message,
        )
      );
  }
};
// Done
export const deposit = async (req, res) => {
  try {
    const { adminId, depositAmount } = req.body;

    const existingAdmin = await admins.findOne({ where: { adminId } });

    if (!existingAdmin) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.notFound, "Admin Not Found")
        );
    }

    const parsedDepositAmount = parseFloat(depositAmount);

    await existingAdmin.increment("balance", { by: parsedDepositAmount });

    const updatedAdmin = await admins.findOne({ where: { adminId } });

    if (!updatedAdmin) {
      throw new Error("Failed to fetch updated admin");
    }

    const newAdmin = {
      adminId: updatedAdmin.adminId,
      walletId: updatedAdmin.walletId,
      balance: updatedAdmin.balance,
    };

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          newAdmin,
          true,
          statusCode.create,
          "Deposit balance successful"
        )
      );
  } catch (error) {
    console.error("Error depositing balance:", error);
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
export const sendBalance = async (req, res) => {
  try {
    const { balance, adminId, userId } = req.body;

    const admin = await admins.findOne({ where: { adminId } });
    if (!admin) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Admin Not Found")
        );
    }

    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "User Not Found")
        );
    }

    const parsedDepositAmount = parseFloat(balance);
    if (isNaN(parsedDepositAmount)) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Invalid Balance")
        );
    }

    if (admin.balance < parsedDepositAmount) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Insufficient Balance For Transfer"
          )
        );
    }

    await Sequelize.transaction(async (t) => {
      await admins.update(
        { balance: Sequelize.literal(`balance - ${parsedDepositAmount}`) },
        { where: { adminId }, transaction: t }
      );

      await userSchema.update(
        {
          balance: Sequelize.literal(`balance + ${parsedDepositAmount}`),
          walletId: user.walletId,
        },
        { where: { userId }, transaction: t }
      );

      await transactionRecord.create(
        {
          userId,
          transactionType: "credit",
          amount: parsedDepositAmount,
          date: Date.now(),
        },
        { transaction: t }
      );
    });

    const successResponse = {
      userId,
      balance: user.balance,
      walletId: user.walletId,
    };
    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.create,
          "Send balance to User successful"
        )
      );
  } catch (error) {
    console.error("Error sending balance:", error);
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

// Authenticate by user Password

export const updateByAdmin = async (req, res) => {
  try {
    const {
      amount,
      userId,
      transactionId,
      transactionType,
      date,
      remarks,
      transferFromUserAccount,
      transferToUserAccount,
      userName
    } = req.body;

    console.log("req.body", req.body)

    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "User Not Found")
        );
    }

    const createTransaction = await transactionRecord.create({
      userId: userId,
      transactionId: transactionId,
      transactionType: transactionType,
      amount: amount,
      date: date,
      remarks: remarks,
      userName: userName,
      transferFromUserAccount: transferFromUserAccount,
      transferToUserAccount: transferToUserAccount,
    });

    if (!createTransaction) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Failed to create transaction"
          )
        );
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Balance updated successful"
        )
      );
  } catch (error) {
    console.error("Error sending balance:", error);
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

export const buildRootPath = async (req, res) => {
  try {
    const { action } = req.params;
    const { id } = req.query;
    let data;

    // Find data based on the id
    data = await Game.findOne({ where: { gameId: id } }) ||
      await Market.findOne({ where: { marketId: id } }) ||
      await Runner.findOne({ where: { runnerId: id } });

    if (!data) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Data not found for the specified criteria")
      );
    }

    const entityName = data instanceof Game ? data.gameName
      : data instanceof Market ? data.marketName
        : data.runnerName;

    // Map name to identifier in an array format
    const nameIdMap = globalName.map(item => ({ name: item.name, id: item.id }));

    if (action === "store") {
      const newPath = { name: entityName, id };
      const indexToRemove = globalName.findIndex(item => item.id === newPath.id);

      if (indexToRemove !== -1) {
        globalName.splice(indexToRemove + 1); // Remove elements after the found index
      } else {
        globalName.push(newPath); // Add new path
      }

      // Update user's path
      await data.update({ path: JSON.stringify(globalName) });

      return res.status(statusCode.success).send(
        apiResponseSuccess(globalName, true, statusCode.success, "Path stored successfully")
      );
    } else if (action === "clear") {
      const lastItem = globalName.pop();

      if (lastItem) {
        const indexToRemove = globalName.findIndex(item => item.id === lastItem.id);

        if (indexToRemove !== -1) {
          globalName.splice(indexToRemove, 1); // Remove specific element
        }
      }
    } else if (action === "clearAll") {
      globalName.length = 0; // Clear the entire array
    } else {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Invalid action provided")
      );
    }

    // Update user's path after clear or clearAll actions
    await data.update({ path: JSON.stringify(globalName) });

    const successMessage = action === "store" ? "Path stored successfully" : "Path cleared successfully";
    return res.status(statusCode.success).send(
      apiResponseSuccess(globalName, true, statusCode.success, successMessage)
    );
  } catch (error) {
    console.error('Error occurred:', error); // Log error for debugging
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const storePreviousState = async (
  user,
  marketId,
  runnerId,
  gameId,
  runnerBalanceValue
) => {
  // Fetch all runner balances for the given market and user
  const allRunnerBalances = await MarketBalance.findAll({
    where: { marketId, userId: user.userId },
    attributes: ['runnerId', 'bal']
  });

  // Convert the runner balances to an object
  const allRunnerBalancesObj = {};
  allRunnerBalances.forEach((item) => {
    allRunnerBalancesObj[item.runnerId] = Number(item.bal);
  });

  const balance = await user_Balance(user.userId)
  // Create the previous state object
  const previousState = {
    userId: user.userId,
    marketId: marketId,
    runnerId: runnerId,
    gameId: gameId,
    balance: balance,
    marketListExposure: JSON.stringify(user.marketListExposure),
    runnerBalance: runnerBalanceValue,
    allRunnerBalances: JSON.stringify(allRunnerBalancesObj),
    isReverted: false,
  };

  // Save the previous state
  await PreviousState.create(previousState);
};

export const afterWining = async (req, res) => {
  try {
    const { marketId, runnerId, isWin } = req.body;
    let gameId = null;

    const market = await Market.findOne({
      where: { marketId },
      include: [{ model: Runner, required: false }],
    });

    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Market not found")
        );
    }

    gameId = market.gameId;

    // Update market runners with win status
    if (market.runners) {
      market.runners.forEach((runner) => {
        runner.isWin = String(runner.runnerId) === runnerId ? isWin : false;
      });
    }

    if (isWin) {
      const runners = await Runner.findAll({ where: { runnerId } });
      for (const runner of runners) {
        runner.isWin = true;
        await runner.save();
      }
      market.announcementResult = true;
    }
    await market.save();

    // Fetch users and previous state data
    const users = await MarketBalance.findAll({ where: { marketId } });
    const previousStateUsers = await PreviousState.findAll({ where: { marketId } });

    let message = "";

    if (market.isRevoke) {
      for (const user of previousStateUsers) {
        try {
          let allRunnerBalances = JSON.parse(user.allRunnerBalances);

          const runnerBalance = allRunnerBalances[runnerId];

          if (runnerBalance) {
            const userDetails = await userSchema.findOne({
              where: { userId: user.userId },
            });

            if (userDetails) {
              await storePreviousState(
                userDetails,
                marketId,
                runnerId,
                gameId,
                Number(runnerBalance)
              );

              const marketExposureEntry = userDetails.marketListExposure.find(
                (item) => Object.keys(item)[0] === marketId
              );

              if (marketExposureEntry) {
                const marketExposureValue = Number(marketExposureEntry[marketId]);
                const runnerBalanceValue = Number(runnerBalance);

                if (isWin) {
                  userDetails.balance += runnerBalanceValue + marketExposureValue;
                }

                await ProfitLoss.create({
                  userId: user.userId,
                  userName: userDetails.userName,
                  gameId,
                  marketId,
                  runnerId,
                  date: new Date(),
                  profitLoss: runnerBalanceValue,
                });

                userDetails.marketListExposure =
                  userDetails.marketListExposure.filter(
                    (item) => Object.keys(item)[0] !== marketId
                  );

                await userSchema.update(
                  { marketListExposure: userDetails.marketListExposure },
                  { where: { userId: user.userId } }
                );

                await userDetails.save();

                const marketExposure = userDetails.marketListExposure;

                let totalExposure = 0;
                marketExposure.forEach(market => {
                  const exposure = Object.values(market)[0];
                  totalExposure += exposure;
                });

                // const dataToSend = {
                //   amount: userDetails.balance,
                //   userId: user.userId,
                //   exposure: marketExposure
                // };
                // const baseURL = process.env.WHITE_LABEL_URL;
                // const { data: response } = await axios.post(
                //   `${baseURL}/api/admin/extrnal/balance-update`,
                //   dataToSend
                // );

                // message = response.success ? "Sync data successful" : "Sync not successful";

                await MarketBalance.destroy({
                  where: { marketId, runnerId, userId: user.userId },
                });
              } else {
                console.error(`Market exposure not found for marketId ${marketId}`);
              }
            } else {
              console.error(`User details not found for userId ${user.userId}`);
            }
          } else {
            console.error(`Runner balance not found for marketId ${marketId} and runnerId ${runnerId}`);
          }
        } catch (error) {
          console.error("Error processing user:", error);
        }
      }
    } else {
      for (const user of users) {
        try {
          const runnerBalance = await MarketBalance.findOne({
            where: { marketId, runnerId, userId: user.userId },
          });

          if (runnerBalance) {
            const userDetails = await userSchema.findOne({
              where: { userId: user.userId },
            });

            if (userDetails) {
              await storePreviousState(
                userDetails,
                marketId,
                runnerId,
                gameId,
                Number(runnerBalance.bal)
              );

              const marketExposureEntry = userDetails.marketListExposure.find(
                (item) => Object.keys(item)[0] === marketId
              );
              if (marketExposureEntry) {
                const marketExposureValue = Number(marketExposureEntry[marketId]);
                const runnerBalanceValue = Number(runnerBalance.bal);
                let updateBalance

                if (isWin) {
                  updateBalance = runnerBalanceValue + marketExposureValue;
                }
                console.log("updateBalance", updateBalance)
                await user_Balance(userDetails.userId, updateBalance)

                await ProfitLoss.create({
                  userId: user.userId,
                  userName: userDetails.userName,
                  gameId,
                  marketId,
                  runnerId,
                  date: new Date(),
                  profitLoss: runnerBalanceValue,
                });

                userDetails.marketListExposure =
                  userDetails.marketListExposure.filter(
                    (item) => Object.keys(item)[0] !== marketId
                  );

                await userSchema.update(
                  { marketListExposure: userDetails.marketListExposure },
                  { where: { userId: user.userId } }
                );

                await userDetails.save();

                const marketExposure = userDetails.marketListExposure;
                let totalExposure = 0;
                marketExposure.forEach(market => {
                  const exposure = Object.values(market)[0];
                  totalExposure += exposure;
                });

                // const dataToSend = {
                //   amount: userDetails.balance,
                //   userId: userDetails.userId,
                //   exposure: totalExposure
                // };
                // const baseURL = process.env.WHITE_LABEL_URL;
                // const { data: response } = await axios.post(
                //   `${baseURL}/api/admin/extrnal/balance-update`,
                //   dataToSend
                // );

                // message = response.success ? "Sync data successful" : "Sync not successful";

                await MarketBalance.destroy({
                  where: { marketId, runnerId, userId: user.userId },
                });
              } else {
                console.error(`Market exposure not found for marketId ${marketId}`);
              }
            } else {
              console.error(`User details not found for userId ${user.userId}`);
            }
          } else {
            console.error(`Runner balance not found for marketId ${marketId} and runnerId ${runnerId}`);
          }
        } catch (error) {
          console.error("Error processing user:", error);
        }
      }
    }

    if (isWin) {
      const orders = await CurrentOrder.findAll({ where: { marketId } });

      for (const order of orders) {
        await BetHistory.create({
          betId: order.betId,
          userId: order.userId,
          userName: order.userName,
          gameId: order.gameId,
          gameName: order.gameName,
          marketId: order.marketId,
          marketName: order.marketName,
          runnerId: order.runnerId,
          runnerName: order.runnerName,
          rate: order.rate,
          value: order.value,
          type: order.type,
          date: new Date(),
          matchDate: order.date,
          bidAmount: order.bidAmount,
          isWin: order.isWin,
          profitLoss: order.profitLoss,
          placeDate: order.createdAt
        });
      }

      await CurrentOrder.destroy({ where: { marketId } });
    }

    await Market.update(
      {
        isRevoke: false,
        hideMarketUser: true,
        hideRunnerUser: true,
        hideMarket: true,
        hideRunner: true,
      },
      { where: { marketId } }
    );

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Success" + " " + message
        )
      );
  } catch (error) {
    console.error("Error sending balance:", error);
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

export const revokeWinningAnnouncement = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { marketId, runnerId } = req.body;

    const previousStates = await PreviousState.findAll({
      where: { marketId, runnerId },
      transaction,
    });

    for (const prevState of previousStates) {
      const user = await userSchema.findOne({
        where: { userId: prevState.userId },
        transaction,
      });

      if (user) {
        user.marketListExposure = JSON.parse(prevState.marketListExposure);
        const allRunnerBalances = JSON.parse(prevState.allRunnerBalances);
        const runnerBalance = allRunnerBalances[runnerId];
        const marketExposureEntry = user.marketListExposure.find(
          (item) => Object.keys(item)[0] === marketId
        );
        const marketExposureValue = Number(marketExposureEntry[marketId]);
        console.log("market exposure value", marketExposureValue)
        if (runnerBalance > 0) {
          user.balance -= Number(runnerBalance + marketExposureValue);
        }

        const marketExposure = user.marketListExposure;

        let totalExposure = 0;
        marketExposure.forEach(market => {
          const exposure = Object.values(market)[0];
          totalExposure += exposure;
        });

        const dataToSend = {
          amount: user.balance,
          userId: user.userId,
          exposure: totalExposure
        };
        const baseURL = process.env.WHITE_LABEL_URL;
        await axios.post(
          `${baseURL}/api/admin/extrnal/balance-update`,
          dataToSend
        );

        for (const [runnerId, balance] of Object.entries(allRunnerBalances)) {
          try {
            let runnerBalance = await MarketBalance.findOne({
              where: { marketId, runnerId, userId: user.userId },
              transaction,
            });

            if (runnerBalance) {
              runnerBalance.bal = balance.toString();
              await runnerBalance.save({ transaction });
            } else {
              await MarketBalance.create(
                {
                  marketId,
                  runnerId,
                  userId: user.userId,
                  bal: balance.toString(),
                },
                { transaction }
              );
            }
          } catch (error) {
            console.error("Error processing runner balance:", error);
          }
        }

        await user.save({ transaction });
      } else {
        console.log("User Not Found for userId:", prevState.userId);
      }
    }
    await PreviousState.update(
      { isReverted: true },
      { where: { marketId, runnerId }, transaction }
    );

    await Market.update(
      {
        isRevoke: true,
        isActive: false,
        hideMarketUser: false,
        hideMarket: false,
      },
      { where: { marketId }, transaction }
    );

    await Runner.update(
      { hideRunnerUser: false, hideRunner: false, isWin: false, isBidding: true , clientMessage : false },
      { where: { runnerId }, transaction }
    );

    await transaction.commit();

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Winning announcement revoked successfully"
        )
      );
  } catch (error) {
    await transaction.rollback();
    console.error("Error revoking winning announcement:", error);
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
export const checkMarketStatus = async (req, res) => {
  const marketId = req.params.marketId;
  const { status } = req.body;

  try {
    const market = await Market.findOne({ where: { marketId } });

    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Market not found")
        );
    }

    await Market.update(
      { hideMarketUser: false, isRevoke: false },
      { where: { marketId } }
    );

    await PreviousState.destroy({
      where: { marketId },
    });

    market.isActive = status;
    await market.save();

    // if (status === true) {
    //   if (market.endTime) {
    //     startMarketCountdown(market);
    //   } else {
    //     throw new CustomError('Market end time is not set.', null, statusCode.badRequest)
    //   }
    // }

    const statusMessage = status ? "Market is active" : "Market is suspended";
    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          statusMessage
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

export const liveUsersBet = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { rows: currentOrders, count: totalItems } = await CurrentOrder.findAndCountAll({
      where: { marketId },
      attributes: [
        'userId',
        'userName',
        'marketId',
        'marketName',
        'runnerId',
        'runnerName',
        'rate',
        'value',
        'type',
        'bidAmount',
        'betId',
      ],
      limit,
      offset,
      raw: true,
    });

    if (currentOrders.length === 0) {
      return res.status(statusCode.success).send(
        apiResponseSuccess([], true, statusCode.success, "No orders found for this MarketId")
      );
    }

    const formattedOrders = currentOrders.map((order) => ({
      betId: order.betId,
      userId: order.userId,
      userName: order.userName,
      marketId: order.marketId,
      marketName: order.marketName,
      runnerId: order.runnerId,
      runnerName: order.runnerName,
      rate: order.rate,
      value: order.value,
      type: order.type,
      bidAmount: order.bidAmount,
    }));

    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages,
      totalItems,
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(
        formattedOrders,
        true,
        statusCode.success,
        "Success",
        pagination
      )
    );
  } catch (error) {
    console.error("Error fetching market data:", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getUsersLiveBetGames = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.query;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const where_clause = search
      ? {
          [Op.or]: [
            { userName: { [Op.like]: `%${search}%` } },
            { marketName: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: currentOrders } = await CurrentOrder.findAndCountAll({
      attributes: ["gameId", "gameName", "marketId", "marketName", "userName"],
      where : where_clause,
      raw: true,
    });

    if (!currentOrders || currentOrders.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "No data found.")
        );
    }

    // Remove duplicates by creating a Map with unique keys based on gameId and marketId
    const uniqueOrders = Array.from(
      new Map(
        currentOrders.map((order) => [
          `${order.gameId}-${order.marketId}`,
          order,
        ])
      ).values()
    );

    const paginatedUniqueOrders = uniqueOrders.slice(offset, offset + limit);

    const liveGames = paginatedUniqueOrders.map((order) => ({
      gameId: order.gameId,
      gameName: order.gameName,
      marketId: order.marketId,
      marketName: order.marketName,
      userName : order.userName
    }));

    const totalPages = Math.ceil(uniqueOrders.length / limit);

    const pagination = {
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages,
      totalItems: uniqueOrders.length,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(liveGames, true, statusCode.success, "Success", pagination)
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

export const getBetsAfterWin = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const where_clause = {
      marketId: marketId,
    };

    if (search) {
      where_clause[Op.or] = [
        { userName: { [Op.like]: `%${search}%` } },
        { marketName: { [Op.like]: `%${search}%` } },
        { runnerName: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await BetHistory.findAndCountAll({
      where: where_clause,
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
        "matchDate",
        "placeDate",
      ],
      limit: parseInt(pageSize, 10),
      offset,
    });

    const totalPages = Math.ceil(count / parseInt(pageSize, 10));
    const totalItems = count;

    res
      .status(statusCode.success)
      .send(
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

export const getBetMarketsAfterWin = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.query;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { rows: betHistoryOrders } = await BetHistory.findAndCountAll({
      attributes: ["gameId", "gameName", "marketId", "marketName", "userName"],
      raw: true,
    });

    if (!betHistoryOrders || betHistoryOrders.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "No data found.")
        );
    }

    const filteredOrders = search
      ? betHistoryOrders.filter(
          (order) =>
            order.gameName?.toLowerCase().includes(search.toLowerCase()) ||
            order.marketName?.toLowerCase().includes(search.toLowerCase())
        )
      : betHistoryOrders;

    if (filteredOrders.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "No data match search criteria.")
        );
    }

    // Remove duplicates by creating a Map with unique keys based on gameId and marketId
    const uniqueOrders = Array.from(
      new Map(
        filteredOrders.map((order) => [
          `${order.gameId}-${order.marketId}`,
          order,
        ])
      ).values()
    );

    const paginatedUniqueOrders = uniqueOrders.slice(offset, offset + limit);

    const liveGames = paginatedUniqueOrders.map((order) => ({
      gameId: order.gameId,
      gameName: order.gameName,
      marketId: order.marketId,
      marketName: order.marketName,
      userName: order.userName
    }));

    const totalPages = Math.ceil(uniqueOrders.length / limit);

    const pagination = {
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages,
      totalItems: uniqueOrders.length,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(liveGames, true, statusCode.success, "Success", pagination)
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

export const user_Balance = async (userId, getBalance) => {
  try {
    let balance = 0;
    const user_transactions = await transactionRecord.findAll({
      where: { userId },
    });

    for (const transaction of user_transactions) {
      if (transaction.transactionType === 'credit') {
        balance += parseFloat(transaction.amount);
      }
      if (transaction.transactionType === 'withdrawal') {
        balance -= parseFloat(transaction.amount);
      }
    }

    const getExposure = await userSchema.findOne({ where: { userId } })
    const exposure = getExposure.marketListExposure

    if (Array.isArray(exposure)) {
      for (const item of exposure) {
        const exposureValue = Object.values(item)[0];
        balance -= parseFloat(exposureValue);
      }
    }

    console.log("getBalance..2", (balance + getBalance))
    if (getBalance) {
      balance += parseFloat(getBalance);
    }


    return balance;
  } catch (error) {
    throw new Error(`Error calculating balance: ${error.message}`);
  }
};