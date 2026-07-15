import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Award,
  BadgeCheck,
  Baby,
  Car,
  ChevronLeft,
  ChevronRight,
  Headphones,
  HeartHandshake,
  Home,
  PackageCheck,
  RefreshCcw,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tags,
  Truck,
  UsersRound,
  Volleyball,
} from 'lucide-react';
import API from '../services/api';
import Spinner from '../components/Spinner';

const formatPrice = (price) => Number(price || 0).toFixed(2);

const getSavedCart = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const getRating = (id = '') => {
  const seed = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 4 + (seed % 10) / 10;
};

const fallbackProducts = [
  {
    name: 'Wireless Headphones',
    price: 49.99,
    description: 'Noise cancelling over-ear headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Travel Backpack',
    price: 29.99,
    description: 'Water-resistant daily laptop backpack',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: "Men's Sneakers",
    price: 39.99,
    description: 'Clean white sneakers for everyday wear',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1519741490224-60dc5e9fdbec?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Smart Watch Series 8',
    price: 89.99,
    description: 'Fitness tracking smartwatch with vivid display',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de1d0b5?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Premium Perfume',
    price: 24.99,
    description: 'Fresh daily fragrance in a glass bottle',
    category: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1571748982651-76c6d7e5527b?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Ceramic Dinner Set',
    price: 64.99,
    description: '12-piece stoneware dinner set for modern kitchens',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1515548211267-47f6a1cda1f8?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'LED Desk Lamp',
    price: 22.49,
    description: 'Adjustable desk lamp with warm white lighting',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Yoga Mat',
    price: 19.99,
    description: 'Eco-friendly non-slip fitness yoga mat',
    category: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1526401485004-8c9736182a7c?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Kitchen Knife Set',
    price: 69.99,
    description: 'Professional stainless steel chef knife collection',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c39?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Aromatic Candle',
    price: 14.99,
    description: 'Scented candle with natural essential oils',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1516594798945-0c5a0ccf4d93?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Running Shorts',
    price: 27.99,
    description: 'Lightweight and breathable running shorts',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Bluetooth Speaker',
    price: 59.99,
    description: 'Portable speaker with deep bass and stereo sound',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1518893497248-5d0b5b1d1f78?auto=format&fit=crop&w=700&q=80',
  },
];

const productVisuals = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
];

const promos = [
  {
    title: 'New Arrivals',
    copy: 'Check out the latest products just for you',
    color: 'from-blue-50 to-blue-100',
    button: 'bg-blue-700',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Fashion Sale',
    copy: 'Up to 50% off on trending styles',
    color: 'from-rose-50 to-red-100',
    button: 'bg-red-600',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Home Essentials',
    copy: 'Everything for your perfect home',
    color: 'from-emerald-50 to-cyan-100',
    button: 'bg-teal-700',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Beauty Picks',
    copy: 'Top beauty products at best prices',
    color: 'from-violet-50 to-fuchsia-100',
    button: 'bg-violet-600',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80',
  },
];

const categoryList = [
  [Store, 'Electronics'],
  [Shirt, 'Fashion'],
  [Home, 'Home & Kitchen'],
  [Sparkles, 'Beauty & Personal Care'],
  [Volleyball, 'Sports & Outdoors'],
  [Baby, 'Toys & Games'],
  [Car, 'Automotive'],
];

function Rating({ value, count = '2.5K' }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-slate-600">{value.toFixed(1)} ({count})</span>
    </div>
  );
}

function ProductImage({ product, index, className = '' }) {
  return (
    <img
      src={product.image || productVisuals[index % productVisuals.length]}
      alt={product.name}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
    />
  );
}

