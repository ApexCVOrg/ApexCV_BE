import mongoose from 'mongoose'
import { Brand } from '../models/Brand'

const brandsData = [
  {
    name: 'Nike',
    description: 'Just Do It',
    logo: 'https://example.com/nike-logo.png',
    website: 'https://www.nike.com'
  },
  {
    name: 'Adidas',
    description: 'Impossible Is Nothing',
    logo: 'https://example.com/adidas-logo.png',
    website: 'https://www.adidas.com'
  }
]

export const seedBrands = async () => {
  // Create or update brands
  for (const brandData of brandsData) {
    const existingBrand = await Brand.findOne({ name: brandData.name })

    if (existingBrand) {
      continue
    }

    await new Brand(brandData).save()
  }
}
