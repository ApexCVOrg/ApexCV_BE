import mongoose from 'mongoose'
import { User } from '../models/User'
import connectDB from '../config/db'

const usersData = [
  {
    fullName: 'Test User 01',
    email: 'user01@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isAdmin: false,
    isManager: false
  },
  {
    fullName: 'Test User 02',
    email: 'user02@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isAdmin: false,
    isManager: false
  },
  {
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isAdmin: true,
    isManager: false
  },
  {
    fullName: 'Manager User',
    email: 'manager@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isAdmin: false,
    isManager: true
  }
]

export const seedUsers = async () => {
  try {
    console.log('🔄 Starting user seeding...')
    
    let createdCount = 0
    let skippedCount = 0

    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email })
      
      if (existingUser) {
        // User already exists
        skippedCount++
        continue
      }

      const user = new User(userData)
      await user.save()
      // User created
      createdCount++
    }

    console.log(`\n📊 User seeding summary:`)
    console.log(`   Created: ${createdCount} users`)
    console.log(`   Skipped: ${skippedCount} users (already exist)`)
    console.log(`   Total processed: ${createdCount + skippedCount} users`)

    return { createdCount, skippedCount }
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  connectDB()
    .then(() => seedUsers())
    .then(() => {
      // User seeding completed
      process.exit(0)
    })
    .catch((error: Error) => {
      console.error('❌ User seeding failed:', error)
      process.exit(1)
    })
} 