"use client"

import { ChevronRight, Folder, MoreHorizontal } from "lucide-react"
import React, { useState } from "react"

import { Button } from "@/shared/components/design-system/button"
import { NavUser } from "@/shared/components/sidebar/nav-user"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { useProjectNavigationContext } from "@/shared/contexts/ProjectNavigationContext"

const navigationData = {
  user: {
    name: "Juan",
    email: "juan@example.com",
    avatar: "/avatars/juan.jpg",
  }
}

export function ProjectHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const { currentProject, folderNames, navigateToFolder, backToProjects } = useProjectNavigationContext()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 sm:gap-4 px-2 sm:px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4 hidden sm:block" />
      </div>

      {/* Breadcrumb estilo Google Drive */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {/* Botón de menú inicial - solo aparece cuando hay más de 2 niveles */}
        {folderNames.length > 2 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 py-2">
                {/* Título del menú */}
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b mb-1">
                  Navegación de carpetas
                </div>

                {/* Proyectos - nivel raíz (nivel 0) */}
                <DropdownMenuItem
                  onClick={backToProjects}
                  className="px-3 py-2 hover:bg-accent/50"
                >
                  <Folder className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="font-medium">Proyectos</span>
                </DropdownMenuItem>

                {/* Proyecto actual - nivel 1 */}
                {currentProject && (
                  <DropdownMenuItem
                    onClick={() => navigateToFolder([], [])}
                    className="px-3 py-2 hover:bg-accent/50"
                  >
                    <div className="flex items-center w-full">
                      {/* Sangría nivel 1 */}
                      <div className="w-4 flex justify-center">
                        <div className="w-px h-4 bg-border"></div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />
                      <Folder className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-medium">{currentProject.name}</span>
                    </div>
                  </DropdownMenuItem>
                )}

                {/* Carpetas intermedias - niveles 2+ */}
                {folderNames.slice(0, -2).map((folder, index) => {
                  const currentLevel = index + 2; // Nivel actual (2, 3, 4...)

                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => navigateToFolder(
                        folderNames.slice(0, index + 1).map((_, i) => `folder-${i}`),
                        folderNames.slice(0, index + 1)
                      )}
                      className="px-3 py-2 hover:bg-accent/50"
                    >
                      <div className="flex items-center w-full">
                        {/* Generar sangría para cada nivel */}
                        {Array.from({ length: currentLevel }, (_, levelIndex) => {
                          if (levelIndex === currentLevel - 1) {
                            // Último nivel - mostrar conector
                            return (
                              <div key={levelIndex} className="w-4 flex justify-center">
                                <div className="w-px h-4 bg-border"></div>
                              </div>
                            )
                          } else {
                            // Niveles intermedios - mostrar línea de continuación
                            return (
                              <div key={levelIndex} className="w-4 flex justify-center">
                                <div className="w-px h-full bg-border/30"></div>
                              </div>
                            )
                          }
                        })}
                        <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />
                        <Folder className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{folder}</span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}

                {/* Indicador de ubicación actual */}
                <div className="px-3 py-2 mt-1 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                    <span>Estás aquí: <strong className="text-foreground">{folderNames[folderNames.length - 1]}</strong></span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separador inicial */}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </>
        )}

        {/* Elementos del path */}
        {!currentProject ? (
          // Si estamos en la lista de proyectos
          <span className="text-sm font-medium text-foreground">Proyectos</span>
        ) : folderNames.length === 0 ? (
          // Si estamos en la raíz del proyecto
          <>
            <button
              onClick={backToProjects}
              className="text-sm font-medium hover:text-foreground text-muted-foreground transition-colors px-1"
            >
              Proyectos
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-medium text-foreground px-1">
              {currentProject.name}
            </span>
          </>
        ) : (
          <>
            {/* Mostrar "Proyectos" y proyecto solo si no hay muchos niveles */}
            {folderNames.length <= 2 && (
              <>
                <button
                  onClick={backToProjects}
                  className="text-sm font-medium hover:text-foreground text-muted-foreground transition-colors px-1"
                >
                  Proyectos
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => navigateToFolder([], [])}
                  className="text-sm font-medium hover:text-foreground text-muted-foreground transition-colors px-1"
                >
                  {currentProject.name}
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </>
            )}

            {/* Mostrar solo los últimos 2 elementos del path cuando hay muchos niveles */}
            {(folderNames.length > 2 ? folderNames.slice(-2) : folderNames).map((folder, index) => {
              const actualIndex = folderNames.length > 2 ? folderNames.length - 2 + index : index
              const isLast = actualIndex === folderNames.length - 1

              return (
                <React.Fragment key={actualIndex}>
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  {isLast ? (
                    // Último elemento como texto normal
                    <span className="text-sm font-medium text-foreground px-1">
                      {folder}
                    </span>
                  ) : (
                    // Elementos intermedios como botones clickeables
                    <button
                      onClick={() => {
                        const pathSlice = folderNames.slice(0, actualIndex + 1)
                        const idsSlice = pathSlice.map((_, i) => `folder-${i}`)
                        navigateToFolder(idsSlice, pathSlice)
                      }}
                      className="text-sm font-medium hover:text-foreground text-muted-foreground transition-colors px-1"
                    >
                      {folder}
                    </button>
                  )}
                </React.Fragment>
              )
            })}
          </>
        )}
      </div>

      {/* Búsqueda específica para proyectos */}
      <div className="flex-1 sm:flex-none sm:w-80 max-w-[320px] hidden sm:block">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar en proyectos..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Controles de usuario */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <NavUser user={navigationData.user} />
      </div>
    </header>
  )
} 