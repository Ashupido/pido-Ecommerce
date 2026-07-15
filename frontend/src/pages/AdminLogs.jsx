import { useEffect, useState } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function AdminLogs({ addToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/logs/activity');
      setLogs(res.data);
    } catch (err) {
      addToast?.('Failed to load logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <Spinner label="Loading logs" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-black text-white">Activity Logs</h1>
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 text-white p-4">
          <ul className="space-y-3">
            {logs.map((l) => (
              <li key={l._id} className="rounded-md border border-gray-800 bg-gray-950 p-3">
                <div className="text-sm text-gray-300">{new Date(l.timestamp).toLocaleString()}</div>
                <div className="mt-1 font-black text-white">{l.action}</div>
                <div className="mt-1 text-sm text-gray-300">{l.details || l.target || ''}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
