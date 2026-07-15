const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');
const { 
  authMiddleware, 
  requireAdmin, 
  requireManagerOrAdmin 
} = require('../middleware/rbac');
const { logActivity } = require('../utils/activityLogger');
const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(requireAdmin);

// ========== USER MANAGEMENT ==========

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'manager', 'seller', 'user'];
    
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const oldRole = user.role;
    user.role = role;
    await user.save();
    
    // Log activity
    await logActivity(
      req.userId,
      req.user.name,
      req.userRole,
      'changed_user_role',
      'user',
      user._id,
      user.name,
      { oldRole, newRole: role },
      req.ip
    );
    
    res.json({ message: 'User role updated', user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Log activity
    await logActivity(
      req.userId,
      req.user.name,
      req.userRole,
      'deleted_user',
      'user',
      user._id,
      user.name,
      { email: user.email, role: user.role },
      req.ip
    );
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ========== STATISTICS & ANALYTICS ==========

// Get dashboard statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      averageOrderValue: revenueData[0]?.averageOrderValue || 0,
      usersByRole,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get activity logs
router.get('/logs/activity', async (req, res) => {
  try {
    const { limit = 100, action, userId } = req.query;
    let query = {};
    
    if (action) query.action = action;
    if (userId) query.userId = userId;
    
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email role');
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// ========== ORDER MANAGEMENT ==========

// Get all orders with details
router.get('/orders', async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (userId) query.user = userId;
    
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

module.exports = router;
