import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const getSavedCart = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

export default function Cart({ addToast }) {
  const [cart, setCart] = useState(getSavedCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const persistCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!Number.isFinite(newQuantity) || newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    persistCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    const item = cart.find((product) => product._id === productId);
    persistCart(cart.filter((product) => product._id !== productId));
    if (item) addToast?.(`${item.name} removed from cart`, 'info');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setError('');

    if (cart.length === 0) {
      setError('Cart is empty');
      addToast?.('Cart is empty', 'warning');
      return;
    }

    if (!user.id) {
      addToast?.('Please login before checkout', 'info');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await API.post(`/orders/create/${user.id}`, { items: cart });
      addToast?.('Order created successfully', 'success');
      setCart([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/orders');
    } catch (err) {
      const message = err.response?.data?.error || 'Checkout failed';
      setError(message);
      addToast?.(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Checkout</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Shopping Cart
            </h1>
          </div>
          <p className="text-sm text-gray-400">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center shadow-xl shadow-black/20">
            <p className="mb-5 text-lg text-gray-400">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="grid gap-4">
              {cart.map((item) => (
                <article
                  key={item._id}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-xl shadow-black/20 sm:p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-black text-blue-200 ring-1 ring-blue-400/20">
                        {item.name?.slice(0, 1)?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white">{item.name}</h2>
                        <p className="mt-1 text-sm text-gray-400">${Number(item.price || 0).toFixed(2)} each</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[auto_auto_auto] sm:items-center">
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-700 bg-gray-950 p-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="h-9 w-9 rounded bg-white/5 font-black text-white transition hover:bg-white/10"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value))
                          }
                          className="h-9 w-14 bg-transparent text-center font-bold text-white outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="h-9 w-9 rounded bg-white/5 font-black text-white transition hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-right text-lg font-black text-emerald-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-xl shadow-black/20">
              <h2 className="text-xl font-black text-white">Order Summary</h2>
              <div className="mt-5 grid gap-3 border-b border-gray-800 pb-5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{Number(calculateTotal()) >= 50 ? 'Free' : 'Calculated later'}</span>
                </div>
              </div>
              <div className="my-5 flex items-center justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="text-2xl font-black text-emerald-300">${calculateTotal()}</span>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="rounded-lg bg-emerald-600 px-6 py-3 font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="rounded-lg border border-gray-700 px-6 py-3 font-bold text-gray-200 transition hover:border-gray-500 hover:bg-white/5"
                >
                  Continue Shopping
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
