import { createRoute } from '@tanstack/react-router';

import DashboardPage from '@/app/features/dashboard';
import { mainRoute } from '@/app/routes';

import FilesPage from './resources';
import UsersManagementPage from './users';

export const dashboardRoutes = [
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/',
    component: DashboardPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/resources',
    component: FilesPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/users',
    component: UsersManagementPage,
  }),
];