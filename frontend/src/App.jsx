import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import { useToast } from './hooks/useToast';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminLogs from './pages/AdminLogs';
import SellerDashboard from './pages/SellerDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProtectedSellerRoute from './components/ProtectedSellerRoute';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-950">
        <Navbar />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login addToast={addToast} />} />
            <Route path="/register" element={<Register addToast={addToast} />} />
            <Route path="/products" element={<Products addToast={addToast} />} />
            <Route path="/product/:id" element={<ProductDetail addToast={addToast} />} />
            <Route path="/cart" element={<Cart addToast={addToast} />} />
            <Route path="/orders" element={<Orders addToast={addToast} />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<Admin addToast={addToast} />} />
              <Route path="/admin/dashboard" element={<AdminDashboard addToast={addToast} />} />
              <Route path="/admin/users" element={<AdminUsers addToast={addToast} />} />
              <Route path="/admin/orders" element={<AdminOrders addToast={addToast} />} />
              <Route path="/admin/logs" element={<AdminLogs addToast={addToast} />} />
            </Route>
            <Route element={<ProtectedSellerRoute />}>
              <Route path="/seller" element={<Admin addToast={addToast} />} />
              <Route path="/seller/dashboard" element={<SellerDashboard addToast={addToast} />} />
            </Route>
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
