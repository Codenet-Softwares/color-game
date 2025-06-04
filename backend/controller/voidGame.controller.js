import { statusCode } from "../helper/statusCodes.js";
import {
  apiResponseErr,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import Market from "../models/market.model.js";
import MarketBalance from "../models/marketBalance.js";
import userSchema from "../models/user.model.js";
import CurrentOrder from "../models/currentOrder.model.js";
import Game from "../models/game.model.js";
import Runner from "../models/runner.model.js";
import { Op } from "sequelize";
import BetHistory from "../models/betHistory.model.js";
import MarketListExposure from "../models/marketListExposure.model.js";
import { sequelizeArchive } from "../db.js"
import { deleteLotteryFromFirebase } from "../helper/firebase.delete.js";

export const voidMarket = async (req, res) => {
  try {
    const { marketId } = req.body;

    const market = await Market.findOne({ where: { marketId } });
    if (!market) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(null, false, statusCode.badRequest, "Market not found")
        );
    }

    const [ marketUpdate ] = await Market.update(
      { isVoid: true, isDeleted: true, isPermanentDeleted : true },{ where: { marketId }, }
    );

    const users = await MarketBalance.findAll({ where: { marketId } });

    for (const user of users) {
      const userDetails = await userSchema.findOne({ where: { userId: user.userId } });

      if (userDetails) {
        const exposureEntry = await MarketListExposure.findOne({
          where: {
            UserId: user.userId,
            MarketId: marketId,
          },
        });

        if (exposureEntry) {
          await MarketListExposure.destroy({
            where: {
              UserId: user.userId,
              MarketId: marketId,
            },
          });

          const orders = await CurrentOrder.findAll({ where: { marketId, userId: user.userId } });

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
              isVoid: true
            });
          }

          await MarketBalance.destroy({
            where: { marketId, userId: user.userId },
          });

          await CurrentOrder.destroy({
            where: { marketId, userId: user.userId },
          });
        }
      }
    }

    
    if (marketUpdate > 0) {
      await Market.destroy({
        where: {
          marketId
        },
      });
    };

    await deleteLotteryFromFirebase(marketId)

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(null, true, statusCode.success, "Market voided successfully"));
  } catch (error) {
    console.error("Error voiding market:", error);
    return res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};


export const getAllVoidMarkets = async (req, res) => {
  try {
    let { page = 1, pageSize = 10, search = "" } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const offset = (page - 1) * pageSize;

    let query = `
  SELECT 
    m.id,
    m.marketId,
    m.marketName,
    m.gameId,
    g.gameName,
    r.runnerId,
    r.runnerName,
    r.back,
    r.lay
  FROM colorgame_refactor_archive.market m
  LEFT JOIN colorgame_refactor_archive.game g ON m.gameId = g.gameId
  LEFT JOIN colorgame_refactor_archive.runner r ON m.marketId = r.marketId
  WHERE m.isVoid = 1
`;

    if (search && search.trim() !== "") {
      query += ` AND m.marketName LIKE :search`;
    }

    query += ` ORDER BY m.id DESC`;

    const markets = await sequelizeArchive.query(query, {
      replacements: { search: `%${search}%` },
      type: sequelizeArchive.QueryTypes.SELECT,
    });

    console.log("markets",markets)
    // Group markets by marketId to structure them with runners
    const groupedMarkets = {};

    markets.forEach(market => {
      if (!groupedMarkets[market.marketId]) {
        groupedMarkets[market.marketId] = {
          gameId: market.gameId,
          gameName: market.gameName,
          marketId: market.marketId,
          marketName: market.marketName,
          Runners: []
        };
      }

      if (market.runnerId) {
        groupedMarkets[market.marketId].Runners.push({
          runnerId: market.runnerId,
          runnerName: market.runnerName,
          back: market.back,
          lay: market.lay
        });
      }
    });
    

    const formattedMarkets = Object.values(groupedMarkets);

    const totalItems = formattedMarkets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = formattedMarkets.slice(offset, offset + pageSize);

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(
        paginatedData,
        true,
        statusCode.success,
        'Voided markets retrieved successfully',
        {
          page,
          pageSize,
          totalItems,
          totalPages
        }
      ));
  } catch (error) {
    console.error('Error retrieving voided markets:', error);
    return res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};




