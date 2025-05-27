import { createRouter } from '@tanstack/react-router';
import { authRoutes } from '@/app/features/auth/routes';
import { dashboardRoutes } from '@/app/features/dashboard/routes';
import { authRoute, mainRoute, rootRoute } from '@/app/routes';

const routeTree = rootRoute.addChildren([
  authRoute.addChildren(authRoutes),
  mainRoute.addChildren(dashboardRoutes),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}