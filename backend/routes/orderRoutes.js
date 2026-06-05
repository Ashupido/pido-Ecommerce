const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const router = express.Router();

// Create order from cart
router.post('/create/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    let total = 0;
    const orderItems = cart.items.map(item => {
      total += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });
    
    const order = new Order({
      user: req.params.userId,
      items: orderItems,
      total: total
    });
    
    await order.save();
    
    // Clear cart after order
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const orders = await Order.find({ user: req.params.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;