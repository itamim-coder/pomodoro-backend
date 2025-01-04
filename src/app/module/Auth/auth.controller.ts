/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { authServices } from './auth.service';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...loginData } = req.body;
    const result = await authServices.loginUser(loginData);
    console.log('result', result);
    const { refreshToken } = result;
    console.log(refreshToken, 'refresh');

    res.cookie('refreshToken', refreshToken, {
      secure: config.env === 'development',
      httpOnly: true,
      // sameSite: 'none',
      maxAge: 31536000000,
    });
    res.send({
      statusCode: 200,
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { ...loginData } = req.body;
//     const result = await authServices.googleLogin(loginData);
//     console.log('result', result);
//     const { refreshToken } = result;
//     console.log(result);

//     res.cookie('refreshToken', refreshToken, {
//       secure: config.env === 'production',
//       httpOnly: true,
//       // sameSite: 'none',
//       maxAge: 31536000000
//     });
//     res.send({
//       statusCode: 200,
//       success: true,
//       message: 'User logged in successfully',
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     console.log(req);
//     const { refreshToken } = req.cookies;
//     // const token = req.headers.authorization;
//     const result = await authServices.refreshToken(refreshToken!);
//     // const cookieOptions = {
//     //   secure: config.env === 'production',
//     //   httpOnly: true
//     // };

//     // res.cookie('refreshToken', refreshToken, cookieOptions);
//     res.send({
//       statusCode: 200,
//       success: true,
//       message: 'Token refreshed successfully',
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const signUp = catchAsync(async (req: Request, res: Response) => {
  try {
    const { ...user } = req.body;

    const result = await authServices.signUp(user);

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users sign up successfully !',
      data: result,
    });
  } catch (err) {
    res.send(err);
  }
});

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken, 'controller');
    const result = await authServices.refreshToken(refreshToken!);

    res.send({
      statusCode: 200,
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const authController = { loginUser, signUp, refreshToken };
