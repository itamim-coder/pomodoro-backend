import express from 'express';

import { authController } from './auth.controller';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post(
  '/signin',
  //   validateRequest(authValidation.signin),
  authController.loginUser
);
// router.post('/google-signin', authController.googleLogin);
router.post(
  '/refresh-token',

  authController.refreshToken
);

export const AuthRoutes = router;
