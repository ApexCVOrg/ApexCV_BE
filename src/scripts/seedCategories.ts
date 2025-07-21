/* eslint-disable */
// src/seeds/category.seed.ts
import mongoose from 'mongoose'
import { Category, ensureCategoryIndexes } from '../models/Category'

const categoriesData = [
    {
      name: "Men",
      subcategories: [
        {
          name: "Nike",
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
          name: "Adidas",
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
          name: "Nike",
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
          name: "Adidas",
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
          name: "Nike",
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
          name: "Adidas",
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
  
// Thêm seed cho category OUTLET ở đầu mảng
categoriesData.unshift({
  name: 'Outlet',
  subcategories: []
});

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
        continue
      }
      
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