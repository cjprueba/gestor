import {
  AudioWaveform,
  BookOpen,
  Command,
  Files,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
// import { cn } from "@/shared/lib/utils"

// This is sample data.
const data = {
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
  navMain: [
    {
      title: "Resumen",
      url: "/app",
      icon: Home,
      isActive: true,
      items: [
        
        {
          title: "Colecciones",
          url: "/app/collections",
        },
        {
          title: "Configuración",
          url: "#",
        },
      ],
    },
    {
      title: "Archivos",
      url: "/app/files",
      icon: Files,
      items: [
        {
          title: "Ver todos",
          url: "/app/files",
        },
        {
          title: "Colecciones",
          url: "#",
        },
      ],
    },
    {
      title: "Documentación",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introducción",
          url: "#",
        },
        {
          title: "Comenzar",
          url: "#",
        },
        {
          title: "Tutoriales",
          url: "#",
        },
        {
          title: "Registro de cambios",
          url: "#",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Equipo",
          url: "#",
        },
        {
          title: "Facturación",
          url: "#",
        },
        {
          title: "Límites",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Ingeniería de Diseño",
      url: "#",
      icon: Frame,
    },
    {
      name: "Ventas y Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Viajes",
      url: "#",
      icon: Map,
    },
  ],
}

// interface NavItemProps {
//   href: string
//   icon: React.ReactNode
//   children: React.ReactNode
//   active?: boolean
//   onClick?: () => void
// }

// function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
//   return (
//     <Link
//       href={href}
//       className={cn("flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg", active && "bg-gray-100")}
//       onClick={onClick}
//     >
//       {icon}
//       <span>{children}</span>
//     </Link>
//   )
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
