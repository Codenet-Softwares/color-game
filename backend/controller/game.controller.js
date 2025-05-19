import {
  apiResponseSuccess,
  apiResponseErr,
  apiResponsePagination,
} from "../middleware/serverError.js";
import { v4 as uuidv4 } from "uuid";
import Game from "../models/game.model.js";
import { statusCode } from "../helper/statusCodes.js";
import { Op } from "sequelize";
import Market from "../models/market.model.js";
import Runner from "../models/runner.model.js";
import rateSchema from "../models/rate.model.js";
import BetHistory from "../models/betHistory.model.js";
import CurrentOrder from "../models/currentOrder.model.js";
import MarketDeleteApproval from "../models/marketApproval.model.js";
import ResultRequest from "../models/resultRequest.model.js";
import { sequelize } from "../db.js";
import { db } from "../firebase-db.js";


// done
export const createGame = async (req, res) => {
  try {
      const { gameName, description, isBlink } = req.body;
    const gameId = uuidv4();
    const existingGame = await Game.findOne({ where: { gameName } });

    if (existingGame) {
      return res
        .status(statusCode.badRequest)
        .json(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Game name already exists"
          )
        );
    }

    const newGame = await Game.create({
      gameId,
      gameName,
      description,
      isBlink,
    });

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          newGame,
          true,
          statusCode.create,
          "Game created successfully"
        )
      );
  } catch (error) {
    console.error("Error creating game:", error);
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
export const getAllGames = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const searchQuery = req.query.search || "";

    // Fetch games with pagination and search query
    const { count, rows: games } = await Game.findAndCountAll({
      attributes: ["gameId", "gameName", "description"],
      where: {
        gameName: {
          [Op.like]: `%${searchQuery}%`,
        },
        isDeleted: false,
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
    });

    // Prepare pagination data
    const totalPages = Math.ceil(count / pageSize);
    const paginationData = apiResponsePagination(page, totalPages, count);

    // Check if no games found
    if (!games || games.length === 0) {
      return res.status(statusCode.success).json(
        apiResponseSuccess(
          { games: [], pagination: paginationData },
          true,
          statusCode.success,
          "No games found"
        )
      );
    }

    // Map game data
    const gameData = games.map((game) => ({
      gameId: game.gameId,
      gameName: game.gameName,
      description: game.description,
    }));

    // Prepare response
    const response = {
      games: gameData,
      pagination: paginationData,
    };

    return res
      .status(statusCode.success)
      .json(apiResponseSuccess(response, true, statusCode.success, "Success"));
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
export const updateGame = async (req, res) => {
  const { gameId, gameName, description } = req.body;
  try {
    const game = await Game.findOne({
      where: {
        gameId: gameId,
      },
    });

    if (!game) {
      return res
        .status(statusCode.notFound)
        .json(
          apiResponseErr(null, false, statusCode.badRequest, "Game not found.")
        );
    }

    if (gameName) {
      game.gameName = gameName;
    }

    if (description !== undefined) {
      game.description = description;
    }

    await game.save();

    const updatedGame = await Game.findOne({
      where: {
        gameId: gameId,
      },
    });

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          updatedGame,
          true,
          statusCode.success,
          "Game updated successfully."
        )
      );
  } catch (error) {
    console.error("Error updating game:", error);
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
// time format need to changed its save utc zone
export const createMarket = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { marketName, participants, startTime, endTime } = req.body;


    const existingMarket = await Market.findOne({
      where: {
        gameId: gameId,
        marketName: marketName,
      },
    });

    if (existingMarket) {
      return res
        .status(statusCode.badRequest)
        .json(
          apiResponseErr(
            existingMarket,
            false,
            409,
            "Market already exists for this game"
          )
        );
    }

    const game = await Game.findOne({
      where: {
        gameId: gameId,
      },
    });

    if (!game) {
      return res
        .status(statusCode.badRequest)
        .json(
          apiResponseErr(null, false, statusCode.badRequest, "Game not found")
        );
    }

    const marketId = uuidv4();

    const newMarket = await Market.create({
      gameId: gameId,
      marketId: marketId,
      marketName: marketName,
      participants: participants,
      // startTime: moment(startTime).utc().format(),
      // endTime: moment(endTime).utc().format(),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      announcementResult: false,
      isActive: false,
      isDisplay: true,
      hideMarketUser: true
    });

     // Save data to Firestore
    const formatDateTime = (date) =>date.toISOString().slice(0, 19).replace("T", " ");

    await db.collection('color-game-db').doc(newMarket.marketId).set({
      gameId : newMarket.gameId,
      marketName : newMarket.marketName,
      participants : newMarket.participants,
      startTime : formatDateTime(newMarket.startTime),
      endTime : formatDateTime(newMarket.endTime),
      announcementResult : newMarket.announcementResult,
      isActive : newMarket.isActive,
      isDisplay : newMarket.isDisplay,
      hideMarketUser : newMarket.hideMarketUser,
    });

    return res
      .status(statusCode.create)
      .json(
        apiResponseSuccess(
          newMarket,
          true,
          statusCode.create,
          "Market created successfully"
        )
      );
  } catch (error) {
    console.error("Error creating market:", error);
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
export const getAllMarkets = async (req, res) => {
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
        hideMarket: false,
        isVoid: false,
        deleteApproval: false
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
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
export const updateMarket = async (req, res) => {
  const { marketId, marketName, participants, startTime, endTime } = req.body;
  try {
    const market = await Market.findOne({
      where: {
        marketId: marketId,
      },
    });
    const gameId = market.gameId
    if (!market) {
      return res
        .status(statusCode.notFound)
        .json(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Market not found."
          )
        );
    }

    const formatDateTime = (date) => {
      // Handle case where date is already in SQL format
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
        return date;
      }
      // Handle Date object or ISO string
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date value');
      }
      return dateObj.toISOString().slice(0, 19).replace("T", " ");
    };

    if (marketName !== undefined) {
      market.marketName = marketName;
    }

    if (participants !== undefined) {
      market.participants = participants;
      market.isDisplay = true;
      Runner.destroy({ where: { marketId } })
    }
    if (startTime !== undefined) {
      // market.startTime = moment(startTime).utc().format();
      market.startTime = new Date(startTime);

    }

    if (endTime !== undefined) {
      // market.endTime = moment(endTime).utc().format();
      market.endTime = new Date(endTime);

    }

    await market.save();

    const runners = await Runner.findAll({ where: { marketId } })

    if (runners.isRunnerCreate === true) {
      await Market.update(
        { isDisplay: false },
        {
          where: {
            marketId: marketId,
          },
        }
      );
    }

    const updatedMarket = await Market.findOne({
      where: {
        marketId: marketId,
      },
    });


    const firestoreRef = db.collection("color-game-db").doc(marketId);
    await firestoreRef.set({
      // marketName: updatedMarket.marketName,
      // participants: updatedMarket.participants,
      startTime: formatDateTime(updatedMarket.startTime),
      endTime: formatDateTime(updatedMarket.endTime),
      // isDisplay: updatedMarket.isDisplay,
      updatedAt: new Date().toISOString(), 
    }, { merge: true });

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          updatedMarket,
          true,
          statusCode.success,
          "Market updated successfully."
        )
      );
  } catch (error) {
    console.error("Error updating market:", error);
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
export const createRunner = async (req, res) => {
  try {
    const marketId = req.params.marketId;
    const { runners } = req.body;

    const market = await Market.findOne({
      where: {
        marketId: marketId,
      },
    });

    if (!market) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Market Not Found"
      );
    }

    const existingRunners = await Runner.findAll({
      attributes: ["runnerName"],
      where: {
        marketId: marketId,
      },
    });

    const existingRunnerNames = new Set(
      existingRunners.map((runner) => runner.runnerName.toLowerCase())
    );

    for (const runner of runners) {
      const lowerCaseRunnerName = runner.runnerName.toLowerCase();
      if (existingRunnerNames.has(lowerCaseRunnerName)) {
        throw apiResponseErr(
          null,
          false,
          statusCode.badRequest,
          `Runner "${runner.runnerName}" already exists for this market`
        );
      }
    }

    const maxParticipants = market.participants;
    if (runners.length !== maxParticipants) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Number of runners does not match the maximum allowed participants"
      );
    }

    const runnersToInsert = runners.map((runner) => ({
      marketId: marketId,
      runnerId: uuidv4(),
      runnerName: runner.runnerName,
      isWin: 0,
      bal: 0,
      back: runner.back ?? null,
      lay: runner.lay ?? null,
    }));

    await Runner.bulkCreate(runnersToInsert);

    await Runner.update(
      { isRunnerCreate: true },
      {
        where: {
          marketId: marketId,
        },
      }
    );

    await Market.update(
      { isDisplay: false },
      {
        where: {
          marketId: marketId,
        },
      }
    );

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.create,
          "Runners created successfully"
        )
      );
  } catch (error) {
    console.error("Error creating runner:", error);
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
export const updateRunner = async (req, res) => {
  try {
    const { runnerId, runnerName, back, lay } = req.body;

    const updateData = {};
    if (runnerName) updateData.runnerName = runnerName;
    if (back !== undefined) updateData.back = back;
    if (lay !== undefined) updateData.lay = lay;

    const marketData = await Runner.findOne({ where: { runnerId } });
    const [rowsAffected] = await Runner.update(updateData, {
      where: { runnerId: runnerId }
    });

    if (rowsAffected === 0) {
      return res
        .status(statusCode.notFound)
        .json(
          apiResponseErr(null, false, statusCode.notFound, "Runner not found.")
        );
    }

    // Fetch the market document from Firestore
    const marketId = marketData.marketId;
    const marketRef = db.collection("color-game-db").doc(marketId);
    // const marketSnapshot = await marketRef.get();

    // if (!marketSnapshot.exists) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Market not found in Firestore." });
    // }

    // let marketDataFirestore = marketSnapshot.data();
    // let runners = marketDataFirestore.runners || [];

    // // Find the runner inside Firestore document
    // const runnerIndex = runners.findIndex((r) => r.runnerId === runnerId);

    // if (runnerIndex === -1) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Runner not found in Firestore." });
    // }

    // // Modify the specific runner's fields
    // if (runnerName !== undefined) runners[runnerIndex].runnerName = runnerName;
    // if (back !== undefined) runners[runnerIndex].back = back;
    // if (lay !== undefined) runners[runnerIndex].lay = lay;

    // Update Firestore document with modified runners array
    await marketRef.update({ updatedAt: new Date().toISOString(), });
    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Runner updated successfully."
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
export const createRate = async (req, res) => {
  try {
    const runnerId = req.params.runnerId;
    const { back, lay } = req.body;

    const existingRunner = await Runner.findOne({
      where: { runnerId: runnerId },
    });

    if (!existingRunner) {
      throw new Error(`Runner with ID ${runnerId} not found.`);
    }

    let existingRate = await rateSchema.findOne({
      where: { runnerId: runnerId },
    });

    if (existingRate) {
      await existingRate.update({
        back: back,
        lay: lay,
      });
    } else {
      await rateSchema.create({
        runnerId: runnerId,
        back: back,
        lay: lay,
      });
    }

    await Runner.update(
      { back: back, lay: lay },
      { where: { runnerId: runnerId } }
    );

    return res
      .status(statusCode.create)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.create,
          "Rate created or updated successfully"
        )
      );
  } catch (error) {
    console.error("Error creating or updating rate:", error);
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
export const updateRate = async (req, res) => {
  try {
    const { runnerId, back, lay } = req.body;

    if (back === undefined && lay === undefined) {
      throw apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Either Back or Lay field is required for update."
      );
    }

    const runnerBeforeUpdate = await Runner.findOne({ where: { runnerId } });

    if (!runnerBeforeUpdate) {
      throw apiResponseErr(
        null,
        false,
        statusCode.notFound,
        "Runner not found."
      );
    }

    const updateFields = {};

    if (back !== undefined && back !== parseFloat(runnerBeforeUpdate.back)) {
      updateFields.back = back;
    }

    if (lay !== undefined && lay !== parseFloat(runnerBeforeUpdate.lay)) {
      updateFields.lay = lay;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(statusCode.success)
        .json(
          apiResponseSuccess(
            null,
            true,
            statusCode.success,
            "No changes detected. Runner rate remains the same."
          )
        );
    }

    const [updatedRows] = await Runner.update(updateFields, {
      where: { runnerId },
    });

    if (updatedRows === 0) {
      throw apiResponseErr(
        null,
        false,
        statusCode.notFound,
        "Runner not found."
      );
    }

    // Fetch the market document from Firestore
    const marketData = await Runner.findOne({ where: { runnerId } });
    const marketId = marketData.marketId;
    const marketRef = db.collection("color-game-db").doc(marketId);
    // const marketSnapshot = await marketRef.get();

    // if (!marketSnapshot.exists) {
    //   return res
    //     .status(statusCode.notFound)
    //     .json(apiResponseErr(null, false, statusCode.notFound, "Market not found in Firestore."));
    // }

    // let marketDataFirestore = marketSnapshot.data();
    // let runners = marketDataFirestore.runners || [];

    // // Find the runner inside Firestore
    // const runnerIndex = runners.findIndex((r) => r.runnerId === runnerId);

    // if (runnerIndex === -1) {
    //   return res
    //     .status(statusCode.notFound)
    //     .json(apiResponseErr(null, false, statusCode.notFound, "Runner not found in Firestore."));
    // }

    // // Modify only the back and lay fields
    // if (back !== undefined) runners[runnerIndex].back = back;
    // if (lay !== undefined) runners[runnerIndex].lay = lay;

    // Update Firestore document
    await marketRef.update({ updatedAt: new Date().toISOString(),  });

    return res
      .status(statusCode.success)
      .json(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Rate updated successfully."
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
export const getAllRunners = async (req, res) => {
  try {
    const marketId = req.params.marketId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.search || "";

    const whereConditions = {
      marketId: marketId,
      hideRunner: false,
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
      order: [["createdAt", "DESC"]],
    });

    const transformedRunners = runners.map((runner) => ({
      runnerId: runner.runnerId,
      runnerName: runner.runnerName,
      isBidding: runner.isBidding,
      rates: [
        {
          Back: runner.back,
          Lay: runner.lay,
        },
      ],
    }));

    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationData = apiResponsePagination(page, pageSize, totalPages, totalItems);

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
export const deleteGame = async (req, res) => {
  try {
  const gameId = req.params.gameId;

    if (!gameId) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Game ID cannot be empty"
          )
        );
    }

    const markets = await Market.findAll({
      where: {
        gameId: gameId,
      },
    });

    const marketIds = markets.map((market) => market.marketId);

    const runners = await Runner.findAll({
      where: {
        marketId: {
          [Op.in]: marketIds,
        },
      },
    });

    const runnerIds = runners.map((runner) => runner.runnerId);

    await CurrentOrder.update({
      isDeleted: true,
    }, {
      where: {
        marketId: {
          [Op.in]: marketIds,
        },
      },
    });

    await BetHistory.update({
      isDeleted: true,
    }, {
      where: {
        marketId: {
          [Op.in]: marketIds,
        },
      },
    });

    await rateSchema.update({
      isDeleted: true,
    }, {
      where: {
        runnerId: {
          [Op.in]: runnerIds,
        },
      },
    });

    await Runner.update({
      isDeleted: true,
    }, {
      where: {
        marketId: {
          [Op.in]: marketIds,
        },
      },
    });

    await ResultRequest.update({
      isDeleted: true,
    }, {
      where: {
        marketId: {
          [Op.in]: marketIds,
        },
      },
    });

    await Market.update({
      isDeleted: true,
    }, {
      where: {
        gameId: gameId,
      },
    });

    const deletedGameCount = await Game.update({
      isDeleted: true,
    }, {
      where: {
        gameId: gameId,
      },
    });

    if (deletedGameCount === 0) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.notFound, "Game not found")
        );
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Game deleted successfully"
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
export const deleteMarket = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { marketId } = req.params;

    const getMarket = await Market.findOne({ where: { marketId }, transaction });
    if (!getMarket) {
      return res
        .status(statusCode.success)
        .send(apiResponseSuccess(null, true, statusCode.success, "Market or Runner not found"));
    }

    await MarketDeleteApproval.create({
      approvalMarkets: [getMarket.dataValues],
      approvalMarketId: uuidv4(),
    }, { transaction });

    await getMarket.update({
      deleteApproval: true,
      transaction,
    });

    await transaction.commit();

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Market deleted successfully"
        )
      );
  } catch (error) {
    transaction.rollback();
    res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};
