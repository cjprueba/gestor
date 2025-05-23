import { SidebarProvider } from '@/shared/components/ui/sidebar';
import Header from '@/shared/components/Header';
import { AppSidebar } from '@/shared/components/sidebar/_components/app-sidebar';
import { SidebarInset } from '@/shared/components/ui/sidebar';
import { Outlet } from '@tanstack/react-router';

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