export default function Products({ addToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(getSavedCart);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeMobileToggle, setActiveMobileToggle] = useState('categories');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products');
        setProducts(response.data);
      } catch {
        setError('Failed to load live products. Showing featured picks.');
        addToast?.('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [addToast]);

  useEffect(() => {
    const category = searchParams.get('category')?.trim();
    const query = searchParams.get('q')?.trim();

    setSelectedCategory(category?.length ? category : 'All');
    setSearchTerm(query ?? '');
  }, [searchParams]);

  const updateSearchParams = (category, query) => {
    const next = new URLSearchParams();
    const normalizedCategory = category?.trim();
    const normalizedQuery = query?.trim();

    if (normalizedCategory && normalizedCategory !== 'All') next.set('category', normalizedCategory);
    if (normalizedQuery) next.set('q', normalizedQuery);
    setSearchParams(next);
  };

  const catalog = products.length > 0 ? products : fallbackProducts.map((product, index) => ({
    ...product,
    _id: `fallback-${index}`,
  }));

  const selectedCategoryLabel = selectedCategory;

  const featuredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedCategory = selectedCategoryLabel.trim().toLowerCase();

    return catalog
      .filter((product) => {
        if (normalizedCategory === 'all') return true;
        return String(product.category || '').trim().toLowerCase() === normalizedCategory;
      })
      .filter((product) => {
        if (!normalizedSearch) return true;
        return `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .map((product, index) => ({
        ...product,
        rating: getRating(product._id || product.name),
        oldPrice: Number(product.price || 0) * (index % 2 === 0 ? 2 : 1.8),
        discount: index % 2 === 0 ? '50% off' : '55% off',
        image: product.image || productVisuals[index % productVisuals.length],
      }));
  }, [catalog, searchTerm, selectedCategoryLabel]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    updateSearchParams(category, searchTerm);
  };

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    updateSearchParams(selectedCategory, value);
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
    addToast?.(`${product.name} added to cart`, 'success');
  };

  const goToProduct = (product) => {
    if (!String(product._id || '').startsWith('fallback-')) {
      navigate(`/product/${product._id}`);
    }
  };

  if (loading) {
    return <Spinner label="Loading products" />;
  }

  const heroProduct = featuredProducts[0] || fallbackProducts[0];
  const deals = featuredProducts.slice(0, 5);
  const topSelling = featuredProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-10">
        {error && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        )}

        <section className="grid gap-4 xl:grid-cols-[280px_1fr_280px]">
          <aside className="rounded-lg bg-[#071a32] p-6 text-white shadow-sm">
            <h2 className="text-xl font-black">Deal of the Day</h2>
            <p className="mt-4 text-sm font-bold text-amber-300">Ends in</p>
            <div className="mt-2 grid max-w-40 grid-cols-3 overflow-hidden rounded-md bg-amber-400 text-center text-slate-950">
              {['08', '45', '32'].map((time, index) => (
                <div key={time} className="px-2 py-2">
                  <div className="text-xl font-black">{time}</div>
                  <div className="text-[9px] font-bold uppercase">{['Hrs', 'Mins', 'Secs'][index]}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-[86px_1fr] items-center gap-4">
              <div className="h-24 overflow-hidden rounded-md bg-white/10">
                <ProductImage product={heroProduct} index={3} />
              </div>
              <div>
                <p className="text-sm font-bold">{heroProduct.name}</p>
                <Rating value={getRating(heroProduct._id || heroProduct.name)} count="4.8" />
                <p className="mt-2 text-2xl font-black">${formatPrice(heroProduct.price)}</p>
                <p className="text-xs text-slate-300 line-through">${formatPrice(Number(heroProduct.price || 0) * 2.2)}</p>
              </div>
            </div>
            <button
              onClick={() => handleAddToCart(heroProduct)}
              className="mt-8 rounded-md bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300"
            >
              Shop Now
            </button>
          </aside>

          <section className="relative min-h-[360px] overflow-hidden rounded-lg bg-stone-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80"
              alt="Extra virgin olive oil bottles on a rustic table"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
            <div className="relative flex h-full max-w-xl flex-col justify-center p-8 sm:p-12">
              <span className="w-fit rounded-md bg-green-800 px-4 py-2 text-sm font-black text-white">
                100% Natural
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                Pure. Natural. Premium.
                <span className="block text-green-900">Extra Virgin Olive Oil</span>
              </h1>
              <p className="mt-5 max-w-md text-lg font-medium leading-7 text-slate-800">
                Carefully crafted for rich flavor and a healthier you.
              </p>
              <button className="mt-6 w-fit rounded-md bg-green-800 px-6 py-3 text-sm font-black text-white transition hover:bg-green-700">
                Shop Now
              </button>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                <span>Cold Pressed</span>
                <span>Rich in Antioxidants</span>
                <span>100% Natural</span>
              </div>
            </div>
            <button className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white text-xl font-black shadow-md sm:block">
              <ChevronLeft className="mx-auto h-6 w-6" />
            </button>
            <button className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white text-xl font-black shadow-md sm:block">
              <ChevronRight className="mx-auto h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/60'}`} />
              ))}
            </div>
          </section>

          <aside className="grid gap-0 overflow-hidden rounded-lg bg-green-50 p-5 shadow-sm">
            {[
              [ShieldCheck, 'Secure Payments', '100% secure checkout'],
              [PackageCheck, 'Easy Returns', '30-day return policy'],
              [Headphones, '24/7 Support', "We're here to help"],
            ].map(([Icon, title, copy], index) => (
              <div key={title} className={`flex items-center gap-4 py-6 ${index > 0 ? 'border-t border-green-200' : ''}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-950 text-lg font-black text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-black">{title}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{copy}</p>
                </div>
              </div>
            ))}
          </aside>
        </section>

        <section className="mt-4 grid gap-4 rounded-lg bg-white p-5 shadow-sm lg:grid-cols-6">
          {[
            [Truck, 'Free Delivery', 'On orders over $50'],
            [PackageCheck, 'Fast Shipping', 'Quick delivery at your door'],
            [BadgeCheck, 'Best Quality', '100% original products'],
            [Award, 'Top Brands', '1000+ trusted brands'],
            [Tags, 'Great Prices', 'Best price guaranteed'],
            [ShoppingBag, 'Download Our App', 'Get extra 10% off'],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="flex items-center gap-4 border-slate-200 lg:border-r lg:last:border-r-0">
              <Icon className="h-8 w-8 shrink-0 text-slate-800" />
              <div>
                <p className="font-black">{title}</p>
                <p className="text-sm font-medium text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 lg:hidden">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto">
            {[
              ['categories', 'Categories'],
              ['deals', 'Deals'],
              ['topSelling', 'Top Selling'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMobileToggle(key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeMobileToggle === key
                    ? 'border-blue-700 bg-blue-100 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeMobileToggle === 'categories' && (
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Shop by Category</h2>
              <div className="mt-4 grid gap-3">
                <button
                  onClick={() => handleSelectCategory('All')}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    selectedCategory === 'All' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                  }`}
                >
                  <Store className="h-5 w-5 shrink-0 text-slate-700" />
                  All
                </button>
                {categoryList.map(([Icon, category]) => (
                  <button
                    key={category}
                    onClick={() => handleSelectCategory(category)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      selectedCategory === category ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-slate-700" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMobileToggle === 'deals' && (
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">Deals</h2>
                <span className="rounded-md bg-red-500 px-3 py-1 text-xs font-black text-white">Up to 60% off</span>
              </div>
              <label className="mb-4 flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-5 w-5 text-slate-500" />
                <input
                  type="search"
                  placeholder="Filter deals"
                  value={searchTerm}
                  onChange={(event) => handleSearchTermChange(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
              </label>
              {deals.length === 0 ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-slate-500">
                  No products found
                </div>
              ) : (
                <div className="grid gap-4">
                  {deals.map((product) => (
                    <article key={product._id || product.name} className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 block aspect-square overflow-hidden rounded-lg bg-slate-50">
                        <ProductImage product={product} index={0} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{product.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">${formatPrice(product.price)}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMobileToggle === 'topSelling' && (
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">Top Selling</h2>
                <button className="text-sm font-bold text-blue-700">View all</button>
              </div>
              <div className="grid gap-4">
                {topSelling.map((product, index) => (
                  <button
                    key={product._id || product.name}
                    onClick={() => goToProduct(product)}
                    className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-xl border border-slate-200 p-4 text-left"
                  >
                    <div className="overflow-hidden rounded-lg bg-slate-50">
                      <ProductImage product={product} index={index + 1} className="h-14 w-14 object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm font-bold text-amber-500">${formatPrice(product.price)}</p>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section id="deals" className="hidden mt-4 gap-4 rounded-lg bg-white p-5 shadow-sm lg:grid xl:grid-cols-[280px_1fr_360px]">
          <aside className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">Shop by Category</h2>
            <div className="mt-4 grid gap-3">
              <button
                onClick={() => handleSelectCategory('All')}
                className={`flex items-center gap-3 text-left text-sm font-semibold transition ${selectedCategory === 'All' ? 'text-blue-700' : 'text-slate-700 hover:text-blue-700'}`}
              >
                <Store className="h-5 w-5 shrink-0 text-slate-700" />
                All
              </button>
              {categoryList.map(([Icon, category]) => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  className={`flex items-center gap-3 text-left text-sm font-semibold transition ${selectedCategory === category ? 'text-blue-700' : 'text-slate-700 hover:text-blue-700'}`}
                >
                  <Icon className="h-5 w-5 shrink-0 text-slate-700" />
                  {category}
                </button>
              ))}
            </div>
            <button className="mt-5 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black">
              View All Categories
            </button>
          </aside>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black">Today's Deals</h2>
                <span className="rounded-md bg-red-500 px-4 py-2 text-xs font-black text-white">Up to 60% off</span>
              </div>
              <button className="text-sm font-bold text-blue-700">View all deals</button>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="h-5 w-5 text-slate-500" />
                <input
                  type="search"
                  placeholder="Filter deals by name"
                  value={searchTerm}
                  onChange={(event) => handleSearchTermChange(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
              </label>
            </div>

            {deals.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center font-semibold text-slate-500">
                No products found
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                {deals.map((product, index) => (
                  <article key={product._id || product.name} className="group">
                    <button
                      onClick={() => goToProduct(product)}
                      className="block aspect-square w-full overflow-hidden rounded-md bg-slate-50"
                    >
                      <ProductImage product={product} index={index} className="transition duration-200 group-hover:scale-105" />
                    </button>
                    <div className="mt-3">
                      <Rating value={product.rating} />
                      <h3 className="mt-2 line-clamp-1 text-sm font-black">{product.name}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-black">${formatPrice(product.price)}</span>
                        <span className="text-xs font-bold text-slate-400 line-through">${formatPrice(product.oldPrice)}</span>
                        <span className="text-xs font-black text-red-600">{product.discount}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full rounded-md bg-[#061428] px-3 py-2 text-xs font-black text-white transition hover:bg-blue-800"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">Top Selling</h2>
              <button className="text-sm font-bold text-blue-700">View all</button>
            </div>
            <div className="grid gap-4">
              {topSelling.map((product, index) => (
                <button
                  key={product._id || product.name}
                  onClick={() => goToProduct(product)}
                  className="grid grid-cols-[28px_64px_1fr] items-center gap-4 text-left"
                >
                  <span className="text-2xl font-black text-amber-500">{index + 1}</span>
                  <span className="h-16 overflow-hidden rounded-md bg-slate-50">
                    <ProductImage product={product} index={index + 1} />
                  </span>
                  <span>
                    <span className="block line-clamp-1 text-sm font-semibold text-slate-600">{product.name}</span>
                    <span className="mt-1 block font-black">${formatPrice(product.price)}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {product.rating.toFixed(1)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {promos.map((promo) => (
            <article key={promo.title} className={`relative min-h-36 overflow-hidden rounded-lg bg-gradient-to-r ${promo.color} p-6 shadow-sm`}>
              <img src={promo.image} alt="" className="absolute bottom-0 right-0 h-full w-1/2 object-cover mix-blend-multiply" loading="lazy" />
              <div className="relative max-w-[55%]">
                <h2 className="text-xl font-black">{promo.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-5 text-slate-700">{promo.copy}</p>
                <button className={`mt-4 rounded-md ${promo.button} px-4 py-2 text-xs font-black text-white`}>
                  Shop Now
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-4 rounded-lg bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-5">
          {[
            [ShieldCheck, '100% Secure Checkout', 'Multiple payment options'],
            [HeartHandshake, 'Buyer Protection', 'We protect your purchase'],
            [RefreshCcw, 'Easy Returns', 'Hassle-free returns'],
            [Award, 'Quality Guarantee', '100% authentic products'],
            [UsersRound, 'Trusted by Millions', 'Happy customers worldwide'],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="flex items-center gap-4 border-slate-200 lg:border-r lg:last:border-r-0">
              <Icon className="h-8 w-8 shrink-0 text-slate-800" />
              <div>
                <p className="text-sm font-black">{title}</p>
                <p className="text-xs font-medium text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
