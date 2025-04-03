import jwt from 'jsonwebtoken';
import { apiResponseErr } from './serverError.js';
import { string } from '../constructor/string.js';
import admins from '../models/admin.model.js';
import { statusCode } from '../helper/statusCodes.js';
import userSchema from '../models/user.model.js';

export const authorize = (roles, permissions) => {
  return async (req, res, next) => {
    try {
      const authToken = req?.headers?.authorization;
      if (!authToken) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
      }

      const tokenParts = authToken.split(' ');
      if (tokenParts.length !== 2 || !(tokenParts[0] === 'Bearer' && tokenParts[1])) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
      }

      const token = tokenParts[1];
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!user) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
      }

      let existingUser;

      if (roles.includes(string.Admin) || roles.includes(string.subAdmin)) {
        existingUser = await admins.findOne({
          where: {
            adminId: user.adminId,
          },
        });
      } else if (roles.includes(string.User)) {
        existingUser = await userSchema.findOne({
          where: {
            id: user.id,
            isActive: true,
            locked: true,
          },
        });
      }

      if (!existingUser || existingUser.token !== token) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Session expired or unauthorized access'));
      }

      req.user = existingUser;
      next();
    } catch (err) {
      console.error('Authorization Error:', err.message);
      return res
        .status(statusCode.unauthorize)
        .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
    }
  };
};

