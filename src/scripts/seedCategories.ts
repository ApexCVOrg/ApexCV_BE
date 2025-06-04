import mongoose from "mongoose";
import { Category } from "../models/Category";

const categoriesData = [
    {
      id: "shoes",
      name: "Shoes",
      subcategories: [
        { id: "running-shoes", name: "Running Shoes" },
        { id: "basketball-shoes", name: "Basketball Shoes" },
        { id: "soccer-shoes", name: "Soccer Shoes" },
        { id: "sneakers", name: "Sneakers" },
      ],
    },
    {
      id: "clothing",
      name: "Clothing",
      subcategories: [
        { id: "jackets", name: "Jackets" },
        { id: "t-shirts", name: "T-shirts" },
        { id: "pants", name: "Pants" },
        { id: "hoodies", name: "Hoodies" },
      ],
    },
    {
      id: "accessories",
      name: "Accessories",
      subcategories: [
        { id: "bags", name: "Bags" },
        { id: "hats", name: "Hats" },
        { id: "socks", name: "Socks" },
        { id: "watches", name: "Watches" },
      ],
    },
    {
      id: "sports",
      name: "Sports",
      subcategories: [
        { id: "football", name: "Football" },
        { id: "running", name: "Running" },
        { id: "training", name: "Training" },
      ],
    },
    {
      id: "kids",
      name: "Kids",
      subcategories: [
        { id: "kids-shoes", name: "Shoes" },
        { id: "kids-clothing", name: "Clothing" },
        { id: "kids-accessories", name: "Accessories" },
      ],
    },
    {
      id: "sale",
      name: "Sale",
      subcategories: [
        { id: "sale-shoes", name: "Shoes" },
        { id: "sale-clothing", name: "Clothing" },
        { id: "sale-accessories", name: "Accessories" },
      ],
    },
  ];
  

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nidas");

    const delResult = await Category.deleteMany({});
    console.log("Deleted categories:", delResult);

    const count = await Category.countDocuments();
    console.log("Categories after delete:", count);

    for (const cat of categoriesData) {
      const parent = new Category({
        name: cat.name,
        parentCategory: null,
        status: "active",
      });
      const savedParent = await parent.save();

      for (const sub of cat.subcategories) {
        await new Category({
          name: sub.name,
          parentCategory: savedParent._id,
          status: "active",
        }).save();
      }
    }
    console.log("Seeding done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
