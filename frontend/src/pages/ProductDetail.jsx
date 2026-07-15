import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';

const getSavedCart = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const fallbackProductImage = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80';

export default function ProductDetail({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(getSavedCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch {
        setError('Failed to load product details');
        addToast?.('Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToast]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = cart.find((item) => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { ...product, quantity }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
    addToast?.(`${product.name} added to cart`, 'success');
    setQuantity(1);
  };

  if (loading) {
    return <Spinner label="Loading product" />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-950 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-center text-red-100">
            {error || 'Product not found'}
          </div>
          <button
            onClick={() => navigate('/products')}
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 rounded-lg border border-gray-800 px-4 py-2 text-sm font-bold text-blue-200 transition hover:border-blue-400/40 hover:bg-blue-500/10"
        >
          Back to Products
        </button>

        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-2xl shadow-black/30">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
            <div className="bg-gradient-to-br from-gray-800 to-gray-950 p-5 sm:p-8">
              <div className="flex min-h-72 items-center justify-center rounded-lg border border-gray-700 bg-gray-950/80 p-8 sm:min-h-96">
                <img
                  src={product.image || fallbackProductImage}
                  alt={product.name}
                  className="h-full w-full max-w-full rounded-xl object-cover"
                />
              </div>
            </div>

            <div className="grid content-center gap-6 p-5 sm:p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Product Detail</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-3xl font-black text-emerald-300">
                  ${Number(product.price || 0).toFixed(2)}
                </p>
                <p className="mt-4 text-base leading-7 text-gray-400">{product.description}</p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Product ID</p>
                <p className="mt-2 break-all font-mono text-sm text-gray-300">{product._id}</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-11 w-11 rounded-lg border border-gray-700 bg-gray-950 text-xl font-black text-white transition hover:bg-white/5"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-11 w-20 rounded-lg border border-gray-700 bg-gray-950 text-center font-bold text-white outline-none focus:border-blue-400"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-11 w-11 rounded-lg border border-gray-700 bg-gray-950 text-xl font-black text-white transition hover:bg-white/5"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={handleAddToCart}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="rounded-lg border border-gray-700 px-6 py-3 font-bold text-gray-200 transition hover:border-gray-500 hover:bg-white/5"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="grid gap-3 border-t border-gray-800 pt-6 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">In Stock</p>
                  <p className="mt-1 font-black text-white">Available</p>
                </div>
                <div className="rounded-lg bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">Shipping</p>
                  <p className="mt-1 font-black text-white">Free on orders $50+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
