import {
  AudioWaveform,
  Building,
  Building2,
  ChartBar,
  Command,
  Database,
  Flag,
  FolderIcon,
  Folders,
  GalleryVerticalEnd,
  Home,
  Shield,
  User,
  UserPlus,
  Users
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar"

import { NavAdmin } from "./nav-admin"
import { NavMain } from "./nav-main"

const navigationData = {
  user: {
    name: "Juan",
    email: "juan@example.com",
    avatar: "/avatars/juan.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Another Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  main: [
    {
      title: "Dashboard",
      url: "/app",
      icon: Home,
    },
    {
      title: "Proyectos",
      url: "/app/projects",
      icon: Folders,
      // items: [
      //   {
      //     title: "Todos los archivos",
      //     url: "/app/resources",
      //     icon: FolderOpen,
      //   },
      //   {
      //     title: "Recientes",
      //     url: "/files/recent",
      //     icon: Clock,
      //   },
      //   {
      //     title: "Favoritos",
      //     url: "/files/favorites",
      //     icon: Star,
      //   },
      //   {
      //     title: "Papelera",
      //     url: "/files/trash",
      //     icon: Trash2,
      //   },
      // ],
    }
  ],
  admin: [
    {
      title: "Gestión de usuarios",
      url: "/app/users",
      icon: Users,
      items: [
        {
          title: "Todos los usuarios",
          url: "/app/users",
          icon: User,
        },
        {
          title: "Roles y permisos",
          url: "/admin/roles",
          icon: Shield,
        },
        {
          title: "Invitaciones",
          url: "/admin/invitations",
          icon: UserPlus,
        },
      ],
    },
    {
      title: "Gestión de Unidades Org.",
      icon: Building2,
      items: [
        {
          title: "General",
          url: "/app/org_units",
          icon: Building2,
        },
        {
          title: "Divisiones",
          url: "/app/org_units/divisions",
          icon: Building,
        },
        {
          title: "Departamentos",
          url: "/app/org_units/departments",
          icon: Building,
        },
        {
          title: "Unidades",
          url: "/app/org_units/units",
          icon: Building,
        },
      ],
    },
    {
      title: "Actividad documental",
      icon: Flag,
      url: "/app/milestones",
      items: [
        {
          title: "Registro de actividades documentales",
          url: "/app/milestones",
        },
        {
          title: "Configuración",
          url: "/app/milestones/settings",
        },
      ],
    },
    {
      title: "Gestión de plantillas",
      url: "/app/folder_templates",
      icon: FolderIcon,
      items: [
        {
          title: "Plantillas de carpetas",
          url: "/app/folder_templates",
        },
      ],
    },
    {
      title: "Gestión de etapas",
      url: "/app/stages",
      icon: ChartBar,
      items: [
        {
          title: "Etapas",
          url: "/app/stages",
        },
      ],
    },


    {
      title: "Sistema",
      url: "/admin/settings",
      icon: Database,
      items: [
        {
          title: "Almacenamiento",
          url: "/admin/storage",
        },
        {
          title: "Configuración",
          url: "/admin/settings",
        },
        {
          title: "Respaldos",
          url: "/admin/backups",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className="flex items-center flex-row gap-3 group-data-[state=collapsed]:justify-center transition-[padding,justify-content] duration-300 ease-in-out" >
        <img
          src="/logo_cl.png"
          alt="logo"
          className="w-14 h-auto group-data-[state=collapsed]:w-10 transition-all duration-200" />

        <div className=" flex flex-col group-data-[state=collapsed]:hidden transition-all duration-300 ease-in-out">
          <h1 className="text-md font-medium">MOP</h1>
          <h2 className="text-xs font-medium">Gestor de Proyectos</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.main} />
        <NavAdmin items={navigationData.admin} />
      </SidebarContent>
      <SidebarFooter>
        <div className="absolute bottom-0 right-5 group-data-[state=collapsed]:hidden">
          <img src="/franja.svg" alt="logo" className="w-full h-full" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
