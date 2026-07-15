const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { 
  authMiddleware, 
  requireManagerOrAdmin 
} = require('../middleware/rbac');
const { logActivity } = require('../utils/activityLogger');
const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);
router.use(requireManagerOrAdmin);

// ========== PRODUCT MANAGEMENT ==========

// Get all products
router.get('/products', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Log activity
    await logActivity(
      req.userId,
      req.user.name,
      req.userRole,
      'updated_product',
      'product',
      product._id,
      product.name,
      { name, price, description },
      req.ip
    );
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Log activity
    await logActivity(
      req.userId,
      req.user.name,
      req.userRole,
      'deleted_product',
      'product',
      product._id,
      product.name,
      { price: product.price },
      req.ip
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ========== ORDER MANAGEMENT ==========

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('items.product');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Log activity
    await logActivity(
      req.userId,
      req.user.name,
      req.userRole,
      'updated_order_status',
      'order',
      order._id,
      `Order #${order._id}`,
      { newStatus: status },
      req.ip
    );
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ========== ANALYTICS & REPORTS ==========

// Get sales analytics
router.get('/analytics/sales', async (req, res) => {
  try {
    const salesByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }
    ]);
    
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      salesByMonth,
      topProducts,
      orderStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get inventory status
router.get('/analytics/inventory', async (req, res) => {
  try {
    const products = await Product.find().select('name price _id');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// ========== CUSTOMER SUPPORT VIEW ==========

// Get customer order history
router.get('/customers/:userId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) return res.status(404).json({ error: 'Customer not found' });
    
    res.json({ user, orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer information' });
  }
});

module.exports = router;
