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
    
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    let total = 0;
    const orderItems = items.map(item => {
      total += item.price * item.quantity;
      return {
        product: item._id,
        quantity: item.quantity,
        price: item.price
      };
    });
    
    const order = new Order({
      user: req.params.userId,
      items: orderItems,
      total: total,
      status: 'pending'
    });
    
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
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