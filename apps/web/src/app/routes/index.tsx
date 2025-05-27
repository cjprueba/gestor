import {
  createRootRouteWithContext,
  createRoute,
} from '@tanstack/react-router';

import AuthLayout from '@/app/layouts/AuthLayout';
import MainLayout from '@/app/layouts/MainLayout';
import Root from './__root';
import UserLayout from '../layouts/UserLayout';

export const rootRoute = createRootRouteWithContext()({
  component: Root
});

export const authRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
});

export const mainRoute = createRoute({
  path: '/app',
  getParentRoute: () => rootRoute,
  component: MainLayout,
});

export const userRoute = createRoute({
  path: '/dashboard_user',
  getParentRoute: () => rootRoute,
  component: UserLayout,
});

// Ejemplo: authRoutes deberían colgar de authRoute
// y deberían exportarse como `createRoute` también

