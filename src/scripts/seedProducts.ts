import mongoose from 'mongoose'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import { Brand } from '../models/Brand'

const productsData = [
  // Arsenal Products
  {
    name: "Arsenal Men's Home Jersey 2024/25",
    description:
      'Official Arsenal FC home jersey for the 2024/25 season. Made with high-quality materials and featuring the latest team design.',
    price: 2199000,
    discountPrice: 1959000,
    categoryPath: ['Men', 'Arsenal', 'T-Shirts'],
    images: ['Arsenal_Home_2425.avif'],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 10 }
    ],
    colors: ['Red', 'White'],
    tags: ['arsenal', 'jersey', 'football', 'home'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: "Arsenal Men's Training Jacket",
    description: 'Premium training jacket with Arsenal FC branding. Perfect for training sessions and casual wear.',
    price: 3184000,
    discountPrice: 2694000,
    categoryPath: ['Men', 'Arsenal', 'Jackets'],
    images: ['Arsenal_Training_Jacket.avif'],
    sizes: [
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    colors: ['Black', 'Red'],
    tags: ['arsenal', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Arsenal Women's Home Jersey 2024/25",
    description:
      "Official Arsenal FC women's home jersey for the 2024/25 season. Designed specifically for female fans.",
    price: 1999000,
    discountPrice: 1799000,
    categoryPath: ['Women', 'Arsenal', 'T-Shirts'],
    images: ['Arsenal_24-25_Home_Jersey_Red.avif'],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 15 }
    ],
    colors: ['Red', 'White'],
    tags: ['arsenal', 'jersey', 'football', 'home', 'women'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: "Arsenal Women's Training Hoodie",
    description: "Comfortable and stylish hoodie for Arsenal women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ['Women', 'Arsenal', 'Hoodies'],
    images: ['Arsenal_Women_Hoodie.jpg'],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 }
    ],
    colors: ['Black', 'Red'],
    tags: ['arsenal', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Arsenal Kids Home Jersey 2024/25',
    description:
      'Official Arsenal FC home jersey for kids, perfect for young fans. Made with comfortable, breathable materials.',
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Kids", "Arsenal", "T-Shirts"],
    images: ["Arsenal_Shirt.avif"],
    sizes: [
      { size: '4-5Y', stock: 20 },
      { size: '6-7Y', stock: 25 },
      { size: '8-9Y', stock: 20 },
      { size: '10-11Y', stock: 15 }
    ],
    colors: ['Red', 'White'],
    tags: ['arsenal', 'jersey', 'football', 'home', 'kids'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Arsenal Kids Tracksuit',
    description: 'Stylish and comfortable tracksuit for young Arsenal fans. Perfect for training and casual wear.',
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Arsenal", "Tracksuits"],
    images: ["Arsenal_Tracksuit.png"],
    sizes: [
      { size: '4-5Y', stock: 15 },
      { size: '6-7Y', stock: 20 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Red', 'White'],
    tags: ['arsenal', 'tracksuit', 'training', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  // Real Madrid Products
  {
    name: "Real Madrid Men's Home Jersey 2024/25",
    description:
      'Official Real Madrid home jersey for the 2024/25 season. Premium quality with the latest team design.',
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ['Men', 'Real Madrid', 'T-Shirts'],
    images: ['Real_Madrid_24-25_Home.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['White', 'Black'],
    tags: ['real-madrid', 'jersey', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Men's Training Jacket",
    description: 'Professional training jacket with Real Madrid branding. Ideal for training and casual wear.',
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ['Men', 'Real Madrid', 'Jackets'],
    images: ['Real_Madrid_Training_Jacket.avif'],
    sizes: [
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Black', 'White'],
    tags: ['real-madrid', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Women's Home Jersey 2024/25",
    description: "Official Real Madrid women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ['Women', 'Real Madrid', 'T-Shirts'],
    images: ['Real_Madrid_24-25_Home_Jersey_White_IT5182_HM1.avif'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['White', 'Black'],
    tags: ['real-madrid', 'jersey', 'football', 'home', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Women's Training Hoodie",
    description:
      "Stylish and comfortable hoodie for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ['Women', 'Real Madrid', 'Hoodies'],
    images: ['Real_Madrid_Travel_Hoodie_Grey_GR4277.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['real-madrid', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Real Madrid Kids Home Jersey 2024/25',
    description: 'Official Real Madrid home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Real Madrid", "T-Shirts"],
    images: ["Real_Madrid_24-25_Home_Jersey_Kids_White_IT5186_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 25 },
      { size: '6-7Y', stock: 30 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['White', 'Black'],
    tags: ['real-madrid', 'jersey', 'football', 'home', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Real Madrid Kids Tracksuit',
    description: 'Stylish and comfortable tracksuit for young Real Madrid fans. Perfect for training and casual wear.',
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Real Madrid", "Tracksuits"],
    images: ["Real_Madrid_Tiro_24_Competition_Training_Tracksuit_Bottoms_Kids_Blue_IT5120_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 15 },
      { size: '6-7Y', stock: 20 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['White', 'Black'],
    tags: ['real-madrid', 'tracksuit', 'training', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  // Bayern Munich Products
  {
    name: "Bayern Munich Men's Home Jersey 2024/25",
    description:
      'Official Bayern Munich home jersey for the 2024/25 season. Premium quality with the latest team design.',
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ['Men', 'Bayern Munich', 'T-Shirts'],
    images: ['FC_Bayern_24-25_Home_Jersey.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Red', 'White'],
    tags: ['bayern', 'jersey', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Bayern Munich Men's Training Jacket",
    description: 'Professional training jacket with Bayern Munich branding. Ideal for training and casual wear.',
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ['Men', 'Bayern Munich', 'Jackets'],
    images: ['FC_Bayern_Anniversary_Track.avif'],
    sizes: [
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Black', 'Red'],
    tags: ['bayern', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Bayern Munich Women's Home Jersey 2024/25",
    description: "Official Bayern Munich women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Bayern Munich", "T-Shirts"],
    images: ["FC_Bayern_Shirt.png"],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Red', 'White'],
    tags: ['bayern', 'jersey', 'football', 'home', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Bayern Munich Women's Training Hoodie",
    description:
      "Stylish and comfortable hoodie for Bayern Munich women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ['Women', 'Bayern Munich', 'Hoodies'],
    images: ['FC_Bayern_Hoodie.jpg'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'Red'],
    tags: ['bayern', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Bayern Munich Kids Home Jersey 2024/25',
    description: 'Official Bayern Munich home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Bayern Munich", "T-Shirts"],
    images: ["FC_Bayern_24-25_Home_Jersey_Kids_Red_IT2249_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 25 },
      { size: '6-7Y', stock: 30 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Red', 'White'],
    tags: ['bayern', 'jersey', 'football', 'home', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Bayern Munich Kids Tracksuit',
    description:
      'Stylish and comfortable tracksuit for young Bayern Munich fans. Perfect for training and casual wear.',
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Bayern Munich", "Tracksuits"],
    images: ["294607_adidas-bayern-munchen-trainingspak-1-4-zip-2024-2025-kids-bordeauxrood-wit-rood.jpg"],
    sizes: [
      { size: '4-5Y', stock: 15 },
      { size: '6-7Y', stock: 20 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Red', 'White'],
    tags: ['bayern', 'tracksuit', 'training', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  // Juventus Products
  {
    name: "Juventus Men's Home Jersey 2024/25",
    description: 'Official Juventus home jersey for the 2024/25 season. Premium quality with the latest team design.',
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ['Men', 'Juventus', 'T-Shirts'],
    images: ['Ao_DJau_San_Nha_Juventus_25-26.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'jersey', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Juventus Men's Training Jacket",
    description: 'Professional training jacket with Juventus branding. Ideal for training and casual wear.',
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ['Men', 'Juventus', 'Jackets'],
    images: ['juv_jacket.jpg'],
    sizes: [
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Juventus Women's Home Jersey 2024/25",
    description: "Official Juventus women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ['Women', 'Juventus', 'T-Shirts'],
    images: ['Juventus_Shirt.avif'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'jersey', 'football', 'home', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Juventus Women's Training Hoodie",
    description:
      "Stylish and comfortable hoodie for Juventus women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ['Women', 'Juventus', 'Hoodies'],
    images: ['Juventus_Hoodie.png'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Juventus Kids Home Jersey 2024/25',
    description: 'Official Juventus home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Juventus", "T-Shirts"],
    images: ["Juventus_25-26_Shorts_Kids_Black_JN5221_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 25 },
      { size: '6-7Y', stock: 30 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'jersey', 'football', 'home', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Juventus Kids Tracksuit',
    description: 'Stylish and comfortable tracksuit for young Juventus fans. Perfect for training and casual wear.',
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Juventus", "Tracksuits"],
    images: ["Juventus_Tiro_24_Competition_Training_Tracksuit_Bottoms_Kids_Blue_IS5818_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 15 },
      { size: '6-7Y', stock: 20 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'tracksuit', 'training', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  // Manchester United Products
  {
    name: "Manchester United Men's Home Jersey 2024/25",
    description:
      'Official Manchester United home jersey for the 2024/25 season. Premium quality with the latest team design.',
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ['Men', 'Manchester United', 'T-Shirts'],
    images: ['Manchester_United_24-25_Home_Jersey_Red.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Red', 'Black'],
    tags: ['manchester-united', 'jersey', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Manchester United Men's Training Jacket",
    description: 'Professional training jacket with Manchester United branding. Ideal for training and casual wear.',
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ['Men', 'Manchester United', 'Jackets'],
    images: ['MU_Training_Jacket.avif'],
    sizes: [
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    colors: ['Black', 'Red'],
    tags: ['manchester-united', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Manchester United Women's Home Jersey 2024/25",
    description:
      "Official Manchester United women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ['Women', 'Manchester United', 'T-Shirts'],
    images: ['MU_Tshirt.avif'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Red', 'Black'],
    tags: ['manchester-united', 'jersey', 'football', 'home', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Manchester United Women's Training Hoodie",
    description:
      "Stylish and comfortable hoodie for Manchester United women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ['Women', 'Manchester United', 'Hoodies'],
    images: ['MU_Hoodie.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'Red'],
    tags: ['manchester-united', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Manchester United Kids Home Jersey 2024/25',
    description: 'Official Manchester United home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Manchester United", "T-Shirts"],
    images: ["MU_Shirt.avif"],
    sizes: [
      { size: '4-5Y', stock: 25 },
      { size: '6-7Y', stock: 30 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Red', 'Black'],
    tags: ['manchester-united', 'jersey', 'football', 'home', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Manchester United Kids Tracksuit',
    description:
      'Stylish and comfortable tracksuit for young Manchester United fans. Perfect for training and casual wear.',
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Manchester United", "Tracksuits"],
    images: ["Manchester_United_Track_Suit_Kids_Blue_IT4200_21_model.avif"],
    sizes: [
      { size: '4-5Y', stock: 15 },
      { size: '6-7Y', stock: 20 },
      { size: '8-9Y', stock: 25 },
      { size: '10-11Y', stock: 20 }
    ],
    colors: ['Red', 'Black'],
    tags: ['manchester-united', 'tracksuit', 'training', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  // Additional Arsenal Products
  {
    name: "Arsenal Men's Home Shorts 2024/25",
    description: 'Official Arsenal FC home shorts for the 2024/25 season. Lightweight and comfortable for match day.',
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ['Men', 'Arsenal', 'Shorts'],
    images: ['Arsenal_24-25_Home_Shorts.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 }
    ],
    colors: ['Red', 'White'],
    tags: ['arsenal', 'shorts', 'football', 'home'],
    brand: 'Nike',
    status: 'active'
  },
  // Additional Real Madrid Products
  {
    name: "Real Madrid Men's Home Shorts 2024/25",
    description: 'Official Real Madrid home shorts for the 2024/25 season. Lightweight and comfortable for match day.',
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ['Men', 'Real Madrid', 'Shorts'],
    images: ['Real_Madrid_25-26_Home_Shorts.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 }
    ],
    colors: ['White', 'Black'],
    tags: ['real-madrid', 'shorts', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Women', 'Real Madrid', 'Shorts'],
    images: ['Real_Madrid_Short.jpg'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['real-madrid', 'shorts', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  // Additional Bayern Munich Products
  {
    name: "Bayern Munich Men's Home Shorts 2024/25",
    description:
      'Official Bayern Munich home shorts for the 2024/25 season. Lightweight and comfortable for match day.',
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ['Men', 'Bayern Munich', 'Shorts'],
    images: ['FC_Bayern_24-25_Home_Shorts.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 }
    ],
    colors: ['Red', 'White'],
    tags: ['bayern', 'shorts', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  // Additional Juventus Products
  {
    name: "Juventus Men's Home Shorts 2024/25",
    description: 'Official Juventus home shorts for the 2024/25 season. Lightweight and comfortable for match day.',
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ['Men', 'Juventus', 'Shorts'],
    images: ['Juventus_25-26_Home_Shorts.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'shorts', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  // Additional Manchester United Products
  {
    name: "Manchester United Men's Home Shorts 2024/25",
    description:
      'Official Manchester United home shorts for the 2024/25 season. Lightweight and comfortable for match day.',
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ['Men', 'Manchester United', 'Shorts'],
    images: ['Manchester_United_24-25_Home_Shorts.avif'],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 }
    ],
    colors: ['Red', 'Black'],
    tags: ['manchester-united', 'shorts', 'football', 'home'],
    brand: 'Adidas',
    status: 'active'
  },
  // Additional Women's Training Shorts
  {
    name: "Arsenal Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Arsenal women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Women', 'Arsenal', 'Shorts'],
    images: ['Arsenal_Women_Short.avif'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'Red'],
    tags: ['arsenal', 'shorts', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Women', 'Real Madrid', 'Shorts'],
    images: ['Real_Madrid_Short.jpg'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['real-madrid', 'shorts', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Bayern Munich Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Bayern Munich women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Bayern Munich", "Shorts"],
    images: ["FC_Bayern_Short.png"],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'Red'],
    tags: ['bayern', 'shorts', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Juventus Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Juventus women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Women', 'Juventus', 'Shorts'],
    images: ['Juventus_Short.png'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ['Black', 'White'],
    tags: ['juventus', 'shorts', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Manchester United Women's Training Shorts",
    description:
      "Comfortable and stylish training shorts for Manchester United women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Women', 'Manchester United', 'Shorts'],
    images: ['MU_Short.avif'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "shorts", "training", "women"],
    brand: "Adidas",
    status: "active"
  },
  // Men's Sneakers
  {
    name: "Arsenal Men's Sneakers",
    description: "Stylish and comfortable sneakers with Arsenal design. Perfect for casual wear and everyday activities.",
    price: 2899000,
    discountPrice: 2499000,
    categoryPath: ["Men", "Arsenal", "Sneakers"],
    images: ["Arsenal_Men's_Training_Shoes.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "sneakers", "casual", "men"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Real Madrid Men's Sneakers",
    description: "Stylish and comfortable sneakers with Real Madrid design. Perfect for casual wear and everyday activities.",
    price: 2899000,
    discountPrice: 2499000,
    categoryPath: ["Men", "Real Madrid", "Sneakers"],
    images: ["Real_Madrid_Shoes_White.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "sneakers", "casual", "men"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Bayern Munich Men's Sneakers",
    description: "Stylish and comfortable sneakers with Bayern Munich design. Perfect for casual wear and everyday activities.",
    price: 2899000,
    discountPrice: 2499000,
    categoryPath: ["Men", "Bayern Munich", "Sneakers"],
    images: ["FC_Bayern_Shoes.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "sneakers", "casual", "men"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Juventus Men's Sneakers",
    description: "Stylish and comfortable sneakers with Juventus design. Perfect for casual wear and everyday activities.",
    price: 2899000,
    discountPrice: 2499000,
    categoryPath: ["Men", "Juventus", "Sneakers"],
    images: ["gazelle-juventus-terrace-icons-shoes.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "sneakers", "casual", "men"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Manchester United Men's Sneakers",
    description: "Stylish and comfortable sneakers with Manchester United design. Perfect for casual wear and everyday activities.",
    price: 2899000,
    discountPrice: 2499000,
    categoryPath: ["Men", "Manchester United", "Sneakers"],
    images: ["Samba_OG_Shoes_White_IG1025_01_00_standard.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "sneakers", "casual", "men"],
    brand: "Adidas",
    status: "active"
  },
  // Women's Sneakers
  {
    name: "Arsenal Women's Sneakers",
    description: "Stylish and comfortable sneakers with Arsenal design for women. Perfect for casual wear and everyday activities.",
    price: 2699000,
    discountPrice: 2299000,
    categoryPath: ["Women", "Arsenal", "Sneakers"],
    images: ["Gazelle_Arsenal_Terrace_Icons_Shoes_White.avif"],
    sizes: [
      { size: '36', stock: 10 },
      { size: '37', stock: 15 },
      { size: '38', stock: 20 },
      { size: '39', stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "sneakers", "casual", "women"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Real Madrid Women's Sneakers",
    description: "Stylish and comfortable sneakers with Real Madrid design for women. Perfect for casual wear and everyday activities.",
    price: 2699000,
    discountPrice: 2299000,
    categoryPath: ["Women", "Real Madrid", "Sneakers"],
    images: ["Samba_Real_Madrid_Shoes_White_JQ4038_HM1.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "sneakers", "casual", "women"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Bayern Munich Women's Sneakers",
    description: "Stylish and comfortable sneakers with Bayern Munich design for women. Perfect for casual wear and everyday activities.",
    price: 2699000,
    discountPrice: 2299000,
    categoryPath: ["Women", "Bayern Munich", "Sneakers"],
    images: ["Samba_FC_Bayern_Shoes_Red_JQ4039_HM1.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "sneakers", "casual", "women"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Juventus Women's Sneakers",
    description: "Stylish and comfortable sneakers with Juventus design for women. Perfect for casual wear and everyday activities.",
    price: 2699000,
    discountPrice: 2299000,
    categoryPath: ["Women", "Juventus", "Sneakers"],
    images: ["Samba_Juventus_Shoes_Black_JQ4040_HM1.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "sneakers", "casual", "women"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Manchester United Women's Sneakers",
    description: "Stylish and comfortable sneakers with Manchester United design for women. Perfect for casual wear and everyday activities.",
    price: 2699000,
    discountPrice: 2299000,
    categoryPath: ["Women", "Manchester United", "Sneakers"],
    images: ["Gazelle_Manchester_United_Terrace_Icons_Shoes_White_JS3040_HM1.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "sneakers", "casual", "women"],
    brand: "Adidas",
    status: "active"
  },
  // Adidas Shoes - Samba
  {
    name: 'Samba OG Shoes',
    description: 'Adidas Samba OG Shoes - Originals, 14 colours, Trending.',
    price: 2700000,
    discountPrice: 2700000,
    categoryPath: ["Shoes", "Adidas", "Samba"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752479523/Giay_Samba_OG_trang_B75806_01_00_standard_ts41vx.avif'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Grey'],
    tags: ['originals', 'OG'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Samba JP Shoes',
    description: 'Adidas Samba JP Shoes - Originals, 2 colours, New.',
    price: 3000000,
    discountPrice: 3000000,
    categoryPath: ["Shoes", "Adidas", "Samba"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481341/Samba_Jp_Shoes_White_JR0964_01_00_standard_j1mljy.avif'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Green'],
    tags: ['originals', 'JP'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Samba W',
    description: 'Adidas Samba W - Originals, 3 colours, Trending.',
    price: 2700000,
    discountPrice: 2700000,
    categoryPath: ["Shoes", "Adidas", "Samba"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481428/Samba_OG_W_Cream_White_ID0478_01_standard_yq6dvh.avif'],
    sizes: [
      { size: '36', stock: 10 },
      { size: '37', stock: 10 },
      { size: '38', stock: 10 }
    ],
    colors: ['Black', 'White', 'Beige'],
    tags: ['originals', 'W'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Samba LT Shoes',
    description: 'Adidas Samba LT Shoes - Originals, 2 colours.',
    price: 2900000,
    discountPrice: 2900000,
    categoryPath: ["Shoes", "Adidas", "Samba"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481448/Samba_LT_Shoes_Black_IG2010_01_standard_lftp7l.avif'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['Black', 'White'],
    tags: ['originals', 'LT'],
    brand: 'Adidas',
    status: 'active'
  },
  // Adidas Superstar Collection
  {
    name: 'Superstar 82 Shoes',
    description: 'Adidas Superstar 82 - Classic design with modern comfort. Iconic shell toe design.',
    price: 2800000,
    discountPrice: 2500000,
    categoryPath: ["Shoes", "Adidas", "Superstar"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481685/Superstar_82_Shoes_Black_JI2026_01_standard_vk2bpv.avif'],
    sizes: [
      { size: '40', stock: 15 },
      { size: '41', stock: 20 },
      { size: '42', stock: 25 },
      { size: '43', stock: 15 }
    ],
    colors: ['White', 'Black'],
    tags: ['shoes', 'superstar', '82'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Superstar Vintage Shoes',
    description: 'Adidas Superstar Vintage - Retro style with premium materials. Classic shell toe design.',
    price: 2900000,
    discountPrice: 2600000,
    categoryPath: ["Shoes", "Adidas", "Superstar"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481696/Superstar_Vintage_Shoes_White_JQ3254_01_00_standard_fvo24u.avif'],
    sizes: [
      { size: '40', stock: 12 },
      { size: '41', stock: 18 },
      { size: '42', stock: 22 },
      { size: '43', stock: 12 }
    ],
    colors: ['White', 'Black', 'Navy'],
    tags: ['shoes', 'superstar', 'vintage'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Superstar II Shoes',
    description: 'Adidas Superstar II - Enhanced comfort with classic style. Updated shell toe design.',
    price: 2700000,
    discountPrice: 2400000,
    categoryPath: ["Shoes", "Adidas", "Superstar"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481691/SUPERSTAR_II_Green_JI3076_01_00_standard_hpveet.avif'],
    sizes: [
      { size: '40', stock: 14 },
      { size: '41', stock: 19 },
      { size: '42', stock: 24 },
      { size: '43', stock: 14 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['shoes', 'superstar', 'II'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Superstar Standard Shoes',
    description: 'Adidas Superstar Standard - Original design with timeless appeal. Classic shell toe.',
    price: 2600000,
    discountPrice: 2300000,
    categoryPath: ["Shoes", "Adidas", "Superstar"],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481702/Superstar_Shoes_White_IG9367_01_standard_tfdpml.avif'],
    sizes: [
      { size: '40', stock: 16 },
      { size: '41', stock: 21 },
      { size: '42', stock: 26 },
      { size: '43', stock: 16 }
    ],
    colors: ['White', 'Black', 'Green'],
    tags: ['shoes', 'superstar', 'standard'],
    brand: 'Adidas',
    status: 'active'
  },
  // Sample Sneakers from FE TestCardsPage
  {
    name: 'Nike Span 2',
    description: 'Nike Span 2 - classic running shoes with modern comfort.',
    price: 2300000,
    discountPrice: 2100000,
    categoryPath: ['Men', 'Nike', 'Sneakers'],
    images: ['nike-span-2.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Nike Air Force 1 High',
    description: 'Nike Air Force 1 High - iconic high-top sneakers.',
    price: 2500000,
    discountPrice: 2300000,
    categoryPath: ["Shoes", "Nike", "Air Force"],
    images: ['nike-air-force-1-high.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Nike Air Force',
    description: 'Nike Air Force - timeless streetwear sneakers.',
    price: 2100000,
    discountPrice: 1900000,
    categoryPath: ["Shoes", "Nike", "Air Force"],
    images: ['nike-air-force.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Air Max 90',
    description: 'Nike Air Max 90 - legendary comfort and style.',
    price: 2200000,
    discountPrice: 2000000,
    categoryPath: ["Shoes", "Nike", "Air Max"],
    images: ['air-max-90.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Air Max Excee',
    description: 'Nike Air Max Excee - inspired by the Air Max 90.',
    price: 2000000,
    discountPrice: 1800000,
    categoryPath: ["Shoes", "Nike", "Air Max"],
    images: ['air-max-excee-.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  {
    name: 'Air Max 270',
    description: 'Nike Air Max 270 - modern cushioning and bold design.',
    price: 2400000,
    discountPrice: 2200000,
    categoryPath: ["Shoes", "Nike", "Air Max"],
    images: ['air-max-270.png'],
    sizes: [
      { size: '40', stock: 10 },
      { size: '41', stock: 10 },
      { size: '42', stock: 10 }
    ],
    colors: ['White', 'Black', 'Red'],
    tags: ['new', 'hot'],
    brand: 'Nike',
    status: 'active'
  },
  // Gazelle Collection (English)
  {
    name: "Gazelle Bold",
    description: "Adidas Gazelle Bold - Bold design with thick sole, modern style.",
    price: 2500000,
    discountPrice: 2200000,
    categoryPath: ["Shoes", "Adidas", "Gazelle", "Bold"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481668/Gazelle_Bold_Shoes_White_ID7056_01_standard_umjj7p.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["shoes", "gazelle", "bold"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Gazelle Bold X Liberty London",
    description: "Adidas Gazelle Bold X Liberty London - Special collaboration edition.",
    price: 2700000,
    discountPrice: 2400000,
    categoryPath: ["Shoes", "Adidas", "Gazelle", "Bold X Liberty London"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481635/Gazelle_Bold_x_Liberty_London_Shoes_Black_JI2572_01_00_standard_ljphtg.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black"],
    tags: ["shoes", "gazelle", "bold", "liberty", "london"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Gazelle Indoor",
    description: "Adidas Gazelle Indoor - Gum sole, classic retro style.",
    price: 2400000,
    discountPrice: 2100000,
    categoryPath: ["Shoes", "Adidas", "Gazelle", "Indoor"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481663/Gazelle_Indoor_Shoes_Blue_JI2061_01_standard_njgqxv.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Green", "Blue", "Black"],
    tags: ["shoes", "gazelle", "indoor"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Gazelle Spikeless Golf",
    description: "Adidas Gazelle Spikeless Golf - Spikeless sole, perfect for golf.",
    price: 2600000,
    discountPrice: 2300000,
    categoryPath: ["Shoes", "Adidas", "Gazelle", "Spikeless Golf"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481658/Gazelle_Spikeless_Golf_Shoes_Yellow_JS1896_01_00_standard_anoj9k.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["White", "Yellow"],
    tags: ["shoes", "gazelle", "golf", "spikeless"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Gazelle Standard",
    description: "Adidas Gazelle Standard - Original design, easy to style.",
    price: 2300000,
    discountPrice: 2000000,
    categoryPath: ["Shoes", "Adidas", "Gazelle", "Standard"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481650/Gazelle_Shoes_Burgundy_IF9652_01_standard_khizks.avif"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Burgundy", "Green", "Blue"],
    tags: ["shoes", "gazelle", "standard"],
    brand: "Adidas",
    status: "active"
  },
  // SL 72 Collection (English)
  {
    name: "SL 72 OG",
    description: "Adidas SL 72 OG - Original design, retro style.",
    price: 2200000,
    discountPrice: 2000000,
    categoryPath: ["Shoes", "Adidas", "SL 72", "OG"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481540/SL_72_OG_Shoes_Black_JH7390_01_standard_m9gnjo.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Pink", "Green", "Black", "Navy"],
    tags: ["shoes", "sl72", "og"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "SL 72 RS",
    description: "Adidas SL 72 RS - Modern colorways, soft sole.",
    price: 2300000,
    discountPrice: 2100000,
    categoryPath: ["Shoes", "Adidas", "SL 72", "RS"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481540/SL_72_OG_Shoes_Black_JH7390_01_standard_m9gnjo.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Green", "Yellow", "Navy"],
    tags: ["shoes", "sl72", "rs"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "SL 72 RS Mercedes",
    description: "Adidas SL 72 RS Mercedes - Special collaboration with Mercedes.",
    price: 2500000,
    discountPrice: 2250000,
    categoryPath: ["Shoes", "Adidas", "SL 72", "RS Mercedes"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481575/SL_72_RS_MERCEDES_SHOES_White_JQ1781_01_00_standard_n3k1ew.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["shoes", "sl72", "rs", "mercedes"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "SL 72 RTN",
    description: "Adidas SL 72 RTN - New design, dynamic look.",
    price: 2350000,
    discountPrice: 2100000,
    categoryPath: ["Shoes", "Adidas", "SL 72", "RTN"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481559/SL_72_RTN_Shoes_Grey_IH5558_01_standard_btczfy.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Grey", "Black"],
    tags: ["shoes", "sl72", "rtn"],
    brand: "Adidas",
    status: "active"
  },
  // Spezial Collection (English)
  {
    name: "Handball Spezial",
    description: "Adidas Handball Spezial - Classic style, outstanding with many colorways.",
    price: 2100000,
    discountPrice: 1900000,
    categoryPath: ["Shoes", "Adidas", "Spezial"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752481481/Giay_Handball_Spezial_mau_xanh_la_IG6192_01_standard_jnfcze.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Sky Blue", "Yellow", "Black Sky Blue", "Green", "Orange"],
    tags: ["shoes", "spezial", "handball"],
    brand: "Adidas",
    status: "active"
  },
  // Adizero Collection (English)
  {
    name: "Adizero Adios 9",
    description: "Adidas Adizero Adios 9 - Ultra-lightweight running shoes for high performance.",
    price: 3200000,
    discountPrice: 2900000,
    categoryPath: ["Shoes", "Adidas", "Adizero", "Adios 9"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752488411/Giay_Chay_Bo_Adizero_Adios_9_Ngoc_lam_JH5243_01_00_standard_y05ir2.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Teal"],
    tags: ["shoes", "adizero", "adios9"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Adizero Adios Pro 4",
    description: "Adidas Adizero Adios Pro 4 - Top-tier technology for professional athletes.",
    price: 5200000,
    discountPrice: 4800000,
    categoryPath: ["Shoes", "Adidas", "Adizero", "Adios Pro 4"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752488420/Giay_Adizero_Adios_Pro_4_trang_JR1094_01_00_standard_jqbqxe.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["White"],
    tags: ["shoes", "adizero", "adiospro4"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Adizero Boston 13",
    description: "Adidas Adizero Boston 13 - Cushioned support for long-distance running.",
    price: 3500000,
    discountPrice: 3200000,
    categoryPath: ["Shoes", "Adidas", "Adizero", "Boston 13"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752488420/Giay_Adizero_Adios_Pro_4_trang_JR1094_01_00_standard_jqbqxe.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Golden", "White"],
    tags: ["shoes", "adizero", "boston13"],
    brand: "Adidas",
    status: "active"
  },
  {
    name: "Adizero Evo SL",
    description: "Adidas Adizero Evo SL - Super lightweight for maximum speed.",
    price: 4000000,
    discountPrice: 3700000,
    categoryPath: ["Shoes", "Adidas", "Adizero", "Evo SL"],
    images: ["https://res.cloudinary.com/dqmb4e2et/image/upload/v1752488489/Giay_Adizero_EVO_SL_DJen_JP7149_01_00_standard_cjuy6a.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Black"],
    tags: ["shoes", "adizero", "evosl"],
    brand: "Adidas",
    status: "active"
  }
]

// Helper function to find category IDs by path
const findCategoryIdsByPath = async (categoryPath: string[]) => {
  const categoryIds: mongoose.Types.ObjectId[] = []

  // Find parent category
  const parentCategory = (await Category.findOne({
    name: categoryPath[0],
    parentCategory: null
  })) as mongoose.Document & { _id: mongoose.Types.ObjectId }

  if (!parentCategory) {
    throw new Error(`Parent category not found: ${categoryPath[0]}`)
  }
  categoryIds.push(parentCategory._id)

  // Find team category
  const teamCategory = (await Category.findOne({
    name: categoryPath[1],
    parentCategory: parentCategory._id
  })) as mongoose.Document & { _id: mongoose.Types.ObjectId }

  if (!teamCategory) {
    throw new Error(`Team category not found: ${categoryPath[1]}`)
  }
  categoryIds.push(teamCategory._id)

  // Find product type category
  const productTypeCategory = (await Category.findOne({
    name: categoryPath[2],
    parentCategory: teamCategory._id
  })) as mongoose.Document & { _id: mongoose.Types.ObjectId }

  if (!productTypeCategory) {
    throw new Error(`Product type category not found: ${categoryPath[2]}`)
  }
  categoryIds.push(productTypeCategory._id)

  return categoryIds
}

// Function to update product images in MongoDB
export const updateProductImages = async (productName: string, newImages: string[]) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { name: productName },
      { $set: { images: newImages } },
      { new: true }
    )
    
    if (updatedProduct) {
      console.log(`✅ Updated images for product: ${productName}`)
      return updatedProduct
    } else {
      console.log(`❌ Product not found: ${productName}`)
      return null
    }
  } catch (error) {
    console.error(`❌ Error updating images for ${productName}:`, error)
    throw error
  }
}

// Function to update multiple products images
export const updateMultipleProductImages = async (updates: { name: string; images: string[] }[]) => {
  try {
    const results = []
    
    for (const update of updates) {
      const result = await updateProductImages(update.name, update.images)
      if (result) {
        results.push(result)
      }
    }
    
    console.log(`✅ Updated ${results.length} products successfully`)
    return results
  } catch (error) {
    console.error('❌ Error updating multiple products:', error)
    throw error
  }
}

// Function to update all product images from productsData
export const updateAllProductImages = async () => {
  try {
    let updatedCount = 0
    
    for (const product of productsData) {
      const existing = await Product.findOne({ name: product.name })
      
      if (existing) {
        // Check if images have changed
        if (JSON.stringify(existing.images) !== JSON.stringify(product.images)) {
          await Product.findOneAndUpdate(
            { name: product.name },
            { $set: { images: product.images } },
            { new: true }
          )
          console.log(`✅ Updated images for: ${product.name}`)
          updatedCount++
        }
      }
    }
    
    console.log(`✅ Total products updated: ${updatedCount}`)
    return updatedCount
  } catch (error) {
    console.error('❌ Error updating all product images:', error)
    throw error
  }
}

export const seedProducts = async () => {
  try {
    console.log('🔄 Starting product seeding and image updates...')
    
    for (const product of productsData) {
      // Check if product already exists
      const existing = await Product.findOne({ name: product.name })

      if (existing) {
        // Always update existing product images to latest from productsData
        const currentImages = existing.images || []
        const newImages = product.images || []
        
        // Auto-update images if they're different
        if (JSON.stringify(currentImages) !== JSON.stringify(newImages)) {
          await Product.findOneAndUpdate(
            { name: product.name },
            { $set: { images: newImages } },
            { new: true }
          )
          console.log(`🔄 Auto-updated images for: ${product.name}`)
          console.log(`   Old: ${currentImages.join(', ')}`)
          console.log(`   New: ${newImages.join(', ')}`)
        }
        continue
      }

      // Get brand ObjectId
      const brand = await Brand.findOne({ name: product.brand })
      if (!brand) {
        console.error(`❌ Brand not found: ${product.brand}`)
        continue
      }

      try {
        // Get category IDs from path
        const categoryIds = await findCategoryIdsByPath(product.categoryPath)
        
        // Create new product
        const newProduct = await new Product({
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice || null,
          categories: categoryIds,
          images: product.images,
          sizes: product.sizes || [],
          colors: product.colors || [],
          tags: product.tags || [],
          brand: brand._id,
          status: product.status || 'active'
        }).save()
      } catch (error) {
        console.error(`❌ Error processing categories for ${product.name}:`, error)
        continue
      }
    }
  } catch (error) {
    console.error('\n❌ Error seeding products:', error)
    throw error
  }
}
