import { Request, Response } from 'express'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { Category } from '../models/Category.js'
import { readFileSync } from 'fs'
import { join } from 'path'

const sizeChartApparel = JSON.parse(readFileSync(join(process.cwd(), 'src/config/sizeChartApparel.json'), 'utf8'))
const sizeChartFootwear = JSON.parse(readFileSync(join(process.cwd(), 'src/config/sizeChartFootwear.json'), 'utf8'))

interface SizeChartApparel {
  [productId: string]: {
    [size: string]: {
      chest: number
      waist: number
      hip: number
    }
  }
}

interface SizeChartFootwear {
  [productId: string]: {
    [footLength: string]: {
      EU: number
      US: number
      UK: number
    }
  }
}

export const getSizeRecommendation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { productId, sizes, categories } = req.body

    if (!productId || !sizes || !Array.isArray(sizes) || !categories || !Array.isArray(categories)) {
      res.status(400).json({ message: 'Invalid input: productId, sizes array, and categories array are required' })
      return
    }

    // Get user profile
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Get product to check categories
    const product = await Product.findById(productId).populate('categories', 'name')
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    // Determine product type based on categories
    const categoryNames = product.categories.map((cat: any) => cat.name.toLowerCase())
    console.log('Size recommendation - Category names:', categoryNames)
    console.log('Size recommendation - Available sizes:', sizes)
    
    const isApparel = categoryNames.some(name => 
      name.includes('jersey') || name.includes('jacket') || name.includes('hoodie') || 
      name.includes('tracksuit') || name.includes('shorts') || name.includes('apparel')
    )
    const isFootwear = categoryNames.some(name => 
      name.includes('sneakers') || name.includes('shoes') || name.includes('footwear')
    )
    
    console.log('Size recommendation - Is apparel:', isApparel)
    console.log('Size recommendation - Is footwear:', isFootwear)

    if (isApparel) {
      // Handle Apparel size recommendation
      if (!user.height || !user.weight) {
        res.json({
          needProfile: true,
          missing: ['height', 'weight'],
          message: 'Please update your profile with height and weight for apparel size recommendation'
        })
        return
      }

      const apparelChart = sizeChartApparel as SizeChartApparel
      const productChart = apparelChart[productId] || apparelChart.default

      let bestSize = ''
      let minError = Infinity

      // Calculate user's BMI to estimate body type
      const userBMI = user.weight / Math.pow(user.height / 100, 2)
      console.log('Size recommendation - User BMI:', userBMI)
      console.log('Size recommendation - User height:', user.height, 'weight:', user.weight)
      
      for (const size of sizes) {
        const sizeData = productChart[size]
        if (!sizeData) {
          console.log('Size recommendation - No size data for:', size)
          continue
        }

        // Calculate average body measurement for this size
        const avgSizeMeasurement = (sizeData.chest + sizeData.waist + sizeData.hip) / 3

        // Better algorithm: Use BMI and height to estimate ideal measurements
        // For men: chest = height * 0.5 + weight * 0.3
        // For women: chest = height * 0.48 + weight * 0.25
        const estimatedChest = user.height * 0.5 + user.weight * 0.3
        const estimatedWaist = user.height * 0.4 + user.weight * 0.2
        const estimatedHip = user.height * 0.52 + user.weight * 0.35

        // Calculate error for each measurement
        const chestError = Math.abs(sizeData.chest - estimatedChest)
        const waistError = Math.abs(sizeData.waist - estimatedWaist)
        const hipError = Math.abs(sizeData.hip - estimatedHip)
        
        // Weighted average error (chest is most important for tops)
        const totalError = (chestError * 0.5) + (waistError * 0.3) + (hipError * 0.2)
        
        console.log(`Size recommendation - Size ${size}: chest=${sizeData.chest}, waist=${sizeData.waist}, hip=${sizeData.hip}, error=${totalError}`)
        
        if (totalError < minError) {
          minError = totalError
          bestSize = size
        }
      }

      if (bestSize) {
        res.json({
          recommendedSize: bestSize,
          type: 'apparel',
          confidence: Math.max(0, 1 - minError / 50) // Normalize confidence
        })
      } else {
        res.status(400).json({ message: 'No suitable size found for this product' })
      }

    } else if (isFootwear) {
      // Handle Footwear size recommendation
      if (!user.footLength) {
        res.json({
          needProfile: true,
          missing: ['footLength'],
          message: 'Please update your profile with foot length for footwear size recommendation'
        })
        return
      }

      const footwearChart = sizeChartFootwear as SizeChartFootwear
      
      // Check if product has sizes 39-42, use appropriate chart
      let productChart = footwearChart[productId]
      if (!productChart) {
        // Check if product has sizes 39, 40, 41, 42
        const has39to42 = sizes.some(size => ['39', '40', '41', '42'].includes(size))
        console.log('Size recommendation - Has sizes 39-42:', has39to42)
        if (has39to42) {
          productChart = footwearChart.sneakers_39_42
        }
      }
      if (!productChart) {
        productChart = footwearChart.default
      }

      console.log('Size recommendation - Using footwear chart:', productChart ? 'Found' : 'Default')
      console.log('Size recommendation - Product chart keys:', Object.keys(productChart))

      // Find closest foot length in the chart
      const userFootLength = user.footLength // Already in mm
      console.log('Size recommendation - User foot length (mm):', userFootLength)
      let closestFootLength = ''
      let minDifference = Infinity

      for (const footLength in productChart) {
        const difference = Math.abs(parseInt(footLength) - userFootLength)
        console.log(`Size recommendation - Foot length ${footLength}: difference=${difference}`)
        if (difference < minDifference) {
          minDifference = difference
          closestFootLength = footLength
        }
      }

      if (closestFootLength) {
        const recommendedSizes = productChart[closestFootLength]
        
        // Find the closest size from available sizes in the product
        let bestAvailableSize = ''
        let minSizeDifference = Infinity
        
        console.log('Size recommendation - Recommended EU size:', recommendedSizes.EU)
        console.log('Size recommendation - Available sizes:', sizes)
        
        for (const availableSize of sizes) {
          const sizeNum = parseInt(availableSize)
          if (!isNaN(sizeNum)) {
            const difference = Math.abs(sizeNum - recommendedSizes.EU)
            console.log(`Size recommendation - Size ${availableSize}: difference from EU ${recommendedSizes.EU} = ${difference}`)
            if (difference < minSizeDifference) {
              minSizeDifference = difference
              bestAvailableSize = availableSize
            }
          }
        }
        
        // If no numeric size found, use the first available size
        if (!bestAvailableSize && sizes.length > 0) {
          bestAvailableSize = sizes[0]
          console.log('Size recommendation - No numeric size found, using first available:', bestAvailableSize)
        }

        console.log('Size recommendation - Final recommended size:', bestAvailableSize)

        // Calculate confidence based on both foot length difference and size difference
        const footLengthConfidence = Math.max(0, 1 - minDifference / 50) // More lenient tolerance
        const sizeConfidence = bestAvailableSize ? Math.max(0, 1 - minSizeDifference / 5) : 0.5
        const overallConfidence = (footLengthConfidence + sizeConfidence) / 2

        res.json({
          recommendedSize: bestAvailableSize,
          type: 'footwear',
          footLength: userFootLength, // Use user's actual foot length
          confidence: overallConfidence
        })
      } else {
        // Fallback: just recommend the first available size
        if (sizes.length > 0) {
          console.log('Size recommendation - No foot length match, using first available size:', sizes[0])
          res.json({
            recommendedSize: sizes[0],
            type: 'footwear',
            confidence: 0.3 // Low confidence for fallback
          })
        } else {
          res.status(400).json({ message: 'No suitable size found for your foot length' })
        }
      }

    } else {
      res.status(400).json({ message: 'Product type not supported for size recommendation' })
    }

  } catch (error) {
    console.error('Error in getSizeRecommendation:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 