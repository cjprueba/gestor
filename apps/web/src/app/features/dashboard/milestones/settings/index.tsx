import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Bell, Flag, Settings } from "lucide-react"

export default function MilestonesSettingsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuración de Registro de actividad documental</h1>
            <p className="text-muted-foreground">Administra las configuraciones del módulo de registro de actividad documental</p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="gap-4 flex justify-center items-center">
            <TabsTrigger value="general" className="flex items-center whitespace-nowrap">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center whitespace-nowrap">
              <Bell className="mr-2 h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="tipos" className="flex items-center whitespace-nowrap">
              <Flag className="mr-2 h-4 w-4" />
              Tipos de Registro de actividad documental
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Configura los parámetros generales del módulo de Registro de actividad documental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validacionNombre">Validación de nombres duplicados</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="validacionNombre" defaultChecked />
                      <Label htmlFor="validacionNombre">Activar validación</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Evita la duplicación de nombres de Registro de actividad documental en el mismo proyecto
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodoRetencion">Periodo de retención de Registro de actividad documental deshabilitados</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="periodoRetencion" type="number" defaultValue="90" className="w-20" />
                      <span>días</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tiempo que se mantendrán los Registro de actividad documental deshabilitados antes de eliminarlos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notificaciones" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>Configura las notificaciones automáticas para los Registro de actividad documental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificaciones de vencimiento</h3>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificaciones cuando un hito esté próximo a vencer
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Alertas configurables</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alerta1">Primera alerta</Label>
                        <div className="flex items-center space-x-2">
                          <Input id="alerta1" type="number" defaultValue="30" className="w-20" />
                          <span className="text-sm text-muted-foreground">días antes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alerta2">Segunda alerta</Label>
                        <div className="flex items-center space-x-2">
                          <Input id="alerta2" type="number" defaultValue="15" className="w-20" />
                          <span className="text-sm text-muted-foreground">días antes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alerta3">Tercera alerta</Label>
                        <div className="flex items-center space-x-2">
                          <Input id="alerta3" type="number" defaultValue="5" className="w-20" />
                          <span className="text-sm text-muted-foreground">días antes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinatarios">Destinatarios adicionales</Label>
                    <Input id="destinatarios" placeholder="Correos electrónicos separados por comas" />
                    <p className="text-sm text-muted-foreground">
                      Además del responsable del hito, se notificará a estos correos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tipos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Registro de actividad documental</CardTitle>
                <CardDescription>Configura los tipos de Registro de actividad documental disponibles en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoHito">Tipo de Registro de actividad documental</Label>
                      <Select defaultValue="proyecto">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proyecto">Proyecto</SelectItem>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="concesion">Concesión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadoHito">Estados disponibles</Label>
                      <Select defaultValue="cumplir">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cumplir">Por Cumplir</SelectItem>
                          <SelectItem value="vencer">Por Vencer</SelectItem>
                          <SelectItem value="vencido">Vencido</SelectItem>
                          <SelectItem value="recepcionado">Recepcionado</SelectItem>
                          <SelectItem value="aprobado">Aprobado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Agregar Tipo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
