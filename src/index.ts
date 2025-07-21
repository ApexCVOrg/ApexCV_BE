import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import os from 'os'
import dotenv from 'dotenv'
import { createServer } from 'http'
import path from 'path'
import connectDB from './config/db'
import { suggestionsService } from './services/suggestionsService'
import ChatWebSocketServer from './websocket/chatServer'
import { seedUsers } from './scripts/seedUsers.js'

import authRouter from './routes/auth'
import userRouter from './routes/users'
import categoryRouter from './routes/categories'
import productRouter from './routes/products'
import reviewRouter from './routes/reviews'
import orderRouter from './routes/orders'
import cartRouter from './routes/carts'
import brandRouter from './routes/brands'
import managerRouter from './routes/admin/manager'
import managerChatsRouter from './routes/managerChats'
import userChatsRouter from './routes/userChats'
import suggestionsRouter from './routes/suggestions'
import checkoutRouter from './routes/checkout'
import paymentVnpayRoutes from './routes/payment-vnpay'
import couponRouter from './routes/voucher'

import favoritesRouter from './routes/favorites'
import chatRouter from './routes/chat'
import adminRouter from './routes/admin/admin'
import applyCouponRouter from './routes/apply-coupon'
import uploadRouter from './routes/upload'
import { errorHandler } from './middlewares/errorHandler'
import {
  API_BASE,
  AUTH_ROUTES,
  USER_ROUTES,
  CATEGORY_ROUTES,
  PRODUCT_ROUTES,
  REVIEW_ROUTES,
  ORDER_ROUTES,
  CART_ROUTES,
  BRAND_ROUTES,
  SUGGESTIONS_ROUTES,
  MANAGER_ROUTES,
  ADMIN_ROUTES,
  MANAGER_CHAT_ROUTES,
  USER_CHAT_ROUTES,
  FAVORITES_ROUTES,
  CHAT_ROUTES,
  APPLY_COUPON_ROUTES
} from './constants/routes'

dotenv.config()

// Khởi tạo services
const initializeServices = async () => {
  try {
    await connectDB()
    
    // Seed users for production
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Seeding users for production...')
      await seedUsers()
    }
    
    suggestionsService.initialize()
    console.log('✅ All services initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing services:', error)
    process.exit(1)
  }
}

const app: Application = express()
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || '0.0.0.0'
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app'
const EXTRA_ORIGINS = process.env.EXTRA_ORIGINS?.split(',') || []

// Danh sách origin được phép
const allowedOrigins = [
  FRONTEND_URL,
  'https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app',
  'https://apex-cv-fe.vercel.app',
  'https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app/en',
  'https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app/vi',
  'https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app', // Production frontend
  'https://apex-cv-fe.vercel.app', // Alternative frontend
  ...EXTRA_ORIGINS
]

// Lấy IP LAN để debug trên device thật
function getLocalIp(): string | undefined {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
}

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`Origin ${origin} không được phép`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 204
  })
)
// Đúng: bắt mọi preflight request
// ✅ Bắt mọi preflight request cho tất cả routes
app.options(/.*/, cors())
app.use(express.json())
app.use(cookieParser())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority',
      ttl: 10 * 60, // 10 minutes
      autoRemove: 'native'
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
)

// Health-check route
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running...')
})

// Register routes
app.use(API_BASE + AUTH_ROUTES.BASE, authRouter)
app.use(API_BASE + USER_ROUTES.BASE, userRouter)
app.use(API_BASE + CATEGORY_ROUTES.BASE, categoryRouter)
app.use(API_BASE + PRODUCT_ROUTES.BASE, productRouter)
app.use(API_BASE + REVIEW_ROUTES.BASE, reviewRouter)
app.use(API_BASE + ORDER_ROUTES.BASE, orderRouter)
app.use(API_BASE + CART_ROUTES.BASE, cartRouter)
app.use(API_BASE + BRAND_ROUTES.BASE, brandRouter)
app.use(API_BASE + MANAGER_ROUTES.BASE, managerRouter)
app.use(API_BASE + MANAGER_CHAT_ROUTES.BASE, managerChatsRouter)
app.use(API_BASE + USER_CHAT_ROUTES.BASE, userChatsRouter)
app.use(API_BASE + SUGGESTIONS_ROUTES.BASE, suggestionsRouter)
app.use(API_BASE + '/checkout', checkoutRouter)
app.use('/api/payment', paymentVnpayRoutes)
app.use(API_BASE + '/coupons', couponRouter)

app.use(API_BASE + CHAT_ROUTES.BASE, chatRouter)
app.use(API_BASE + FAVORITES_ROUTES.BASE, favoritesRouter)
app.use(API_BASE + CHAT_ROUTES.BASE, chatRouter)
app.use(API_BASE + ADMIN_ROUTES.BASE, adminRouter)
app.use(API_BASE + APPLY_COUPON_ROUTES.BASE, applyCouponRouter)
app.use(API_BASE + '/upload', uploadRouter)

app.use(errorHandler as express.ErrorRequestHandler)

// Create HTTP server
const server = createServer(app)

// Initialize WebSocket server
new ChatWebSocketServer(server)

// Start server và log thêm IP LAN cho debug
server.listen(PORT, HOST, async () => {
  await initializeServices()
  console.log(`– Server đang chạy trên: https://apexcv-be.onrender.com  (production)`)
  console.log(`– WebSocket server: wss://apexcv-be.onrender.com`)
  const lanIp = getLocalIp()
  if (lanIp) {
    console.log(`– Địa chỉ LAN: http://${lanIp}:${PORT}  (cho device thật)`)
    console.log(`– WebSocket LAN: ws://${lanIp}:${PORT}`)
  }
})
