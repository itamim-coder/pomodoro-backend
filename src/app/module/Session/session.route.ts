import express from 'express';
import { sessionController } from './session.controller';

const router = express.Router();

// router.post('/signup', validateRequest(userValidation.create), UserController.createUser);
router.post(
  '/focus-session',
  //   validateRequest(authValidation.signin),
  sessionController.createLogFocusSession
);
// router.post('/google-signin', authController.googleLogin);
// router.post(
//   '/refresh-token',
//   validateRequest(authValidation.refreshToken),
//   authController.refreshToken
// );

export const SessionRoutes = router;
