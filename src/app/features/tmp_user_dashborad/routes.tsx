import { createRoute } from '@tanstack/react-router';

import { userRoute } from '@/app/routes';

import UserDashboard from '.';

export const userRoutes = [
  createRoute({
    getParentRoute: () => userRoute,
    path: '/overview',
    component: UserDashboard,
  }),
  
];