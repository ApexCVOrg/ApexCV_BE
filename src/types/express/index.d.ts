import 'express-session'

declare module 'express-session' {
  interface SessionData {
    pendingOrder?: {
      orderItems: Array<{
        product: string
        quantity: number
        size: Array<{ size: string; color: string; sku?: string }>
      }>
      shippingAddress?: {
        recipientName: string
        street: string
        city: string
        state: string
        postalCode: string
        country: string
        phone: string
      }
      totalPrice: number
    }
  }
}

declare namespace Express {
  export interface Request {
    userId?: string
    user?: {
      _id: string
      id: string
      email: string
      role: string
      username?: string
      fullName?: string
      phone?: string
    }
  }
}
