const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userRole: String,
  action: { type: String, required: true }, // e.g., 'created_product', 'updated_user_role', 'deleted_order'
  resourceType: String, // e.g., 'product', 'user', 'order'
  resourceId: mongoose.Schema.Types.ObjectId,
  resourceName: String,
  details: mongoose.Schema.Types.Mixed, // Additional details about the action
  timestamp: { type: Date, default: Date.now },
  ipAddress: String
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
