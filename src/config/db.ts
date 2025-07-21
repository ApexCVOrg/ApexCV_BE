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
    // Kiểm tra và sửa format của MONGO_URI
    let mongoUri = process.env.MONGO_URI || 'mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority'
    
    // Nếu MONGO_URI bắt đầu với "MONGO_URI=" thì loại bỏ prefix
    if (mongoUri.startsWith('MONGO_URI=')) {
      mongoUri = mongoUri.substring(10)
    }
    
    console.log('Connecting to MongoDB...')
    console.log('MongoDB URI format check:', mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))
    
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.error('Invalid MongoDB URI format:', mongoUri.substring(0, 100))
      throw new Error('Invalid MongoDB connection string format')
    }
    
    // Thử kết nối với retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const conn = await mongoose.connect(mongoUri)
        console.log(`MongoDB connected: ${conn.connection.host}`)
        break;
      } catch (error) {
        retries--;
        console.log(`MongoDB connection attempt failed, retries left: ${retries}`)
        if (retries === 0) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

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
