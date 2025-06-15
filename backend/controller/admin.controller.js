import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  apiResponseErr,
  apiResponsePagination,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import { statusCode } from "../helper/statusCodes.js";
import admins from "../models/admin.model.js";
import { string } from "../constructor/string.js";
import userSchema from "../models/user.model.js";
import transactionRecord from "../models/transactionRecord.model.js";
import Runner from "../models/runner.model.js";
import Market from "../models/market.model.js";
import MarketBalance from "../models/marketBalance.js";
import ProfitLoss from "../models/profitLoss.js";
import CurrentOrder from "../models/currentOrder.model.js";
import BetHistory from "../models/betHistory.model.js";
import { Op, Sequelize } from "sequelize";
import Game from "../models/game.model.js";
import { PreviousState } from "../models/previousState.model.js";
import { sequelize } from "../db.js";
import WinningAmount from "../models/winningAmount.model.js";
import ResultRequest from "../models/resultRequest.model.js";
import ResultHistory from "../models/resultHistory.model.js";
import { db } from "../firebase-db.js";
import MarketListExposure from "../models/marketListExposure.model.js";
import AllRunnerBalance from "../models/allRunnerBalances.model.js";
import { sql } from "../db.js";
import { deleteLotteryFromFirebase } from "../helper/firebase.delete.js";
import NotificationService from "../utils/notification_service.js";
import Notification from "../models/notification.model.js";


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
          newAdmin,
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

export const createSubAdmin = async (req, res) => {
  try {

    const { userName, password, permissions } = req.body;
    const existingAdmin = await admins.findOne({ where: { userName } });

    if (existingAdmin) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Username already exist!"
          )
        );
    }

    const formattedPermissions = Array.isArray(permissions)
      ? permissions.join(",")
      : "";
    const hashedPassword = await bcrypt.hash(password, 10);
    const subAdmin = await admins.create({
      adminId: uuidv4(),
      userName,
      password: hashedPassword,
      roles: string.subAdmin,
      permissions: formattedPermissions,
    });

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          subAdmin,
          true,
          statusCode.success,
          "SubAdmin created successfully"
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

export const deleteSubAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const subAdmin = await admins.findOne({
      where: {
        adminId,
        roles: 'subAdmin',
      },
    });

    if (!subAdmin) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Sub-admin not found"))
    }

    await subAdmin.destroy();

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          [],
          true,
          statusCode.success,
          "Sub-admin deleted successfully"
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



export const getSubAdmins = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const offset = (page - 1) * pageSize;

    const searchCondition = { roles: "subAdmin" };

    if (search) {
      searchCondition.userName = { [Op.like]: `%${search}%` };
    }

    const subAdmins = await admins.findAll({
      where: searchCondition,
      attributes: ["adminId", "userName", "roles", "permissions"],
      order: [["id", "DESC"]],
    });

    const totalItems = subAdmins.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize));
    const paginatedData = subAdmins.slice(offset, offset + parseInt(pageSize));

    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Sub-admins fetched successfully",
          pagination
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
  // Save or update market list exposure in MarketListExposure table
  const existingExposure = await MarketListExposure.findOne({
    where: { UserId: user.userId, MarketId: marketId },
  });

  if (existingExposure) {
    await existingExposure.update({ exposure: user.marketListExposure });
  } else {
    await MarketListExposure.create({
      UserId: user.userId,
      MarketId: marketId,
      exposure: user.marketListExposure,
    });
  }

  // Save or update all runner balances in AllRunnerBalance table
  const allRunnerBalances = await MarketBalance.findAll({
    where: { marketId, userId: user.userId },
    attributes: ["runnerId", "bal"],
  });

  for (const item of allRunnerBalances) {
    const existingBalance = await AllRunnerBalance.findOne({
      where: {
        UserId: user.userId,
        MarketId: marketId,
        RunnerId: item.runnerId,
      },
    });

    if (existingBalance) {
      await existingBalance.update({ balance: item.bal });
    } else {
      await AllRunnerBalance.create({
        UserId: user.userId,
        MarketId: marketId,
        RunnerId: item.runnerId,
        balance: item.bal,
      });
    }
  }

  // Store base previous state (without marketListExposure/allRunnerBalances)
  const previousState = {
    userId: user.userId,
    marketId,
    runnerId,
    gameId,
    runnerBalance: runnerBalanceValue,
    isReverted: false,
  };

  const existingRecord = await PreviousState.findOne({
    where: { userId: user.userId, marketId },
  });

  if (existingRecord) {
    await existingRecord.update(previousState);
  } else {
    await PreviousState.create(previousState);
  }
};

