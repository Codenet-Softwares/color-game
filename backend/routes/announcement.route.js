import { string } from '../constructor/string.js';
import {
  createAnnouncements,
  createInnerAnnouncements,
  deleteAnnouncementData,
  deleteInnerAnnouncementData,
  getAnnouncement,
  getInnerAnnouncement,
} from '../controller/announcement.controller.js';
import { authorize } from '../middleware/auth.js';
import customErrorHandler from '../middleware/customErrorHandler.js';

export const AnnouncementRoute = (app) => {
  /*
    Announcement Apis Start's.....
  */

  app.post('/api/admin/announcements-create', customErrorHandler, authorize([string.Admin]), createAnnouncements);
  
  app.get('/api/admin/get-announcements', customErrorHandler, getAnnouncement);
 
  app.get('/api/admin/get-admin-announcements', authorize([string.Admin]), customErrorHandler, getAnnouncement);
  
  app.delete('/api/admin/delete-announcements/:announceId', authorize([string.Admin]), customErrorHandler, deleteAnnouncementData);

  /*
    Announcement Apis Ends's.....
  */

  /*
    Inner Announcement Apis Start's.....
  */

  app.post('/api/admin/inner-announcements-create', customErrorHandler, authorize([string.Admin]), createInnerAnnouncements);
     
  app.get('/api/admin/get-inner-announcements', customErrorHandler, getInnerAnnouncement);
    
  app.get('/api/admin/get-admin-inner-announcements', authorize([string.Admin]), customErrorHandler, getInnerAnnouncement);
     
  app.delete('/api/admin/delete-inner-announcements/:announceId', authorize([string.Admin]), customErrorHandler, deleteInnerAnnouncementData);

  /*
    Inner Announcement Apis Ends's.....
  */
};