// done
export const deleteRunner = async (req, res) => {
  try {
    const { runnerId } = req.params;

    await rateSchema.destroy({
      where: {
        runnerId: runnerId,
      },
    });

    const deletedRunnerCount = await Runner.destroy({
      where: {
        runnerId: runnerId,
      },
    });

    if (deletedRunnerCount === 0) {
      return res
        .status(statusCode.notFound)
        .send(
          apiResponseErr(null, false, statusCode.notFound, "Runner not found")
        );
    }

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          null,
          true,
          statusCode.success,
          "Runner deleted successfully"
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

export const gameActiveInactive = async (req, res) => {
  const { status, gameId } = req.body;

  if (typeof status !== 'boolean') {
    return res
      .status(statusCode.badRequest)
      .json(
        apiResponseErr(null, false, statusCode.badRequest, "Status must be a boolean")
      );
  }

  try {
    const games = await Game.findOne({ where: { gameId } });

    if (!games) {
      return res
        .status(statusCode.badRequest)
        .json(
          apiResponseErr(null, false, statusCode.badRequest, "Game not found")
        );
    }

    games.activeInactive = status;
    await games.save();

    const statusMessage = status ? "Game is active" : "Game is inactive";
    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(statusMessage, true, statusCode.success, "success")
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


export const updateGameStatus = async (req, res) => {
  const { status } = req.body;
  const { gameId } = req.params;

  try {
    const game = await Game.findOne({ where: { gameId } });
    if (!game) {
      return res
        .status(statusCode.badRequest)
        .json(
          apiResponseErr(null, false, statusCode.badRequest, "Game not found")
        );
    }
    game.isGameActive = status;
    await game.save();

    const markets = await Market.findAll({ where: { gameId } });
    if (markets.length > 0) {
      for (const market of markets) {
        market.isActive = status;
        await market.save();
      }
    }
    const marketsUpdated = markets.map(market => ({
      marketId: market.marketId,
      status: market.isActive,
    }))

    const statusMessage = `Game ${status ? 'activated' : 'suspended'} successfully.`

    res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(marketsUpdated, true, statusCode.success, statusMessage)
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

export const trashDeleteGame = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Game ID cannot be empty")
      );
    }

    const markets = await Market.findAll({ where: { gameId }, transaction: t });
    const marketIds = markets.map((market) => market.marketId);

    if (marketIds.length === 0) {
      await t.rollback();
      return res.status(statusCode.notFound).send(
        apiResponseErr(null, false, statusCode.notFound, "No markets found for this game")
      );
    }

    const runners = await Runner.findAll({
      where: { marketId: { [Op.in]: marketIds } },
      transaction: t
    });

    const runnerIds = runners.map((runner) => runner.runnerId);

    await CurrentOrder.update({ isPermanentDeleted: true }, { where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await BetHistory.update({ isPermanentDeleted: true }, { where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await rateSchema.update({ isPermanentDeleted: true }, { where: { runnerId: { [Op.in]: runnerIds } }, transaction: t });
    await Runner.update({ isPermanentDeleted: true }, { where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await ResultRequest.update({ isPermanentDeleted: true }, { where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await Market.update({ isPermanentDeleted: true }, { where: { gameId }, transaction: t });

    const [deletedGameCount] = await Game.update({ isPermanentDeleted: true }, { where: { gameId }, transaction: t });

    if (deletedGameCount === 0) {
      await t.rollback();
      return res.status(statusCode.notFound).send(
        apiResponseErr(null, false, statusCode.notFound, "Game not found")
      );
    }

    await CurrentOrder.destroy({ where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await BetHistory.destroy({ where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await rateSchema.destroy({ where: { runnerId: { [Op.in]: runnerIds } }, transaction: t });
    await Runner.destroy({ where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await ResultRequest.destroy({ where: { marketId: { [Op.in]: marketIds } }, transaction: t });
    await Market.destroy({ where: { gameId }, transaction: t });
    await Game.destroy({ where: { gameId }, transaction: t });

    await t.commit();

    return res.status(statusCode.success).send(
      apiResponseSuccess(null, true, statusCode.success, "Game deleted successfully")
    );
  } catch (error) {
    await t.rollback();
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(
        error.data ?? null,
        false,
        error.responseCode ?? statusCode.internalServerError,
        error.errMessage ?? error.message
      )
    );
  }
};
