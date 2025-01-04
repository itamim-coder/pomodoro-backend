/* eslint-disable no-async-promise-executor */
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';


// import { IAuthUser } from '../../interfaces/auth';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: any, res: Response, next: NextFunction) => {
    return new Promise(async (resolve, reject) => {
      const token = req.headers.authorization;

      if (!token) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      const verifiedUser: any = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      if (!verifiedUser) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      req.user = verifiedUser;
      console.log('auth', req.user);
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }

      resolve(verifiedUser);
    })
      .then(() => next())
      .catch(err => next(err));
  };

export default auth;