export const afterWining = async (req, res) => {
  try {
    const { marketId, runnerId, isWin } = req.body;
    const declaredBy = req.user?.userName;
    const declaredById = req.user?.adminId;
    const userRole = req.user?.roles;

    if (!declaredBy || !declaredById) {
      return res
        .status(statusCode.unauthorize)
        .send(apiResponseErr(null, false, statusCode.unauthorize, "Unauthorized: User not authenticated"));
    }

    const market = await Market.findOne({
      where: { marketId },
      include: [{ model: Runner, required: false }],
    });

    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Market not found"));
    }

    const gameId = market.gameId;
    const runner = await Runner.findOne({ where: { runnerId } });
    if (!runner) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Runner not found"));
    }

    const runnerName = runner.runnerName;

    if (userRole === 'subAdmin') {
      const existingResultRequest = await ResultRequest.findOne({
        where: { marketId, declaredById, deletedAt: null }
      });

      if (existingResultRequest) {
        return res
          .status(statusCode.badRequest)
          .send(apiResponseErr(null, false, statusCode.badRequest, "You have already created a result request for this market"));
      }

      const rejectedSubadmins = await ResultHistory.findAll({
        attributes: ["declaredById"],
        where: { marketId, isApproved: false, status: 'Rejected' },
        raw: true,
      });

      const rejectedAdminIds = rejectedSubadmins.map(entry => entry.declaredById).flat();

      if (rejectedAdminIds.length === 2 && !rejectedAdminIds.includes(declaredById)) {
        return res
          .status(statusCode.badRequest)
          .send(apiResponseErr(null, false, statusCode.badRequest, "Only the two sub-admins with rejected entries can submit results for this market!"));
      }

      const activeResultRequests = await ResultRequest.count({
        where: { marketId, deletedAt: null }
      });

      if (activeResultRequests >= 2) {
        return res
          .status(statusCode.badRequest)
          .send(apiResponseErr(null, false, statusCode.badRequest, "Maximum number of result requests reached for this market"));
      }

      await ResultRequest.create({
        gameId,
        marketId,
        marketName: market.marketName,
        runnerId,
        runnerName,
        isWin,
        declaredBy,
        declaredById,
      });

      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(null, true, statusCode.success, "Result declaration by sub-admin successful"));
    }

    if (userRole === 'admin') {
      await ResultRequest.destroy({ where: { marketId } });

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

      const users = await MarketBalance.findAll({ where: { marketId } });

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

              const exposureRecord = await MarketListExposure.findOne({
                where: {
                  UserId: userDetails.userId,
                  MarketId: marketId,
                },
              });

              if (exposureRecord) {
                const marketExposureValue = Number(exposureRecord.exposure);
                const runnerBalanceValue = Number(runnerBalance.bal);

                if (isWin) {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: runnerBalanceValue,
                    type: "win",
                    marketId,
                    runnerId,
                  });
                } else {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: Math.abs(marketExposureValue),
                    type: "loss",
                    marketId,
                    runnerId,
                  });
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

                await MarketListExposure.destroy({
                  where: {
                    UserId: userDetails.userId,
                    MarketId: marketId,
                  },
                });

                await userDetails.save();

                await MarketBalance.destroy({
                  where: { marketId, runnerId, userId: user.userId },
                });
              }
            }
          }
        } catch (error) {
          console.error("Error processing user:", error);
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
            placeDate: order.createdAt,
          });
        }

        await CurrentOrder.destroy({ where: { marketId } });
      }

      await Market.update(
        {
          isRevoke: false,
          hideMarketWithUser: true,
          hideRunnerUser: true,
          hideMarket: true,
          hideRunner: true,
        },
        { where: { marketId } }
      );

      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(null, true, statusCode.success, "Result declaration by admin successfully"));
    }

    return res
      .status(statusCode.unauthorize)
      .send(apiResponseErr(null, false, statusCode.unauthorize, "Unauthorized: Invalid user role"));
  } catch (error) {
    console.error("Error sending balance:", error);
    return res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
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
        const allRunnerBalances = await AllRunnerBalance.findAll({
          where: {
            UserId: user.userId,
            MarketId: marketId,
          },
          transaction,
        });

        const balances = allRunnerBalances.map(rb => rb.balance);
        const maxNegativeRunnerBalance = balances.reduce((max, current) => {
          return current < max ? current : max;
        }, 0);

        await MarketListExposure.upsert(
          {
            UserId: user.userId,
            MarketId: marketId,
            exposure: Math.abs(maxNegativeRunnerBalance),
          },
          { transaction }
        );

        await WinningAmount.destroy({ where: { marketId }, transaction });

        for (const runnerBalance of allRunnerBalances) {
          const { RunnerId: runnerId, balance } = runnerBalance;

          try {
            let mb = await MarketBalance.findOne({
              where: { marketId, runnerId, userId: user.userId },
              transaction,
            });

            if (mb) {
              mb.bal = balance.toString();
              await mb.save({ transaction });
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
        hideMarketWithUser: false,
        hideMarket: false,
        announcementResult: false,
      },
      { where: { marketId }, transaction }
    );

    await ResultHistory.update(
      {
        isRevokeAfterWin: true,
      },
      { where: { marketId }, transaction }
    );

    await Runner.update(
      {
        hideRunnerUser: false,
        hideRunner: false,
        isWin: false,
        isBidding: true,
        clientMessage: false,
      },
      { where: { runnerId }, transaction }
    );

    const bets = await BetHistory.findAll({
      where: { marketId },
      transaction,
    });

    for (const bet of bets) {
      await CurrentOrder.create(
        {
          userId: bet.userId,
          gameId: bet.gameId,
          gameName: bet.gameName,
          marketId: bet.marketId,
          marketName: bet.marketName,
          runnerId: bet.runnerId,
          runnerName: bet.runnerName,
          rate: bet.rate,
          value: bet.value,
          type: bet.type,
          date: bet.date,
          bidAmount: bet.bidAmount,
          isWin: bet.isWin,
          profitLoss: bet.profitLoss,
          userName: bet.userName,
          betId: bet.betId,
        },
        { transaction }
      );
    }

    await BetHistory.destroy({ where: { marketId }, transaction });
    await ProfitLoss.destroy({ where: { marketId }, transaction });

    const existingMarket = await Market.findOne({
      where: { marketId },
      transaction,
    });

    if (!existingMarket) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess([], true, statusCode.success, "Market not found"));
    };

    // Save data to Firestore
    const formatDateTime = (date) => date.toISOString().slice(0, 19).replace("T", " ");

    await db.collection('color-game-db').doc(existingMarket.marketId).set({
      gameId: existingMarket.gameId,
      marketName: existingMarket.marketName,
      participants: existingMarket.participants,
      startTime: formatDateTime(existingMarket.startTime),
      endTime: formatDateTime(existingMarket.endTime),
      announcementResult: existingMarket.announcementResult,
      isActive: existingMarket.isActive,
      isDisplay: existingMarket.isDisplay,
      hideMarketWithUser: existingMarket.hideMarketWithUser,
      isMarketClosed: false
    });

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
// export const checkMarketStatus = async (req, res) => {
//   const marketId = req.params.marketId;
//   const { status } = req.body;

