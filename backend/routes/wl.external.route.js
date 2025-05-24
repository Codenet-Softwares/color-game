import { string } from "../constructor/string.js";
import {  getAnnouncement, getGameImg, getGif, getInnerAnnouncement, getInnerImg, getSliderTextImg } from "../controller/wl.external.controller.js";
import { authorize } from "../middleware/auth.js";
import customErrorHandler from "../middleware/customErrorHandler.js";



export const wlExternalRoute = (app) => {
    app.get('/api/slider-text-img', getSliderTextImg);

    app.get('/api/get-gif', getGif);

    app.get('/api/get-game-img', getGameImg);

    app.get('/api/get-inner-game-img', getInnerImg);

    app.get('/api/get-announcements', getAnnouncement);

    app.get('/api/get-inner-announcements', getInnerAnnouncement);
}