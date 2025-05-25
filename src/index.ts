import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
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

dotenv.config();

const app: Application = express();
const port: number | string = process.env.PORT || 5000;
const mongoURI: string = process.env.MONGO_URI || "YOUR_MONGODB_URI";

// Hàm kết nối MongoDB với Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions); // Thêm kiểu để tránh cảnh báo
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};

// Kết nối database trước khi start server
connectDB();

app.use(express.json());

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

// Sử dụng route /api
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/brands", brandRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
