import { useEffect, useState } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';

export default function AdminUsers({ addToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      addToast?.('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      addToast?.('Role updated', 'success');
      fetchUsers();
    } catch (err) {
      addToast?.('Failed to update role', 'error');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      addToast?.('User deleted', 'success');
      fetchUsers();
    } catch (err) {
      addToast?.('Failed to delete user', 'error');
    }
  };

  if (loading) return <Spinner label="Loading users" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-black text-white">User Management</h1>
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 text-white">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-black text-gray-300">Role</th>
                <th className="px-4 py-3 text-right text-sm font-black text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-800 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 text-gray-300">{u.role}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="mr-2 rounded-md bg-gray-800 px-2 py-1 text-sm text-white"
                    >
                      <option value="user">user</option>
                      <option value="seller">seller</option>
                      <option value="manager">manager</option>
                      <option value="admin">admin</option>
                    </select>
                    <button onClick={() => deleteUser(u._id)} className="rounded-md bg-red-600 px-3 py-1 text-sm font-black text-white">
                      Delete
                    </button>
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
