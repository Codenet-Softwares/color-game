import { string } from "../constructor/string.js";
import { deleteLiveBetMarkets, getMarket, getTrashMarketDetails, deleteMarketTrash } from "../controller/delete.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { validateDeleteLiveBet, validateTrashMarketId, validateTrashMarket } from "../schema/commonSchema.js";


export const DeleteRoutes = (app) => {

    app.delete('/api/delete-markets', validateDeleteLiveBet, customErrorHandler, authorize([string.Admin]), deleteLiveBetMarkets);

    // app.delete('/api/delete-afterWin-bets', deleteAfterWinBetMarkets);
    
    app.get('/api/get-market', authorize([string.Admin]), getMarket);

    app.get('/api/get-bet-trash/:marketId', validateTrashMarketId, customErrorHandler,authorize([string.Admin]), getTrashMarketDetails);

    app.delete('/api/delete-market-trash/:trashMarketId', validateTrashMarket, customErrorHandler,authorize([string.Admin]), deleteMarketTrash)

}