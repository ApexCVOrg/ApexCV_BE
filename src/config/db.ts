// src/config/db.ts
import mongoose from 'mongoose'
import { seedCategories } from '../scripts/seedCategories'
import { seedProducts } from '../scripts/seedProducts'
import { seedBrands } from '../scripts/seedBrands'
import { seedOrders } from '../scripts/seedOrders'
import { seedDocuments } from '../scripts/seedDocuments'
import { seedChatData } from '../scripts/seedChatData'
import { seedCoupons } from '../scripts/seedVouchers'

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas', {
    } as mongoose.ConnectOptions)

    console.log(`MongoDB connected: ${conn.connection.host}`)

    try {
      await seedCategories() // Gọi seed tại đây
    } catch (error) {
      console.error('❌ Error seeding categories:', error)
    }

    try {
      await seedBrands()
    } catch (error) {
      console.error('❌ Error seeding brands:', error)
    }

    try {
      await seedProducts()
    } catch (error) {
      console.error('❌ Error seeding products:', error)
    }

    // Chỉ chạy seedOrders nếu có products
    try {
      await seedOrders()
    } catch (error) {
      console.error('❌ Error seeding orders:', error)
    }

    try {
      await seedDocuments()
    } catch (error) {
      console.error('❌ Error seeding documents:', error)
    }

    try {
      await seedChatData()
    } catch (error) {
      console.error('❌ Error seeding chat data:', error)
    }

    try {
      await seedCoupons()
    } catch (error) {
      console.error('❌ Error seeding coupons:', error)
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${(error as Error).message}`)
    process.exit(1)
  }
}

export default connectDB
