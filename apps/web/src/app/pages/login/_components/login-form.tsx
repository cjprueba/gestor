import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/shared/lib/utils"
import { useNavigate } from "@tanstack/react-router"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="rounded-md">
        <CardContent>
          <form className="p-6 md:p-4">
            <div className="flex flex-col gap-4">
              <img src="/logo_cl.png" alt="logo" className="w-25 h-25 ml-4 mt-2 self-center" />
              <div className="flex flex-col items-center text-center">

                <h1 className="text-xl text-muted-foreground font-medium">MOP - Gestor de Proyectos</h1>
                <p className="text-balance text-muted-foreground mt-4 mb-2 text-sm">
                  Por favor ingrese credenciales para acceder.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                // required
                />
              </div>
              <div className="grid gap-2 mt-4">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button variant="primario" className="w-full rounded-sm mt-1" onClick={() => {
                navigate({ to: "/app" })
              }}>
                Ingresar
              </Button>
              <div className="mt-4 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  O inicia sesión con:
                </span>
              </div>
              <div className="flex justify-center">
                <Button variant="primario" className="bg-primary-400 " >
                  <img src="/clave_unica.svg" alt="clave unica" className=" w-20 h-20" />
                </Button>
              </div>
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Regístrate
                </a>
              </div>
            </div>
          </form>
          {/* <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Imagen"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div> */}
        </CardContent>
      </Card>

    </div>
  )
}
