import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ArrowRight, Building, Building2, Plus, Users } from "lucide-react"

export default function OrganizationUnitsPage() {
  const stats = [
    {
      title: "Divisiones",
      value: "4",
      description: "3 activas, 1 inactiva",
      icon: Building2,
      href: "org_units/divisions",
      color: "text-blue-600",
    },
    {
      title: "Departamentos",
      value: "12",
      description: "Todos activos",
      icon: Building,
      href: "org_units/departments",
      color: "text-green-600",
    },
    {
      title: "Unidades",
      value: "25",
      description: "23 activas, 2 pausadas",
      icon: Users,
      href: "org_units/units",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center mt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unidades Organizacionales</h1>
            <p className="text-muted-foreground">
              Gestiona la estructura organizacional de la empresa
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <Button
                  variant="secundario"
                  size="sm"
                  className="mt-2 text-xs h-auto items-center justify-center "
                  onClick={() => window.location.href = stat.href}
                >
                  Ver todos
                  <ArrowRight className="h-3 w-3" />
                </Button>

              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestión de Divisiones
            </CardTitle>
            <CardDescription>
              Administra las divisiones principales de la organización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "/app/org_units/divisions"}
              >
                <span className="truncate">Ver Divisiones</span>
              </Button>
              <Button
                variant="secundario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "/org_units/divisions?action=create"}
              >
                <Plus className="h-4 w-4 flex-shrink-0 mr-2" />
                <span className="truncate">Nueva División</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gestión de Departamentos
            </CardTitle>
            <CardDescription>
              Organiza los departamentos dentro de cada división
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "/app/org_units/departments"}
              >
                <span className="truncate">Ver Departamentos</span>
              </Button>
              <Button
                variant="secundario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "/org_units/departments?action=create"}
              >
                <Plus className="h-4 w-4 flex-shrink-0 mr-2" />
                <span className="truncate">Nuevo Departamento</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Unidades
            </CardTitle>
            <CardDescription>
              Define las unidades de trabajo específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "/app/org_units/units"}
              >
                <span className="truncate">Ver Unidades</span>
              </Button>
              <Button
                variant="secundario"
                size="sm"
                className="w-full sm:w-auto justify-center sm:whitespace-nowrap overflow-hidden"
                onClick={() => window.location.href = "org_units/units?action=create"}
              >
                <Plus className="h-4 w-4 flex-shrink-0 mr-2" />
                <span className="truncate">Nueva Unidad</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado general */}
      <Card>
        <CardHeader>
          <CardTitle>Estado General</CardTitle>
          <CardDescription>
            Vista rápida del estado de las unidades organizacionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">Activas</Badge>
              <span className="text-sm text-muted-foreground">29 unidades</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Inactivas</Badge>
              <span className="text-sm text-muted-foreground">3 unidades</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Pausadas</Badge>
              <span className="text-sm text-muted-foreground">2 unidades</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Con Issues</Badge>
              <span className="text-sm text-muted-foreground">0 unidades</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
