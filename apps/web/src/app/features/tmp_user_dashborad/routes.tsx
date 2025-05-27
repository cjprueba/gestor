import { userRoute } from '@/app/routes';
import { createRoute } from '@tanstack/react-router';
import UserDashboard from '.';

export const userRoutes = [
  createRoute({
    getParentRoute: () => userRoute,
    path: '/overview',
    component: UserDashboard,
  }),
  
];