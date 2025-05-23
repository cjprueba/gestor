import { createRoute } from '@tanstack/react-router';
import { mainRoute } from '@/app/routes/routes';
import DashboardPage from '@/app/features/dashboard';
import FilesPage from './files';

export const dashboardRoutes = [
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/',
    component: DashboardPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/files',
    component: FilesPage,
  }),

];