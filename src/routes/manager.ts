import express, { Request, Response, Router } from "express";
import { authenticateToken, isManager } from "../middlewares/auth";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { User } from "../models/User";

const router: Router = express.Router();

// Apply authentication middleware to all manager routes
router.use(authenticateToken, isManager);

// Dashboard overview
router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement dashboard data aggregation
    res.json({ message: "Dashboard data" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data: " + (error as Error).message });
  }
});

// Products management
router.get("/products", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('category').populate('brand');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products: " + (error as Error).message });
  }
});

// Categories management
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories: " + (error as Error).message });
  }
});

// Orders management
router.get("/orders", async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders: " + (error as Error).message });
  }
});

// Customers management
router.get("/customers", async (_req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers: " + (error as Error).message });
  }
});

// Settings management
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement get settings from database
    const settings = {
      siteName: "ApexCV",
      contactEmail: "contact@apexcv.com",
      supportPhone: "+1234567890",
      // Add more settings as needed
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings: " + (error as Error).message });
  }
});

router.put("/settings", async (req: Request, res: Response) => {
  try {
    const settings = req.body;
    // TODO: Implement save settings to database
    res.json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings: " + (error as Error).message });
  }
});

// Stats endpoints
router.get("/stats/sales", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement sales statistics
    res.json({ message: "Sales statistics" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales stats: " + (error as Error).message });
  }
});

router.get("/stats/users", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement user statistics
    res.json({ message: "User statistics" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats: " + (error as Error).message });
  }
});

router.get("/stats/orders", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement order statistics
    res.json({ message: "Order statistics" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order stats: " + (error as Error).message });
  }
});

router.get("/stats/customers", async (_req: Request, res: Response) => {
  try {
    // TODO: Implement customer statistics
    res.json({ message: "Customer statistics" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer stats: " + (error as Error).message });
  }
});

export default router; 