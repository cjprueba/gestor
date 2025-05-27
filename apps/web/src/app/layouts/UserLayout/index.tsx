import { AppUserSidebar } from '@/shared/components/sidebar/app-user-sidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { Outlet } from '@tanstack/react-router';

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
