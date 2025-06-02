import { Bell, Search } from "lucide-react";
import { useState } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Button } from "./design-system/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./sidebar/nav-user";

const navigationData = {
  user: {
    name: "Juan",
    email: "juan@example.com",
    avatar: "/avatars/juan.jpg",
  }
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Sección izquierda: Navigation y controles */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Administración</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Gestión de Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>




      {/* Búsqueda - hacia la derecha */}
      <div className="w-80">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar archivos..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {/* Controles de usuario - hacia la izquierda */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <NavUser user={navigationData.user} />
      </div>
    </header>
  );
} 