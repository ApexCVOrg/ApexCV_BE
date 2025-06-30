"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoute = exports.MANAGER_ROUTES = exports.BRAND_ROUTES = exports.MESSAGE_ROUTES = exports.CONVERSATION_ROUTES = exports.CART_ROUTES = exports.ORDER_ROUTES = exports.REVIEW_ROUTES = exports.PRODUCT_ROUTES = exports.CATEGORY_ROUTES = exports.USER_ROUTES = exports.AUTH_ROUTES = exports.API_BASE = void 0;
// API Base path
exports.API_BASE = '/api';
// Auth routes
exports.AUTH_ROUTES = {
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
};
// User routes
exports.USER_ROUTES = {
    BASE: '/users',
    PROFILE: '/profile',
    SETTINGS: '/settings'
};
// Category routes
exports.CATEGORY_ROUTES = {
    BASE: '/categories',
    LIST: '/',
    DETAIL: '/:id'
};
// Product routes
exports.PRODUCT_ROUTES = {
    BASE: '/products',
    LIST: '/',
    DETAIL: '/:id',
    SEARCH: '/search'
};
// Review routes
exports.REVIEW_ROUTES = {
    BASE: '/reviews',
    LIST: '/',
    DETAIL: '/:id',
    PRODUCT: '/product/:productId'
};
// Order routes
exports.ORDER_ROUTES = {
    BASE: '/orders',
    LIST: '/',
    DETAIL: '/:id',
    USER: '/user/:userId'
};
// Cart routes
exports.CART_ROUTES = {
    BASE: '/carts',
    USER: '/user/:userId',
    ADD_ITEM: '/add',
    REMOVE_ITEM: '/remove',
    UPDATE_ITEM: '/update'
};
// Conversation routes
exports.CONVERSATION_ROUTES = {
    BASE: '/conversations',
    LIST: '/',
    DETAIL: '/:id',
    USER: '/user/:userId'
};
// Message routes
exports.MESSAGE_ROUTES = {
    BASE: '/messages',
    LIST: '/',
    CONVERSATION: '/conversation/:conversationId'
};
// Brand routes
exports.BRAND_ROUTES = {
    BASE: '/brands',
    LIST: '/',
    DETAIL: '/:id'
};
// Manager routes
exports.MANAGER_ROUTES = {
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
};
var buildRoute = function (base, path) {
    return "".concat(exports.API_BASE).concat(base).concat(path);
};
exports.buildRoute = buildRoute;
