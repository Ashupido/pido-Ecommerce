// Role definitions and permission matrix
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SELLER: 'seller',
  USER: 'user'
};

// Permission matrix: what each role can do
const PERMISSIONS = {
  admin: {
    // User management
    viewUsers: true,
    editUsers: true,
    deleteUsers: true,
    changeUserRole: true,
    
    // Product management
    createProducts: true,
    editProducts: true,
    deleteProducts: true,
    viewAllProducts: true,
    
    // Order management
    viewAllOrders: true,
    updateOrderStatus: true,
    deleteOrders: true,
    
    // Analytics & Reports
    viewAnalytics: true,
    viewReports: true,
    viewActivityLogs: true,
    
    // System management
    manageSellers: true,
    manageManagers: true
  },
  manager: {
    // Product management
    createProducts: true,
    editProducts: true,
    deleteProducts: true,
    viewAllProducts: true,
    
    // Order management
    viewAllOrders: true,
    updateOrderStatus: true,
    
    // Analytics & Reports
    viewAnalytics: true,
    viewReports: true,
    
    // Cannot do:
    viewUsers: false,
    editUsers: false,
    deleteUsers: false,
    changeUserRole: false,
    deleteOrders: false,
    manageSellers: false,
    manageManagers: false,
    viewActivityLogs: false
  },
  seller: {
    // Product management (own products)
    createProducts: true,
    editProducts: true,
    deleteProducts: true,
    viewAllProducts: false, // Only own products
    
    // Order management (for own products)
    viewAllOrders: false,
    updateOrderStatus: false,
    
    // Analytics & Reports (own only)
    viewAnalytics: true,
    viewReports: false,
    
    // Cannot do:
    viewUsers: false,
    editUsers: false,
    deleteUsers: false,
    changeUserRole: false,
    deleteOrders: false,
    manageSellers: false,
    manageManagers: false,
    viewActivityLogs: false
  },
  user: {
    // Customer permissions
    viewAllProducts: true,
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    
    viewAllOrders: false, // Only own orders
    updateOrderStatus: false,
    
    viewAnalytics: false,
    viewReports: false,
    viewUsers: false,
    editUsers: false,
    deleteUsers: false,
    changeUserRole: false,
    deleteOrders: false,
    manageSellers: false,
    manageManagers: false,
    viewActivityLogs: false
  }
};

// Check if a role has a specific permission
const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] === true;
};

// Check if a role can perform an action (alternative)
const canPerform = (role, action) => {
  return hasPermission(role, action);
};

// Get all permissions for a role
const getPermissions = (role) => {
  return PERMISSIONS[role] || {};
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  canPerform,
  getPermissions
};