//   try {
//     const market = await Market.findOne({ where: { marketId } });

//     const gameId = market.gameId;

//     if (!market) {
//       return res
//         .status(statusCode.badRequest)
//         .send(
//           apiResponseErr(null, false, statusCode.badRequest, "Market not found")
//         );
//     }

//     await Market.update(
//       { hideMarketUser: false, isRevoke: false },
//       { where: { marketId } }
//     );

//     await PreviousState.destroy({
//       where: { marketId },
//     });

//     market.isActive = status;
//     await market.save();

//     const marketRef = db.collection("color-game").doc(marketId);

//     await marketRef.set(
//          {
//           isActive: status,
//           hideMarketUser: false,
//           isRevoke: false,
//           updatedAt: new Date()
//         },
//       { merge: true },
//     );

//     const statusMessage = status ? "Market is active" : "Market is suspended";
//     res.status(200).send({
//       success: true,
//       message: statusMessage,
//     });

//   } catch (error) {
//     console.log("Error updating market status:", error);
//     res
//       .status(statusCode.internalServerError)
//       .send(
//         apiResponseErr(
//           error.data ?? null,
//           false,
//           error.responseCode ?? statusCode.internalServerError,
//           error.errMessage ?? error.message
//         )
//       );
//   }
// };


export const inActiveMarketStatus = async (req, res) => {
  const { marketId } = req.params;
  const { status } = req.body

  try {
    const market = await Market.findOne({ where: { marketId } });

    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Market not found"));
    }

    if (status) {
      await Market.update(
        { hideMarketWithUser: true },
        { where: { marketId } }
      );
    }
    else {
      await Market.update(
        { hideMarketWithUser: false },
        { where: { marketId } }
      );
    }

    await PreviousState.destroy({ where: { marketId } });

    // Ensure `db` is initialized properly before using Firestore
    if (!db) {
      throw new Error("Database connection not initialized");
    }

    const marketRef = db.collection("color-game-db").doc(marketId);

    await marketRef.set(
      {
        isActive: market.isActive,
        hideMarketWithUser: status, // Changed to match SQL DB update
        isRevoke: market.isRevoke,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    // Notification 
    const allUsers = await userSchema.findAll({
      where: {
        isActive: true,
        fcm_token: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'fcm_token', 'userName', 'userId'],
    });

    for (const user of allUsers) {
      if (user.fcm_token) {
        let title;
        let message;

        if (status === true) {
          title = `Market Live: ${market.marketName}`;
          message = `The market "${market.marketName}" is now live. Start playing now!`;
        } else {
          title = `Market Closed: ${market.marketName}`;
          message = `The market "${market.marketName}" has been closed. Stay tuned for updates.`;
        }

        await NotificationService.sendNotification(
          title,
          message,
          {
            type: "colorgame",
            marketId: marketId.toString(),
            userId: user.userId.toString(),
          },
          user.fcm_token
        );

        await Notification.create({
          UserId: user.userId,
          MarketId: marketId,
          message,
          type: "colorgame",
        });

      const notificationsRef = db
        .collection("color-game-notification")
        .doc(user.userId)
        .collection("notifications");

      await notificationsRef.add({
        UserId: user.userId,
        marketId: marketId,
        message: message,
        type: "colorgame",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      }
    }

    return res
      .status(statusCode.success) // Corrected the response status code
      .send(apiResponseSuccess([], true, statusCode.success, "Market updated successfully"));
  } catch (error) {
    console.error("Error updating market status:", error);
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

export const liveUsersBet = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const whereCondition = { marketId, isLiveDeleted: false };

    if (search) {
      whereCondition.userName = { [Op.like]: `%${search}%` };
    }

    const { count, rows: existingUser } = await CurrentOrder.findAndCountAll({
      attributes: ["marketId", "marketName", "userId", "userName"],
      where: whereCondition,
      group: ["marketId", "marketName", "userId", "userName"],
      limit: parseInt(pageSize),
      offset,
      order: [["date", "DESC"]],
    });

    if (!existingUser || existingUser.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found!")
        );
    }


    const totalBets = await Promise.all(existingUser.map(async (user) => {
      const userBetCount = await CurrentOrder.count({
        where: {
          marketId,
          userId: user.userId,
          isLiveDeleted: false,
        }
      });
      return userBetCount;
    }));

    const formatData = {
      marketId: existingUser[0].marketId,
      marketName: existingUser[0].marketName,
      data: existingUser.map((user, index) => ({
        userId: user.userId,
        userName: user.userName,
        totalBets: totalBets[index],
      })),
    };

    const totalItems = count.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize, 10));

    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          formatData,
          true,
          statusCode.success,
          "Data fatch successfully!",
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

export const getUsersLiveBetGames = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.query;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const whereClause = {
      isLiveDeleted: false,
    };

    if (search) {
      whereClause[Op.or] = [
        { userName: { [Op.like]: `%${search}%` } },
        { marketName: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: currentOrders } = await CurrentOrder.findAndCountAll({
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "userName",
        "createdAt",
      ],
      where: whereClause,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (currentOrders.length === 0) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess([], true, statusCode.success, "No data found."));
    }

    // Remove duplicates
    const uniqueOrders = Array.from(
      new Map(currentOrders.map(order => [`${order.gameId}-${order.marketId}`, order])).values()
    );

    const liveGames = uniqueOrders.map(order => ({
      gameId: order.gameId,
      gameName: order.gameName,
      marketId: order.marketId,
      marketName: order.marketName,
      userName: order.userName,
    }));

    const paginatedOrders = liveGames.slice(offset, offset + limit);
    const totalPages = Math.ceil(liveGames.length / limit);

    const pagination = {
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages,
      totalItems: uniqueOrders.length,
    };

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(paginatedOrders, true, statusCode.success, "Success", pagination));
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};


export const getBetsAfterWin = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const whereCondition = { marketId };

    if (search) {
      whereCondition.userName = { [Op.like]: `%${search}%` };
    }

    const { count, rows: existingUser } = await BetHistory.findAndCountAll({
      attributes: ["marketId", "marketName", "userId", "userName"],
      where: whereCondition,
      group: ["marketId", "marketName", "userId", "userName"],
      limit: parseInt(pageSize),
      offset,
    });

    if (!existingUser || existingUser.length == 0) {
      res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found!")
        );
    }
    const totalBets = await Promise.all(existingUser.map(async (user) => {
      const userBetCount = await BetHistory.count({
        where: {
          marketId,
          userId: user.userId,
        }
      });
      return userBetCount;
    }));

    const formatData = {
      marketId: existingUser[0].marketId,
      marketName: existingUser[0].marketName,
      data: existingUser.map((user, index) => ({
        userId: user.userId,
        userName: user.userName,
        totalBets: totalBets[index],
      })),
    };

    const totalItems = count.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize, 10));

    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          formatData,
          true,
          statusCode.success,
          "Data fetch successfully! ",
          pagination
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

