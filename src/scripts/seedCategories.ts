/* eslint-disable */
// src/seeds/category.seed.ts
import mongoose from 'mongoose'
import { Category, ensureCategoryIndexes } from '../models/Category'

const categoriesData = [
    {
      name: "Shoes",
      subcategories: [
        {
          name: "Nike",
          subcategories: [
            "Air Max",
            "Air Force"
          ],
        },
        {
          name: "Adidas",
          subcategories: [
            "SL 72",
            "Samba",
            "Spezial",
            "Gazelle",
            "Superstar",
            "Adizero"
          ],
        },
      ],
    },
    {
      name: "Men",
      subcategories: [
        {
          name: "Nike",
          subcategories: [
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Adidas",
          subcategories: [
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Arsenal",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
      ],
    },
    {
      name: "Women",
      subcategories: [
        {
          name: "Nike",
          subcategories: [
            "Sneakers",          
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Adidas",
          subcategories: [
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Arsenal",
          subcategories: [
            "Sneakers",        
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Sneakers", 
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Sneakers",          
            "Jersey",
            "Shorts",      
            "Jackets",
            "Hoodies",
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Sneakers",        
            "Jersey",
            "Shorts",     
            "Jackets",
            "Hoodies",  
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Jersey",
            "Sneakers",
            "Jersey",
            "Shorts",
            "Jackets",
            "Hoodies",
          ],
        },
      ],
    },
    {
      name: "Kids",
      subcategories: [
        {
          name: "Nike",
          subcategories: [
            "T-Shirts",
            "Jersey",
            "Tracksuits",
            "Backpacks",
          ],
        },
        {
          name: "Adidas",
          subcategories: [
            "T-Shirts",
            "Jersey",
            "Tracksuits",
            "Smiley World",
          ],
        },
        {
          name: "Arsenal",
          subcategories: [
            "Jersey",
            "Tracksuits",
          ],
        },
        {
          name: "Juventus",
          subcategories: [
            "Jersey",
            "Tracksuits",
          ],
        },
        {
          name: "Bayern Munich",
          subcategories: [
            "Jersey",
            "Tracksuits",
          ],
        },
        {
          name: "Real Madrid",
          subcategories: [
            "Jersey",
            "Tracksuits",
          ],
        },
        {
          name: "Manchester United",
          subcategories: [
            "Jersey",
            "Tracksuits",
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
    console.log(`Total categories to create: ${categoriesData.length}`)

    // Create all parent categories
    const parentCategories = []
    for (const cat of categoriesData) {
      let parent = await Category.findOne({ name: cat.name, parentCategory: null })
      if (!parent) {
        parent = await new Category({
          name: cat.name,
          parentCategory: null,
          status: 'active'
        }).save()
        console.log(`Created parent category: ${cat.name}`)
      } else {
        console.log(`Parent category exists: ${cat.name}`)
      }
      parentCategories.push(parent)
    }
    const parentMap = new Map(parentCategories.map((p) => [p.name, p]))

    // For each parent (Men, Women, Kids), create team and product type categories
    for (const cat of categoriesData) {
      const parent = parentMap.get(cat.name)
      if (!parent) {
        console.log(`❌ Parent category not found: ${cat.name}`)
        continue
      }
      
      console.log(`Processing parent category: ${cat.name}`)
      console.log(`Subcategories count: ${cat.subcategories.length}`)
      
      for (const sub of cat.subcategories) {
        // Create team category for this parent
        let teamCategory = await Category.findOne({ name: sub.name, parentCategory: parent._id })
        if (!teamCategory) {
          teamCategory = await new Category({
            name: sub.name,
            parentCategory: parent._id,
            status: 'active'
          }).save()
          console.log(`  Created team category: ${cat.name} > ${sub.name}`)
        } else {
          console.log(`  Team category exists: ${cat.name} > ${sub.name}`)
        }
        // Create product type subcategories for this team
        console.log(`  Creating product types for ${sub.name}: ${sub.subcategories.join(', ')}`)
        for (const productType of sub.subcategories) {
          let productTypeCat = await Category.findOne({ name: productType, parentCategory: teamCategory._id })
          if (!productTypeCat) {
            await new Category({
              name: productType,
              parentCategory: teamCategory._id,
              status: 'active'
            }).save()
            console.log(`    Created product type: ${cat.name} > ${sub.name} > ${productType}`)
          } else {
            console.log(`    Product type exists: ${cat.name} > ${sub.name} > ${productType}`)
          }
        }
      }
    }

    console.log('Categories seeded successfully!')

  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  }
}

// Hàm kiểm tra và sửa các category sai cấu trúc
export const fixCategoryStructure = async () => {
  for (const cat of categoriesData) {
    // Kiểm tra parent
    let parent = await Category.findOne({ name: cat.name, parentCategory: null })
    if (!parent) {
      parent = await new Category({ name: cat.name, parentCategory: null, status: 'active' }).save()
      console.log(`Created parent category: ${cat.name}`)
    }
    for (const sub of cat.subcategories) {
      // Kiểm tra team
      let team = await Category.findOne({ name: sub.name, parentCategory: parent._id })
      // Nếu có team trùng tên nhưng parentCategory sai, xóa đi
      const wrongTeams = await Category.find({ name: sub.name, parentCategory: { $ne: parent._id } })
      for (const wrong of wrongTeams) {
        await Category.deleteOne({ _id: wrong._id })
        console.log(`Deleted wrong team category: ${sub.name} (parentCategory: ${wrong.parentCategory})`)
      }
      if (!team) {
        team = await new Category({ name: sub.name, parentCategory: parent._id, status: 'active' }).save()
        console.log(`  Created team category: ${cat.name} > ${sub.name}`)
      }
      for (const productType of sub.subcategories) {
        // Kiểm tra product type
        let prod = await Category.findOne({ name: productType, parentCategory: team._id })
        // Nếu có product type trùng tên nhưng parentCategory sai, xóa đi
        const wrongProds = await Category.find({ name: productType, parentCategory: { $ne: team._id } })
        for (const wrong of wrongProds) {
          await Category.deleteOne({ _id: wrong._id })
          console.log(`    Deleted wrong product type: ${productType} (parentCategory: ${wrong.parentCategory})`)
        }
        if (!prod) {
          await new Category({ name: productType, parentCategory: team._id, status: 'active' }).save()
          console.log(`    Created product type: ${cat.name} > ${sub.name} > ${productType}`)
        }
      }
    }
  }
  console.log('✅ Category structure checked and fixed!')
}