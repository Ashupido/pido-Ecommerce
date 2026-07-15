import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/products" className="text-2xl font-black tracking-tight text-slate-950">
            Pido
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Everyday essentials and curated products with a simple shopping experience.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Shop</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link className="hover:text-blue-700" to="/products">Products</Link>
            <Link className="hover:text-blue-700" to="/cart">Cart</Link>
            <Link className="hover:text-blue-700" to="/orders">Orders</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Support</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <span>Free shipping over $50</span>
            <span>Secure checkout</span>
            <span>support@pido.store</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        (c) 2026 Pido. All rights reserved.
      </div>
    </footer>
  );
}