export const getBetMarketsAfterWin = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.query;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { rows: betHistoryOrders } = await BetHistory.findAndCountAll({
      attributes: ["gameId", "gameName", "marketId", "marketName", "userName", "id"],
      order: [["id", "DESC"]],
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

// Generic user Balance function
export const user_Balance = async (userId, getExposure = false) => {
  try {
    const [results] = await sql.query(
      `CALL getUserWallet(?, ?)`,
      [userId, getExposure]
    );
    return results;
  } catch (error) {
    console.error("Error in user_Balance:", error.message);
    throw new Error(`Error calculating balance: ${error.message}`);
  }
};


export const approveResult = async (req, res) => {
  try {
    const { marketId, action } = req.body;

    const resultRequests = await ResultRequest.findAll({
      where: { marketId },
    });

    if (resultRequests.length !== 2) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Exactly two declarations are required"
          )
        );
    }

    const runnerId1 = resultRequests[0].runnerId;
    const runnerId2 = resultRequests[1].runnerId;
    const gameId = resultRequests[0].gameId;
    const declaredByNames = resultRequests.map((request) => request.declaredBy);
    const declaredByIds = resultRequests.map((request) => request.declaredById);

    const market = await Market.findOne({
      where: { marketId },
      include: [
        { model: Game, attributes: ["gameName"] },
        { model: Runner, attributes: ["runnerId", "runnerName"] },
      ],
    });

    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Market not found")
        );
    }

    const gameName = market.Game.gameName;
    const marketName = market.marketName;
    const runnerNames = market.Runners.filter(
      (runner) => runner.runnerId === runnerId1 || runner.runnerId === runnerId2
    ).map((runner) => runner.runnerName);

    const isApproved = runnerId1 === runnerId2;
    const type = isApproved ? "Matched" : "Unmatched";

    let remarks = "";
    if (action === "reject") {
      remarks =
        type === "Matched"
          ? "Your result has been rejected. Kindly reach out to your upline for further guidance."
          : "Oops! Your submission does not match our records. Please check the data and try again.";

      await ResultHistory.create({
        gameId,
        gameName,
        marketId,
        marketName,
        runnerId: [runnerId1, runnerId2],
        runnerNames,
        isApproved: false,
        type,
        declaredByNames,
        declaredById: declaredByIds,
        remarks,
        status: "Rejected",
        createdAt: new Date(),
      });

      await ResultRequest.update(
        { status: "Rejected", type, remarks },
        { where: { marketId, status: "Pending" } }
      );

      await ResultRequest.destroy({ where: { marketId } });

      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "Result rejected successfully"
          )
        );
    }

    remarks = "Congratulations! Your result has been approved.";

    await ResultHistory.create({
      gameId,
      gameName,
      marketId,
      marketName,
      runnerId: [runnerId1, runnerId2],
      runnerNames,
      isApproved,
      type,
      declaredByNames,
      declaredById: declaredByIds,
      remarks,
      status: "Approved",
      createdAt: new Date(),
    });

    await ResultRequest.update(
      { status: "Approved", type, remarks },
      { where: { marketId, status: "Pending" } }
    );

    await ResultRequest.destroy({ where: { marketId } });

    if (isApproved) {
      await Market.update(
        {
          isRevoke: false,
          hideMarketWithUser: true,
          hideRunnerUser: true,
          hideMarket: true,
          hideRunner: true,
          announcementResult: true,
        },
        { where: { marketId } }
      );

      await Runner.update(
        { isWin: resultRequests[0].isWin },
        { where: { runnerId: runnerId1 } }
      );

      const users = await MarketBalance.findAll({ where: { marketId } });

      for (const user of users) {
        try {
          const runnerBalance = await MarketBalance.findOne({
            where: { marketId, runnerId: runnerId1, userId: user.userId },
          });

          if (runnerBalance) {
            const userDetails = await userSchema.findOne({
              where: { userId: user.userId },
            });

            if (userDetails) {
              await storePreviousState(
                userDetails,
                marketId,
                runnerId1,
                gameId,
                Number(runnerBalance.bal)
              );

              const exposureEntry = await MarketListExposure.findOne({
                where: { MarketId: marketId, UserId: user.userId },
              });

              const marketExposureValue = exposureEntry
                ? Number(exposureEntry.exposure)
                : 0;
              const runnerBalanceValue = Number(runnerBalance.bal);

              if (resultRequests[0].isWin) {
                await WinningAmount.create({
                  userId: userDetails.userId,
                  userName: userDetails.userName,
                  amount: runnerBalanceValue,
                  type: "win",
                  marketId,
                  runnerId: runnerId1,
                });
              } else {
                await WinningAmount.create({
                  userId: userDetails.userId,
                  userName: userDetails.userName,
                  amount: Math.abs(marketExposureValue),
                  type: "loss",
                  marketId,
                  runnerId: runnerId1,
                });
              }

              await ProfitLoss.create({
                userId: user.userId,
                userName: userDetails.userName,
                gameId,
                marketId,
                runnerId: runnerId1,
                date: new Date(),
                profitLoss: runnerBalanceValue,
              });

              // Delete exposure after use
              await MarketListExposure.destroy({
                where: { MarketId: marketId, UserId: user.userId },
              });

              await MarketBalance.destroy({
                where: { marketId, runnerId: runnerId1, userId: user.userId },
              });
            }
          }
        } catch (error) {
          console.error("Error processing user:", error);
        }
      }

      if (resultRequests[0].isWin) {
        const orders = await CurrentOrder.findAll({ where: { marketId } });

        for (const order of orders) {
          await BetHistory.create({
            betId: order.betId,
            userId: order.userId,
            userName: order.userName,
            gameId,
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
            placeDate: order.createdAt,
          });
        }

        await CurrentOrder.destroy({ where: { marketId } });
      }
      // Notification 
      const allUsers = await userSchema.findAll({
        where: {
          isActive: true,
          fcm_token: {
            [Op.ne]: null,
          },
        },
        attributes: ['id', 'fcm_token', 'userName', 'userId'],
      });

      for (const user of allUsers) {
        if (user.fcm_token) {
          let title;
          let message;
          title = `🏁 Results Declared: ${market.marketName}`;
          message = `The final results for "${market.marketName}" have been declared. Check now to see if you've secured a win!`;

          await NotificationService.sendNotification(
            title,
            message,
            {
              type: "colorgame",
              marketId: marketId.toString(),
              userId: user.userId.toString(),
            },
            user.fcm_token
          );

          await Notification.create({
            UserId: user.userId,
            MarketId: marketId,
            message,
            type: "colorgame",
          });

          const notificationsRef = db
            .collection("color-game-notification")
            .doc(user.userId)
            .collection("notifications");

          await notificationsRef.add({
            UserId: user.userId,
            marketId: marketId,
            message: message,
            type: "colorgame",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      await deleteLotteryFromFirebase(marketId);
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "Result approved and declared successfully"
          )
        );
    } else {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "Result rejected due to mismatched declarations"
          )
        );
    }
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


