import { string } from "../constructor/string.js";
import { deleteLiveBetMarkets, getMarket, getMarketDetails } from "../controller/delete.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { validateDeleteLiveBet } from "../schema/commonSchema.js";


export const DeleteRoutes = (app) => {

    app.delete('/api/delete-markets', validateDeleteLiveBet, customErrorHandler, authorize([string.Admin]), deleteLiveBetMarkets);
    app.get('/api/get-market', getMarket);
    app.get('/api/get-marketdetails/:marketId', getMarketDetails)


}