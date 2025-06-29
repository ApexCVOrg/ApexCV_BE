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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
            "Sneakers",
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
    // Xóa triệt để các document lỗi (parentCategory undefined/null/không phải ObjectId)
    const deleteResult = await Category.deleteMany({
      $or: [
        { parentCategory: { $exists: false } },
        { parentCategory: { $type: 10 } } // null
      ]
    });

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
        }
      }
    }

    // Xóa các categories không còn tồn tại trong categoriesData
    for (const parent of parentCategories) {
      // Lấy danh sách teams trong categoriesData cho parent này
      const validTeams = categoriesData
        .find(cat => cat.name === parent.name)
        ?.subcategories.map(sub => sub.name) || [];

      // Xóa các team không còn trong categoriesData
      await Category.deleteMany({
        parentCategory: parent._id,
        name: { $nin: validTeams }
      });

      // Với mỗi team còn lại, xóa các product types không còn trong categoriesData
      const teams = await Category.find({ parentCategory: parent._id });
      for (const team of teams) {
        const validProductTypes = categoriesData
          .find(cat => cat.name === parent.name)
          ?.subcategories.find(sub => sub.name === team.name)
          ?.subcategories || [];

        await Category.deleteMany({
          parentCategory: team._id,
          name: { $nin: validProductTypes }
        });
      }
    }

    // For each parent (Men, Women, Kids), create team and product type categories
    for (const cat of categoriesData) {
      const parent = parentMap.get(cat.name);
      if (!parent) {
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
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
