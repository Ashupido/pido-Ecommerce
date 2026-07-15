import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register({ addToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register | Pido';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', { name: name.trim(), email: normalizedEmail, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-updated'));
      addToast(`Welcome, ${response.data.user.name}! Your account is created.`, 'success');
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setFormError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">Register</h1>
        <p className="mb-8 mt-2 text-center text-gray-400">Join Pido E-commerce today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Password"
              required
            />
            <p className="mt-1 text-xs text-gray-400">Minimum 6 characters</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Confirm password"
              required
            />
          </div>

          {formError && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/70 px-3 py-2 text-sm font-medium text-red-100">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-400 transition hover:text-blue-300">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
