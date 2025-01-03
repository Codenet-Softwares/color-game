import { string } from "../constructor/string.js";
import { deleteLiveBetMarkets, getMarket, getMarketDetails } from "../controller/delete.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { validateDeleteLiveBet, validateTrashMarketId } from "../schema/commonSchema.js";


export const DeleteRoutes = (app) => {

    app.delete('/api/delete-markets', validateDeleteLiveBet, customErrorHandler, authorize([string.Admin]), deleteLiveBetMarkets);

    // app.delete('/api/delete-afterWin-bets', deleteAfterWinBetMarkets);
    
    app.get('/api/get-market', authorize([string.Admin]), getMarket);
    app.get('/api/get-marketdetails/:marketId', validateTrashMarketId, customErrorHandler, authorize([string.Admin]), getMarketDetails);
}