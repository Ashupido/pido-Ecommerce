const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    // Validation
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    if (price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    const product = new Product({ name, price, description });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;