import mongoose from 'mongoose';
import { Coupon } from '../models/Coupon';

const couponsData = [
  {
    code: 'SALE10',
    type: 'percentage',
    value: 10,
    minOrderValue: 500000,
    maxUsage: 1000,
    used: 0,
    expiresAt: new Date('2025-12-31'),
    isActive: true,
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 50000,
    minOrderValue: 300000,
    maxUsage: 500,
    used: 0,
    expiresAt: new Date('2025-10-01'),
    isActive: true,
  },
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrderValue: 200000,
    maxUsage: 300,
    used: 0,
    expiresAt: new Date('2025-09-30'),
    isActive: true,
  },
  {
    code: 'NEWCUSTOMER',
    type: 'percentage',
    value: 15,
    minOrderValue: 300000,
    maxUsage: 200,
    used: 0,
    expiresAt: new Date('2025-12-31'),
    isActive: true,
  },
];

export const seedCoupons = async () => {
  try {
    for (const couponData of couponsData) {
      const existing = await Coupon.findOne({ code: couponData.code });
      if (existing) continue;
      await new Coupon(couponData).save();
    }
    console.log('Seed coupons thành công!');
  } catch (error) {
    console.error('Lỗi khi seed coupons:', error);
    throw error;
  }
};

// Nếu chạy trực tiếp file này
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas')
    .then(async () => {
      await seedCoupons();
      process.exit(0);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}
