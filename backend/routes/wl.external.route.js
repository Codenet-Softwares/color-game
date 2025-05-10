import { getAllGameImg, getAllGif, getAllInnerImg, getAllSliderTextImg, getAnnouncement, getInnerAnnouncement } from "../controller/wl.external.controller.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { authenticateSuperAdmin } from "../middleware/whiteLabelAuth.js";


export const wlExternalRoute = (app) => {
    app.get('/api/all-slider-text-img',customErrorHandler,  getAllSliderTextImg);

    app.get('/api/get-all-gif', customErrorHandler, getAllGif);

    app.get('/api/get-all-game-img', customErrorHandler, getAllGameImg);

    app.get('/api/get-all-inner-img', customErrorHandler, getAllInnerImg);

    app.get('/api/get-admin-announcements', customErrorHandler, getAnnouncement);

    app.get('/api/get-admin-inner-announcements', customErrorHandler, getInnerAnnouncement);
}