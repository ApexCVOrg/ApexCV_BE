// src/seeds/category.seed.ts
import mongoose from "mongoose";
import { Category } from "../models/Category";

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
    
    // Get all existing categories
    const existingCategories = await Category.find({});
    
    // Create sets of all category names from seed data
    const seedCategoryNames = new Set<string>();
    categoriesData.forEach(cat => {
      seedCategoryNames.add(cat.name); // Add parent category (Men/Women/Kids)
      cat.subcategories.forEach(sub => {
        seedCategoryNames.add(sub.name); // Add team categories (Arsenal, Juventus, etc.)
        sub.subcategories.forEach(productType => {
          seedCategoryNames.add(productType); // Add product type categories
        });
      });
    });

    // Find categories to delete (those that exist in DB but not in seed data)
    const categoriesToDelete = existingCategories.filter(cat => !seedCategoryNames.has(cat.name));

    // Delete categories that are not in seed data
    if (categoriesToDelete.length > 0) {
      await Category.deleteMany({
        _id: { $in: categoriesToDelete.map(cat => cat._id) }
      });
      console.log(`🗑️ Deleted ${categoriesToDelete.length} categories that are not in seed data`);
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
        // First, ensure team category exists at root level
        let teamCategory = await Category.findOne({ 
          name: sub.name,
          parentCategory: null 
        });

        if (!teamCategory) {
          teamCategory = await new Category({
            name: sub.name,
            parentCategory: null,
            status: "active",
          }).save();
          console.log(`✅ Created team category: ${sub.name}`);
        } else {
          console.log(`ℹ️ Team category already exists: ${sub.name}`);
        }

        // Then create gender-specific team category
        const existingSub = await Category.findOne({ 
          name: sub.name,
          parentCategory: parent._id 
        });

        let genderTeamSub;
        if (!existingSub) {
          genderTeamSub = await new Category({
            name: sub.name,
            parentCategory: parent._id,
            status: "active",
          }).save();
          console.log(`✅ Created ${cat.name} team subcategory: ${sub.name}`);
        } else {
          genderTeamSub = existingSub;
          console.log(`ℹ️ ${cat.name} team subcategory already exists: ${sub.name}`);
        }

        // Create the product type subcategories
        for (const productType of sub.subcategories) {
          const existingProductType = await Category.findOne({ 
            name: productType,
            parentCategory: genderTeamSub._id 
          });

          if (!existingProductType) {
            await new Category({
              name: productType,
              parentCategory: genderTeamSub._id,
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
