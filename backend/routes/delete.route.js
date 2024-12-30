import { deleteLiveBetMarkets } from "../controller/delete.controller.js";


export const DeleteRoutes = (app) => {

    app.delete('/api/delete-markets', deleteLiveBetMarkets);


}