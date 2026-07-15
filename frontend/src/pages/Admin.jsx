import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';

const categoryOptions = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Books & Stationery',
  'Uncategorized',
];

export default function Admin({ addToast }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const defaultFormData = {
    name: '',
    price: '',
    description: '',
    category: 'Uncategorized',
    image: '',
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products');
        setProducts(response.data);
      } catch {
        setError('Failed to load products');
        addToast?.('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [addToast]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/products');
      setProducts(response.data);
    } catch {
      setError('Failed to load products');
      addToast?.('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      addToast?.('Name and price are required', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        addToast?.('Product updated successfully', 'success');
      } else {
        await API.post('/products', formData);
        addToast?.('Product created successfully', 'success');
      }

      setFormData(defaultFormData);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      const message = err.response?.data?.error || 'Operation failed';
      setError(message);
      addToast?.(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category || 'Uncategorized',
      image: product.image || '',
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await API.delete(`/products/${pendingDelete._id}`);
      addToast?.('Product deleted successfully', 'success');
      setPendingDelete(null);
      fetchProducts();
    } catch (err) {
      const message = err.response?.data?.error || 'Delete failed';
      setError(message);
      addToast?.(message, 'error');
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return <Spinner label="Loading admin" />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(135deg,_#020617,_#111827_45%,_#030712)] py-6 sm:py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">Catalog control</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Product Management
            </h1>
            <p className="mt-2 text-sm text-slate-300">Create, update, and remove products with advanced control tools.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-black text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/products')}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-black text-slate-100 transition hover:bg-white/20"
            >
              Back to Store
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {showForm ? (
          <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 shadow-xl shadow-black/20 sm:p-6">
            <h2 className="mb-5 text-2xl font-black text-white">
              {editingId ? 'Edit Product' : 'Create New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option} className="bg-gray-950 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-28 w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                  {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-700 px-4 py-3 font-bold text-gray-200 transition hover:border-gray-500 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <button
            onClick={() => {
              setFormData(defaultFormData);
              setEditingId(null);
              setShowForm(true);
            }}
            className="mb-8 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-400"
          >
            Add New Product
          </button>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl shadow-black/20">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-300">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-black text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-t border-gray-800 hover:bg-white/[0.03]">
                      <td className="px-6 py-4 font-bold text-white">{product.name}</td>
                      <td className="px-6 py-4 font-black text-emerald-300">${Number(product.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-200">{product.category || 'Uncategorized'}</td>
                      <td className="max-w-xs truncate px-6 py-4 text-gray-300">
                        {product.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="mr-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete(product)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 md:hidden">
            {products.length === 0 ? (
              <p className="py-6 text-center text-gray-400">No products found</p>
            ) : (
              products.map((product) => (
                <article key={product._id} className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-white">{product.name}</h2>
                      <p className="mt-1 font-black text-emerald-300">${Number(product.price || 0).toFixed(2)}</p>
                      <p className="mt-1 text-sm text-slate-300">{product.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{product.description || '-'}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setPendingDelete(product)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {pendingDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/40">
              <h2 className="text-xl font-black text-white">Delete product?</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                This will remove "{pendingDelete.name}" from the store.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="rounded-lg border border-gray-700 px-4 py-3 font-bold text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-3 font-black text-white transition hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
