import { Outlet } from '@tanstack/react-router';

import { AppUserSidebar } from '@/shared/components/sidebar/app-user-sidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import Header from '@/shared/components/Header';

export default function MainLayout() {
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <AppUserSidebar />

      <SidebarInset>
        {/* <Header /> */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
