import { string } from "../constructor/string.js";
import {  getAnnouncement, getGameImg, getGif, getInnerAnnouncement, getInnerImg, getSliderTextImg } from "../controller/wl.external.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";



export const wlExternalRoute = (app) => {
    app.get('/api/slider-text-img',customErrorHandler,  getSliderTextImg);

    app.get('/api/get-gif', customErrorHandler, getGif);

    app.get('/api/get-game-img', customErrorHandler, getGameImg);

    app.get('/api/get-inner-game-img', customErrorHandler,authorize([string.User]), getInnerImg);

    app.get('/api/get-announcements', customErrorHandler, getAnnouncement);

    app.get('/api/get-inner-announcements', customErrorHandler,authorize([string.User]), getInnerAnnouncement);
}