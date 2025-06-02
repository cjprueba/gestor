import { Outlet } from "@tanstack/react-router";
// import { AuthProvider } from "@/lib/providers/AuthProvider";
// import { ThemeProvider } from "@/lib/providers/ThemeProvider";
// import { ErrorBoundary } from "@/lib/components/ErrorBoundary";

export function App() {
  return (
    // <ThemeProvider>
    //   <AuthProvider>
    //     <ErrorBoundary>
    // {/* Outlet renderiza las rutas */}
    <Outlet />
    // {/* </ErrorBoundary>
    //   </AuthProvider>
    // </ThemeProvider> */}
  );
}