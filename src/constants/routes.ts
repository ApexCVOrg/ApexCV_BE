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

// Brand routes
export const BRAND_ROUTES = {
  BASE: '/brands',
  LIST: '/',
  DETAIL: '/:id'
} as const

// Suggestions routes
export const SUGGESTIONS_ROUTES = {
  BASE: '/suggestions',
  LIST: '/',
  TREE: '/tree'
} as const

// Manager routes
export const MANAGER_ROUTES = {
  BASE: '/manager',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  USERS: '/users',
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

// Chat routes
export const CHAT_ROUTES = {
  BASE: '/chat',
  SEND: '/'
} as const

// Manager Chat routes
export const MANAGER_CHAT_ROUTES = {
  BASE: '/manager/chats',
  LIST: '/',
  MESSAGES: '/:chatId/messages',
  SEND_MESSAGE: '/:chatId/messages',
  CLOSE: '/:chatId/close'
} as const

// User Chat routes
export const USER_CHAT_ROUTES = {
  BASE: '/user/chats',
  CREATE: '/',
  LIST: '/',
  MESSAGES: '/:chatId/messages',
  SEND_MESSAGE: '/:chatId/messages'
} as const

export const buildRoute = (base: string, path: string): string => {
  return `${API_BASE}${base}${path}`
}
