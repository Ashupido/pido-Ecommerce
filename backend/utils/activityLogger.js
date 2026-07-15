const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, userName, userRole, action, resourceType, resourceId, resourceName, details, ipAddress) => {
  try {
    const log = new ActivityLog({
      userId,
      userName,
      userRole,
      action,
      resourceType,
      resourceId,
      resourceName,
      details,
      ipAddress,
      timestamp: new Date()
    });
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const getActivityLogs = async (filters = {}, limit = 100) => {
  try {
    const query = ActivityLog.find(filters)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name email role');
    
    return await query.exec();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};

module.exports = {
  logActivity,
  getActivityLogs
};