export const getResultRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const resultRequests = await ResultRequest.findAll({
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: Game,
          attributes: ['gameName'],
        },
        {
          model: Market,
          attributes: ['marketName', 'marketId'],
        },
        {
          model: Runner,
          attributes: ['runnerName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    });

    const groupedData = resultRequests.reduce((acc, request) => {
      const key = `${request.Game.gameName}-${request.Market.marketName}`;
      if (!acc[key]) {
        acc[key] = {
          gameName: request.Game.gameName,
          marketName: request.Market.marketName,
          marketId: request.Market.marketId,
          data: [],
        };
      }
      acc[key].data.push({
        declaredBy: request.declaredBy,
        runnerName: request.Runner.runnerName,
      });
      return acc;
    }, {});

    const formattedResultRequests = Object.values(groupedData);
    let filteredResults = formattedResultRequests;

    if (search) {
      filteredResults = formattedResultRequests.filter(item =>
        item.marketName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = filteredResults.length;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      Page: page,
      limit: limit,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          filteredResults,
          true,
          statusCode.success,
          "Result requests fetched successfully",
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


export const getSubAdminResultHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type } = req.query;
    const offset = (page - 1) * limit;

    const queryOptions = {
      attributes: {
        exclude: ['id', 'deletedAt'],
      },
      order: [['createdAt', 'DESC']],
      where: {
        isApproved: true,
        isRevokeAfterWin: false,
      },
    };

    if (type) {
      queryOptions.where = {
        ...queryOptions.where,
        type: type,
      };
    }

    const resultHistories = await ResultHistory.findAll(queryOptions);

    const marketIds = resultHistories.map(history => history.marketId);
    const markets = await Market.findAll({
      where: { marketId: marketIds },
      include: [
        { model: Runner, attributes: ['runnerId', 'runnerName'] },
      ],
    });

    const marketRunnersMap = new Map();
    markets.forEach(market => {
      marketRunnersMap.set(market.marketId, market.Runners);
    });

    const groupedData = resultHistories.reduce((acc, history) => {
      const key = `${history.gameId}-${history.gameName}-${history.marketId}-${history.marketName}-${history.isApproved}-${history.type}`;
      if (!acc[key]) {
        acc[key] = {
          gameId: history.gameId,
          gameName: history.gameName,
          marketId: history.marketId,
          marketName: history.marketName,
          isApproved: history.isApproved,
          type: history.type,
          data: [],
        };
      }

      history.declaredByNames.forEach((declaredBy, index) => {
        const runnerId = history.runnerId[index];
        const runners = marketRunnersMap.get(history.marketId) || [];
        const runner = runners.find(r => r.runnerId === runnerId);
        const runnerName = runner ? runner.runnerName : 'Unknown';

        acc[key].data.push({
          declaredByNames: declaredBy,
          runnerId: runnerId,
          runnerName: runnerName,
        });
      });

      return acc;
    }, {});

    const formattedResultHistories = Object.values(groupedData);

    let filteredResults = formattedResultHistories;

    if (search) {
      filteredResults = formattedResultHistories.filter((item) =>
        item.marketName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = filteredResults.length;
    const totalPages = Math.ceil(totalItems / limit);

    const validPage = page > totalPages ? 1 : page;
    const validOffset = (validPage - 1) * limit;

    const paginatedData = filteredResults.slice(validOffset, validOffset + limit);

    const pagination = {
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalItems: totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Subadmin result histories fetched successfully",
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

export const winningData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const winningAmounts = await WinningAmount.findAll({
      attributes: ['userId', 'userName', 'marketId'],
      where: {
        isVoidAfterWin: false,
      },
    });

    const betHistories = await BetHistory.findAll({
      attributes: ['gameId', 'gameName', 'marketId', 'marketName']
    });

    const combinedData = winningAmounts.map(wa => {
      const betHistory = betHistories.find(bh => bh.marketId === wa.marketId);

      return {
        gameId: betHistory ? betHistory.gameId : null,
        gameName: betHistory ? betHistory.gameName : null,
        marketId: wa.marketId,
        marketName: betHistory ? betHistory.marketName : null,
      };
    });


    const filteredData = combinedData.filter(item => item.gameName && item.gameName.toLowerCase() === "colorgame");


    const uniqueMarketData = filteredData.reduce((acc, item) => {
      if (!acc.some(entry => entry.marketName === item.marketName)) {
        acc.push(item);
      }
      return acc;
    }, []);

    const searchedData = search
      ? uniqueMarketData.filter(item =>
        item.marketName.toLowerCase().includes(search.toLowerCase())
      )
      : uniqueMarketData;

    const paginatedData = searchedData.slice(offset, offset + limit);

    const totalItems = searchedData.length;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalPages,
      totalItems
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Color-game winning data fetched successfully",
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

export const getDetailsWinningData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const marketId = req.params.marketId;

    const winningAmounts = await WinningAmount.findAll({
      attributes: ["userId", "userName", "marketId", "type", "runnerId"],
      where: {
        marketId,
        isVoidAfterWin: false,
        type: "win",
      },
    });

    const betHistories = await BetHistory.findAll({
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "runnerName",
        "runnerId",
        "rate",
        "value",
        "type",
        "date",
        "matchDate",
        "placeDate",
        "userId",
        "userName",
      ],
      where: { marketId },
    });

    const combinedData = winningAmounts.map((winner) => {
      const relatedBets = betHistories.filter(
        (bet) => bet.runnerId === winner.runnerId && bet.userId === winner.userId
      );

      const firstBet = relatedBets[0];

      return {
        userId: winner.userId || null,
        userName: winner.userName || null,
        marketId: firstBet?.marketId || null,
        marketName: firstBet?.marketName || null,
        gameName: firstBet?.gameName || null,
      };
    });

    const filteredData = combinedData.filter(
      (item) => item.gameName && item.gameName.toLowerCase() === "colorgame"
    );

    const searchedData = search
      ? filteredData.filter((item) =>
        item.userName.toLowerCase().includes(search.toLowerCase())
      )
      : filteredData;

    const paginatedData = searchedData.slice(offset, offset + limit);
    const totalItems = searchedData.length;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalPages,
      totalItems,
    };

    return res.status(statusCode.success).send(
      apiResponseSuccess(
        paginatedData,
        true,
        statusCode.success,
        "Color-game winning users' bets fetched successfully",
        pagination
      )
    );
  } catch (error) {
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const deleteBetAfterWin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, marketId } = req.body;

    const winningAmount = await WinningAmount.findOne({
      where: { userId, marketId, type: "win" },
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
            statusCode.notFound,
            "Winning amount not found"
          )
        );
    }

    const profitLossAmount = await ProfitLoss.findOne({
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
            statusCode.notFound,
            "Profit/Loss record not found"
          )
        );
    }

    const updatedProfitLoss = profitLossAmount.profitLoss - winningAmount.amount;
    await ProfitLoss.update(
      { profitLoss: updatedProfitLoss },
      { where: { userId, marketId }, transaction: t }
    );

    const [updateRows] = await WinningAmount.update({ isPermanentDeleted: true }, {
      where: { userId, marketId, type: "win" },
      transaction: t,
    })

    if (updateRows > 0) {
      await WinningAmount.destroy({
        where: { userId, marketId, type: "win" },
        transaction: t,
      });

    }

    await t.commit();
    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "After winning bet delete successfully"
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
    const { marketId } = req.body;
    const winningAmountRecords = await WinningAmount.findAll({
      where: { marketId, type: 'win' },
      attributes: ['userId'],
      group: ['userId'],
    });

    const userIds = winningAmountRecords.map(record => record.userId);

    if (userIds.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "No users found for this market!"
          )
        );
    }

    await WinningAmount.update(
      { amount: 0 },
      {
        where: {
          userId: userIds,
          marketId,
          type: 'win',
        },
      }
    );

    await WinningAmount.update(
      { isVoidAfterWin: true },
      { where: { marketId } }
    );



    await ProfitLoss.destroy({
      where: {
        userId: userIds,
        marketId,
      },
    });

    await BetHistory.destroy({
      where: {
        userId: userIds,
        marketId,
      },
    });

    await ResultHistory.destroy({
      where: {
        marketId
      },
    });

    await deleteLotteryFromFirebase(marketId)

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "After winning market void successfully!"
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


