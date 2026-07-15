import { useEffect, useState } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function AdminOrders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      addToast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      addToast?.('Order updated', 'success');
      fetchOrders();
    } catch (err) {
      addToast?.('Failed to update order', 'error');
    }
  };

  if (loading) return <Spinner label="Loading orders" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-black text-white">Order Management</h1>
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 text-white">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Order</th>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Total</th>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Status</th>
                <th className="px-4 py-3 text-right text-sm font-black text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-gray-800 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-bold text-white">#{o._id.slice(-6)}</td>
                  <td className="px-4 py-3 text-gray-300">{o.user?.name}</td>
                  <td className="px-4 py-3 text-emerald-300">${Number(o.total || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-300">{o.status}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="mr-2 rounded-md bg-gray-800 px-2 py-1 text-sm text-white"
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
