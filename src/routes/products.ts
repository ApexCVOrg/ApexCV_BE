import express, { Request, Response, Router } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { CATEGORY_MESSAGES } from "../constants/categories";

const router: Router = express.Router();

// Get all products
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("categories", "name") // chỉ lấy tên category
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error?.message || "Unknown error" });
  }
});

// Create product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, price, discountPrice, categories, brand, images, sizes, colors, tags, status } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      categories,
      brand,
      images,
      sizes,
      colors,
      tags,
      status,
    });
    const saved = await product.save();
    res.status(201).json({ ...saved.toObject(), message: "Product created successfully!" });
  } catch (error: any) {
    res.status(400).json({ message: "Error creating product", error: error?.message || "Unknown error" });
  }
});

// Update product
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ ...updated.toObject(), message: "Product updated successfully!" });
  } catch (error: any) {
    res.status(400).json({ message: "Error updating product", error: error?.message || "Unknown error" });
  }
});

// Delete product
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error: error?.message || "Unknown error" });
  }
});

export default router;