export const getSubAdminHistory = async (req, res) => {
  try {
    const adminId = req.user?.adminId;
    const { page = 1, limit = 10, status, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let baseQuery = `
      SELECT 
        marketName, 
        marketId, 
        runnerId,
        runnerName, 
        declaredBy, 
        status, 
        type, 
        remarks, 
        deletedAt 
      FROM ResultRequests 
      WHERE declaredById = :adminId
      AND createdAt >= :sevenDaysAgo
    `;

    if (status) {
      baseQuery += ` AND status = :status`;
    }

    if (search) {
      baseQuery += " AND marketName LIKE :search";
    }

    baseQuery += ` ORDER BY createdAt DESC LIMIT :limit OFFSET :offset`;

    const resultRequests = await sequelize.query(baseQuery, {
      replacements: { adminId, status, limit, offset, sevenDaysAgo, search: search ? `%${search}%` : null, },
      type: sequelize.QueryTypes.SELECT,
    });

    let countQuery = `
      SELECT COUNT(*) as count 
      FROM ResultRequests 
      WHERE declaredById = :adminId
      AND createdAt >= :sevenDaysAgo
    `;

    if (status) {
      countQuery += ` AND status = :status`;
    }

    if (search) {
      countQuery += " AND marketName LIKE :search";
    }

    const totalCount = await sequelize.query(countQuery, {
      replacements: { adminId, status, sevenDaysAgo, search: search ? `%${search}%` : null },
      type: sequelize.QueryTypes.SELECT,
    });

    const totalPages = Math.ceil(totalCount[0].count / limit);

    const pagination = {
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalLimits: totalCount[0].count,
    };

    return res.status(statusCode.success).send(
      apiResponseSuccess(
        resultRequests,
        true,
        statusCode.success,
        "Data fetched successfully!",
        pagination
      )
    );
  } catch (error) {
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getSubadminResult = async (req, res) => {
  try {
    const adminId = req.user?.adminId;
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const offset = (page - 1) * pageSize;

    if (!adminId) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Declared By ID is required"));
    }

    const whereCondition = { status: "Approved", declaredById: Sequelize.literal(`JSON_CONTAINS(declaredById, '"${adminId}"')`) }

    if (search) {
      whereCondition.marketName = { [Op.like]: `%${search}%` };
    }

    const results = await ResultHistory.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]]
    });

    const structuredResults = results.map(result => {
      const dataArray = [];

      if (Array.isArray(result.declaredById) && Array.isArray(result.declaredByNames)) {
        result.declaredById.forEach((declaredId, index) => {
          if (declaredId === adminId) {

            const uniqueRunnerIds = [...new Set(result.runnerId)];

            uniqueRunnerIds.forEach((runnerId, idx) => {
              dataArray.push({
                declaredByNames: result.declaredByNames[index],
                runnerId: runnerId,
                runnerName: result.runnerNames ? result.runnerNames[idx] || null : null,
              });
            });
          }
        });
      }

      return {
        gameId: result.gameId,
        gameName: result.gameName,
        marketId: result.marketId,
        marketName: result.marketName,
        isApproved: result.isApproved,
        type: result.type,
        data: dataArray,
      };
    });

    const totalItems = structuredResults.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize));
    const paginatedData = structuredResults.slice(offset, offset + parseInt(pageSize));

    const pagination = {
      page: parseInt(page),
      limit: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Subadmin result fetch successfully!",
          pagination,
        )
      );

  } catch (error) {
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(
        null,
        false,
        statusCode.internalServerError,
        error.message
      )
    );
  }
};

