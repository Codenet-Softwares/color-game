import axios from "axios";
import jwt from 'jsonwebtoken';
import { statusCode } from "../helper/statusCodes.js";
import {
  apiResponseErr,
  apiResponseSuccess,
} from "../middleware/serverError.js";
import userSchema from "../models/user.model.js";
import LotteryProfit_Loss from "../models/lotteryProfit_loss.model.js";
import sequelize from "../db.js";
import { user_Balance } from "./admin.controller.js";
import WinningAmount from "../models/winningAmount.model.js";
import { Op } from "sequelize";

export const searchTicket = async (req, res) => {
  try {
    const { group, series, number, sem, marketId } = req.body;

    const baseURL = process.env.LOTTERY_URL;

    const token = jwt.sign(
      { roles: req.user.roles },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const payload = { group, series, number, sem, marketId };

    const response = await axios.post(`${baseURL}/api/search-ticket`, payload, { headers });

    if (!response.data.success) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, "Failed to search ticket"));
    }

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(response.data.data, true, statusCode.success, "Success"));

  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

export const purchaseLottery = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { generateId, lotteryPrice } = req.body;
    const { userId, userName, roles, balance, marketListExposure } = req.user;
    const { marketId } = req.params;
    const baseURL = process.env.LOTTERY_URL;
    const whiteLabelUrl = process.env.WHITE_LABEL_URL;

    const token = jwt.sign({ roles }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const userBalance = await user_Balance(userId)
    
    if (userBalance < lotteryPrice) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, "Insufficient balance"));
    }

    const user = await userSchema.findOne({ where: { userId }, transaction: t });

    let updatedMarketListExposure;

    if (!marketListExposure || marketListExposure.length === 0) {
      updatedMarketListExposure = [{ [marketId]: lotteryPrice }];
    } else {
      updatedMarketListExposure = marketListExposure.map(exposure => {
        if (exposure.hasOwnProperty(marketId)) {
          exposure[marketId] += lotteryPrice;
        }
        return exposure;
      });
    }

    if (!updatedMarketListExposure.some(exposure => exposure.hasOwnProperty(marketId))) {
      const newExposure = { [marketId]: lotteryPrice };
      updatedMarketListExposure.push(newExposure);
    }

    user.marketListExposure = updatedMarketListExposure;
    await user.save({ fields: ["marketListExposure"], transaction: t });

    const marketExposure = user.marketListExposure;

    let totalExposure = 0;
    marketExposure.forEach(market => {
      const exposure = Object.values(market)[0];
      totalExposure += exposure;
    });


    const [rs1] = await Promise.all([
      axios.post(
        `${baseURL}/api/purchase-lottery/${marketId}`,
        { generateId, userId, userName, lotteryPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),

    ]);

    if (!rs1.data.success) {
      return res.status(statusCode.success).send(rs1.data);
    }

    await t.commit();
    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.create, "Lottery purchased successfully"));
  } catch (error) {
    await t.rollback();

    console.error("Error:", error);
    if (error.response) {
      return res.status(error.response.status).send(apiResponseErr(null, false, error.response.status, error.response.data.message || error.response.data.errMessage));
    } else {
      return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
    }
  }
};

export const purchaseHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit, sem, date } = req.query;
    const { marketId } = req.params;

    const params = {
      page,
      limit,
      sem,
    };

    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.post(
      `${baseURL}/api/purchase-history/${marketId}`,
      { userId },
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
            "Failed to get purchase history"
          )
        );
    }

    const { data, pagination } = response.data;
    const paginationData = {
      page: pagination?.page || page,
      limit: pagination?.limit || limit,
      totalPages: pagination?.totalPages || 1,
      totalItems: pagination?.totalItems || data.length,
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
    console.error('Error:', error);

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

export const getTicketRange = async (req, res) => {
  try {
    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/get-range`);

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, "Failed to get purchase history"));
    }

    return res.status(statusCode.success).send(apiResponseSuccess(response.data.data, true, statusCode.success, "Success"));

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }

}

export const getResult = async (req, res) => {
  try {
    const token = jwt.sign({ roles: req.user.roles }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const baseURL = process.env.LOTTERY_URL;

    const response = await axios.get(`${baseURL}/api/prize-results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, "Failed to get result"));
    }

    return res.status(statusCode.success).send(apiResponseSuccess(response.data.data, true, statusCode.success, "Success"));

  } catch (error) {

    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

export const getMarkets = async (req, res) => {
  try {
    const token = jwt.sign(
      { roles: req.user.roles },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/getAll-markets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Failed to get Draw Date"
          )
        );
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          response.data.data,
          true,
          statusCode.success,
          "Success"
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

export const updateBalance = async (req, res) => {
  try {
    const { userId, prizeAmount, marketId } = req.body;
    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, 'User not found.'));
    }

    await WinningAmount.create({
      userId: user.userId,
      userName: user.userName,
      amount:  prizeAmount,
      type: "win",
      marketId,
    });

     const users = await userSchema.findAll({
      where: { marketListExposure: { [Op.ne]: null } },
    });

    for (const user of users) {
      if (user.marketListExposure) {
        let updatedExposure = user.marketListExposure.filter((entry) => !entry[marketId]);

        await userSchema.update(
          { marketListExposure: updatedExposure },
          { where: { userId: user.userId } }
        );
      }
    }


    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Balance Update"));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

export const removeExposer = async (req, res) => {
  try {
    const { userId,  marketId, lotteryPrice } = req.body;
    
    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, 'User not found.'));
    }

    await WinningAmount.create({
      userId: user.userId,
      userName: user.userName,
      amount: lotteryPrice,
      type: "loss",
      marketId,
    });
    
    await user.save();

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(null, true, statusCode.success, 'Balance updated successfully.'));
  } catch (error) {
    return res
      .status(statusCode.internalServerError)
      .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};


