import { v4 as uuidv4 } from "uuid";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import CurrentOrder from "../models/currentOrder.model.js"
import MarketTrash from "../models/trash.model.js"
import { sequelize } from "../db.js";
import userSchema from "../models/user.model.js";
import { Op, Sequelize } from 'sequelize';
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import MarketBalance from "../models/marketBalance.js";
import { PreviousState } from "../models/previousState.model.js";
import MarketListExposure from "../models/marketListExposure.model.js";
import { user_Balance } from "./admin.controller.js";

export const deleteLiveBetMarkets = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
   const { marketId, runnerId, userId, betId } = req.body;

    const getMarket = await CurrentOrder.findOne({ where: { marketId, runnerId, betId } });
    if (!getMarket) {
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market or Runner not found"));
    }

    await getMarket.update({ isLiveDeleted: true }, { transaction });

    const user = await userSchema.findOne({ where: { userId }, transaction });

    if (!user) {
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "User not found"));
    }

    const marketBalanceData = await MarketBalance.findOne({
      where: { marketId, runnerId, userId },
    });

    if (marketBalanceData) {
      await marketBalanceData.update({ isLiveDeleted: true  }, { transaction });
    }

    const previousStateData = await PreviousState.findOne({
      where: { marketId, runnerId, userId },
    });

    if (previousStateData) {
      await previousStateData.update({ isLiveDeleted : true  }, { transaction });
    }

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

    if (userId) {
      const remainingMarket = await CurrentOrder.findAll({
        where: {
          marketId,
          userId,
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

      const userBalance = await user_Balance(userId, true);

      // console.log("userBalance", userBalance);

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

        const exposureList = userBalance?.[1] ?? [];


        let marketListExposure = exposureList.map((exposure) => ({
          [exposure.MarketId]: exposure.exposure,
        }));

        let marketExposure = marketListExposure || [];

        // console.log("marketExposure", marketExposure);

        let exposureMap = marketExposure.reduce((acc, obj) => {
          return { ...acc, ...obj };
        }, {});

        exposureMap[marketId] = Math.abs(maxNegativeRunnerBalance.bal);

        marketListExposure = Object.keys(exposureMap).map(key => ({ [key]: exposureMap[key] }));

        console.log("marketListExposure", marketListExposure);

      });


      // await user.update({
      //   marketListExposure: user.marketListExposure,
      // }, { transaction });

      await MarketListExposure.update({
        exposure: Math.abs(maxNegativeRunnerBalance.bal),
      }, {
        where: {
          userId,
          marketId,
          runnerId,
        },
        transaction
      });
    }
    await transaction.commit();

    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting live bet markets:", error);
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};



export const getMarket = async (req, res) => {
  try {
    let { page = 1, pageSize = 10, search } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const whereCondition = {
      isLiveDeleted: true,
    };

    if (search) {
      whereCondition.marketName = {
        [Op.like]: `%${search}%`,
      };
    }

    const existingMarket = await CurrentOrder.findAll({
      attributes: ["marketId", "marketName", "gameId", "gameName", "userName", "createdAt"],
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      group: ["marketId"],
    })

    if (!existingMarket || existingMarket.length === 0) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(
          [],
          true,
          statusCode.success,
          "No markets found",
        ));
    };

    const offset = (page - 1) * pageSize;

    const getAllMarkets = existingMarket.slice(offset, offset + pageSize);

    const totalItems = existingMarket.length;
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

export const getTrashMarketDetails = async (req, res) => {
  try {
    let { page = 1, pageSize = 10 } = req.query;
    const { marketId } = req.params;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const orders = await CurrentOrder.findAll({
      where: {
        marketId,
        isLiveDeleted: true,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!orders.length) {
      return res
        .status(statusCode.success)
        .send(
          apiResponseSuccess([], true, statusCode.success, "No data found for this market")
        );
    }

    const getData = orders.map((order) => ({
      currentOrderId: order.currentOrderId,
      marketId: order.marketId,
      marketName: order.marketName,
      runnerId: order.runnerId,
      runnerName: order.runnerName,
      userId: order.userId,
      userName: order.userName,
      betId: order.betId,
      rate: order.rate,
      type: order.type,
      bidAmount: order.bidAmount,
      value: order.value,
      createdAt: order.createdAt,
    }));

    const offset = (page - 1) * pageSize;
    const paginatedData = getData.slice(offset, offset + pageSize);

    const paginationData = {
      page,
      pageSize,
      totalPages: Math.ceil(getData.length / pageSize),
      totalItems: getData.length,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          paginatedData,
          true,
          statusCode.success,
          "Market details fetched successfully",
          paginationData
        )
      );
  } catch (error) {
    console.error("Error fetching market details:", error);
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
  const transaction = await sequelize.transaction();
  try {
    const { marketId, userId, runnerId, betId } = req.body;

    const getMarket = await CurrentOrder.findOne({ where: { marketId, runnerId, betId }, transaction });
    if (!getMarket) {
      await transaction.rollback();
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market or Runner not found"));
    }

    await getMarket.update({ isLivePermanentDeleted: true }, { transaction });
    await getMarket.destroy({ transaction });

    const user = await userSchema.findOne({ where: { userId }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "User not found"));
    }

    const marketBalanceData = await MarketBalance.findOne({ where: { marketId, runnerId, userId }, transaction });
    if (marketBalanceData) {
      await marketBalanceData.update({ isLivePermanentDeleted: true }, { transaction });
      await marketBalanceData.destroy({ transaction });
    }

    const previousStateData = await PreviousState.findOne({ where: { marketId, runnerId, userId }, transaction });
    if (previousStateData) {
      await previousStateData.update({ isLivePermanentDeleted: true }, { transaction });
      await previousStateData.destroy({ transaction });
    }

    await transaction.commit();
    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Bet deleted successfully"));

  } catch (error) {
    await transaction.rollback();
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};


export const restoreMarketData = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { marketId, userId, runnerId, betId } = req.body;

    const getMarket = await CurrentOrder.findOne({ where: { marketId, runnerId, betId }, transaction });
    if (!getMarket) {
      await transaction.rollback();
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market or Runner not found"));
    }

    await getMarket.update({ isLiveDeleted: false }, { transaction });

    const user = await userSchema.findOne({ where: { userId }, transaction });
    if (!user) {
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "User not found"));
    }

    const marketBalanceData = await MarketBalance.findOne({
      where: { marketId, runnerId, userId },
      transaction
    });
    if (marketBalanceData) {
      await marketBalanceData.update({ isLiveDeleted: false }, { transaction });
    }

    const previousStateData = await PreviousState.findOne({
      where: { marketId, runnerId, userId },
      transaction
    });

    if (previousStateData) {
      await previousStateData.update({ isLiveDeleted: false }, { transaction });
    }

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

    await transaction.commit();

    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Restore data successfully"));

  } catch (error) {
    console.log("error", error)
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
