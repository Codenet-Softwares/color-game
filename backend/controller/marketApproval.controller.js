import { Op, Sequelize } from "sequelize";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import MarketDeleteApproval from "../models/marketApproval.model.js";

export const getDeleteMarket = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const where = search
        ? Sequelize.literal(`JSON_SEARCH(approvalMarkets, 'one', '%${search}%', NULL, '$[*].marketName') IS NOT NULL`)
        : {};

        const { rows: deleteMarket, count: totalItems } = await MarketDeleteApproval.findAndCountAll({
            attributes: ["approvalMarketId", "approvalMarkets"],
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const response = deleteMarket.map((approval) => {
            const market = approval.approvalMarkets[0];
            return {
                approvalMarketId: approval.approvalMarketId,
                marketName: market.marketName,
                marketId: market.marketId,
                isActive: market.isActive,
            };
        });

        const totalPages = Math.ceil(totalItems / limit);

        const pagination = {
            page: parseInt(page),
            pageSize: parseInt(limit),
            totalPages,
            totalItems,
        }

        return res.status(statusCode.success).send(apiResponseSuccess(response, true, statusCode.success, "Get deleted market successfully", pagination));

    } catch (error) {
        console.error("Error fetching deleted market:", error);
        return res
            .status(statusCode.internalServerError)
            .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
    }
};
