// src/config/db.ts
import mongoose from 'mongoose'
import { seedCategories } from '../scripts/seedCategories'
import { seedProducts } from '../scripts/seedProducts'
import { seedBrands } from '../scripts/seedBrands'
import { seedOrders } from '../scripts/seedOrders'
import { seedDocuments } from '../scripts/seedDocuments'
import { seedChatData } from '../scripts/seedChatData'
import { seedVouchers } from '../scripts/seedVouchers'

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as mongoose.ConnectOptions)

    console.log(`MongoDB connected: ${conn.connection.host}`)

    await seedCategories() // Gọi seed tại đây
    // await seedBrands()
    // await seedProducts()
    // await seedOrders()
    // await seedDocuments()
    // await seedChatData()
    await seedVouchers()
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${(error as Error).message}`)
    process.exit(1)
  }
}

export default connectDB
