import { authorize } from '../middleware/auth.js';
import { errorHandler } from '../middleware/ErrorHandling.js';
import customErrorHandler from '../middleware/customErrorHandler.js';
import {
  createSlider,
  activeSlider,
  createGif,
  deleteGifData,
  getSliderTextImg,
  getGif,
  getAllSliderTextImg,
  deleteImgData,
  getAllGif,
  activeGif,
  createGameImg,
  getGameImg,
  getAllGameImg,
  activeGame,
  deleteGameData,
  createInnerImg,
  getInnerImg,
  getAllInnerImg,
  activeInnerImg,
  deleteInnerImgData,
} from '../controller/slider.controller.js';
import { string } from '../constructor/string.js';

export const SliderRoute = (app) => {
  /*
     Slider Img Apis Start's.....
  */

  app.post('/api/admin/create-slider-text-img', customErrorHandler, authorize([string.Admin]), createSlider);

  app.get('/api/admin/slider-text-img', customErrorHandler, getSliderTextImg);

  app.get('/api/admin/all-slider-text-img', authorize([string.Admin]), customErrorHandler, getAllSliderTextImg);

  app.post('/api/admin/active-slider/:imageId', authorize([string.Admin]), customErrorHandler, activeSlider);

  app.delete('/api/delete/img/:imageId', customErrorHandler, authorize([string.Admin]), deleteImgData);

  /*
     Slider Img Apis End's.....
  */

  /*
     Gif Apis Start's.....
  */

  app.post('/api/admin/create-gif', customErrorHandler, errorHandler, authorize([string.Admin]), createGif);

  app.get('/api/admin/get-gif', customErrorHandler, getGif);

  app.get('/api/admin/get-all-gif', customErrorHandler, authorize([string.Admin]), getAllGif);

  app.delete('/api/delete/gif/:imageId', customErrorHandler, authorize([string.Admin]), deleteGifData);

  app.post('/api/admin/active-gif/:imageId', authorize([string.Admin]), customErrorHandler, activeGif);

  /*
     Gif Apis End's.....
  */

  /*
     Game Apis Start's.....
  */

  app.post('/api/admin/create-game-img', customErrorHandler, errorHandler, authorize([string.Admin]), createGameImg);

  app.get('/api/admin/get-game-img', customErrorHandler, getGameImg);

  app.get('/api/admin/get-all-game-img', customErrorHandler, authorize([string.Admin]), getAllGameImg);

  app.delete('/api/delete/game-img/:imageId', customErrorHandler, authorize([string.Admin]), deleteGameData);

  app.post('/api/admin/active-game-img/:imageId', authorize([string.Admin]), customErrorHandler, activeGame);

  /*
     Game Apis End's.....
  */

  /*
      Inner Img Apis Start's.....
   */

  app.post('/api/admin/create-inner-img', customErrorHandler, errorHandler, authorize([string.Admin]), createInnerImg);

  app.get('/api/admin/get-inner-game-img', customErrorHandler, getInnerImg);

  app.get('/api/admin/get-all-game-img', customErrorHandler, authorize([string.Admin]), getAllInnerImg);

  app.delete('/api/delete/game-img/:imageId', customErrorHandler, authorize([string.Admin]), deleteInnerImgData);

  app.post('/api/admin/active-game-img/:imageId', authorize([string.Admin]), customErrorHandler, activeInnerImg);

  /*
     Inner Img Apis End's.....
  */

};
