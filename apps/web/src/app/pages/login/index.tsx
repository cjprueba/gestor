import { LoginForm } from "./_components/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}