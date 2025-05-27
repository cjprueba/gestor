import {
  AudioWaveform,
  Clock,
  Command,
  Database,
  Files,
  FolderOpen,
  GalleryVerticalEnd,
  Home,
  Shield,
  Star,
  Trash2,
  Upload,
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
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
// import { cn } from "@/shared/lib/utils"

// This is sample data.
// const data = {
//   user: {
//     name: "Juan",
//     email: "juan@example.com",
//     avatar: "/avatars/juan.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Another Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Resumen",
//       url: "/app",
//       icon: Home,
//       isActive: true,
//       items: [

//         {
//           title: "Colecciones",
//           url: "/app/collections",
//         },
//         {
//           title: "Configuración",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Archivos",
//       url: "/app/files",
//       icon: Files,
//       items: [
//         {
//           title: "Ver todos",
//           url: "/app/files",
//         },
//         {
//           title: "Colecciones",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Documentación",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         {
//           title: "Introducción",
//           url: "#",
//         },
//         {
//           title: "Comenzar",
//           url: "#",
//         },
//         {
//           title: "Tutoriales",
//           url: "#",
//         },
//         {
//           title: "Registro de cambios",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Configuración",
//       url: "#",
//       icon: Settings2,
//       items: [
//         {
//           title: "General",
//           url: "#",
//         },
//         {
//           title: "Equipo",
//           url: "#",
//         },
//         {
//           title: "Facturación",
//           url: "#",
//         },
//         {
//           title: "Límites",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: "Ingeniería de Diseño",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Ventas y Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Viajes",
//       url: "#",
//       icon: Map,
//     },
//   ],
// }


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
      title: "Archivos",
      // url: "/app/files",
      icon: Files,
      items: [
        {
          title: "Todos los archivos",
          url: "/app/resources",
          icon: FolderOpen,
        },
        {
          title: "Recientes",
          url: "/files/recent",
          icon: Clock,
        },
        {
          title: "Favoritos",
          url: "/files/favorites",
          icon: Star,
        },
        {
          title: "Papelera",
          url: "/files/trash",
          icon: Trash2,
        },
      ],
    },
    {
      title: "Subir archivos",
      url: "/upload",
      icon: Upload,
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
        },
        {
          title: "Roles y permisos",
          url: "/admin/roles",
        },
        {
          title: "Invitaciones",
          url: "/admin/invitations",
        },
      ],
    },
    {
      title: "Seguridad",
      url: "/admin/security",
      icon: Shield,
      items: [
        {
          title: "Logs de actividad",
          url: "/admin/activity",
        },
        {
          title: "Configuración de seguridad",
          url: "/admin/security",
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

export function AppUserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigationData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
