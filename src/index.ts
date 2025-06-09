import express, { Application, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import helloRouter from "./routes/hello";
import dotenv from "dotenv";
import userRouter from "./routes/users";
import categoryRouter from "./routes/categories";
import productRouter from "./routes/products";
import reviewRouter from "./routes/reviews";
import orderRouter from "./routes/orders";
import cartRouter from "./routes/carts";
import conversationRouter from "./routes/conversations";
import messageRouter from "./routes/messages";
import brandRouter from "./routes/brands";
import authRouter from "./routes/auth";
import managerRouter from "./routes/manager";
import connectDB from "./config/db";
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
  MANAGER_ROUTES,
} from './constants/routes';
dotenv.config();

const app: Application = express();
const port: number | string = process.env.PORT || 5000;

// Kết nối database trước khi start server
connectDB();

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Route test
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

// Register routes
app.use(API_BASE + AUTH_ROUTES.BASE, authRouter);
app.use(API_BASE + USER_ROUTES.BASE, userRouter);
app.use(API_BASE + CATEGORY_ROUTES.BASE, categoryRouter);
app.use(API_BASE + PRODUCT_ROUTES.BASE, productRouter);
app.use(API_BASE + REVIEW_ROUTES.BASE, reviewRouter);
app.use(API_BASE + ORDER_ROUTES.BASE, orderRouter);
app.use(API_BASE + CART_ROUTES.BASE, cartRouter);
app.use(API_BASE + CONVERSATION_ROUTES.BASE, conversationRouter);
app.use(API_BASE + MESSAGE_ROUTES.BASE, messageRouter);
app.use(API_BASE + BRAND_ROUTES.BASE, brandRouter);
app.use(API_BASE + MANAGER_ROUTES.BASE, managerRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
