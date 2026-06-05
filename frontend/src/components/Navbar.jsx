import React from 'react';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">🛒 Pido E-commerce</h1>
        <div className="space-x-4">
          <a href="/" className="hover:underline">Products</a>
          <a href="/cart" className="hover:underline">Cart</a>
          <a href="/orders" className="hover:underline">Orders</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;