import { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function Orders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user.id) {
          setError('Please login to view orders');
          addToast?.('Please login to view orders', 'info');
          return;
        }

        setLoading(true);
        const response = await API.get(`/orders/${user.id}`);
        setOrders(response.data);
      } catch (err) {
        const message = err.response?.data?.error || 'Failed to load orders';
        setError(message);
        addToast?.(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id, addToast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-100';
      case 'paid':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-100';
      case 'shipped':
        return 'border-violet-500/30 bg-violet-500/10 text-violet-100';
      case 'delivered':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
      default:
        return 'border-gray-600 bg-gray-800 text-gray-100';
    }
  };

  if (loading) {
    return <Spinner label="Loading orders" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Purchases</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            My Orders
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-center text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center shadow-xl shadow-black/20">
            <p className="text-lg text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <article key={order._id} className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-xl shadow-black/20">
                <div className="grid gap-5 border-b border-gray-800 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Order ID</p>
                    <p className="mt-2 break-all font-mono text-sm text-gray-300">{order._id}</p>
                  </div>
                  <span className={`${getStatusColor(order.status)} w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <div className="rounded-lg bg-gray-950 p-4">
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="mt-1 font-bold text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-950 p-4">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="mt-1 text-2xl font-black text-emerald-300">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                  <h3 className="mb-4 text-lg font-black text-white">Items</h3>
                  <div className="grid gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${order._id}-${idx}`}
                        className="grid gap-3 rounded-lg border border-gray-800 bg-gray-950 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                        <div>
                          <p className="font-bold text-white">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="mt-1 text-sm text-gray-400">
                            Qty: {item.quantity} x ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-lg font-black text-emerald-300">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
