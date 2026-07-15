import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAdminRoute() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/products" replace />;
}
