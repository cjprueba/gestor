import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/shared/components/sidebar/app-sidebar";


export default function AuthLayoutPage() {
  return (
    <main className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  )
}
