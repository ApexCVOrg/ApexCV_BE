import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { CATEGORY_MESSAGES } from "../constants/categories";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, brand, minPrice, maxPrice, sortBy } = req.query;

    const filter: any = {};

    if (category) {
      const categoryIds = category.toString().split(',').map(id => new mongoose.Types.ObjectId(id));
      filter.categories = { $all: categoryIds }; // phải có tất cả các category này
    }

    if (brand) {
      const brandIds = brand.toString().split(',').map(id => new mongoose.Types.ObjectId(id));
      filter.brand = { $in: brandIds };
    }

    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) })
      };
    }

    let query = Product.find(filter).populate("categories", "name");

    if (sortBy === 'priceAsc') query = query.sort({ price: 1 });
    else if (sortBy === 'priceDesc') query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error?.message || "Unknown error" });
  }
});

// Create product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, price, discountPrice, categories, brand, images, sizes, colors, tags, label, status } = req.body;
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
      label,
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