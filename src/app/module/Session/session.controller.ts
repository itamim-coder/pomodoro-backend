import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { sessionService } from './session.service';

const createLogFocusSession = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { ...data } = req.body;

      const result = await sessionService.logFocusSession(data);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Log Focus Session !',
        data: result,
      });
    } catch (err) {
      res.send(err);
    }
  }
);
const getFocusMetrcis = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await sessionService.getFocusMetrics(req);

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user focus metrics retrived !',
      data: result,
    });
  } catch (err) {
    res.send(err);
  }
});
const getStreaks = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await sessionService.getStreaks(req);

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user streaks retrived !',
      data: result,
    });
  } catch (err) {
    res.send(err);
  }
});

export const sessionController = {
  createLogFocusSession,
  getFocusMetrcis,
  getStreaks,
};
