import mongoose from 'mongoose'
import { Order } from '../models/Order'
import { User } from '../models/User'
import { Product } from '../models/Product'

const ordersData = [
  {
    userEmail: 'user01@example.com',
    orderItems: [
      {
        productName: "Arsenal Men's Home Jersey 2024/25",
        size: 'M',
        color: 'Red',
        quantity: 1,
        price: 1959000
      }
    ],
    shippingAddress: {
      recipientName: 'Van A',
      street: 'Le Loi',
      city: 'Hue',
      state: 'Thua Thien Hue',
      postalCode: '53000',
      country: 'Vietnam',
      phone: '0901000001'
    },
    paymentMethod: 'COD',
    taxPrice: 195900,
    shippingPrice: 50000,
    totalPrice: 2204900,
    isPaid: true,
    paidAt: new Date('2024-11-15T10:30:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2024-11-18T14:20:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user02@example.com',
    orderItems: [
      {
        productName: "Real Madrid Men's Home Jersey 2024/25",
        size: 'L',
        color: 'White',
        quantity: 1,
        price: 1999000
      },
      {
        productName: "Real Madrid Men's Training Jacket",
        size: 'XL',
        color: 'Black',
        quantity: 1,
        price: 2799000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi B',
      street: 'Tran Hung Dao',
      city: 'Hoi An',
      state: 'Quang Nam',
      postalCode: '56000',
      country: 'Vietnam',
      phone: '0901000002'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 479800,
    shippingPrice: 50000,
    totalPrice: 5327800,
    isPaid: true,
    paidAt: new Date('2024-11-20T09:15:00Z'),
    isDelivered: false,
    orderStatus: 'shipped'
  },
  {
    userEmail: 'user03@example.com',
    orderItems: [
      {
        productName: "Arsenal Women's Home Jersey 2024/25",
        size: 'S',
        color: 'Red',
        quantity: 2,
        price: 1799000
      }
    ],
    shippingAddress: {
      recipientName: 'Minh C',
      street: 'Nguyen Van Linh',
      city: 'Da Nang',
      state: 'Da Nang',
      postalCode: '55000',
      country: 'Vietnam',
      phone: '0901000003'
    },
    paymentMethod: 'COD',
    taxPrice: 359800,
    shippingPrice: 50000,
    totalPrice: 3658800,
    isPaid: false,
    orderStatus: 'pending'
  },
  {
    userEmail: 'user04@example.com',
    orderItems: [
      {
        productName: 'Arsenal Kids Home Jersey 2024/25',
        size: '6-7Y',
        color: 'Red',
        quantity: 1,
        price: 1399000
      },
      {
        productName: 'Arsenal Kids Tracksuit',
        size: '8-9Y',
        color: 'Red',
        quantity: 1,
        price: 1599000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi D',
      street: 'Hung Vuong',
      city: 'Quy Nhon',
      state: 'Binh Dinh',
      postalCode: '59000',
      country: 'Vietnam',
      phone: '0901000004'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_123456789',
      status: 'COMPLETED',
      update_time: '2024-12-25T16:45:00Z',
      email_address: 'user04@example.com'
    },
    taxPrice: 299800,
    shippingPrice: 50000,
    totalPrice: 3148800,
    isPaid: true,
    paidAt: new Date('2024-12-25T16:45:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user05@example.com',
    orderItems: [
      {
        productName: "Real Madrid Women's Home Jersey 2024/25",
        size: 'M',
        color: 'White',
        quantity: 1,
        price: 1899000
      }
    ],
    shippingAddress: {
      recipientName: 'Van E',
      street: 'Pham Van Dong',
      city: 'Da Nang',
      state: 'Da Nang',
      postalCode: '55000',
      country: 'Vietnam',
      phone: '0901000005'
    },
    paymentMethod: 'COD',
    taxPrice: 189900,
    shippingPrice: 50000,
    totalPrice: 2138900,
    isPaid: false,
    orderStatus: 'cancelled'
  },
  {
    userEmail: 'user06@example.com',
    orderItems: [
      {
        productName: "Arsenal Men's Training Jacket",
        size: 'L',
        color: 'Black',
        quantity: 1,
        price: 2694000
      },
      {
        productName: "Arsenal Women's Training Hoodie",
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1599000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi F',
      street: 'Le Thanh Ton',
      city: 'Nha Trang',
      state: 'Khanh Hoa',
      postalCode: '65000',
      country: 'Vietnam',
      phone: '0901000006'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 429300,
    shippingPrice: 50000,
    totalPrice: 4772300,
    isPaid: true,
    paidAt: new Date('2024-12-30T11:20:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-01-02T15:30:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user07@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Men's Home Jersey 2024/25",
        size: 'M',
        color: 'Red',
        quantity: 1,
        price: 1999000
      },
      {
        productName: "Bayern Munich Men's Home Shorts 2024/25",
        size: 'L',
        color: 'Red',
        quantity: 1,
        price: 979000
      }
    ],
    shippingAddress: {
      recipientName: 'Van G',
      street: 'Tran Phu',
      city: 'Da Lat',
      state: 'Lam Dong',
      postalCode: '67000',
      country: 'Vietnam',
      phone: '0901000007'
    },
    paymentMethod: 'COD',
    taxPrice: 297800,
    shippingPrice: 50000,
    totalPrice: 3325800,
    isPaid: true,
    paidAt: new Date('2025-01-05T14:30:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user08@example.com',
    orderItems: [
      {
        productName: "Juventus Men's Home Jersey 2024/25",
        size: 'XL',
        color: 'Black',
        quantity: 1,
        price: 1999000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi H',
      street: 'Hai Ba Trung',
      city: 'Vung Tau',
      state: 'Ba Ria - Vung Tau',
      postalCode: '78000',
      country: 'Vietnam',
      phone: '0901000008'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_987654321',
      status: 'COMPLETED',
      update_time: '2025-01-10T09:15:00Z',
      email_address: 'user08@example.com'
    },
    taxPrice: 199900,
    shippingPrice: 50000,
    totalPrice: 2248900,
    isPaid: true,
    paidAt: new Date('2025-01-10T09:15:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-01-13T16:45:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user09@example.com',
    orderItems: [
      {
        productName: "Manchester United Men's Home Jersey 2024/25",
        size: 'S',
        color: 'Red',
        quantity: 1,
        price: 1999000
      },
      {
        productName: "Manchester United Men's Training Jacket",
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 2799000
      },
      {
        productName: "Manchester United Men's Home Shorts 2024/25",
        size: 'M',
        color: 'Red',
        quantity: 1,
        price: 979000
      }
    ],
    shippingAddress: {
      recipientName: 'Van I',
      street: 'Ly Thuong Kiet',
      city: 'Can Tho',
      state: 'Can Tho',
      postalCode: '90000',
      country: 'Vietnam',
      phone: '0901000009'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 577700,
    shippingPrice: 50000,
    totalPrice: 6425700,
    isPaid: true,
    paidAt: new Date('2025-01-15T11:00:00Z'),
    isDelivered: false,
    orderStatus: 'shipped'
  },
  {
    userEmail: 'user11@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Women's Home Jersey 2024/25",
        size: 'M',
        color: 'Red',
        quantity: 1,
        price: 1899000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi K',
      street: 'Le Duan',
      city: 'Thanh Hoa',
      state: 'Thanh Hoa',
      postalCode: '44000',
      country: 'Vietnam',
      phone: '0901000011'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_111222333',
      status: 'COMPLETED',
      update_time: '2025-01-20T14:20:00Z',
      email_address: 'user11@example.com'
    },
    taxPrice: 189900,
    shippingPrice: 50000,
    totalPrice: 2138900,
    isPaid: true,
    paidAt: new Date('2025-01-20T14:20:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-01-23T10:30:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user12@example.com',
    orderItems: [
      {
        productName: "Juventus Women's Training Hoodie",
        size: 'L',
        color: 'Black',
        quantity: 1,
        price: 1699000
      },
      {
        productName: "Juventus Women's Training Shorts",
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1399000
      }
    ],
    shippingAddress: {
      recipientName: 'Van L',
      street: 'Trieu Viet Vuong',
      city: 'Thai Nguyen',
      state: 'Thai Nguyen',
      postalCode: '25000',
      country: 'Vietnam',
      phone: '0901000012'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 309800,
    shippingPrice: 50000,
    totalPrice: 3448800,
    isPaid: true,
    paidAt: new Date('2025-01-25T16:45:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user13@example.com',
    orderItems: [
      {
        productName: "Manchester United Women's Home Jersey 2024/25",
        size: 'S',
        color: 'Red',
        quantity: 1,
        price: 1899000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi M',
      street: 'Quang Trung',
      city: 'Quang Ngai',
      state: 'Quang Ngai',
      postalCode: '57000',
      country: 'Vietnam',
      phone: '0901000013'
    },
    paymentMethod: 'COD',
    taxPrice: 189900,
    shippingPrice: 50000,
    totalPrice: 2138900,
    isPaid: true,
    paidAt: new Date('2025-01-30T09:30:00Z'),
    isDelivered: false,
    orderStatus: 'shipped'
  },
  {
    userEmail: 'user14@example.com',
    orderItems: [
      {
        productName: 'Real Madrid Kids Home Jersey 2024/25',
        size: '6-7Y',
        color: 'White',
        quantity: 1,
        price: 1499000
      }
    ],
    shippingAddress: {
      recipientName: 'Van N',
      street: 'Le Lai',
      city: 'Da Lat',
      state: 'Lam Dong',
      postalCode: '67000',
      country: 'Vietnam',
      phone: '0901000014'
    },
    paymentMethod: 'COD',
    taxPrice: 149900,
    shippingPrice: 50000,
    totalPrice: 1698900,
    isPaid: true,
    paidAt: new Date('2025-02-05T11:15:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-02-08T14:20:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user15@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Kids Tracksuit",
        size: '8-9Y',
        color: 'Red',
        quantity: 1,
        price: 1599000
      },
      {
        productName: 'Bayern Munich Kids Home Jersey 2024/25',
        size: '10-11Y',
        color: 'Red',
        quantity: 1,
        price: 1499000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi O',
      street: 'Pham Hong Thai',
      city: 'Bac Ninh',
      state: 'Bac Ninh',
      postalCode: '22000',
      country: 'Vietnam',
      phone: '0901000015'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_444555666',
      status: 'COMPLETED',
      update_time: '2025-02-10T11:15:00Z',
      email_address: 'user15@example.com'
    },
    taxPrice: 309800,
    shippingPrice: 50000,
    totalPrice: 3448800,
    isPaid: true,
    paidAt: new Date('2025-02-10T11:15:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-02-13T14:20:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user16@example.com',
    orderItems: [
      {
        productName: "Real Madrid Men's Training Jacket",
        size: 'L',
        color: 'Black',
        quantity: 2,
        price: 2799000
      }
    ],
    shippingAddress: {
      recipientName: 'Van P',
      street: 'Tran Nhan Tong',
      city: 'Vinh',
      state: 'Nghe An',
      postalCode: '46000',
      country: 'Vietnam',
      phone: '0901000016'
    },
    paymentMethod: 'BANK_TRANSFER',
    paymentResult: {
      id: 'pay_1616161616',
      status: 'APPROVED',
      update_time: '2025-02-15T10:00:00Z',
      email_address: 'user16@example.com'
    },
    taxPrice: 559800,
    shippingPrice: 50000,
    totalPrice: 5658800,
    isPaid: true,
    paidAt: new Date('2025-02-15T10:00:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user17@example.com',
    orderItems: [
      {
        productName: "Juventus Women's Training Hoodie",
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1699000
      },
      {
        productName: "Juventus Women's Training Shorts",
        size: 'L',
        color: 'Black',
        quantity: 1,
        price: 1399000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi Q',
      street: 'Le Loi',
      city: 'Dong Hoi',
      state: 'Quang Binh',
      postalCode: '48000',
      country: 'Vietnam',
      phone: '0901000017'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_1717171717',
      status: 'COMPLETED',
      update_time: '2025-02-20T14:30:00Z',
      email_address: 'user17@example.com'
    },
    taxPrice: 309800,
    shippingPrice: 50000,
    totalPrice: 3148800,
    isPaid: true,
    paidAt: new Date('2025-02-20T14:30:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-02-23T12:00:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user18@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Men's Home Shorts 2024/25",
        size: 'M',
        color: 'Red',
        quantity: 1,
        price: 979000
      },
      {
        productName: "Bayern Munich Men's Training Jacket",
        size: 'XL',
        color: 'Black',
        quantity: 1,
        price: 2799000
      }
    ],
    shippingAddress: {
      recipientName: 'Van R',
      street: 'Nguyen Tat Thanh',
      city: 'Cam Ranh',
      state: 'Khanh Hoa',
      postalCode: '65000',
      country: 'Vietnam',
      phone: '0901000018'
    },
    paymentMethod: 'COD',
    taxPrice: 377800,
    shippingPrice: 50000,
    totalPrice: 3775800,
    isPaid: true,
    paidAt: new Date('2025-02-25T11:15:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user19@example.com',
    orderItems: [
      {
        productName: "Manchester United Men's Home Jersey 2024/25",
        size: 'L',
        color: 'Red',
        quantity: 2,
        price: 1999000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi S',
      street: 'Tran Phu',
      city: 'Pleiku',
      state: 'Gia Lai',
      postalCode: '59000',
      country: 'Vietnam',
      phone: '0901000019'
    },
    paymentMethod: 'BANK_TRANSFER',
    paymentResult: {
      id: 'pay_1919191919',
      status: 'COMPLETED',
      update_time: '2025-03-01T09:00:00Z',
      email_address: 'user19@example.com'
    },
    taxPrice: 399800,
    shippingPrice: 50000,
    totalPrice: 4049000,
    isPaid: true,
    paidAt: new Date('2025-03-01T09:00:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-03-04T10:30:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'thihtktk03@gmail.com',
    orderItems: [
      {
        productName: "Arsenal Women's Home Jersey 2024/25",
        size: 'M',
        color: 'White',
        quantity: 1,
        price: 1799000
      }
    ],
    shippingAddress: {
      recipientName: 'Đình Thi',
      street: 'TCV',
      city: 'Ngũ Hành Sơn',
      state: 'Đà Nẵng',
      postalCode: '55000',
      country: 'Vietnam',
      phone: '0359731884'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_3300330033',
      status: 'APPROVED',
      update_time: '2025-03-05T13:00:00Z',
      email_address: 'thihtktk@gmail.com'
    },
    taxPrice: 179900,
    shippingPrice: 50000,
    totalPrice: 2028900,
    isPaid: true,
    paidAt: new Date('2025-03-05T13:00:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user02@example.com',
    orderItems: [
      {
        productName: "Real Madrid Women's Training Hoodie",
        size: 'S',
        color: 'Black',
        quantity: 1,
        price: 1699000
      },
      {
        productName: "Real Madrid Women's Training Shorts",
        size: 'M',
        color: 'White',
        quantity: 1,
        price: 1399000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi B',
      street: 'Tran Hung Dao',
      city: 'Hoi An',
      state: 'Quang Nam',
      postalCode: '56000',
      country: 'Vietnam',
      phone: '0901000002'
    },
    paymentMethod: 'BANK_TRANSFER',
    paymentResult: {
      id: 'pay_2020202020',
      status: 'COMPLETED',
      update_time: '2025-03-10T15:30:00Z',
      email_address: 'user02@example.com'
    },
    taxPrice: 309800,
    shippingPrice: 50000,
    totalPrice: 3458800,
    isPaid: true,
    paidAt: new Date('2025-03-10T15:30:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-03-13T12:45:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user03@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Kids Tracksuit",
        size: '6-7Y',
        color: 'White',
        quantity: 1,
        price: 1599000
      }
    ],
    shippingAddress: {
      recipientName: 'Minh C',
      street: 'Nguyen Van Linh',
      city: 'Da Nang',
      state: 'Da Nang',
      postalCode: '55000',
      country: 'Vietnam',
      phone: '0901000003'
    },
    paymentMethod: 'COD',
    taxPrice: 159900,
    shippingPrice: 50000,
    totalPrice: 1808900,
    isPaid: false,
    orderStatus: 'cancelled'
  },
  {
    userEmail: 'user04@example.com',
    orderItems: [
      {
        productName: "Manchester United Kids Tracksuit",
        size: '10-11Y',
        color: 'Red',
        quantity: 2,
        price: 1599000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi D',
      street: 'Hung Vuong',
      city: 'Quy Nhon',
      state: 'Binh Dinh',
      postalCode: '59000',
      country: 'Vietnam',
      phone: '0901000004'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_2424242424',
      status: 'COMPLETED',
      update_time: '2025-03-15T10:20:00Z',
      email_address: 'user04@example.com'
    },
    taxPrice: 319800,
    shippingPrice: 50000,
    totalPrice: 3518800,
    isPaid: true,
    paidAt: new Date('2025-03-15T10:20:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user06@example.com',
    orderItems: [
      {
        productName: "Juventus Men's Home Shorts 2024/25",
        size: 'L',
        color: 'White',
        quantity: 1,
        price: 979000
      },
      {
        productName: "Juventus Kids Home Jersey 2024/25",
        size: '8-9Y',
        color: 'Black',
        quantity: 1,
        price: 1499000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi F',
      street: 'Le Thanh Ton',
      city: 'Nha Trang',
      state: 'Khanh Hoa',
      postalCode: '65000',
      country: 'Vietnam',
      phone: '0901000006'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 247800,
    shippingPrice: 50000,
    totalPrice: 2775800,
    isPaid: true,
    paidAt: new Date('2025-03-20T08:45:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-03-23T11:30:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user07@example.com',
    orderItems: [
      {
        productName: "Real Madrid Men's Home Shorts 2024/25",
        size: 'M',
        color: 'Black',
        quantity: 2,
        price: 979000
      }
    ],
    shippingAddress: {
      recipientName: 'Van G',
      street: 'Tran Phu',
      city: 'Da Lat',
      state: 'Lam Dong',
      postalCode: '67000',
      country: 'Vietnam',
      phone: '0901000007'
    },
    paymentMethod: 'COD',
    taxPrice: 195800,
    shippingPrice: 50000,
    totalPrice: 2205800,
    isPaid: true,
    paidAt: new Date('2025-03-25T12:00:00Z'),
    isDelivered: false,
    orderStatus: 'shipped'
  },
  {
    userEmail: 'user08@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Women's Home Jersey 2024/25",
        size: 'XS',
        color: 'White',
        quantity: 1,
        price: 1899000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi H',
      street: 'Hai Ba Trung',
      city: 'Vung Tau',
      state: 'Ba Ria - Vung Tau',
      postalCode: '78000',
      country: 'Vietnam',
      phone: '0901000008'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_2828282828',
      status: 'COMPLETED',
      update_time: '2025-03-30T14:00:00Z',
      email_address: 'user08@example.com'
    },
    taxPrice: 189900,
    shippingPrice: 50000,
    totalPrice: 2138900,
    isPaid: true,
    paidAt: new Date('2025-03-30T14:00:00Z'),
    isDelivered: true,
    deliveredAt: new Date('2025-04-02T16:00:00Z'),
    orderStatus: 'delivered'
  },
  {
    userEmail: 'user09@example.com',
    orderItems: [
      {
        productName: "Arsenal Men's Home Shorts 2024/25",
        size: 'L',
        color: 'Red',
        quantity: 1,
        price: 979000
      },
      {
        productName: "Arsenal Men's Home Jersey 2024/25",
        size: 'M',
        color: 'White',
        quantity: 1,
        price: 1959000
      }
    ],
    shippingAddress: {
      recipientName: 'Van I',
      street: 'Ly Thuong Kiet',
      city: 'Can Tho',
      state: 'Can Tho',
      postalCode: '90000',
      country: 'Vietnam',
      phone: '0901000009'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 293800,
    shippingPrice: 50000,
    totalPrice: 3285800,
    isPaid: true,
    paidAt: new Date('2025-04-05T09:00:00Z'),
    isDelivered: false,
    orderStatus: 'paid'
  },
  // TODAY'S ORDERS - For testing Today's Sales
  {
    userEmail: 'user01@example.com',
    orderItems: [
      {
        productName: "Arsenal Men's Home Jersey 2024/25",
        size: 'L',
        color: 'Red',
        quantity: 1,
        price: 1959000
      }
    ],
    shippingAddress: {
      recipientName: 'Van A',
      street: 'Le Loi',
      city: 'Hue',
      state: 'Thua Thien Hue',
      postalCode: '53000',
      country: 'Vietnam',
      phone: '0901000001'
    },
    paymentMethod: 'CREDIT_CARD',
    paymentResult: {
      id: 'pay_today_001',
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: 'user01@example.com'
    },
    taxPrice: 195900,
    shippingPrice: 50000,
    totalPrice: 2204900,
    isPaid: true,
    paidAt: new Date(), // Today's date
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user02@example.com',
    orderItems: [
      {
        productName: "Real Madrid Women's Training Hoodie",
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1699000
      }
    ],
    shippingAddress: {
      recipientName: 'Thi B',
      street: 'Tran Hung Dao',
      city: 'Hoi An',
      state: 'Quang Nam',
      postalCode: '56000',
      country: 'Vietnam',
      phone: '0901000002'
    },
    paymentMethod: 'BANK_TRANSFER',
    taxPrice: 169900,
    shippingPrice: 50000,
    totalPrice: 1918900,
    isPaid: true,
    paidAt: new Date(), // Today's date
    isDelivered: false,
    orderStatus: 'paid'
  },
  {
    userEmail: 'user03@example.com',
    orderItems: [
      {
        productName: "Bayern Munich Kids Home Jersey 2024/25",
        size: '8-9Y',
        color: 'Red',
        quantity: 1,
        price: 1499000
      },
      {
        productName: "Bayern Munich Kids Tracksuit",
        size: '10-11Y',
        color: 'Red',
        quantity: 1,
        price: 1599000
      }
    ],
    shippingAddress: {
      recipientName: 'Minh C',
      street: 'Nguyen Van Linh',
      city: 'Da Nang',
      state: 'Da Nang',
      postalCode: '55000',
      country: 'Vietnam',
      phone: '0901000003'
    },
    paymentMethod: 'COD',
    taxPrice: 309800,
    shippingPrice: 50000,
    totalPrice: 3448800,
    isPaid: true,
    paidAt: new Date(), // Today's date
    isDelivered: false,
    orderStatus: 'paid'
  }
]

const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error(`User with email ${email} not found`)
  }
  return user._id
}

const findProductByName = async (productName: string) => {
  const product = await Product.findOne({ name: productName })
  if (!product) {
    throw new Error(`Product with name ${productName} not found`)
  }
  return product._id
}

export const seedOrders = async () => {
  try {
    const createdOrders = []

    for (const orderData of ordersData) {
      // Check if order already exists by checking user, orderItems, and totalPrice
      const userId = await findUserByEmail(orderData.userEmail)
      
      const orderItems = []
      for (const item of orderData.orderItems) {
        const productId = await findProductByName(item.productName)
        orderItems.push({
          product: productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        })
      }

      // Check if order with same user, similar items, and totalPrice already exists
      const existingOrder = await Order.findOne({
        user: userId,
        totalPrice: orderData.totalPrice,
        'orderItems.0.product': orderItems[0].product,
        'orderItems.0.size': orderItems[0].size,
        'orderItems.0.color': orderItems[0].color
      })

      if (existingOrder) {
        continue
      }

      const order = new Order({
        user: userId,
        orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentResult: orderData.paymentResult,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        isPaid: orderData.isPaid,
        paidAt: orderData.paidAt,
        isDelivered: orderData.isDelivered,
        deliveredAt: orderData.deliveredAt,
        orderStatus: orderData.orderStatus
      })

      const savedOrder = await order.save()
      createdOrders.push(savedOrder)
    }

    return createdOrders
  } catch (error) {
    throw error
  }
} 