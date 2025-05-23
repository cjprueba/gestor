import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routes/routes';
import LoginPage from '@/app/pages/login';
// import { RegisterPage } from '@/app/pages/RegisterPage';

export const authRoutes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: 'login',
    component: LoginPage,
  }),
  // createRoute({
  //   getParentRoute: () => rootRoute,
  //   path: 'register',
  //   component: RegisterPage,
  // }),
];