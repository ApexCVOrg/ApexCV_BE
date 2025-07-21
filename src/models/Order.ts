import mongoose, { Schema } from 'mongoose';
const sizeSchema = new Schema({
  sku: { type: String, required: true },
  size: String,
  stock: Number,
  color: String,
});
const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: [sizeSchema],
  quantity: { type: Number, required: true, min: 1 },
  price: Number,
  productName: String,
  productImage: String,
  productBrand: String,
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    recipientName: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  userSnapshot: {
    fullName: String,
    email: String,
    phone: String,
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String, // trạng thái của cổng thanh toán (ví dụ: 'COMPLETED', 'APPROVED')
    update_time: String,
    email_address: String,
  },
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  orderStatus: {
    // trạng thái nghiệp vụ của đơn hàng
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

// Schema cho pending order (backup khi session mất)
const pendingOrderSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderData: { type: Schema.Types.Mixed, required: true }, // Lưu toàn bộ order data
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Tự động xóa sau 1 giờ
});

orderSchema.index({ createdAt: 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model('Order', orderSchema);
export const PendingOrder = mongoose.model('PendingOrder', pendingOrderSchema);