export const getLotteryResults = async (req, res) => {
  try {
    const { marketId } = req.params;
    const baseURL = process.env.LOTTERY_URL;

    const response = await axios.get(
      `${baseURL}/api/lottery-results/${marketId}`,
    );

    if (!response.data.success) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, 'Failed to fetch data'));
    }

    const { data } = response.data;

    return res.status(statusCode.success).send(apiResponseSuccess(data, true, statusCode.success, 'Lottery results fetched successfully.'));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

export const createLotteryP_L = async (req, res) => {
  try {
    const { userId, marketId, marketName } = req.body;

    const winningData = await WinningAmount.findAll({
      where: { userId, marketId },
      attributes: ['userId', 'userName', 'amount', 'type'],
    });

    let totalWin = 0;
    let totalLoss = 0;
    let userName = '';

    winningData.forEach((entry) => {
      if (entry.type === 'win') {
        totalWin += entry.amount;
      } else if (entry.type === 'loss') {
        totalLoss += entry.amount;
      }
      userName = entry.userName;
    });

    const profitLoss = totalWin - totalLoss;

    const newEntry = await LotteryProfit_Loss.create({
      userId,
      userName,
      marketId,
      marketName,
      profitLoss,
    });

    return res.status(statusCode.create).send(apiResponseSuccess(newEntry, true, statusCode.create, 'Success'));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};


export const getLotteryP_L = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (currentPage - 1) * parsedLimit;

    const { count: totalItems, rows: lotteryProfitLossRecords } = await LotteryProfit_Loss.findAndCountAll({
      where: { userId: user.userId },
      attributes: ['gameName', 'marketName', 'marketId', 'profitLoss'],
      limit: parsedLimit,
      offset,
    });

    const totalPages = Math.ceil(totalItems / parsedLimit);
    const pagination = {
      page: currentPage,
      limit: parsedLimit,
      totalPages,
      totalItems,
    };

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          lotteryProfitLossRecords,
          true,
          statusCode.success,
          'Success',
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


export const getLotteryBetHistory = async (req, res) => {
  try {
    const userId = req.user.userId
    const baseURL = process.env.LOTTERY_URL;
    const { startDate, endDate, page = 1, limit = 10, dataType, type } = req.query;

    const params = {
      dataType,
      startDate,
      endDate,
      page,
      limit,
      type
    };
    const response = await axios.post(`${baseURL}/api/lottery-external-bet-history`,
      { userId },
      { params },
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
    return res.status(statusCode.success).send(apiResponseSuccess(data, true, statusCode.success, 'Success', pagination));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

export const dateWiseMarkets = async (req, res) => {
  try {
    const token = jwt.sign({ roles: req.user.roles }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const { date } = req.query;
    const baseURL = process.env.LOTTERY_URL;

    const response = await axios.get(`${baseURL}/api/user/dateWise-markets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date,
      },
    });

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, "Failed to get market"));
    }

    return res.status(statusCode.success).send(apiResponseSuccess(response.data.data, true, statusCode.success, "Success"));

  } catch (error) {

    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

export const getAllMarket = async (req, res) => {
  try {
    const token = jwt.sign(
      { roles: req.user.roles, userId: req.user.userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const { date } = req.query;
    const currentDate = new Date();
    const formattedDate = date || currentDate.toISOString().split("T")[0];

    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/user/get-markets?date=${encodeURIComponent(formattedDate)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      return res
        .status(statusCode.badRequest)
        .send(
          apiResponseErr(
            null,
            false,
            statusCode.badRequest,
            "Failed to get markets"
          )
        );
    }

    return res
      .status(statusCode.success)
      .send(
        apiResponseSuccess(
          response.data.data,
          true,
          statusCode.success,
          "Success"
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

export const getBetHistoryP_L = async (req, res) => {
  try {
    const userId = req.user.userId
    const { marketId } = req.params
    const baseURL = process.env.LOTTERY_URL;

    const response = await axios.post(`${baseURL}/api/lottery-external-betHistory-profitLoss`, { userId, marketId });

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

    const { data } = response.data;

    return res.status(statusCode.success).send(apiResponseSuccess(data, true, statusCode.success, 'Success'));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

