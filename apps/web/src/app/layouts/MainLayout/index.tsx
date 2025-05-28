import { Outlet } from '@tanstack/react-router';

import Header from '@/shared/components/Header';
import { AppSidebar } from '@/shared/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { SidebarInset } from '@/shared/components/ui/sidebar';

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
