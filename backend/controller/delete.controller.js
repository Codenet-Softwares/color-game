import { v4 as uuidv4 } from "uuid";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import CurrentOrder from "../models/currentOrder.model.js"
import MarketTrash from "../models/trash.model.js"
import sequelize from "../db.js";
import userSchema from "../models/user.model.js";
import { Op, Sequelize } from 'sequelize';
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import MarketBalance from "../models/marketBalance.js";
import { PreviousState } from "../models/previousState.model.js";
import MarketListExposure from "../models/marketListExposure.model.js";

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

    await getMarket.destroy({ transaction });

    const marketBalanceData = await MarketBalance.findOne({
      where: { marketId, runnerId, userId },
    });

    if (marketBalanceData) {
      await marketBalanceData.destroy({ transaction });
    }

    const previousStateData = await PreviousState.findOne({
      where: { marketId, runnerId, userId },
    });

    if (previousStateData) {
      await previousStateData.destroy({ transaction });
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
      });

      // Calculate max negative balance for exposure
      const maxNegativeRunnerBalance = userMarketBalance.runnerBalance.reduce((max, current) => {
        return current.bal < max.bal ? current : max;
      }, { bal: 0 });

      const updatedExposureValue = Math.abs(maxNegativeRunnerBalance.bal);

      // Save or update MarketListExposure
      const existingExposure = await MarketListExposure.findOne({
        where: {
          UserId: userId,
          MarketId: marketId
        },
        transaction
      });

      if (existingExposure) {
        await existingExposure.update({
          exposure: updatedExposureValue
        }, { transaction });
      } else {
        await MarketListExposure.create({
          UserId: userId,
          MarketId: marketId,
          exposure: updatedExposureValue
        }, { transaction });
      }
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

    const existingMarket = await MarketTrash.findAll({
      attributes: ["trashMarkets", "createdAt"],
      order: [["createdAt", "DESC"]]
    });

    const allMarkets = [];
    existingMarket.forEach((record) => {
      const markets = record.trashMarkets;
      if (Array.isArray(markets)) {
        allMarkets.push(...markets);
      }
    });


    if (allMarkets.length === 0) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(
          [],
          true,
          statusCode.success,
          "No markets found",
        ));
    }

    const filteredMarkets = search
      ? allMarkets.filter(
        (market) =>
          market.userName?.toLowerCase().includes(search.toLowerCase()) ||
          market.marketName?.toLowerCase().includes(search.toLowerCase())
      )
      : allMarkets;

    if (filteredMarkets.length === 0) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(
          [],
          true,
          statusCode.success,
          "No markets match the search criteria",
        ));
    }

    const uniqueMarkets = [
      ...new Map(
        filteredMarkets.map((m) => [
          m.marketId,
          { marketId: m.marketId, marketName: m.marketName, gameId: m.gameId, gameName: m.gameName, userName: m.userName },
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
  const transaction = await sequelize.transaction();
  try {
    const { trashMarketId } = req.params

    const trash_data = await MarketTrash.findOne({ where: { trashMarketId } });

    if (!trash_data) { return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, 'Market trash data not found')) }

    const trash_markets = trash_data.dataValues.trashMarkets;

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
      betId: data.betId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }));

    const { marketId, userId, runnerId, betId } = map_trash_data[0];

    const checkMarket = await Market.findOne({ where: { marketId }, transaction });

    if (!checkMarket) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, 'Market is no longer available, cannot restore bet')
      );
    }

    if (!checkMarket.isActive) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, 'Market is suspended, cannot restore bet.')
      );
    }

    await CurrentOrder.bulkCreate(map_trash_data, { transaction });

    const user = await userSchema.findOne({ where: { userId }, transaction });
    if (!user) {
      return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "User not found"));
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

    await MarketTrash.destroy({ where: { trashMarketId } })

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
