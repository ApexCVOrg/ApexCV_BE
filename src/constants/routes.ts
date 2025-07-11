// API Base path
export const API_BASE = '/api'

// Auth routes
export const AUTH_ROUTES = {
  BASE: '/auth',
  REGISTER: '/register',
  LOGIN: '/login',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
  SAVE_ADDRESS: '/save-address',
  PROFILE: '/profile',
  ADMIN: '/admin',
  GOOGLE: {
    CALLBACK: '/google/callback'
  },
  FACEBOOK: {
    CALLBACK: '/facebook/callback'
  }
} as const

// User routes
export const USER_ROUTES = {
  BASE: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  FAVORITES: '/favorites'
} as const

// Category routes
export const CATEGORY_ROUTES = {
  BASE: '/categories',
  LIST: '/',
  DETAIL: '/:id'
} as const

// Product routes
export const PRODUCT_ROUTES = {
  BASE: '/products',
  LIST: '/',
  DETAIL: '/:id',
  SEARCH: '/search'
} as const

// Review routes
export const REVIEW_ROUTES = {
  BASE: '/reviews',
  LIST: '/',
  DETAIL: '/:id',
  PRODUCT: '/product/:productId'
} as const

// Order routes
export const ORDER_ROUTES = {
  BASE: '/orders',
  LIST: '/',
  DETAIL: '/:id',
  USER: '/user/:userId'
} as const

// Cart routes
export const CART_ROUTES = {
  BASE: '/carts',
  USER: '/user/:userId',
  ADD_ITEM: '/add',
  REMOVE_ITEM: '/remove',
  UPDATE_ITEM: '/update'
} as const

// Conversation routes
export const CONVERSATION_ROUTES = {
  BASE: '/conversations',
  LIST: '/',
  DETAIL: '/:id',
  USER: '/user/:userId'
} as const

// Message routes
export const MESSAGE_ROUTES = {
  BASE: '/messages',
  LIST: '/',
  CONVERSATION: '/conversation/:conversationId'
} as const

// Brand routes
export const BRAND_ROUTES = {
  BASE: '/brands',
  LIST: '/',
  DETAIL: '/:id'
} as const

// Manager routes
export const MANAGER_ROUTES = {
  BASE: '/manager',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  SETTINGS: '/settings',
  STATS: {
    SALES: '/stats/sales',
    USERS: '/stats/users',
    ORDERS: '/stats/orders',
    CUSTOMERS: '/stats/customers'
  }
} as const

// Favorites routes
export const FAVORITES_ROUTES = {
  BASE: '/favorites',
  LIST: '/',
  ADD: '/add/:productId',
  REMOVE: '/remove/:productId',
  CHECK: '/check/:productId'
} as const

export const buildRoute = (base: string, path: string): string => {
  return `${API_BASE}${base}${path}`
}
