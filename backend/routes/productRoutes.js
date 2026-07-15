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

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    
    // Validation
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    if (price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    const product = new Product({
      name,
      price,
      description,
      category: category?.trim() || 'Uncategorized',
      image: image?.trim() || '',
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category: category?.trim() || 'Uncategorized',
        image: image?.trim() || '',
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;