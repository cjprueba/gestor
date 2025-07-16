"use client"

import { Outlet, useLocation } from '@tanstack/react-router';

import Header from '@/shared/components/Header';
import { ProjectHeader } from '@/shared/components/ProjectHeader';
import { AppSidebar } from '@/shared/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { SidebarInset } from '@/shared/components/ui/sidebar';
import { ProjectNavigationProvider } from '@/shared/contexts/ProjectNavigationContext';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Determinar si estamos en la sección de proyectos
  const isProjectsSection = pathname.startsWith('/app/projects');

  const renderHeader = () => {
    if (isProjectsSection) {
      return <ProjectHeader />;
    }
    return <Header />;
  };

  return (
    <ProjectNavigationProvider>
      <div className="min-h-screen flex flex-col max-w-dvw">
        <div className="flex-1 sidebar-container">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {renderHeader()}
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </ProjectNavigationProvider>
  );
}
