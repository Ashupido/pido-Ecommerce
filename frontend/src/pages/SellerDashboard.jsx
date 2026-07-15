import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function SellerDashboard({ addToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get('/products');
        setProducts(res.data || []);
      } catch {
        addToast?.('Failed to load seller inventory', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [addToast]);

  if (loading) return <Spinner label="Loading seller dashboard" />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_24%),linear-gradient(135deg,_#111827,_#1f2937_45%,_#030712)] py-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">Seller workspace</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Seller Control Panel</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Manage your catalog, keep inventory fresh, and stay on top of orders without touching the storefront.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/seller" className="rounded-xl bg-amber-500 px-4 py-2.5 font-black text-slate-950 transition hover:bg-amber-400">Manage Products</Link>
            <Link to="/products" className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 font-black text-white transition hover:bg-white/20">View Storefront</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Listed Products</div>
            <div className="mt-3 text-4xl font-black">{products.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Active Catalog</div>
            <div className="mt-3 text-4xl font-black">Live</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Quick Actions</div>
            <div className="mt-3 text-lg font-black">Add / Edit / Remove</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <h2 className="text-lg font-black">Recent Inventory</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <div key={product._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-black text-white">{product.name}</div>
                <div className="mt-2 text-sm text-slate-300">{product.description || 'No description yet'}</div>
                <div className="mt-3 text-lg font-black text-amber-300">${Number(product.price || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
