import { createRouter } from '@tanstack/react-router';
import { authRoute, mainRoute, rootRoute } from './routes';
import { authRoutes } from '@/app/features/auth/routes';
import { dashboardRoutes } from '@/app/features/dashboard/routes';

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