// src/seeds/category.seed.ts
import mongoose from "mongoose";
import { Category, ensureCategoryIndexes } from "../models/Category";

const categoriesData = [
    {
      name: "Men",
      subcategories: [
        {
          name: "Arsenal",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
      ],
    },
    {
      name: "Women",
      subcategories: [
        {
          name: "Arsenal",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
      ],
    },
    {
      name: "Kids",
      subcategories: [
        {
          name: "Arsenal",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Football Boots",
            "Training Shoes",
            "Running Shoes",
            "T-Shirts",
            "Shorts",
            "Tracksuits",
            "Jackets",
            "Hoodies",
            "Socks",
            "Bags"
          ],
        },
      ],
    },
  ];
  

export const seedCategories = async () => {
  try {
    console.log("🔄 Starting category seeding...");

    // Xóa triệt để các document lỗi (parentCategory undefined/null/không phải ObjectId)
    const deleteResult = await Category.deleteMany({
      $or: [
        { parentCategory: { $exists: false } },
        { parentCategory: { $type: 10 } } // null
      ]
    });
    if (deleteResult.deletedCount > 0) {
      console.log(`🗑️ Đã xóa ${deleteResult.deletedCount} document category lỗi (parentCategory undefined/null)`);
    }

    // Ensure indexes are properly set up
    await ensureCategoryIndexes();

    // Create all parent categories if not exist
    const parentCategories = [];
    for (const cat of categoriesData) {
      let parent = await Category.findOne({ name: cat.name, parentCategory: null });
      if (!parent) {
        parent = await new Category({
          name: cat.name,
          parentCategory: null,
          status: "active",
        }).save();
        console.log(`✅ Created parent category: ${cat.name}`);
      } else {
        console.log(`ℹ️ Parent category already exists: ${cat.name}`);
      }
      parentCategories.push(parent);
    }
    const parentMap = new Map(parentCategories.map(p => [p.name, p]));

    // Xử lý triệt để duplicate: Xóa các document team bị duplicate (cùng name, cùng parentCategory)
    const teamNames = Array.from(new Set(categoriesData.flatMap(cat => cat.subcategories.map(sub => sub.name))));
    for (const parent of parentCategories) {
      for (const teamName of teamNames) {
        const dups = await Category.find({ name: teamName, parentCategory: parent._id });
        if (dups.length > 1) {
          // Giữ lại 1 document, xóa các document còn lại
          const toDelete = dups.slice(1).map(d => d._id);
          await Category.deleteMany({ _id: { $in: toDelete } });
          console.log(`🗑️ Đã xóa ${toDelete.length} document team duplicate: ${teamName} - parent: ${parent._id}`);
        }
      }
    }

    // For each parent (Men, Women, Kids), create team and product type categories
    for (const cat of categoriesData) {
      const parent = parentMap.get(cat.name);
      if (!parent) {
        console.warn(`⚠️ Parent category not found for ${cat.name}, skipping...`);
        continue;
      }
      for (const sub of cat.subcategories) {
        // Create team category for this parent
        let teamCategory = await Category.findOne({ name: sub.name, parentCategory: parent._id });
        if (!teamCategory) {
          teamCategory = await new Category({
            name: sub.name,
            parentCategory: parent._id,
            status: "active",
          }).save();
          console.log(`✅ Created team category: ${sub.name} for parent: ${cat.name}`);
        } else {
          console.log(`ℹ️ Team category already exists: ${sub.name} for parent: ${cat.name}`);
        }
        // Create product type subcategories for this team
        for (const productType of sub.subcategories) {
          let productTypeCategory = await Category.findOne({ name: productType, parentCategory: teamCategory._id });
          if (!productTypeCategory) {
            await new Category({
              name: productType,
              parentCategory: teamCategory._id,
              status: "active",
            }).save();
            console.log(`✅ Created product type: ${productType} under ${sub.name} for ${cat.name}`);
          } else {
            console.log(`ℹ️ Product type already exists: ${productType} under ${sub.name} for ${cat.name}`);
          }
        }
      }
    }

    console.log("✅ Category seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};
