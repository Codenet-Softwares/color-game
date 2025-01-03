import { string } from "../constructor/string.js";
import { deleteAfterWinBetMarkets, deleteLiveBetMarkets } from "../controller/delete.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { validateDeleteLiveBet } from "../schema/commonSchema.js";


export const DeleteRoutes = (app) => {

    app.delete('/api/delete-markets', validateDeleteLiveBet, customErrorHandler, authorize([string.Admin]), deleteLiveBetMarkets);

    app.delete('/api/delete-afterWin-bets', deleteAfterWinBetMarkets);
}