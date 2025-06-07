// src/seeds/category.seed.ts
import { Category } from "../models/Category";

const categoriesData = [
  {
    name: "Shoes",
    subcategories: ["Running Shoes", "Basketball Shoes", "Soccer Shoes", "Sneakers"],
  },
  {
    name: "Clothing",
    subcategories: ["Jackets", "T-shirts", "Pants", "Hoodies"],
  },
  {
    name: "Accessories",
    subcategories: ["Bags", "Hats", "Socks", "Watches"],
  },
  {
    name: "Sports",
    subcategories: ["Football", "Running", "Training"],
  },
  {
    name: "Kids",
    subcategories: ["Shoes", "Clothing", "Accessories"],
  },
  {
    name: "Sale",
    subcategories: ["Shoes", "Clothing", "Accessories"],
  },
];

export const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return; // Đã có dữ liệu → bỏ qua

  for (const cat of categoriesData) {
    const parent = await new Category({
      name: cat.name,
      parentCategory: null,
      status: "active",
    }).save();

    for (const sub of cat.subcategories) {
      await new Category({
        name: sub,
        parentCategory: parent._id,
        status: "active",
      }).save();
    }
  }

  console.log("✅ Seeded initial categories.");
};
