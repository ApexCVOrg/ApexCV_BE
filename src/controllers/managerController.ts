import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { CATEGORY_MESSAGES } from "../constants/categories";
import { Brand } from "../models/Brand";

/* -------------------------------- Dashboard ------------------------------- */
export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments()
    ]);
    res.json({ totalUsers, totalOrders, totalProducts });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* -------------------------------- Products -------------------------------- */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("categories", "name") // chỉ lấy tên category
      .populate({ path: "brand", select: "name", strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching products",
      error: error?.message || "Unknown error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* ------------------------------- Categories ------------------------------- */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentCategory, status } = req.body;
    const category = new Category({ name, description, parentCategory: parentCategory || null, status });
    const saved = await category.save();
    res.status(201).json({ ...saved.toObject(), message: CATEGORY_MESSAGES.CREATE_SUCCESS });
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(400).json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || "Unknown error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory, status } = req.body;

    if (id === parentCategory) {
      return res.status(400).json({ message: "Category cannot be its own parent" });
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description, parentCategory: parentCategory || null, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: CATEGORY_MESSAGES.ERROR });
    }

    res.json({ ...updated.toObject(), message: CATEGORY_MESSAGES.UPDATE_SUCCESS });
  } catch (error: any) {
    console.error("Error updating category:", error);
    res.status(400).json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || "Unknown error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* -------------------------------- Orders ---------------------------------- */
export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* ------------------------------- Customers -------------------------------- */
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await User.findById(req.params.id).select("-passwordHash");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const updatedCustomer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* -------------------------------- Settings -------------------------------- */
export const getSettings = async (_req: Request, res: Response) => {
  try {
    res.json({
      siteName: "ApexCV",
      contactEmail: "contact@apexcv.com",
      supportPhone: "+1234567890",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Settings updated", settings: req.body });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/* --------------------------------- Stats ---------------------------------- */
export const getSalesStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: "Sales statistics" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: "User statistics" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getOrderStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: "Order statistics" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCustomerStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: "Customer statistics" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await Brand.find().lean();
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching brands", error: error?.message || "Unknown error" });
  }
};
