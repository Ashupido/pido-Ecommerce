const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Product = require('./models/Product');

  // Delete existing products
  await Product.deleteMany({});
  console.log('Cleared existing products');

  // Add sample products
  const products = [
    {
      name: 'Wireless Headphones',
      price: 79.99,
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      name: 'Smartphone Stand',
      price: 19.99,
      description: 'Adjustable phone stand for desk and table'
    },
    {
      name: 'USB-C Cable',
      price: 12.99,
      description: 'Durable 6ft USB-C charging and data cable'
    },
    {
      name: 'Laptop Backpack',
      price: 49.99,
      description: 'Water-resistant backpack with laptop compartment'
    },
    {
      name: 'Portable Charger',
      price: 34.99,
      description: '20000mAh portable power bank for all devices'
    },
    {
      name: 'Mechanical Keyboard',
      price: 89.99,
      description: 'RGB mechanical keyboard with Cherry MX switches'
    }
  ];

  const created = await Product.insertMany(products);
  console.log(`✅ Added ${created.length} products to database`);
  
  // Display them
  const all = await Product.find();
  console.log('\nProducts in database:');
  all.forEach(p => console.log(`  - ${p.name}: $${p.price}`));

  process.exit();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
