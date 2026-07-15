import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedSellerRoute() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.role === 'seller' || user?.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/products" replace />;
}
