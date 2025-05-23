import { SidebarInset } from "@/shared/components/ui/sidebar";

import { AppSidebar } from "@/shared/components/sidebar/_components/app-sidebar";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import Header from "@/shared/components/Header";
import { Outlet } from "@tanstack/react-router";

export default function Sidebar() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
      </SidebarInset>
    </SidebarProvider>
  );
} 