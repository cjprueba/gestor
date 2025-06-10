import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import React from 'react';

export default function Root() {
  const nav = useNavigate();
  const loc = useLocation();
  React.useEffect(() => {
    if (loc.pathname === '/') nav({ to: '/auth/login', replace: true });
  }, []);
  return <Outlet />;
}
