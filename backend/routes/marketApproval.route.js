import { getDeleteMarket } from "../controller/marketApproval.controller.js";

export const MarketDeleteApprovalRoute = (app) => {
    app.get("/api/market-delete-approval", getDeleteMarket);
}