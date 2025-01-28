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

    console.log("totalExposure...999", totalExposure)

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
      date
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
    const { userId, prizeAmount, marketId, lotteryPrice } = req.body;

    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, 'User not found.'));
    }

    let totalBalanceUpdate = prizeAmount;
    let updatedMarketListExposure = user.marketListExposure; // Start with the current value

    totalBalanceUpdate += lotteryPrice;

    // Modify the market exposure for the given marketId
    const marketExposures = user.marketListExposure;

    updatedMarketListExposure = marketExposures.map(exposure => {
      if (exposure.hasOwnProperty(marketId)) {
        exposure[marketId] -= lotteryPrice; // Decrease exposure for the given marketId
      }
      return exposure;
    });

    await userSchema.update(
      { marketListExposure: updatedMarketListExposure },
      { where: { userId } }
    );

    await WinningAmount.create({
      userId: user.userId,
      userName: user.userName,
      amount: prizeAmount,
      type: "win",
      marketId,
    });

    return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Balance Update"));
  } catch (error) {
    console.log("Error:", error);
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

export const removeExposer = async (req, res) => {
  try {
    const { userId, marketId, marketName } = req.body;

    const user = await userSchema.findOne({ where: { userId } });
    if (!user) {
      return res
        .status(statusCode.badRequest)
        .send(apiResponseErr(null, false, statusCode.badRequest, 'User not found.'));
    }

    if (user.marketListExposure) {
      const exposures = Array.isArray(user.marketListExposure)
        ? user.marketListExposure
        : JSON.parse(user.marketListExposure);

      const marketExposure = exposures.find(exposure => exposure[marketId] !== undefined);

      if (marketExposure) {
        let marketListExposureValue = marketExposure[marketId];
        user.marketListExposure = exposures.filter(exposure => !exposure[marketId]);

        await LotteryProfit_Loss.create({
          userId,
          userName: user.userName,
          marketId,
          marketName,
          price: marketListExposureValue,
          profitLoss: -marketListExposureValue,
        });

        await WinningAmount.create({
          userId: user.userId,
          userName: user.userName,
          amount: marketListExposureValue,
          type: "loss",
          marketId: marketId,
        })
      }

    }

    await user.save();

    return res
      .status(statusCode.success)
      .send(apiResponseSuccess(null, true, statusCode.success, 'Balance updated successfully.'));
  } catch (error) {
    console.log("Error:", error);
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
    console.log("Error fetching results:", error);
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
};

export const createLotteryP_L = async (req, res) => {
  try {
    const {
      userId,
      userName,
      marketId,
      marketName,
      ticketNumber,
      price,
      sem,
      profitLoss,
    } = req.body;

    const newEntry = await LotteryProfit_Loss.create({
      userId,
      userName,
      marketId,
      marketName,
      ticketNumber,
      price,
      sem,
      profitLoss,
    });

    return res.status(statusCode.create).send(apiResponseSuccess(newEntry, true, statusCode.create, 'Success'));
  } catch (error) {
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

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
    const { startDate, endDate, page = 1, limit = 10, dataType } = req.query;

    const params = {
      dataType,
      startDate,
      endDate,
      page,
      limit,
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

    const baseURL = process.env.LOTTERY_URL;
    const response = await axios.get(`${baseURL}/api/user/get-markets`, {
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
    console.log("error.........", error)
    return res.status(statusCode.internalServerError).send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
  }
}

