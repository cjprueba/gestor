import { Outlet } from '@tanstack/react-router';

export default function AuthLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
