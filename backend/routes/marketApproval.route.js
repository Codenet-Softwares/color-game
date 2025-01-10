import { deleteMarket, getDeleteMarket, restoreDeleteMarket } from "../controller/marketApproval.controller.js";
import { validateApprovalMarket } from "../schema/commonSchema.js";

export const MarketDeleteApprovalRoute = (app) => {
    app.get("/api/market-delete-approval", authorize([string.Admin]), getDeleteMarket);
    app.post("/api/restore-deleted-market-approval/:approvalMarketId", validateApprovalMarket, customErrorHandler, authorize([string.Admin]), restoreDeleteMarket);
    app.post("/api/deleted-market-approval/:approvalMarketId", validateApprovalMarket, customErrorHandler, authorize([string.Admin]), deleteMarket);
}