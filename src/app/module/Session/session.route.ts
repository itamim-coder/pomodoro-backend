import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { sessionController } from './session.controller';

const router = express.Router();

// router.post('/signup', validateRequest(userValidation.create), UserController.createUser);
router.post(
  '/focus-session',
  //   validateRequest(authValidation.signin),
  sessionController.createLogFocusSession
);
router.get(
  '/focus-metrics',
  auth(ENUM_USER_ROLE.STUDENT),
  //   validateRequest(authValidation.signin),
  sessionController.getFocusMetrcis
);
router.get(
  '/streaks',
  auth(ENUM_USER_ROLE.STUDENT),
  //   validateRequest(authValidation.signin),
  sessionController.getStreaks
);
// router.post('/google-signin', authController.googleLogin);
// router.post(
//   '/refresh-token',
//   validateRequest(authValidation.refreshToken),
//   authController.refreshToken
// );

export const SessionRoutes = router;
