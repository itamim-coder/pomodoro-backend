import express from 'express';
import { sessionController } from './session.controller';

const router = express.Router();

// router.post('/signup', validateRequest(userValidation.create), UserController.createUser);
router.post(
  '/focus-session',
  //   validateRequest(authValidation.signin),
  sessionController.createLogFocusSession
);
router.get(
  '/focus-metrics/:id',
  //   validateRequest(authValidation.signin),
  sessionController.getFocusMetrcis
);
router.get(
  '/streaks/:id',
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
