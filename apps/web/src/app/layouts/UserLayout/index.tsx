import { Outlet } from '@tanstack/react-router';

import { AppUserSidebar } from '@/shared/components/sidebar/app-user-sidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppUserSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
