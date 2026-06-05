import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const res = await API.get('/products');
      console.log('Products received:', res.data);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">${product.price}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;