export const liveUsersBetHistory = async (req, res) => {
  try {
    const { marketId, userId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (page - 1) * pageSize;

    const whereCondition = { marketId, userId, isLiveDeleted: false };

    if (search) {
      whereCondition.runnerName = { [Op.like]: `%${search}%` };
    }

    const existingBets = await CurrentOrder.findAll({
      where: whereCondition,
      attributes: [
        "betId",
        "userId",
        "userName",
        "runnerId",
        "runnerName",
        "rate",
        "value",
        "type",
        "bidAmount",
        "date",
      ],
      order: [["date", "DESC"]],
    });

    if (!existingBets || existingBets.length === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found!")
        );
    }

    const totalItems = existingBets.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize));
    const paginatedData = existingBets.slice(
      offset,
      offset + parseInt(pageSize)
    );

    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Data fetched successfully!",
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



export const getBetsAfterWinHistory = async (req, res) => {
  try {
    const { marketId, userId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (page - 1) * pageSize;

    const whereCondition = { marketId, userId };

    if (search) {
      whereCondition.runnerName = { [Op.like]: `%${search}%` };
    }

    const existingBets = await BetHistory.findAll({
      where: whereCondition,
      attributes: [
        "betId",
        "userId",
        "userName",
        "runnerId",
        "runnerName",
        "rate",
        "value",
        "type",
        "bidAmount",
        "date",
      ],
      order: [["date", "DESC"]],
    });

    if (!existingBets || existingBets.length == 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found!")
        );
    }

    const totalItems = existingBets.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize));
    const paginatedData = existingBets.slice(
      offset,
      offset + parseInt(pageSize)
    );

    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Data featch successfully!",
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

