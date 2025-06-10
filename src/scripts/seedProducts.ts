import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

const productsData = [
  {
    name: "Arsenal Home Jersey 2024/25",
    description: "Official Arsenal FC home jersey for the 2024/25 season. Made with high-quality materials and featuring the latest team design.",
    price: 2199000,
    discountPrice: 1959000,
    categoryPath: ["Men", "Men Arsenal", "Men Arsenal T-Shirts"],
    images: ["arsenal-home-jersey-2024.jpg"],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 10 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "jersey", "football", "home"]
  },
  {
    name: "Arsenal Training Jacket",
    description: "Premium training jacket with Arsenal FC branding. Perfect for training sessions and casual wear.",
    price: 3184000,
    discountPrice: 2694000,
    categoryPath: ["Men", "Men Arsenal", "Men Arsenal Jackets"],
    images: ["arsenal-training-jacket.jpg"],
    sizes: [
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "jacket", "training"]
  },
  {
    name: "Juventus Home Shorts 2024/25",
    description: "Official Juventus FC home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Men Juventus", "Men Juventus Shorts"],
    images: ["juventus-home-shorts-2024.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shorts", "football"]
  },
  {
    name: "Bayern Munich Training Shoes",
    description: "Professional training shoes endorsed by Bayern Munich. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Men Bayern Munich", "Men Bayern Munich Training Shoes"],
    images: ["bayern-training-shoes.jpg"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "shoes", "training"]
  },
  {
    name: "Real Madrid Women's Hoodie",
    description: "Stylish hoodie for Real Madrid women's collection. Perfect for casual wear and showing team support.",
    price: 1959000,
    discountPrice: 1714000,
    categoryPath: ["Women", "Women Real Madrid", "Women Real Madrid Hoodies"],
    images: ["real-madrid-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 15 }
    ],
    colors: ["White", "Purple"],
    tags: ["real-madrid", "hoodie", "women"]
  }
];

export const seedProducts = async () => {
  try {
    console.log("🔄 Starting product seeding...");
    
    // Get all existing products
    const existingProducts = await Product.find({});
    
    // Create a set of all product names from seed data
    const seedProductNames = new Set(productsData.map(product => product.name));
    
    // Find products to delete (those that exist in DB but not in seed data)
    const productsToDelete = existingProducts.filter(product => !seedProductNames.has(product.name));
    
    // Delete products that are not in seed data
    if (productsToDelete.length > 0) {
      await Product.deleteMany({
        _id: { $in: productsToDelete.map(product => product._id) }
      });
      console.log(`🗑️ Deleted ${productsToDelete.length} products that are not in seed data`);
    }
    
    for (const product of productsData) {
      console.log(`\n📦 Processing product: ${product.name}`);
      
      // Resolve full category path
      let parent = null;
      let category = null;

      for (const level of product.categoryPath) {
        console.log(`🔍 Looking for category: ${level}`);
        category = await Category.findOne({
          name: level,
          parentCategory: parent,
        });

        if (!category) {
          console.error(`❌ Category not found: ${level}`);
          throw new Error(`Category not found: ${level}`);
        }
        console.log(`✅ Found category: ${level}`);

        parent = category._id;
      }

      // Check if product already exists
      const existing = await Product.findOne({ name: product.name });

      if (existing) {
        console.log(`ℹ️ Product already exists: ${product.name}`);
        continue;
      }

      if (!category) {
        throw new Error(`Category not found for product: ${product.name}`);
      }

      // Create new product
      const newProduct = await new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || null,
        categories: [category._id],
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        tags: product.tags || []
      }).save();

      console.log(`✅ Created product: ${product.name} with ID: ${newProduct._id}`);
    }

    console.log("\n✅ Product seeding completed.");
  } catch (error) {
    console.error("\n❌ Error seeding products:", error);
    throw error;
  }
}; 