import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function AdminDashboard({ addToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/stats/dashboard');
        setStats(res.data);
      } catch {
        addToast?.('Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addToast]);

  if (loading) return <Spinner label="Loading dashboard" />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827_45%,_#030712)] py-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">Operations center</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Admin Command Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Monitor store health, manage users, and keep orders moving without leaving the control panel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin" className="rounded-xl bg-cyan-500/20 px-4 py-2.5 font-black text-cyan-200 ring-1 ring-cyan-400/30 transition hover:bg-cyan-500/30">Manage Products</Link>
            <Link to="/admin/users" className="rounded-xl bg-violet-500/20 px-4 py-2.5 font-black text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/30">Manage Users</Link>
            <Link to="/admin/orders" className="rounded-xl bg-amber-500/20 px-4 py-2.5 font-black text-amber-200 ring-1 ring-amber-400/30 transition hover:bg-amber-500/30">Manage Orders</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Users', value: stats?.totalUsers ?? 0, tone: 'from-cyan-500/20 to-cyan-500/5' },
            { label: 'Products', value: stats?.totalProducts ?? 0, tone: 'from-violet-500/20 to-violet-500/5' },
            { label: 'Orders', value: stats?.totalOrders ?? 0, tone: 'from-amber-500/20 to-amber-500/5' },
          ].map((card) => (
            <div key={card.label} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.tone} p-5 shadow-lg shadow-black/20`}>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">{card.label}</div>
              <div className="mt-3 text-4xl font-black">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-black">Revenue Snapshot</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="text-sm text-emerald-200">Total Revenue</div>
                <div className="mt-2 text-3xl font-black">${Number(stats?.totalRevenue || 0).toFixed(2)}</div>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <div className="text-sm text-cyan-200">Average Order Value</div>
                <div className="mt-2 text-3xl font-black">${Number(stats?.averageOrderValue || 0).toFixed(2)}</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-black">Users by Role</h2>
            <ul className="mt-4 space-y-3">
              {(stats?.usersByRole || []).map((r) => (
                <li key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                  <span className="font-semibold capitalize">{r._id}</span>
                  <span className="font-black text-white">{r.count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <h2 className="text-lg font-black">Orders by Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {(stats?.ordersByStatus || []).map((s) => (
              <div key={s._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold capitalize text-slate-300">{s._id}</div>
                <div className="mt-2 text-2xl font-black">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