export const getDetailsWinningBet = async (req, res) => {
  try {

    const { marketId, userId } = req.params;

    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const winningAmounts = await WinningAmount.findAll({
      attributes: ["userId", "userName", "marketId", "type", "runnerId"],
      where: {
        marketId,
        userId,
        isVoidAfterWin: false,
        type: "win",
      },
    });

    const betHistories = await BetHistory.findAll({
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "runnerName",
        "runnerId",
        "rate",
        "value",
        "type",
        "date",
        "matchDate",
        "placeDate",
        "userId",
        "userName",
        "bidAmount",
        "betId",
      ],
      where: { marketId, userId },
    });

    const combinedData = winningAmounts.map((winner) => {
      const relatedBets = betHistories.filter(
        (bet) => bet.runnerId === winner.runnerId && bet.userId === winner.userId
      );

      const firstBet = relatedBets[0];
      return {
        betId: firstBet.betId || null,
        userId: winner.userId || null,
        userName: winner.userName || null,
        gameName: firstBet?.gameName || null,
        marketId: firstBet?.marketId || null,
        marketName: firstBet?.marketName || null,
        runnerId: firstBet?.runnerId || null,
        runnerName: firstBet?.runnerName || null,
        rate: firstBet.rate?.toString() || null,
        value: firstBet.value?.toString() || null,
        type: firstBet?.type || null,
        bidAmount: firstBet?.bidAmount || null,
        date: firstBet?.date || null,
      };
    });

    const filteredData = combinedData.filter(
      (item) => item.gameName && item.gameName.toLowerCase() === "colorgame"
    );

    const searchedData = search
      ? filteredData.filter((item) =>
        item.userName.toLowerCase().includes(search.toLowerCase())
      )
      : filteredData;

    const paginatedData = searchedData.slice(offset, offset + limit);
    const totalItems = searchedData.length;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalPages,
      totalItems,
    };

    return res.status(statusCode.success).send(
      apiResponseSuccess(
        paginatedData,
        true,
        statusCode.success,
        "Color-game winning users' bets fetched successfully",
        pagination,
      )
    );

  } catch (error) {
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(
        null,
        false,
        statusCode.internalServerError,
        error.message
      )
    );
  }
};

export const createTitleTextNotification = async (req, res) => {
  try {
    const { message, title } = req.body;

    const allUsers = await userSchema.findAll({
      where: {
        isActive: true,
        fcm_token: { [Op.ne]: null },
      },
      attributes: ['id', 'fcm_token', 'userName', 'userId'],
    });

    const createdNotifications = [];

    for (const user of allUsers) {
      if (user.fcm_token) {
        await NotificationService.sendNotification(
          title,
          message,
          { userId: user.userId.toString() },
          user.fcm_token
        );

        const newNotif = await Notification.create({
          UserId: user.userId,
          message,
          type: "colorgame",
        });

        createdNotifications.push(newNotif);
      }
      const notificationsRef = db
        .collection("color-game-notification")
        .doc(user.userId)
        .collection("notifications");

      await notificationsRef.add({
        UserId: user.userId,
        message: message,
        type: "colorgame",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          createdNotifications,
          true,
          statusCode.create,
          "Notifications created with title and message."
        )
      );

  } catch (error) {
    console.error("Error in createTitleTextNotification:", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const updateHotGameStatus = async(req, res) => {
  try {
    const { marketId, status } = req.body;

    const existingMarket = await Market.findOne({
      where: { marketId }
    });

    if (!existingMarket) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "Market not found.",
          )
        );
    }

    const updatedMarket = await Market.update(
      { hotGame: status },
      { where: { marketId } }
    ); 

    if (updatedMarket[0] === 0) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "Failed to update hot game status. Market not found or no changes made.",
          )
        );
    };

    const marketRef = db.collection("color-game-db").doc(marketId);

    await marketRef.set(
      {
        hotGame: status,
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
          `Hot game status updated to ${status ? 'active' : 'inactive'} successfully.`
        )
      );

  } catch (error) {
    return apiResponseErr(
      null,
      false,
      statusCode.internalServerError,
      error.message,
      res
    );
  }

};


export const updateRunner = async (req, res) => {
  try {
    const { marketId, runnerName, runnerId} = req.body;
    const { adminId }  = req.user;

    const existingRecord = await Runner.findAll({
      where : { marketId, runnerId}
    });

    if(!existingRecord || existingRecord.length === 0)
    {
       return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "Runner not Found!",
          )
        );
    }

    const existingMarkets = await ResultRequest.findAll({ where : { marketId, status : "Rejected" }});

  if (!existingMarkets) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            [],
            true,
            statusCode.success,
            "Market not Found!",
          )
        );
    }
    // Update the specific row (example update - modify as needed)
    const [ updatedRow ] = await ResultRequest.update(
      {
        runnerName : runnerName,
        runnerId : runnerId,
        status: "Pending",
        type : null,
        remarks : null,
        deletedAt : null,
      },
      {
        where: {
          marketId,
          declaredById :adminId
        },
         paranoid: false
      }
    );

    if(updatedRow > 0)
    {
      await ResultHistory.destroy({
        where : { marketId }
      })
    }

     return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            updatedRow,
            true,
            statusCode.success,
            "Result Update Successfull!",
          )
        );
  } catch (error) {
    console.log(error)
      return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
}

