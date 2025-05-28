import { createRouter } from '@tanstack/react-router';

import { authRoutes } from '@/app/features/auth/routes';
import { dashboardRoutes } from '@/app/features/dashboard/routes';
import { authRoute, mainRoute, rootRoute, userRoute } from '@/app/routes';

import { userRoutes } from '../features/tmp_user_dashborad/routes';

const routeTree = rootRoute.addChildren([
  authRoute.addChildren(authRoutes),
  mainRoute.addChildren(dashboardRoutes),
  userRoute.addChildren(userRoutes),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}