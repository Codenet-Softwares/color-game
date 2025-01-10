import { Op, Sequelize } from "sequelize";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";
import MarketDeleteApproval from "../models/marketApproval.model.js";
import Market from "../models/market.model.js";
import sequelize from "../db.js";
import Runner from "../models/runner.model.js";
import CurrentOrder from "../models/currentOrder.model.js";
import rateSchema from "../models/rate.model.js";

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

export const restoreDeleteMarket = async (req, res) => {
    try {
        const { approvalMarketId } = req.params;

        const restoreDeletedMarket = await MarketDeleteApproval.findOne({
            where: { approvalMarketId }
        });

        if (!restoreDeletedMarket) {
            return res
                .status(statusCode.notFound)
                .send(apiResponseErr(null, false, statusCode.notFound, "Market not found"));
        }

        const marketData = restoreDeletedMarket.approvalMarkets[0];

        await Market.update(
            { deleteApproval: false },
            { where: { marketId: marketData.marketId } }
        );

        await MarketDeleteApproval.destroy({
            where: { approvalMarketId }
        });

        return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market restored successfully"));
    } catch (error) {
        console.error("Error restoring deleted market:", error);
        return res
            .status(statusCode.internalServerError)
            .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
    }
};

export const deleteMarket = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { approvalMarketId } = req.params;

        const deletedMarket = await MarketDeleteApproval.findOne({
            where: { approvalMarketId }
        });

        const marketData = deletedMarket.approvalMarkets[0];
        const runners = await Runner.findAll({
            where: { marketId: marketData.marketId },
            transaction,
        });

        const runnerIds = runners.map((runner) => runner.runnerId);

        if (runnerIds.length) {
            await rateSchema.destroy({
                where: { runnerId: { [Op.in]: runnerIds } },
                transaction,
            });

            await Runner.destroy({
                where: { marketId: marketData.marketId },
                transaction,
            });
        }

        await CurrentOrder.destroy({
            where: { marketId: marketData.marketId },
            transaction,
        });

        const deletedMarketCount = await Market.destroy({
            where: { marketId: marketData.marketId },
            transaction,
        });

        if (deletedMarketCount === 0) {
            res.status(statusCode.badRequest).send(apiResponseErr(null, false, statusCode.badRequest, "Market deletion failed"));
        }

        await MarketDeleteApproval.destroy({
            where: { approvalMarketId }
        });

        await transaction.commit();

        return res.status(statusCode.success).send(apiResponseSuccess(null, true, statusCode.success, "Market deleted successfully"));

    } catch (error) {
        transaction.rollback();
        return res
            .status(statusCode.internalServerError)
            .send(apiResponseErr(null, false, statusCode.internalServerError, error.message));
    }
};