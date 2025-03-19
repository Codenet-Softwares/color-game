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
import sequelize from "../db.js";
import WinningAmount from "../models/winningAmount.model.js";
import ResultRequest from "../models/resultRequest.model.js";
import ResultHistory from "../models/resultHistory.model.js";


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
    const existingAdmin = await admins.findOne({ where : { userName } });

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
  const allRunnerBalances = await MarketBalance.findAll({
    where: { marketId, userId: user.userId },
    attributes: ["runnerId", "bal"],
  });

  const allRunnerBalancesObj = {};
  allRunnerBalances.forEach((item) => {
    allRunnerBalancesObj[item.runnerId] = Number(item.bal);
  });

  const previousState = {
    userId: user.userId,
    marketId: marketId,
    runnerId: runnerId,
    gameId: gameId,
    marketListExposure: JSON.stringify(user.marketListExposure),
    runnerBalance: runnerBalanceValue,
    allRunnerBalances: JSON.stringify(allRunnerBalancesObj),
    isReverted: false,
  };

  const existingRecord = await PreviousState.findOne({
    where: { userId: user.userId, marketId: marketId },
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
        .send(
          apiResponseErr(null, false, statusCode.unauthorize, "Unauthorized: User not authenticated")
        );
    }

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

    const gameId = market.gameId;

    if (userRole === 'subAdmin') {
      const existingResultRequest = await ResultRequest.findOne({
        where: {
          marketId,
          declaredById,
          deletedAt: null
        }
      });

      if (existingResultRequest) {
        return res
          .status(statusCode.badRequest)
          .send(
            apiResponseErr(null, false, statusCode.badRequest, "You have already created a result request for this market")
          );
      };

      const rejectedSubadmins = await ResultHistory.findAll({
        attributes: ["declaredById"],
        where: { 
          marketId, 
          isApproved: false,
          status: 'Rejected',
        },
        raw: true,
      });
      
      const rejectedAdminIds = rejectedSubadmins.map(entry => entry.declaredById).flat();
      
      if (rejectedAdminIds.length === 2 && !rejectedAdminIds.includes(declaredById)) {
        return res
          .status(statusCode.badRequest)
          .send(
            apiResponseErr(null, false, statusCode.badRequest, "Only the two sub-admins with rejected entries can submit results for this market!")
          );
      };
      
      const activeResultRequests = await ResultRequest.count({
        where: {
          marketId,
          deletedAt: null
        }
      });

      if (activeResultRequests >= 2) {
        return res
          .status(statusCode.badRequest)
          .send(
            apiResponseErr(null, false, statusCode.badRequest, "Maximum number of result requests reached for this market")
          );
      }

      await ResultRequest.create({
        gameId,
        marketId,
        marketName : market.marketName,
        runnerId,
        isWin,
        declaredBy,
        declaredById,
      });

      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "Result declaration by sub-admin successful"
          )
        );
    }

    if (userRole === 'admin') {
      await ResultRequest.destroy({
        where: { marketId }
      });

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

              const marketExposureEntry = userDetails.marketListExposure.find(
                (item) => Object.keys(item)[0] === marketId
              );

              if (marketExposureEntry) {
                const marketExposureValue = Number(marketExposureEntry[marketId]);
                const runnerBalanceValue = Number(runnerBalance.bal);

                if (isWin) {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: runnerBalanceValue,
                    type: "win",
                    marketId: marketId,
                    runnerId: runnerId,
                  });
                } else {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: Math.abs(marketExposureValue),
                    type: "loss",
                    marketId: marketId,
                    runnerId: runnerId,
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

                userDetails.marketListExposure =
                  userDetails.marketListExposure.filter(
                    (item) => Object.keys(item)[0] !== marketId
                  );

                await userSchema.update(
                  { marketListExposure: userDetails.marketListExposure },
                  { where: { userId: user.userId } }
                );

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
            "Result declaration by admin successfully"
          )
        );
    }

    return res
      .status(statusCode.unauthorize)
      .send(
        apiResponseErr(null, false, statusCode.unauthorize, "Unauthorized: Invalid user role")
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

        const allRunnerBalances = JSON.parse(prevState.allRunnerBalances);

        const balances = Object.values(allRunnerBalances);

        const maxNegativeRunnerBalance = balances.reduce((max, current) => {
          return current < max ? current : max;
        }, 0);

        let marketExposure = user.marketListExposure || [];

        let exposureMap = marketExposure.reduce((acc, obj) => {
          return { ...acc, ...obj };
        }, {});

        exposureMap[marketId] = Math.abs(maxNegativeRunnerBalance);

        user.marketListExposure = Object.keys(exposureMap).map(key => ({ [key]: exposureMap[key] }));

        await WinningAmount.destroy({ where: { marketId } }, transaction);

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

    await ResultHistory.update({
      isRevokeAfterWin: true
    }, { where: { marketId }, transaction })

    await Runner.update(
      { hideRunnerUser: false, hideRunner: false, isWin: false, isBidding: true, clientMessage: false },
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
    await BetHistory.destroy({ where: { marketId } });
    await ProfitLoss.destroy({ where: { marketId } });

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

// export const liveUsersBet = async (req, res) => {
//   try {
//     const { marketId } = req.params;
//     const { page = 1, pageSize = 10, search } = req.query;
//     const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

//     const where_clause = {
//       marketId: marketId,
//     };

//     if (search) {
//       where_clause[Op.or] = [
//         { userName: { [Op.like]: `%${search}%` } },
//         { marketName: { [Op.like]: `%${search}%` } },
//         { runnerName: { [Op.like]: `%${search}%` } },
//       ];
//     }

//     const existingBets = await CurrentOrder.findAll({
//       where: where_clause,
//       order: [["date", "DESC"]],
//     });

//     const uniqueUsers = [];

//     for (const bet of existingBets) {
//       const exists = uniqueUsers.find((user) => user.userId === bet.userId);
//       if (!exists) {
//         uniqueUsers.push({
//           marketId: bet.marketId,
//           marketName: bet.marketName,
//           userId: bet.userId,
//           userName: bet.userName,
//           bets: [],
//         });
//       }
//     }

//     for (const bet of existingBets) {
//       const user = uniqueUsers.find((user) => user.userId === bet.userId);
//       if (user) {
//         user.bets.push({
//           betId: bet.betId,
//           runnerId: bet.runnerId,
//           runnerName: bet.runnerName,
//           rate: bet.rate,
//           value: bet.value,
//           type: bet.type,
//           bidAmount: bet.bidAmount,
//           date: bet.date,
//         });
//       }
//     }
//     const totalItems = existingBets.length;
//     const totalPages = Math.ceil(totalItems / parseInt(pageSize, 10));
//     const paginatedData = uniqueUsers.slice(
//       offset,
//       offset + parseInt(pageSize, 10)
//     );

//     const pagination = {
//       page: parseInt(page),
//       pageSize: parseInt(pageSize),
//       totalPages,
//       totalItems,
//     };

//     res
//       .status(statusCode.success)
//       .send(
//         apiResponseSuccess(
//           paginatedData,
//           true,
//           statusCode.success,
//           "Success",
//           pagination
//         )
//       );
//   } catch (error) {
//     res
//       .status(statusCode.internalServerError)
//       .send(
//         apiResponseErr(
//           null,
//           false,
//           statusCode.internalServerError,
//           error.message
//         )
//       );
//   }
// };


export const liveUsersBet = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const whereCondition = { marketId };

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
      res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "Data not found!")
        );
    }

    const formatData = {
      marketId: existingUser[0].marketId,
      marketName: existingUser[0].marketName,
      data: existingUser.map((user) => ({
        userId: user.userId,
        userName: user.userName,
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
          "Data fatch successfully!",
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
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "userName",
        "createdAt",
      ],
      where: where_clause,
      order: [["createdAt", "DESC"]],
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
        { runnerName: { [Op.like]: `%${search}%` } },
      ];
    }

    const existingBets = await BetHistory.findAll({
      where: where_clause,
      order: [["date", "DESC"]],
    });

    const uniqueUsers = [];

    for (const bet of existingBets) {
      const exists = uniqueUsers.find((user) => user.userId === bet.userId);
      if (!exists) {
        uniqueUsers.push({
          marketId: bet.marketId,
          marketName: bet.marketName,
          userId: bet.userId,
          userName: bet.userName,
          bets: [],
        });
      }
    }

    for (const bet of existingBets) {
      const user = uniqueUsers.find((user) => user.userId === bet.userId);
      if (user) {
        user.bets.push({
          betId: bet.betId,
          runnerId: bet.runnerId,
          runnerName: bet.runnerName,
          rate: bet.rate,
          value: bet.value,
          type: bet.type,
          bidAmount: bet.bidAmount,
          date: bet.date,
        });
      }
    }
    const totalItems = existingBets.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize, 10));
    const paginatedData = uniqueUsers.slice(
      offset,
      offset + parseInt(pageSize, 10)
    );

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
          paginatedData,
          true,
          statusCode.success,
          "Success",
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
export const user_Balance = async (userId) => {
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

    const winningAmounts = await WinningAmount.findAll({
      where: { userId },
    });

    for (const trans of winningAmounts) {
      if (trans.type === 'win') {
        balance += parseFloat(trans.amount);
      }
      if (trans.type === 'loss') {
        balance -= parseFloat(trans.amount);
      }
      if (trans.isVoidAfterWin === true && trans.type === 'loss') {
        balance += parseFloat(trans.amount);
      }
    }


    return balance;
  } catch (error) {
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
          apiResponseErr(null, false, statusCode.badRequest, "Exactly two declarations are required")
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
        { model: Game, attributes: ['gameName'] },
        { model: Runner, attributes: ['runnerId', 'runnerName'] },
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
    const type = isApproved ? 'Matched' : 'Unmatched';

    if (action === 'reject') {
      await ResultHistory.create({
        gameId: gameId,
        gameName: gameName,
        marketId: marketId,
        marketName: marketName,
        runnerId: [runnerId1, runnerId2],
        runnerNames: runnerNames,
        isApproved: false,
        type: type,
        declaredByNames: declaredByNames,
        declaredById: declaredByIds,
        remarks: type === 'Matched' 
    ? "Your result has been rejected. Kindly reach out to your upline for further guidance." 
    : "Oops! Your submission does not match our records. Please check the data and try again.",
        status: 'Rejected',
        createdAt: new Date(),
      });

    await ResultRequest.update({ status : "Rejected"}, { where : {marketId, status : "Pending"}})

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

    await ResultHistory.create({
      gameId: gameId,
      gameName: gameName,
      marketId: marketId,
      marketName: marketName,
      runnerId: [runnerId1, runnerId2],
      runnerNames: runnerNames,
      isApproved: isApproved,
      type: type,
      declaredByNames: declaredByNames,
      declaredById: declaredByIds,
      remarks : "Congratulations! Your result has been approved.",
      status: 'Approved',
      createdAt: new Date(),
    });
    
  
    await ResultRequest.update({ status : "Approved"}, { where : {marketId, status : "Pending"}})

    await ResultRequest.destroy({ where: { marketId } });

    if (isApproved) {
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

              const marketExposureEntry = userDetails.marketListExposure.find(
                (item) => Object.keys(item)[0] === marketId
              );

              if (marketExposureEntry) {
                const marketExposureValue = Number(marketExposureEntry[marketId]);
                const runnerBalanceValue = Number(runnerBalance.bal);

                if (resultRequests[0].isWin) {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: runnerBalanceValue,
                    type: "win",
                    marketId: marketId,
                    runnerId: runnerId1,
                  });
                } else {
                  await WinningAmount.create({
                    userId: userDetails.userId,
                    userName: userDetails.userName,
                    amount: Math.abs(marketExposureValue),
                    type: "loss",
                    marketId: marketId,
                    runnerId: runnerId1,
                  });
                }

                await ProfitLoss.create({
                  userId: user.userId,
                  userName: userDetails.userName,
                  gameId: gameId,
                  marketId: marketId,
                  runnerId: runnerId1,
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

                await MarketBalance.destroy({
                  where: { marketId, runnerId: runnerId1, userId: user.userId },
                });
              }
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
            gameId: gameId,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: resultRequests } = await ResultRequest.findAndCountAll({
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

    const totalItems = formattedResultRequests.length;
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
          formattedResultRequests,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const type = req.query.type;

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

    const { count, rows: resultHistories } = await ResultHistory.findAndCountAll(queryOptions);

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

    const paginatedData = formattedResultHistories.slice(offset, offset + limit);

    const totalItems = formattedResultHistories.length;
    const totalPages = Math.ceil(totalItems / limit);
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
      attributes: ["userId", "userName", "marketId"],
      where: {
        marketId,
        isVoidAfterWin: false,
      },
    });

    const betHistories = await BetHistory.findAll({
      attributes: [
        "gameId",
        "gameName",
        "marketId",
        "marketName",
        "runnerName",
        "rate",
        "value",
        "type",
        "date",
        "matchDate",
        "placeDate",
      ],
      where: { marketId },
    });

    const combinedData = winningAmounts.map((result) => {
      const relatedBets = betHistories.filter(
        (bet) => bet.marketId === result.marketId
      );

      const bets = relatedBets.map((bet) => ({
        runnerName: bet.runnerName || null,
        rate: bet.rate?.toString() || null,
        value: bet.value?.toString() || null,
        type: bet.type || null,
        date: bet.date || null,
        matchDate: bet.matchDate || null,
        placeDate: bet.placeDate || null,
      }));

      const firstBet = relatedBets[0];

      return {
        userId: result.userId || null,
        userName: result.userName || null,
        gameName: firstBet?.gameName || null,
        marketId: firstBet?.marketId || null,
        marketName: firstBet?.marketName || null,
        bets: bets,
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

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Color-game after winning users bet-data fetched successfully",
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

    await WinningAmount.destroy({
      where: { userId, marketId, type: "win" },
      transaction: t,
    });

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
    const { status, page = 1, pageSize = 10, search } = req.query;
    const offset = (page - 1) * pageSize;
    const whereRequest = { deletedAt: null, declaredById: adminId };
    const whereHistory = {
      [Op.and]: [
        Sequelize.literal(`JSON_SEARCH(declaredById, 'one', '${adminId}') IS NOT NULL`)
      ]
    };

    if (status) {
      whereRequest.status = status;
      whereHistory[Op.and].push({ status });
    }

    if (search) {
      whereRequest.marketName = { [Op.like]: `%${search}%` };
      whereHistory[Op.and].push({ marketName: { [Op.like]: `%${search}%` } });
    }

    // Fetch ResultRequest data (Pending status)
    const resultRequests = await ResultRequest.findAll({
      attributes: ["marketName", "marketId", "status"],
      where: whereRequest,
      group: ["marketId", "status"],
      raw: true,
    });

    // Fetch ResultHistory data (Approved/Rejected)
    const resultHistories = await ResultHistory.findAll({
      attributes: ["marketName", "marketId", "type", "status", "remarks"],
      where: whereHistory,
      raw: true,
    });

    // Merge and sort combined results
    const combinedResults = [...resultRequests, ...resultHistories].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    // Pagination
    const totalItems = combinedResults.length;
    const totalPages = Math.ceil(totalItems / parseInt(pageSize));
    const paginatedData = combinedResults.slice(offset, offset + parseInt(pageSize));

    const pagination = {
      page: parseInt(page),
      limit: parseInt(pageSize),
      totalPages,
      totalItems,
    };

    return res.status(statusCode.success).send(
      apiResponseSuccess(paginatedData, true, statusCode.success, "Data fetched successfully!", pagination)
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
    const { page = 1 , pageSize = 10 ,} = req.query;
    const offset = (page - 1) * pageSize;

    if (!adminId) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Declared By ID is required"));
    }

    const results = await ResultHistory.findAll({
      where: {
        status: "Approved",
        declaredById: Sequelize.literal(`JSON_CONTAINS(declaredById, '"${adminId}"')`),
      },
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

    const whereCondition = { marketId, userId };

    if (search) {
      whereCondition[Op.or] = [
        { userName: { [Op.like]: `%${search}%` } },
        { runnerName: { [Op.like]: `%${search}%` } },
      ];
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

    if (!existingBets || existingBets.length == 0) {
      res
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
    res
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

