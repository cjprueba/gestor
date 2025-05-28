import { Outlet } from "@tanstack/react-router";

import Sidebar from "@/shared/components/sidebar/Sidebar";


export default function AuthLayoutPage() {
  return (
    <main className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  )
}
