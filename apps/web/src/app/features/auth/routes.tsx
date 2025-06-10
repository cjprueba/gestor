import { createRoute } from '@tanstack/react-router';

import LoginPage from '@/app/pages/login';
import { authRoute } from '@/app/routes';
// import { RegisterPage } from '@/app/pages/RegisterPage';

export const authRoutes = [
  createRoute({
    getParentRoute: () => authRoute,
    path: 'login',
    component: LoginPage,
  }),
  // createRoute({
  //   getParentRoute: () => rootRoute,
  //   path: 'register',
  //   component: RegisterPage,
  // }),
];