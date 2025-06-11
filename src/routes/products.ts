import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";

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

    let query = Product.find(filter).populate("categories");

    if (sortBy === 'priceAsc') query = query.sort({ price: 1 });
    else if (sortBy === 'priceDesc') query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm: " + (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("categories");
    if (!product) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm: " + (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo sản phẩm: " + (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm: " + (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      return;
    }
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm: " + (error as Error).message });
  }
});

export default router;