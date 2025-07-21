export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  VIEW_ORDERS = 'view_orders',
  CREATE_ORDER = 'create_order',
  CANCEL_ORDER = 'cancel_order',
  VIEW_CART = 'view_cart',
  MANAGE_CART = 'manage_cart',
  WRITE_REVIEW = 'write_review',
  VIEW_PRODUCTS = 'view_products',
  VIEW_CATEGORIES = 'view_categories',

  // Manager permissions
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_CATEGORIES = 'manage_categories',
  MANAGE_ORDERS = 'manage_orders',
  VIEW_REPORTS = 'view_reports',
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_ALL_USERS = 'view_all_users',
  MANAGE_REVIEWS = 'manage_reviews',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_MANAGERS = 'manage_managers',
  VIEW_ALL_REPORTS = 'view_all_reports',
  MANAGE_SYSTEM = 'manage_system',
  MANAGE_SETTINGS = 'manage_settings'
}

// Define base user permissions
const userPermissions = [
  Permission.VIEW_PROFILE,
  Permission.EDIT_PROFILE,
  Permission.VIEW_ORDERS,
  Permission.CREATE_ORDER,
  Permission.CANCEL_ORDER,
  Permission.VIEW_CART,
  Permission.MANAGE_CART,
  Permission.WRITE_REVIEW,
  Permission.VIEW_PRODUCTS,
  Permission.VIEW_CATEGORIES
]

// Define manager specific permissions
const managerPermissions = [
  Permission.MANAGE_PRODUCTS,
  Permission.MANAGE_CATEGORIES,
  Permission.MANAGE_ORDERS,
  Permission.VIEW_REPORTS,
  Permission.MANAGE_INVENTORY,
  Permission.VIEW_ALL_USERS,
  Permission.MANAGE_REVIEWS
]

// Define admin specific permissions
const adminPermissions = [
  Permission.MANAGE_USERS,
  Permission.MANAGE_ROLES,
  Permission.MANAGE_MANAGERS,
  Permission.VIEW_ALL_REPORTS,
  Permission.MANAGE_SYSTEM,
  Permission.MANAGE_SETTINGS
]

export const RolePermissions = {
  user: userPermissions,
  manager: [...userPermissions, ...managerPermissions],
  admin: [...userPermissions, ...managerPermissions, ...adminPermissions]
}
