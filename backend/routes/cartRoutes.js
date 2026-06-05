const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    res.json(cart || { user: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Validation
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: 'User ID, product ID, and quantity are required' });
    }
    
    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

module.exports = router;