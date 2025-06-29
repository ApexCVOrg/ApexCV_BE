// src/seeds/category.seed.ts
import mongoose from 'mongoose'
import { Category, ensureCategoryIndexes } from '../models/Category'

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
    // Ensure indexes are properly set up
    await ensureCategoryIndexes()

    // Kiểm tra xem đã có dữ liệu categories chưa
    const existingCategoriesCount = await Category.countDocuments()
    if (existingCategoriesCount > 0) {
      console.log('Categories already exist, skipping seeding...')
      return
    }

    console.log('Starting to seed categories...')

    // Create all parent categories
    const parentCategories = []
    for (const cat of categoriesData) {
      const parent = await new Category({
        name: cat.name,
        parentCategory: null,
        status: 'active'
      }).save()
      parentCategories.push(parent)
    }
    const parentMap = new Map(parentCategories.map((p) => [p.name, p]))

    // For each parent (Men, Women, Kids), create team and product type categories
    for (const cat of categoriesData) {
      const parent = parentMap.get(cat.name)
      if (!parent) {
        continue
      }
      
      for (const sub of cat.subcategories) {
        // Create team category for this parent
        const teamCategory = await new Category({
          name: sub.name,
          parentCategory: parent._id,
          status: 'active'
        }).save()
        
        // Create product type subcategories for this team
        for (const productType of sub.subcategories) {
          await new Category({
            name: productType,
            parentCategory: teamCategory._id,
            status: 'active'
          }).save()
        }
      }
    }

    console.log('Categories seeded successfully!')

  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  }
}
