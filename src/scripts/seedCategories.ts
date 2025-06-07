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
  try {
    // Get all existing categories
    const existingCategories = await Category.find({});
    const existingParentNames = new Set(existingCategories
      .filter(cat => !cat.parentCategory)
      .map(cat => cat.name));
    
    const existingSubNames = new Set(existingCategories
      .filter(cat => cat.parentCategory)
      .map(cat => cat.name));

    // Collect all names from seed data
    const seedParentNames = new Set(categoriesData.map(cat => cat.name));
    const seedSubNames = new Set(categoriesData.flatMap(cat => cat.subcategories));

    // Find categories to delete
    const parentNamesToDelete = [...existingParentNames].filter(name => !seedParentNames.has(name));
    const subNamesToDelete = [...existingSubNames].filter(name => !seedSubNames.has(name));

    // Delete categories that are not in seed data
    if (parentNamesToDelete.length > 0) {
      await Category.deleteMany({ 
        name: { $in: parentNamesToDelete },
        parentCategory: null 
      });
      console.log(`🗑️ Deleted parent categories: ${parentNamesToDelete.join(', ')}`);
    }

    if (subNamesToDelete.length > 0) {
      await Category.deleteMany({ 
        name: { $in: subNamesToDelete },
        parentCategory: { $ne: null }
      });
      console.log(`🗑️ Deleted subcategories: ${subNamesToDelete.join(', ')}`);
    }

    // Add new categories
    for (const cat of categoriesData) {
      // Check if parent category exists
      let parent = await Category.findOne({ 
        name: cat.name,
        parentCategory: null 
      });
      
      if (!parent) {
        // Create parent if not exists
        parent = await new Category({
          name: cat.name,
          parentCategory: null,
          status: "active",
        }).save();
        console.log(`✅ Created parent category: ${cat.name}`);
      } else {
        console.log(`ℹ️ Parent category already exists: ${cat.name}`);
      }

      // Check and create subcategories
      for (const sub of cat.subcategories) {
        const existingSub = await Category.findOne({ 
          name: sub,
          parentCategory: parent._id 
        });

        if (!existingSub) {
          try {
            await new Category({
              name: sub,
              parentCategory: parent._id,
              status: "active",
            }).save();
            console.log(`✅ Created subcategory: ${sub} under ${cat.name}`);
          } catch (error: any) {
            if (error.code === 11000) {
              console.log(`ℹ️ Subcategory already exists: ${sub}`);
            } else {
              throw error;
            }
          }
        } else {
          console.log(`ℹ️ Subcategory already exists: ${sub} under ${cat.name}`);
        }
      }
    }

    console.log("✅ Category seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};
