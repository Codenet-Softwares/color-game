import { string } from '../constructor/string.js';
import { adminLogin, loginUser, resetPassword, trashUser, restoreTrashUser, logout, externalResetPassword, adminResetPassword, subAdminResetPassword } from '../controller/auth.controller.js';
import { authorize } from '../middleware/auth.js';
import customErrorHandler from '../middleware/customErrorHandler.js';
import { authenticateSuperAdmin } from '../middleware/whiteLabelAuth.js';
import { externalResetPasswordSchema, loginSchema, logOutValidate, resetPasswordSchema, trashUserSchema, validateResetPassword } from '../schema/commonSchema.js';

export const authRoute = (app) => {
  // done
  app.post('/api/admin-login', loginSchema, customErrorHandler, adminLogin);
  // done
  app.post('/api/user-login', loginSchema, customErrorHandler, loginUser);
  // done
  app.post('/api/reset-password', resetPasswordSchema, customErrorHandler, resetPassword);

  app.post('/api/subAdmin/reset-password', resetPasswordSchema, customErrorHandler, subAdminResetPassword);

  // done
  app.post('/api/extrernal/trash-user', trashUserSchema, customErrorHandler, trashUser);
  // done
  app.post('/api/extrernal/restore-trash-user', trashUserSchema, customErrorHandler, restoreTrashUser);

  app.post('/api/user-logout', logOutValidate, customErrorHandler, logout);

  app.post('/api/external-reset-password', externalResetPasswordSchema, customErrorHandler, authenticateSuperAdmin, externalResetPassword);

  app.post('/api/supAdmin-reset-password',validateResetPassword, customErrorHandler, authorize([string.Admin]), adminResetPassword);
};
