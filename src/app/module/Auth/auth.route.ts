import express from 'express';

import { authController } from './auth.controller';

const router = express.Router();

// router.post('/signup', validateRequest(userValidation.create), UserController.createUser);
router.post(
  '/signin',
  //   validateRequest(authValidation.signin),
  authController.loginUser
);
// router.post('/google-signin', authController.googleLogin);
// router.post(
//   '/refresh-token',
//   validateRequest(authValidation.refreshToken),
//   authController.refreshToken
// );

export const AuthRoutes = router;
