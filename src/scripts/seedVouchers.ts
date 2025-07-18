import mongoose from 'mongoose'
import { Voucher } from '../models/Voucher'

const vouchersData = [
  {
    code: 'SALE10',
    description: 'Giảm 10% cho đơn hàng từ 500K',
    expiry: new Date('2025-12-31')
  },
  {
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn từ 300K',
    expiry: new Date('2025-10-01')
  },
  {
    code: 'WELCOME20',
    description: 'Giảm 20% cho khách hàng mới',
    expiry: new Date('2025-09-30')
  }
]

export const seedVouchers = async () => {
  try {
    for (const voucherData of vouchersData) {
      const existing = await Voucher.findOne({ code: voucherData.code })
      if (existing) continue
      await new Voucher(voucherData).save()
    }
    console.log('Seed vouchers thành công!')
  } catch (error) {
    console.error('Lỗi khi seed vouchers:', error)
    throw error
  }
}

// Nếu chạy trực tiếp file này
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas')
    .then(async () => {
      await seedVouchers()
      process.exit(0)
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err)
      process.exit(1)
    })
} 