import { Bell, Search } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useLocation } from "@tanstack/react-router";

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

// Mapeo de rutas a breadcrumbs
const routeBreadcrumbsMap: Record<string, Array<{ title: string; url?: string }>> = {
  "/app": [
    { title: "Dashboard" }
  ],
  "/app/users": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de usuarios" }
  ],
  "/admin/roles": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de usuarios", url: "/app/users" },
    { title: "Roles y permisos" }
  ],
  "/admin/invitations": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de usuarios", url: "/app/users" },
    { title: "Invitaciones" }
  ],
  "/app/org_units": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de Unidades Org." }
  ],
  "/app/org_units/divisions": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de Unidades Org.", url: "/app/org_units" },
    { title: "Divisiones" }
  ],
  "/app/org_units/departments": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de Unidades Org.", url: "/app/org_units" },
    { title: "Departamentos" }
  ],
  "/app/org_units/units": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Gestión de Unidades Org.", url: "/app/org_units" },
    { title: "Unidades" }
  ],
  "/app/milestones": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Actividad documental" }
  ],
  "/app/milestones/settings": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Actividad documental", url: "/app/milestones" },
    { title: "Configuración" }
  ],
  "/admin/security": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Seguridad" }
  ],
  "/admin/activity": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Seguridad", url: "/admin/security" },
    { title: "Logs de actividad" }
  ],
  "/admin/settings": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Sistema" }
  ],
  "/admin/storage": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Sistema", url: "/admin/settings" },
    { title: "Almacenamiento" }
  ],
  "/admin/backups": [
    { title: "Dashboard", url: "/app" },
    { title: "Mantenedores" },
    { title: "Sistema", url: "/admin/settings" },
    { title: "Respaldos" }
  ]
};

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { pathname } = useLocation()

  const breadcrumbs = routeBreadcrumbsMap[pathname] || [
    { title: "Dashboard", url: "/app" }
  ];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 sm:gap-4 px-2 sm:px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Sección izquierda: Navigation y controles */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4 hidden sm:block" />
      </div>

      {/* Breadcrumb dinámico */}
      <div className="hidden sm:flex flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.title}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem className={index === 0 ? "hidden lg:block" : index === 1 ? "hidden md:block" : "min-w-0"}>
                    {isLast ? (
                      <BreadcrumbPage className="truncate">{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.url || "#"}>{crumb.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Búsqueda - hacia la derecha */}
      <div className="flex-1 sm:flex-none sm:w-80 max-w-[320px] hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Controles de usuario - hacia la derecha */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
          <Bell className="h-4 w-4" />
        </Button>
        <NavUser user={navigationData.user} />
      </div>
    </header>
  );
} 