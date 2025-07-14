import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import os from 'os'
import dotenv from 'dotenv'
import connectDB from './config/db'

import authRouter from './routes/auth'
import userRouter from './routes/users'
import categoryRouter from './routes/categories'
import productRouter from './routes/products'
import reviewRouter from './routes/reviews'
import orderRouter from './routes/orders'
import cartRouter from './routes/carts'
import conversationRouter from './routes/conversations'
import messageRouter from './routes/messages'
import brandRouter from './routes/brands'
import managerRouter from './routes/admin/manager'
import checkoutRouter from './routes/checkout'

import {
  API_BASE,
  AUTH_ROUTES,
  USER_ROUTES,
  CATEGORY_ROUTES,
  PRODUCT_ROUTES,
  REVIEW_ROUTES,
  ORDER_ROUTES,
  CART_ROUTES,
  CONVERSATION_ROUTES,
  MESSAGE_ROUTES,
  BRAND_ROUTES,
  MANAGER_ROUTES
} from './constants/routes'

dotenv.config()
connectDB()

const app: Application = express()
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || '0.0.0.0'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const EXTRA_ORIGINS = process.env.EXTRA_ORIGINS?.split(',') || []

// Danh sách origin được phép
const allowedOrigins = [
  FRONTEND_URL,
  'http://10.0.2.2:5000',      // Android emulator
  'http://10.0.3.2:5000',      // Genymotion
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
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`Origin ${origin} không được phép`))
  },
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization','Accept','Origin','X-Requested-With'],
  optionsSuccessStatus: 204
}))
// Đúng: bắt mọi preflight request
// ✅ Bắt mọi preflight request cho tất cả routes
app.options(/.*/, cors());

app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/nidas',
    ttl: 10 * 60,        // 10 minutes
    autoRemove: 'native'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * 60 * 1000  // 10 minutes
  }
}))

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
app.use(API_BASE + CONVERSATION_ROUTES.BASE, conversationRouter)
app.use(API_BASE + MESSAGE_ROUTES.BASE, messageRouter)
app.use(API_BASE + BRAND_ROUTES.BASE, brandRouter)
app.use(API_BASE + MANAGER_ROUTES.BASE, managerRouter)
app.use(API_BASE + '/checkout', checkoutRouter)

// Start server và log thêm IP LAN cho debug
app.listen(PORT, HOST, () => {
  console.log(`– Server đang chạy trên: http://${HOST}:${PORT}  (cho web/emulator)`)
  const lanIp = getLocalIp()
  if (lanIp) {
    console.log(`– Địa chỉ LAN: http://${lanIp}:${PORT}  (cho device thật)`)
  }
})
