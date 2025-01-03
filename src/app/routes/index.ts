import express from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { SessionRoutes } from '../module/Session/session.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/session',
    route: SessionRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
