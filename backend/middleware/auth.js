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

      const user = jwt.verify(tokenParts[1], process.env.JWT_SECRET_KEY);
      if (!user) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
      }

      let existingUser;

      // Check if the user is an admin or subAdmin
      if (roles.includes(string.Admin) || roles.includes(string.subAdmin)) {
        existingUser = await admins.findOne({
          where: {
            adminId: user.adminId,
          },
        });
      }

      // If no user is found, return unauthorized
      if (!existingUser) {
        return res
          .status(statusCode.unauthorize)
          .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
      }

      const rolesArray = existingUser.roles.replace(/['"]+/g, '').split(',');

      // Check if the user has the required role
      if (roles && roles.length > 0) {
        let userHasRequiredRole = false;

        roles.forEach((role) => {
          if (rolesArray.includes(role)) {
            userHasRequiredRole = true;
          }
        });

        if (!userHasRequiredRole) {
          return res
            .status(statusCode.unauthorize)
            .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
        }
      }

      // Check if the user has the required permissions
      if (permissions && permissions.length > 0) {
        const userPermissions = existingUser.permissions ? existingUser.permissions.split(',') : [];
        let userHasRequiredPermission = false;

        // If the user is Admin, bypass permission checks
        if (rolesArray.includes(string.Admin)) {
          userHasRequiredPermission = true;
        } else {
          permissions.forEach((permission) => {
            if (userPermissions.includes(permission)) {
              userHasRequiredPermission = true;
            }
          });
        }

        if (!userHasRequiredPermission) {
          return res
            .status(statusCode.unauthorize)
            .send(apiResponseErr(null, false, statusCode.unauthorize, 'Unauthorized access'));
        }
      }

      // Attach the user to the request object
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

