import { createRoute } from '@tanstack/react-router';

import DashboardPage from '@/app/features/dashboard';
import { mainRoute } from '@/app/routes';

import UsersManagementPage from './users';
import OrganizationUnitsPage from './org_units';
import DivisionsPage from './org_units/divisions';
import DepartmentsPage from './org_units/departments';
import UnitsPage from './org_units/units';
import MilestonesPage from './milestones';
import MilestonesSettingsPage from './milestones/settings';
import ProjectsPage from './projects';
import FolderTemplatesPage from './folder_templates';
import StagesPage from './stages';

export const dashboardRoutes = [
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/',
    component: DashboardPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/projects',
    component: ProjectsPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/users',
    component: UsersManagementPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/org_units',
    component: OrganizationUnitsPage,
  }),

  createRoute({
    getParentRoute: () => mainRoute,
    path: '/org_units/divisions',
    component: DivisionsPage,
  }),

  createRoute({
    getParentRoute: () => mainRoute,
    path: '/org_units/departments',
    component: DepartmentsPage,
  }),

  createRoute({
    getParentRoute: () => mainRoute,
    path: '/org_units/units',
    component: UnitsPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/milestones',
    component: MilestonesPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/milestones/settings',
    component: MilestonesSettingsPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/folder_templates',
    component: FolderTemplatesPage,
  }),
  createRoute({
    getParentRoute: () => mainRoute,
    path: '/stages',
    component: StagesPage,
  }),
];
