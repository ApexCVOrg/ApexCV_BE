/* eslint-disable */
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
    categoryPath: ['Men', 'Arsenal', 'Jersey'],
    images: ['Arsenal_Home_2425.avif'],
    sizes: [
      { sku: '1234567890', size: 'S', stock: 15, color: 'Red' },
      { sku: '1234567891', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234567892', size: 'L', stock: 20, color: 'Red' },
      { sku: '1234567893', size: 'XL', stock: 10, color: 'Red' },
      { sku: '1234567894', size: 'S', stock: 15, color: 'White' },
      { sku: '1234567895', size: 'M', stock: 25, color: 'White' },
      { sku: '1234567896', size: 'L', stock: 20, color: 'White' },
      { sku: '1234567897', size: 'XL', stock: 10, color: 'White' }
    ],
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
      { sku: '1234567898', size: 'M', stock: 20, color: 'Black' },
      { sku: '1234567899', size: 'L', stock: 15, color: 'Black' },
      { sku: '1234567900', size: 'XL', stock: 10, color: 'Black' },
      { sku: '1234567901', size: 'M', stock: 20, color: 'Red' },
      { sku: '1234567902', size: 'L', stock: 15, color: 'Red' },
      { sku: '1234567903', size: 'XL', stock: 10, color: 'Red' }
    ],
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
    categoryPath: ['Women', 'Arsenal', 'Jersey'],
    images: ['Arsenal_24-25_Home_Jersey_Red.avif'],
    sizes: [
      { sku: '1234567904', size: 'XS', stock: 10, color: 'Red' },
      { sku: '1234567905', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234567906', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234567907', size: 'L', stock: 15, color: 'Red' },
      { sku: '1234567908', size: 'XS', stock: 10, color: 'White' },
      { sku: '1234567909', size: 'S', stock: 20, color: 'White' },
      { sku: '1234567910', size: 'M', stock: 25, color: 'White' },
      { sku: '1234567911', size: 'L', stock: 15, color: 'White' }
    ],
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
      { sku: '1234567912', size: 'S', stock: 15, color: 'Black' },
      { sku: '1234567913', size: 'M', stock: 20, color: 'Black' },
      { sku: '1234567914', size: 'L', stock: 15, color: 'Black' },
      { sku: '1234567915', size: 'S', stock: 15, color: 'Red' },
      { sku: '1234567916', size: 'M', stock: 20, color: 'Red' },
      { sku: '1234567917', size: 'L', stock: 15, color: 'Red' }
    ],
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
    categoryPath: ["Kids", "Arsenal", "Jersey"],
    images: ["Arsenal_Shirt.avif"],
    sizes: [
      { sku: '1234567918', size: '4-5Y', stock: 20, color: 'Red' },
      { sku: '1234567919', size: '6-7Y', stock: 25, color: 'Red' },
      { sku: '1234567920', size: '8-9Y', stock: 20, color: 'Red' },
      { sku: '1234567921', size: '10-11Y', stock: 15, color: 'Red' },
      { sku: '1234567922', size: '4-5Y', stock: 20, color: 'White' },
      { sku: '1234567923', size: '6-7Y', stock: 25, color: 'White' },
      { sku: '1234567924', size: '8-9Y', stock: 20, color: 'White' },
      { sku: '1234567925', size: '10-11Y', stock: 15, color: 'White' }
    ],
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
      { sku: '1234567926', size: '4-5Y', stock: 15, color: 'Red' },
      { sku: '1234567927', size: '6-7Y', stock: 20, color: 'Red' },
      { sku: '1234567928', size: '8-9Y', stock: 25, color: 'Red' },
      { sku: '1234567929', size: '10-11Y', stock: 20, color: 'Red' },
      { sku: '1234567930', size: '4-5Y', stock: 15, color: 'White' },
      { sku: '1234567931', size: '6-7Y', stock: 20, color: 'White' },
      { sku: '1234567932', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234567933', size: '10-11Y', stock: 20, color: 'White' }
    ],
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
    categoryPath: ['Men', 'Real Madrid', 'Jersey'],
    images: ['Real_Madrid_24-25_Home.avif'],
    sizes: [
      { sku: '1234567934', size: 'S', stock: 20, color: 'White' },
      { sku: '1234567935', size: 'M', stock: 30, color: 'White' },
      { sku: '1234567936', size: 'L', stock: 25, color: 'White' },
      { sku: '1234567937', size: 'XL', stock: 15, color: 'White' },
      { sku: '1234567938', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234567939', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234567940', size: 'L', stock: 25, color: 'Black' },
      { sku: '1234567941', size: 'XL', stock: 15, color: 'Black' }
    ],
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
      { sku: '1234567942', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234567943', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234567944', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234567945', size: 'M', stock: 25, color: 'White' },
      { sku: '1234567946', size: 'L', stock: 20, color: 'White' },
      { sku: '1234567947', size: 'XL', stock: 15, color: 'White' }
    ],
    tags: ['real-madrid', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Real Madrid Women's Home Jersey 2024/25",
    description: "Official Real Madrid women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ['Women', 'Real Madrid', 'Jersey'],
    images: ['Real_Madrid_24-25_Home_Jersey_White_IT5182_HM1.avif'],
    sizes: [
      { sku: '1234567948', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234567949', size: 'S', stock: 25, color: 'White' },
      { sku: '1234567950', size: 'M', stock: 30, color: 'White' },
      { sku: '1234567951', size: 'L', stock: 20, color: 'White' },
      { sku: '1234567952', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234567953', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234567954', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234567955', size: 'L', stock: 20, color: 'Black' }
    ],
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
      { sku: '1234567956', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234567957', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234567958', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234567959', size: 'S', stock: 20, color: 'White' },
      { sku: '1234567960', size: 'M', stock: 25, color: 'White' },
      { sku: '1234567961', size: 'L', stock: 20, color: 'White' }
    ],
    tags: ['real-madrid', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Real Madrid Kids Home Jersey 2024/25',
    description: 'Official Real Madrid home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Real Madrid", "Jersey"],
    images: ["Real_Madrid_24-25_Home_Jersey_Kids_White_IT5186_21_model.avif"],
    sizes: [
      { sku: '1234567962', size: '4-5Y', stock: 25, color: 'White' },
      { sku: '1234567963', size: '6-7Y', stock: 30, color: 'White' },
      { sku: '1234567964', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234567965', size: '10-11Y', stock: 20, color: 'White' },
      { sku: '1234567966', size: '4-5Y', stock: 25, color: 'Black' },
      { sku: '1234567967', size: '6-7Y', stock: 30, color: 'Black' },
      { sku: '1234567968', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234567969', size: '10-11Y', stock: 20, color: 'Black' }
    ],
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
      { sku: '1234567970', size: '4-5Y', stock: 15, color: 'White' },
      { sku: '1234567971', size: '6-7Y', stock: 20, color: 'White' },
      { sku: '1234567972', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234567973', size: '10-11Y', stock: 20, color: 'White' },
      { sku: '1234567974', size: '4-5Y', stock: 15, color: 'Black' },
      { sku: '1234567975', size: '6-7Y', stock: 20, color: 'Black' },
      { sku: '1234567976', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234567977', size: '10-11Y', stock: 20, color: 'Black' }
    ],
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
    categoryPath: ['Men', 'Bayern Munich', 'Jersey'],
    images: ['FC_Bayern_24-25_Home_Jersey.avif'],
    sizes: [
      { sku: '1234567978', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234567979', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234567980', size: 'L', stock: 25, color: 'Red' },
      { sku: '1234567981', size: 'XL', stock: 15, color: 'Red' },
      { sku: '1234567982', size: 'S', stock: 20, color: 'White' },
      { sku: '1234567983', size: 'M', stock: 30, color: 'White' },
      { sku: '1234567984', size: 'L', stock: 25, color: 'White' },
      { sku: '1234567985', size: 'XL', stock: 15, color: 'White' }
    ],
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
      { sku: '1234568000', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568001', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568002', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568003', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234568004', size: 'L', stock: 20, color: 'Red' },
      { sku: '1234568005', size: 'XL', stock: 15, color: 'Red' }
    ],
    tags: ['bayern', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Bayern Munich Women's Home Jersey 2024/25",
    description: "Official Bayern Munich women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Bayern Munich", "Jersey"],
    images: ["FC_Bayern_Shirt.png"],
    sizes: [
      { sku: '1234568006', size: 'XS', stock: 15, color: 'Red' },
      { sku: '1234568007', size: 'S', stock: 25, color: 'Red' },
      { sku: '1234568008', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568009', size: 'L', stock: 20, color: 'Red' },
      { sku: '1234568010', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234568011', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568012', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568013', size: 'L', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568014', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568015', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568016', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568017', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568018', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234568019', size: 'L', stock: 20, color: 'Red' }
    ],
    tags: ['bayern', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Bayern Munich Kids Home Jersey 2024/25',
    description: 'Official Bayern Munich home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Bayern Munich", "Jersey"],
    images: ["FC_Bayern_24-25_Home_Jersey_Kids_Red_IT2249_21_model.avif"],
    sizes: [
      { sku: '1234568020', size: '4-5Y', stock: 25, color: 'Red' },
      { sku: '1234568021', size: '6-7Y', stock: 30, color: 'Red' },
      { sku: '1234568022', size: '8-9Y', stock: 25, color: 'Red' },
      { sku: '1234568023', size: '10-11Y', stock: 20, color: 'Red' },
      { sku: '1234568024', size: '4-5Y', stock: 25, color: 'White' },
      { sku: '1234568025', size: '6-7Y', stock: 30, color: 'White' },
      { sku: '1234568026', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234568027', size: '10-11Y', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568028', size: '4-5Y', stock: 15, color: 'Red' },
      { sku: '1234568029', size: '6-7Y', stock: 20, color: 'Red' },
      { sku: '1234568030', size: '8-9Y', stock: 25, color: 'Red' },
      { sku: '1234568031', size: '10-11Y', stock: 20, color: 'Red' },
      { sku: '1234568032', size: '4-5Y', stock: 15, color: 'White' },
      { sku: '1234568033', size: '6-7Y', stock: 20, color: 'White' },
      { sku: '1234568034', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234568035', size: '10-11Y', stock: 20, color: 'White' }
    ],
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
    categoryPath: ['Men', 'Juventus', 'Jersey'],
    images: ['Ao_DJau_San_Nha_Juventus_25-26.avif'],
    sizes: [
      { sku: '1234568036', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568037', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568038', size: 'L', stock: 25, color: 'Black' },
      { sku: '1234568039', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568040', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568041', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568042', size: 'L', stock: 25, color: 'White' },
      { sku: '1234568043', size: 'XL', stock: 15, color: 'White' }
    ],
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
      { sku: '1234568044', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568045', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568046', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568047', size: 'M', stock: 25, color: 'White' },
      { sku: '1234568048', size: 'L', stock: 20, color: 'White' },
      { sku: '1234568049', size: 'XL', stock: 15, color: 'White' }
    ],
    tags: ['juventus', 'jacket', 'training'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Juventus Women's Home Jersey 2024/25",
    description: "Official Juventus women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ['Women', 'Juventus', 'Jersey'],
    images: ['Juventus_Shirt.avif'],
    sizes: [
      { sku: '1234568050', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568051', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568052', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568053', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568054', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234568055', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568056', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568057', size: 'L', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568058', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568059', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568060', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568061', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568062', size: 'M', stock: 25, color: 'White' },
      { sku: '1234568063', size: 'L', stock: 20, color: 'White' }
    ],
    tags: ['juventus', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Juventus Kids Home Jersey 2024/25',
    description: 'Official Juventus home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Juventus", "Jersey"],
    images: ["Juventus_25-26_Shorts_Kids_Black_JN5221_21_model.avif"],
    sizes: [
      { sku: '1234568064', size: '4-5Y', stock: 25, color: 'Black' },
      { sku: '1234568065', size: '6-7Y', stock: 30, color: 'Black' },
      { sku: '1234568066', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234568067', size: '10-11Y', stock: 20, color: 'Black' },
      { sku: '1234568068', size: '4-5Y', stock: 25, color: 'White' },
      { sku: '1234568069', size: '6-7Y', stock: 30, color: 'White' },
      { sku: '1234568070', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234568071', size: '10-11Y', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568072', size: '4-5Y', stock: 15, color: 'Black' },
      { sku: '1234568073', size: '6-7Y', stock: 20, color: 'Black' },
      { sku: '1234568074', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234568075', size: '10-11Y', stock: 20, color: 'Black' },
      { sku: '1234568076', size: '4-5Y', stock: 15, color: 'White' },
      { sku: '1234568077', size: '6-7Y', stock: 20, color: 'White' },
      { sku: '1234568078', size: '8-9Y', stock: 25, color: 'White' },
      { sku: '1234568079', size: '10-11Y', stock: 20, color: 'White' }
    ],
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
    categoryPath: ['Men', 'Manchester United', 'Jersey'],
    images: ['Manchester_United_24-25_Home_Jersey_Red.avif'],
    sizes: [
      { sku: '1234568080', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568081', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568082', size: 'L', stock: 25, color: 'Red' },
      { sku: '1234568083', size: 'XL', stock: 15, color: 'Red' },
      { sku: '1234568084', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568085', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568086', size: 'L', stock: 25, color: 'Black' },
      { sku: '1234568087', size: 'XL', stock: 15, color: 'Black' }
    ],
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
      { sku: '1234568088', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568089', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568090', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568091', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234568092', size: 'L', stock: 20, color: 'Red' },
      { sku: '1234568093', size: 'XL', stock: 15, color: 'Red' }
    ],
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
    categoryPath: ['Women', 'Manchester United', 'Jersey'],
    images: ['MU_Tshirt.avif'],
    sizes: [
      { sku: '1234568094', size: 'XS', stock: 15, color: 'Red' },
      { sku: '1234568095', size: 'S', stock: 25, color: 'Red' },
      { sku: '1234568096', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568097', size: 'L', stock: 20, color: 'Red' },
      { sku: '1234568098', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568099', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568100', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568101', size: 'L', stock: 20, color: 'Black' }
    ],
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
      { sku: '1234568102', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568103', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568104', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568105', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568106', size: 'M', stock: 25, color: 'Red' },
      { sku: '1234568107', size: 'L', stock: 20, color: 'Red' }
    ],
    tags: ['manchester-united', 'hoodie', 'training', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: 'Manchester United Kids Home Jersey 2024/25',
    description: 'Official Manchester United home jersey for kids. Perfect for young fans with comfortable materials.',
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Manchester United", "Jersey"],
    images: ["MU_Shirt.avif"],
    sizes: [
      { sku: '1234568108', size: '4-5Y', stock: 25, color: 'Red' },
      { sku: '1234568109', size: '6-7Y', stock: 30, color: 'Red' },
      { sku: '1234568110', size: '8-9Y', stock: 25, color: 'Red' },
      { sku: '1234568111', size: '10-11Y', stock: 20, color: 'Red' },
      { sku: '1234568112', size: '4-5Y', stock: 25, color: 'Black' },
      { sku: '1234568113', size: '6-7Y', stock: 30, color: 'Black' },
      { sku: '1234568114', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234568115', size: '10-11Y', stock: 20, color: 'Black' }
    ],
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
      { sku: '1234568116', size: '4-5Y', stock: 15, color: 'Red' },
      { sku: '1234568117', size: '6-7Y', stock: 20, color: 'Red' },
      { sku: '1234568118', size: '8-9Y', stock: 25, color: 'Red' },
      { sku: '1234568119', size: '10-11Y', stock: 20, color: 'Red' },
      { sku: '1234568120', size: '4-5Y', stock: 15, color: 'Black' },
      { sku: '1234568121', size: '6-7Y', stock: 20, color: 'Black' },
      { sku: '1234568122', size: '8-9Y', stock: 25, color: 'Black' },
      { sku: '1234568123', size: '10-11Y', stock: 20, color: 'Black' }
    ],
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
      { sku: '1234568124', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568125', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568126', size: 'L', stock: 25, color: 'Red' },
      { sku: '1234568127', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568128', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568129', size: 'L', stock: 25, color: 'White' }
    ],
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
      { sku: '1234568130', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568131', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568132', size: 'L', stock: 25, color: 'White' },
      { sku: '1234568133', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568134', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568135', size: 'L', stock: 25, color: 'Black' }
    ],
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
      { sku: '1234568136', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568137', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568138', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568139', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568140', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234568141', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568142', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568143', size: 'L', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568144', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568145', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568146', size: 'L', stock: 25, color: 'Red' },
      { sku: '1234568147', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568148', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568149', size: 'L', stock: 25, color: 'White' }
    ],
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
      { sku: '1234568150', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568151', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568152', size: 'L', stock: 25, color: 'Black' },
      { sku: '1234568153', size: 'S', stock: 20, color: 'White' },
      { sku: '1234568154', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568155', size: 'L', stock: 25, color: 'White' }
    ],
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
      { sku: '1234568156', size: 'S', stock: 20, color: 'Red' },
      { sku: '1234568157', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568158', size: 'L', stock: 25, color: 'Red' },
      { sku: '1234568159', size: 'S', stock: 20, color: 'Black' },
      { sku: '1234568160', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568161', size: 'L', stock: 25, color: 'Black' }
    ],
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
      { sku: '1234568162', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568163', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568164', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568165', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568166', size: 'XS', stock: 15, color: 'Red' },
      { sku: '1234568167', size: 'S', stock: 25, color: 'Red' },
      { sku: '1234568168', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568169', size: 'L', stock: 20, color: 'Red' }
    ],
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
      { sku: '1234568170', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568171', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568172', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568173', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568174', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234568175', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568176', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568177', size: 'L', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568178', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568179', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568180', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568181', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568182', size: 'XS', stock: 15, color: 'Red' },
      { sku: '1234568183', size: 'S', stock: 25, color: 'Red' },
      { sku: '1234568184', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568185', size: 'L', stock: 20, color: 'Red' }
    ],
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
      { sku: '1234568186', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568187', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568188', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568189', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568190', size: 'XS', stock: 15, color: 'White' },
      { sku: '1234568191', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568192', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568193', size: 'L', stock: 20, color: 'White' }
    ],
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
      { sku: '1234568194', size: 'XS', stock: 15, color: 'Black' },
      { sku: '1234568195', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568196', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568197', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568198', size: 'XS', stock: 15, color: 'Red' },
      { sku: '1234568199', size: 'S', stock: 25, color: 'Red' },
      { sku: '1234568200', size: 'M', stock: 30, color: 'Red' },
      { sku: '1234568201', size: 'L', stock: 20, color: 'Red' }
    ],
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
      { sku: '1234568202', size: "40", stock: 10, color: "Red" },
      { sku: '1234568203', size: "41", stock: 15, color: "Red" },
      { sku: '1234568204', size: "42", stock: 20, color: "Red" },
      { sku: '1234568205', size: "43", stock: 15, color: "Red" },
      { sku: '1234568206', size: "40", stock: 10, color: "White" },
      { sku: '1234568207', size: "41", stock: 15, color: "White" },
      { sku: '1234568208', size: "42", stock: 20, color: "White" },
      { sku: '1234568209', size: "43", stock: 15, color: "White" }
    ],
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
      { sku: '1234568210', size: "40", stock: 10, color: "White" },
      { sku: '1234568211', size: "41", stock: 15, color: "White" },
      { sku: '1234568212', size: "42", stock: 20, color: "White" },
      { sku: '1234568213', size: "43", stock: 15, color: "White" },
      { sku: '1234568214', size: "40", stock: 10, color: "Black" },
      { sku: '1234568215', size: "41", stock: 15, color: "Black" },
      { sku: '1234568216', size: "42", stock: 20, color: "Black" },
      { sku: '1234568217', size: "43", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568218', size: "40", stock: 10, color: "Red" },
      { sku: '1234568219', size: "41", stock: 15, color: "Red" },
      { sku: '1234568220', size: "42", stock: 20, color: "Red" },
      { sku: '1234568221', size: "43", stock: 15, color: "Red" },
      { sku: '1234568222', size: "40", stock: 10, color: "White" },
      { sku: '1234568223', size: "41", stock: 15, color: "White" },
      { sku: '1234568224', size: "42", stock: 20, color: "White" },
      { sku: '1234568225', size: "43", stock: 15, color: "White" }
    ],
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
      { sku: '1234568226', size: "40", stock: 10, color: "Black" },
      { sku: '1234568227', size: "41", stock: 15, color: "Black" },
      { sku: '1234568228', size: "42", stock: 20, color: "Black" },
      { sku: '1234568229', size: "43", stock: 15, color: "Black" },
      { sku: '1234568230', size: "40", stock: 10, color: "White" },
      { sku: '1234568231', size: "41", stock: 15, color: "White" },
      { sku: '1234568232', size: "42", stock: 20, color: "White" },
      { sku: '1234568233', size: "43", stock: 15, color: "White" }
    ],
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
      { sku: '1234568234', size: "40", stock: 10, color: "Red" },
      { sku: '1234568235', size: "41", stock: 15, color: "Red" },
      { sku: '1234568236', size: "42", stock: 20, color: "Red" },
      { sku: '1234568237', size: "43", stock: 15, color: "Red" },
      { sku: '1234568238', size: "40", stock: 10, color: "Black" },
      { sku: '1234568239', size: "41", stock: 15, color: "Black" },
      { sku: '1234568240', size: "42", stock: 20, color: "Black" },
      { sku: '1234568241', size: "43", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568242', size: '36', stock: 10, color: "Red" },
      { sku: '1234568243', size: '37', stock: 15, color: "Red" },
      { sku: '1234568244', size: '38', stock: 20, color: "Red" },
      { sku: '1234568245', size: '39', stock: 15, color: "Red" },
      { sku: '1234568246', size: '36', stock: 10, color: "White" },
      { sku: '1234568247', size: '37', stock: 15, color: "White" },
      { sku: '1234568248', size: '38', stock: 20, color: "White" },
      { sku: '1234568249', size: '39', stock: 15, color: "White" }
    ],
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
      { sku: '1234568250', size: "36", stock: 10, color: "White" },
      { sku: '1234568251', size: "37", stock: 15, color: "White" },
      { sku: '1234568252', size: "38", stock: 20, color: "White" },
      { sku: '1234568253', size: "39", stock: 15, color: "White" },
      { sku: '1234568254', size: "36", stock: 10, color: "Black" },
      { sku: '1234568255', size: "37", stock: 15, color: "Black" },
      { sku: '1234568256', size: "38", stock: 20, color: "Black" },
      { sku: '1234568257', size: "39", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568258', size: "36", stock: 10, color: "Red" },
      { sku: '1234568259', size: "37", stock: 15, color: "Red" },
      { sku: '1234568260', size: "38", stock: 20, color: "Red" },
      { sku: '1234568261', size: "39", stock: 15, color: "Red" },
      { sku: '1234568262', size: "36", stock: 10, color: "White" },
      { sku: '1234568263', size: "37", stock: 15, color: "White" },
      { sku: '1234568264', size: "38", stock: 20, color: "White" },
      { sku: '1234568265', size: "39", stock: 15, color: "White" }
    ],
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
      { sku: '1234568266', size: "36", stock: 10, color: "Black" },
      { sku: '1234568267', size: "37", stock: 15, color: "Black" },
      { sku: '1234568268', size: "38", stock: 20, color: "Black" },
      { sku: '1234568269', size: "39", stock: 15, color: "Black" },
      { sku: '1234568270', size: "36", stock: 10, color: "White" },
      { sku: '1234568271', size: "37", stock: 15, color: "White" },
      { sku: '1234568272', size: "38", stock: 20, color: "White" },
      { sku: '1234568273', size: "39", stock: 15, color: "White" }
    ],
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
      { sku: '1234568274', size: "36", stock: 10, color: "Red" },
      { sku: '1234568275', size: "37", stock: 15, color: "Red" },
      { sku: '1234568276', size: "38", stock: 20, color: "Red" },
      { sku: '1234568277', size: "39", stock: 15, color: "Red" },
      { sku: '1234568278', size: "36", stock: 10, color: "Black" },
      { sku: '1234568279', size: "37", stock: 15, color: "Black" },
      { sku: '1234568280', size: "38", stock: 20, color: "Black" },
      { sku: '1234568281', size: "39", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568282', size: '40', stock: 10, color: 'White' },
      { sku: '1234568283', size: '41', stock: 10, color: 'White' },
      { sku: '1234568284', size: '42', stock: 10, color: 'White' },
      { sku: '1234568285', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568286', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568287', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568288', size: '40', stock: 10, color: 'Grey' },
      { sku: '1234568289', size: '41', stock: 10, color: 'Grey' },
      { sku: '1234568290', size: '42', stock: 10, color: 'Grey' }
    ],
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
      { sku: '1234568291', size: '40', stock: 10, color: 'White' },
      { sku: '1234568292', size: '41', stock: 10, color: 'White' },
      { sku: '1234568293', size: '42', stock: 10, color: 'White' },
      { sku: '1234568294', size: '40', stock: 10, color: 'Green' },
      { sku: '1234568295', size: '41', stock: 10, color: 'Green' },
      { sku: '1234568296', size: '42', stock: 10, color: 'Green' }
    ],
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
      { sku: '1234568297', size: '36', stock: 10, color: 'Black' },
      { sku: '1234568298', size: '37', stock: 10, color: 'Black' },
      { sku: '1234568299', size: '38', stock: 10, color: 'Black' },
      { sku: '1234568300', size: '36', stock: 10, color: 'White' },
      { sku: '1234568301', size: '37', stock: 10, color: 'White' },
      { sku: '1234568302', size: '38', stock: 10, color: 'White' },
      { sku: '1234568303', size: '36', stock: 10, color: 'Beige' },
      { sku: '1234568304', size: '37', stock: 10, color: 'Beige' },
      { sku: '1234568305', size: '38', stock: 10, color: 'Beige' }
    ],
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
      { sku: '1234568306', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568307', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568308', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568309', size: '40', stock: 10, color: 'White' },
      { sku: '1234568310', size: '41', stock: 10, color: 'White' },
      { sku: '1234568311', size: '42', stock: 10, color: 'White' }
    ],
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
      { sku: '1234568312', size: '40', stock: 15, color: 'White' },
      { sku: '1234568313', size: '41', stock: 20, color: 'White' },
      { sku: '1234568314', size: '42', stock: 25, color: 'White' },
      { sku: '1234568315', size: '43', stock: 15, color: 'White' },
      { sku: '1234568316', size: '40', stock: 15, color: 'Black' },
      { sku: '1234568317', size: '41', stock: 20, color: 'Black' },
      { sku: '1234568318', size: '42', stock: 25, color: 'Black' },
      { sku: '1234568319', size: '43', stock: 15, color: 'Black' }
    ],
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
      { sku: '1234568320', size: '40', stock: 12, color: 'White' },
      { sku: '1234568321', size: '41', stock: 18, color: 'White' },
      { sku: '1234568322', size: '42', stock: 22, color: 'White' },
      { sku: '1234568323', size: '43', stock: 12, color: 'White' },
      { sku: '1234568324', size: '40', stock: 12, color: 'Black' },
      { sku: '1234568325', size: '41', stock: 18, color: 'Black' },
      { sku: '1234568326', size: '42', stock: 22, color: 'Black' },
      { sku: '1234568327', size: '43', stock: 12, color: 'Black' },
      { sku: '1234568328', size: '40', stock: 12, color: 'Navy' },
      { sku: '1234568329', size: '41', stock: 18, color: 'Navy' },
      { sku: '1234568330', size: '42', stock: 22, color: 'Navy' },
      { sku: '1234568331', size: '43', stock: 12, color: 'Navy' }
    ],
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
      { sku: '1234568332', size: '40', stock: 14, color: 'White' },
      { sku: '1234568333', size: '41', stock: 19, color: 'White' },
      { sku: '1234568334', size: '42', stock: 24, color: 'White' },
      { sku: '1234568335', size: '43', stock: 14, color: 'White' },
      { sku: '1234568336', size: '40', stock: 14, color: 'Black' },
      { sku: '1234568337', size: '41', stock: 19, color: 'Black' },
      { sku: '1234568338', size: '42', stock: 24, color: 'Black' },
      { sku: '1234568339', size: '43', stock: 14, color: 'Black' },
      { sku: '1234568340', size: '40', stock: 14, color: 'Red' },
      { sku: '1234568341', size: '41', stock: 19, color: 'Red' },
      { sku: '1234568342', size: '42', stock: 24, color: 'Red' },
      { sku: '1234568343', size: '43', stock: 14, color: 'Red' }
    ],
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
      { sku: '1234568344', size: '40', stock: 16, color: 'White' },
      { sku: '1234568345', size: '41', stock: 21, color: 'White' },
      { sku: '1234568346', size: '42', stock: 26, color: 'White' },
      { sku: '1234568347', size: '43', stock: 16, color: 'White' },
      { sku: '1234568348', size: '40', stock: 16, color: 'Black' },
      { sku: '1234568349', size: '41', stock: 21, color: 'Black' },
      { sku: '1234568350', size: '42', stock: 26, color: 'Black' },
      { sku: '1234568351', size: '43', stock: 16, color: 'Black' },
      { sku: '1234568352', size: '40', stock: 16, color: 'Green' },
      { sku: '1234568353', size: '41', stock: 21, color: 'Green' },
      { sku: '1234568354', size: '42', stock: 26, color: 'Green' },
      { sku: '1234568355', size: '43', stock: 16, color: 'Green' }
    ],
    tags: ['shoes', 'superstar', 'standard'],
    brand: 'Adidas',
    status: 'active'
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
      { sku: '1234568282', size: '40', stock: 10, color: 'White' },
      { sku: '1234568283', size: '41', stock: 10, color: 'White' },
      { sku: '1234568284', size: '42', stock: 10, color: 'White' },
      { sku: '1234568285', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568286', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568287', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568288', size: '40', stock: 10, color: 'Grey' },
      { sku: '1234568289', size: '41', stock: 10, color: 'Grey' },
      { sku: '1234568290', size: '42', stock: 10, color: 'Grey' }
    ],
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
      { sku: '1234568291', size: '40', stock: 10, color: 'White' },
      { sku: '1234568292', size: '41', stock: 10, color: 'White' },
      { sku: '1234568293', size: '42', stock: 10, color: 'White' },
      { sku: '1234568294', size: '40', stock: 10, color: 'Green' },
      { sku: '1234568295', size: '41', stock: 10, color: 'Green' },
      { sku: '1234568296', size: '42', stock: 10, color: 'Green' }
    ],
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
      { sku: '1234568297', size: '36', stock: 10, color: 'Black' },
      { sku: '1234568298', size: '37', stock: 10, color: 'Black' },
      { sku: '1234568299', size: '38', stock: 10, color: 'Black' },
      { sku: '1234568300', size: '36', stock: 10, color: 'White' },
      { sku: '1234568301', size: '37', stock: 10, color: 'White' },
      { sku: '1234568302', size: '38', stock: 10, color: 'White' },
      { sku: '1234568303', size: '36', stock: 10, color: 'Beige' },
      { sku: '1234568304', size: '37', stock: 10, color: 'Beige' },
      { sku: '1234568305', size: '38', stock: 10, color: 'Beige' }
    ],
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
      { sku: '1234568306', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568307', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568308', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568309', size: '40', stock: 10, color: 'White' },
      { sku: '1234568310', size: '41', stock: 10, color: 'White' },
      { sku: '1234568311', size: '42', stock: 10, color: 'White' }
    ],
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
      { sku: '1234568312', size: '40', stock: 15, color: 'White' },
      { sku: '1234568313', size: '41', stock: 20, color: 'White' },
      { sku: '1234568314', size: '42', stock: 25, color: 'White' },
      { sku: '1234568315', size: '43', stock: 15, color: 'White' },
      { sku: '1234568316', size: '40', stock: 15, color: 'Black' },
      { sku: '1234568317', size: '41', stock: 20, color: 'Black' },
      { sku: '1234568318', size: '42', stock: 25, color: 'Black' },
      { sku: '1234568319', size: '43', stock: 15, color: 'Black' }
    ],
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
      { sku: '1234568320', size: '40', stock: 12, color: 'White' },
      { sku: '1234568321', size: '41', stock: 18, color: 'White' },
      { sku: '1234568322', size: '42', stock: 22, color: 'White' },
      { sku: '1234568323', size: '43', stock: 12, color: 'White' },
      { sku: '1234568324', size: '40', stock: 12, color: 'Black' },
      { sku: '1234568325', size: '41', stock: 18, color: 'Black' },
      { sku: '1234568326', size: '42', stock: 22, color: 'Black' },
      { sku: '1234568327', size: '43', stock: 12, color: 'Black' },
      { sku: '1234568328', size: '40', stock: 12, color: 'Navy' },
      { sku: '1234568329', size: '41', stock: 18, color: 'Navy' },
      { sku: '1234568330', size: '42', stock: 22, color: 'Navy' },
      { sku: '1234568331', size: '43', stock: 12, color: 'Navy' }
    ],
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
      { sku: '1234568332', size: '40', stock: 14, color: 'White' },
      { sku: '1234568333', size: '41', stock: 19, color: 'White' },
      { sku: '1234568334', size: '42', stock: 24, color: 'White' },
      { sku: '1234568335', size: '43', stock: 14, color: 'White' },
      { sku: '1234568336', size: '40', stock: 14, color: 'Black' },
      { sku: '1234568337', size: '41', stock: 19, color: 'Black' },
      { sku: '1234568338', size: '42', stock: 24, color: 'Black' },
      { sku: '1234568339', size: '43', stock: 14, color: 'Black' },
      { sku: '1234568340', size: '40', stock: 14, color: 'Red' },
      { sku: '1234568341', size: '41', stock: 19, color: 'Red' },
      { sku: '1234568342', size: '42', stock: 24, color: 'Red' },
      { sku: '1234568343', size: '43', stock: 14, color: 'Red' }
    ],
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
      { sku: '1234568344', size: '40', stock: 16, color: 'White' },
      { sku: '1234568345', size: '41', stock: 21, color: 'White' },
      { sku: '1234568346', size: '42', stock: 26, color: 'White' },
      { sku: '1234568347', size: '43', stock: 16, color: 'White' },
      { sku: '1234568348', size: '40', stock: 16, color: 'Black' },
      { sku: '1234568349', size: '41', stock: 21, color: 'Black' },
      { sku: '1234568350', size: '42', stock: 26, color: 'Black' },
      { sku: '1234568351', size: '43', stock: 16, color: 'Black' },
      { sku: '1234568352', size: '40', stock: 16, color: 'Green' },
      { sku: '1234568353', size: '41', stock: 21, color: 'Green' },
      { sku: '1234568354', size: '42', stock: 26, color: 'Green' },
      { sku: '1234568355', size: '43', stock: 16, color: 'Green' }
    ],
    tags: ['shoes', 'superstar', 'standard'],
    brand: 'Adidas',
    status: 'active'
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
      { sku: '1234568282', size: '40', stock: 10, color: 'White' },
      { sku: '1234568283', size: '41', stock: 10, color: 'White' },
      { sku: '1234568284', size: '42', stock: 10, color: 'White' },
      { sku: '1234568285', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568286', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568287', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568288', size: '40', stock: 10, color: 'Grey' },
      { sku: '1234568289', size: '41', stock: 10, color: 'Grey' },
      { sku: '1234568290', size: '42', stock: 10, color: 'Grey' }
    ],
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
      { sku: '1234568291', size: '40', stock: 10, color: 'White' },
      { sku: '1234568292', size: '41', stock: 10, color: 'White' },
      { sku: '1234568293', size: '42', stock: 10, color: 'White' },
      { sku: '1234568294', size: '40', stock: 10, color: 'Green' },
      { sku: '1234568295', size: '41', stock: 10, color: 'Green' },
      { sku: '1234568296', size: '42', stock: 10, color: 'Green' }
    ],
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
      { sku: '1234568297', size: '36', stock: 10, color: 'Black' },
      { sku: '1234568298', size: '37', stock: 10, color: 'Black' },
      { sku: '1234568299', size: '38', stock: 10, color: 'Black' },
      { sku: '1234568300', size: '36', stock: 10, color: 'White' },
      { sku: '1234568301', size: '37', stock: 10, color: 'White' },
      { sku: '1234568302', size: '38', stock: 10, color: 'White' },
      { sku: '1234568303', size: '36', stock: 10, color: 'Beige' },
      { sku: '1234568304', size: '37', stock: 10, color: 'Beige' },
      { sku: '1234568305', size: '38', stock: 10, color: 'Beige' }
    ],
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
      { sku: '1234568306', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568307', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568308', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568309', size: '40', stock: 10, color: 'White' },
      { sku: '1234568310', size: '41', stock: 10, color: 'White' },
      { sku: '1234568311', size: '42', stock: 10, color: 'White' }
    ],
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
      { sku: '1234568312', size: '40', stock: 15, color: 'White' },
      { sku: '1234568313', size: '41', stock: 20, color: 'White' },
      { sku: '1234568314', size: '42', stock: 25, color: 'White' },
      { sku: '1234568315', size: '43', stock: 15, color: 'White' },
      { sku: '1234568316', size: '40', stock: 15, color: 'Black' },
      { sku: '1234568317', size: '41', stock: 20, color: 'Black' },
      { sku: '1234568318', size: '42', stock: 25, color: 'Black' },
      { sku: '1234568319', size: '43', stock: 15, color: 'Black' }
    ],
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
      { sku: '1234568320', size: '40', stock: 12, color: 'White' },
      { sku: '1234568321', size: '41', stock: 18, color: 'White' },
      { sku: '1234568322', size: '42', stock: 22, color: 'White' },
      { sku: '1234568323', size: '43', stock: 12, color: 'White' },
      { sku: '1234568324', size: '40', stock: 12, color: 'Black' },
      { sku: '1234568325', size: '41', stock: 18, color: 'Black' },
      { sku: '1234568326', size: '42', stock: 22, color: 'Black' },
      { sku: '1234568327', size: '43', stock: 12, color: 'Black' },
      { sku: '1234568328', size: '40', stock: 12, color: 'Navy' },
      { sku: '1234568329', size: '41', stock: 18, color: 'Navy' },
      { sku: '1234568330', size: '42', stock: 22, color: 'Navy' },
      { sku: '1234568331', size: '43', stock: 12, color: 'Navy' }
    ],
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
      { sku: '1234568332', size: '40', stock: 14, color: 'White' },
      { sku: '1234568333', size: '41', stock: 19, color: 'White' },
      { sku: '1234568334', size: '42', stock: 24, color: 'White' },
      { sku: '1234568335', size: '43', stock: 14, color: 'White' },
      { sku: '1234568336', size: '40', stock: 14, color: 'Black' },
      { sku: '1234568337', size: '41', stock: 19, color: 'Black' },
      { sku: '1234568338', size: '42', stock: 24, color: 'Black' },
      { sku: '1234568339', size: '43', stock: 14, color: 'Black' },
      { sku: '1234568340', size: '40', stock: 14, color: 'Red' },
      { sku: '1234568341', size: '41', stock: 19, color: 'Red' },
      { sku: '1234568342', size: '42', stock: 24, color: 'Red' },
      { sku: '1234568343', size: '43', stock: 14, color: 'Red' }
    ],
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
      { sku: '1234568344', size: '40', stock: 16, color: 'White' },
      { sku: '1234568345', size: '41', stock: 21, color: 'White' },
      { sku: '1234568346', size: '42', stock: 26, color: 'White' },
      { sku: '1234568347', size: '43', stock: 16, color: 'White' },
      { sku: '1234568348', size: '40', stock: 16, color: 'Black' },
      { sku: '1234568349', size: '41', stock: 21, color: 'Black' },
      { sku: '1234568350', size: '42', stock: 26, color: 'Black' },
      { sku: '1234568351', size: '43', stock: 16, color: 'Black' },
      { sku: '1234568352', size: '40', stock: 16, color: 'Green' },
      { sku: '1234568353', size: '41', stock: 21, color: 'Green' },
      { sku: '1234568354', size: '42', stock: 26, color: 'Green' },
      { sku: '1234568355', size: '43', stock: 16, color: 'Green' }
    ],
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
      { sku: '1234568356', size: '40', stock: 10, color: 'White' },
      { sku: '1234568357', size: '41', stock: 10, color: 'White' },
      { sku: '1234568358', size: '42', stock: 10, color: 'White' },
      { sku: '1234568359', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568360', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568361', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568362', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568363', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568364', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568365', size: '40', stock: 10, color: 'White' },
      { sku: '1234568366', size: '41', stock: 10, color: 'White' },
      { sku: '1234568367', size: '42', stock: 10, color: 'White' },
      { sku: '1234568368', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568369', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568370', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568371', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568372', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568373', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568374', size: '40', stock: 10, color: 'White' },
      { sku: '1234568375', size: '41', stock: 10, color: 'White' },
      { sku: '1234568376', size: '42', stock: 10, color: 'White' },
      { sku: '1234568377', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568378', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568379', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568380', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568381', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568382', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568383', size: '40', stock: 10, color: 'White' },
      { sku: '1234568384', size: '41', stock: 10, color: 'White' },
      { sku: '1234568385', size: '42', stock: 10, color: 'White' },
      { sku: '1234568386', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568387', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568388', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568389', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568390', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568391', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568392', size: '40', stock: 10, color: 'White' },
      { sku: '1234568393', size: '41', stock: 10, color: 'White' },
      { sku: '1234568394', size: '42', stock: 10, color: 'White' },
      { sku: '1234568395', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568396', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568397', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568398', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568399', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568400', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568401', size: '40', stock: 10, color: 'White' },
      { sku: '1234568402', size: '41', stock: 10, color: 'White' },
      { sku: '1234568403', size: '42', stock: 10, color: 'White' },
      { sku: '1234568404', size: '40', stock: 10, color: 'Black' },
      { sku: '1234568405', size: '41', stock: 10, color: 'Black' },
      { sku: '1234568406', size: '42', stock: 10, color: 'Black' },
      { sku: '1234568407', size: '40', stock: 10, color: 'Red' },
      { sku: '1234568408', size: '41', stock: 10, color: 'Red' },
      { sku: '1234568409', size: '42', stock: 10, color: 'Red' }
    ],
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
      { sku: '1234568410', size: "36", stock: 10, color: "Black" },
      { sku: '1234568411', size: "37", stock: 15, color: "Black" },
      { sku: '1234568412', size: "38", stock: 20, color: "Black" },
      { sku: '1234568413', size: "39", stock: 15, color: "Black" },
      { sku: '1234568414', size: "36", stock: 10, color: "White" },
      { sku: '1234568415', size: "37", stock: 15, color: "White" },
      { sku: '1234568416', size: "38", stock: 20, color: "White" },
      { sku: '1234568417', size: "39", stock: 15, color: "White" }
    ],
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
      { sku: '1234568418', size: "36", stock: 10, color: "Black" },
      { sku: '1234568419', size: "37", stock: 15, color: "Black" },
      { sku: '1234568420', size: "38", stock: 20, color: "Black" },
      { sku: '1234568421', size: "39", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568422', size: "36", stock: 10, color: "Green" },
      { sku: '1234568423', size: "37", stock: 15, color: "Green" },
      { sku: '1234568424', size: "38", stock: 20, color: "Green" },
      { sku: '1234568425', size: "39", stock: 15, color: "Green" },
      { sku: '1234568426', size: "36", stock: 10, color: "Blue" },
      { sku: '1234568427', size: "37", stock: 15, color: "Blue" },
      { sku: '1234568428', size: "38", stock: 20, color: "Blue" },
      { sku: '1234568429', size: "39", stock: 15, color: "Blue" },
      { sku: '1234568430', size: "36", stock: 10, color: "Black" },
      { sku: '1234568431', size: "37", stock: 15, color: "Black" },
      { sku: '1234568432', size: "38", stock: 20, color: "Black" },
      { sku: '1234568433', size: "39", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568434', size: "36", stock: 10, color: "White" },
      { sku: '1234568435', size: "37", stock: 15, color: "White" },
      { sku: '1234568436', size: "38", stock: 20, color: "White" },
      { sku: '1234568437', size: "39", stock: 15, color: "White" },
      { sku: '1234568438', size: "36", stock: 10, color: "Yellow" },
      { sku: '1234568439', size: "37", stock: 15, color: "Yellow" },
      { sku: '1234568440', size: "38", stock: 20, color: "Yellow" },
      { sku: '1234568441', size: "39", stock: 15, color: "Yellow" }
    ],
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
      { sku: '1234568442', size: "36", stock: 10, color: "Burgundy" },
      { sku: '1234568443', size: "37", stock: 15, color: "Burgundy" },
      { sku: '1234568444', size: "38", stock: 20, color: "Burgundy" },
      { sku: '1234568445', size: "39", stock: 15, color: "Burgundy" },
      { sku: '1234568446', size: "36", stock: 10, color: "Green" },
      { sku: '1234568447', size: "37", stock: 15, color: "Green" },
      { sku: '1234568448', size: "38", stock: 20, color: "Green" },
      { sku: '1234568449', size: "39", stock: 15, color: "Green" },
      { sku: '1234568450', size: "36", stock: 10, color: "Blue" },
      { sku: '1234568451', size: "37", stock: 15, color: "Blue" },
      { sku: '1234568452', size: "38", stock: 20, color: "Blue" },
      { sku: '1234568453', size: "39", stock: 15, color: "Blue" }
    ],
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
      { sku: '1234568454', size: "40", stock: 10, color: "Pink" },
      { sku: '1234568455', size: "41", stock: 15, color: "Pink" },
      { sku: '1234568456', size: "42", stock: 20, color: "Pink" },
      { sku: '1234568457', size: "43", stock: 15, color: "Pink" },
      { sku: '1234568458', size: "40", stock: 10, color: "Green" },
      { sku: '1234568459', size: "41", stock: 15, color: "Green" },
      { sku: '1234568460', size: "42", stock: 20, color: "Green" },
      { sku: '1234568461', size: "43", stock: 15, color: "Green" },
      { sku: '1234568462', size: "40", stock: 10, color: "Black" },
      { sku: '1234568463', size: "41", stock: 15, color: "Black" },
      { sku: '1234568464', size: "42", stock: 20, color: "Black" },
      { sku: '1234568465', size: "43", stock: 15, color: "Black" },
      { sku: '1234568466', size: "40", stock: 10, color: "Navy" },
      { sku: '1234568467', size: "41", stock: 15, color: "Navy" },
      { sku: '1234568468', size: "42", stock: 20, color: "Navy" },
      { sku: '1234568469', size: "43", stock: 15, color: "Navy" }
    ],
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
      { sku: '1234568470', size: "40", stock: 10, color: "Green" },
      { sku: '1234568471', size: "41", stock: 15, color: "Green" },
      { sku: '1234568472', size: "42", stock: 20, color: "Green" },
      { sku: '1234568473', size: "43", stock: 15, color: "Green" },
      { sku: '1234568474', size: "40", stock: 10, color: "Yellow" },
      { sku: '1234568475', size: "41", stock: 15, color: "Yellow" },
      { sku: '1234568476', size: "42", stock: 20, color: "Yellow" },
      { sku: '1234568477', size: "43", stock: 15, color: "Yellow" },
      { sku: '1234568478', size: "40", stock: 10, color: "Navy" },
      { sku: '1234568479', size: "41", stock: 15, color: "Navy" },
      { sku: '1234568480', size: "42", stock: 20, color: "Navy" },
      { sku: '1234568481', size: "43", stock: 15, color: "Navy" }
    ],
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
      { sku: '1234568482', size: "40", stock: 10, color: "White" },
      { sku: '1234568483', size: "41", stock: 15, color: "White" },
      { sku: '1234568484', size: "42", stock: 20, color: "White" },
      { sku: '1234568485', size: "43", stock: 15, color: "White" },
      { sku: '1234568486', size: "40", stock: 10, color: "Black" },
      { sku: '1234568487', size: "41", stock: 15, color: "Black" },
      { sku: '1234568488', size: "42", stock: 20, color: "Black" },
      { sku: '1234568489', size: "43", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568490', size: "40", stock: 10, color: "Grey" },
      { sku: '1234568491', size: "41", stock: 15, color: "Grey" },
      { sku: '1234568492', size: "42", stock: 20, color: "Grey" },
      { sku: '1234568493', size: "43", stock: 15, color: "Grey" },
      { sku: '1234568494', size: "40", stock: 10, color: "Black" },
      { sku: '1234568495', size: "41", stock: 15, color: "Black" },
      { sku: '1234568496', size: "42", stock: 20, color: "Black" },
      { sku: '1234568497', size: "43", stock: 15, color: "Black" }
    ],
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
      { sku: '1234568498', size: "40", stock: 10, color: "Sky Blue" },
      { sku: '1234568499', size: "41", stock: 15, color: "Sky Blue" },
      { sku: '1234568500', size: "42", stock: 20, color: "Sky Blue" },
      { sku: '1234568501', size: "43", stock: 15, color: "Sky Blue" },
      { sku: '1234568502', size: "40", stock: 10, color: "Yellow" },
      { sku: '1234568503', size: "41", stock: 15, color: "Yellow" },
      { sku: '1234568504', size: "42", stock: 20, color: "Yellow" },
      { sku: '1234568505', size: "43", stock: 15, color: "Yellow" },
      { sku: '1234568506', size: "40", stock: 10, color: "Black Sky Blue" },
      { sku: '1234568507', size: "41", stock: 15, color: "Black Sky Blue" },
      { sku: '1234568508', size: "42", stock: 20, color: "Black Sky Blue" },
      { sku: '1234568509', size: "43", stock: 15, color: "Black Sky Blue" },
      { sku: '1234568510', size: "40", stock: 10, color: "Green" },
      { sku: '1234568511', size: "41", stock: 15, color: "Green" },
      { sku: '1234568512', size: "42", stock: 20, color: "Green" },
      { sku: '1234568513', size: "43", stock: 15, color: "Green" },
      { sku: '1234568514', size: "40", stock: 10, color: "Orange" },
      { sku: '1234568515', size: "41", stock: 15, color: "Orange" },
      { sku: '1234568516', size: "42", stock: 20, color: "Orange" },
      { sku: '1234568517', size: "43", stock: 15, color: "Orange" }
    ],
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
      { sku: '1234568518', size: "40", stock: 10, color: "Teal" },
      { sku: '1234568519', size: "41", stock: 15, color: "Teal" },
      { sku: '1234568520', size: "42", stock: 20, color: "Teal" },
      { sku: '1234568521', size: "43", stock: 15, color: "Teal" }
    ],
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
      { sku: '1234568522', size: "40", stock: 10, color: "White" },
      { sku: '1234568523', size: "41", stock: 15, color: "White" },
      { sku: '1234568524', size: "42", stock: 20, color: "White" },
      { sku: '1234568525', size: "43", stock: 15, color: "White" }
    ],
    tags: ["shoes", "adizero", "adios", "pro4"],
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
      { sku: '1234568526', size: "40", stock: 10, color: "Golden" },
      { sku: '1234568527', size: "41", stock: 15, color: "Golden" },
      { sku: '1234568528', size: "42", stock: 20, color: "Golden" },
      { sku: '1234568529', size: "43", stock: 15, color: "Golden" }
    ],
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
      { sku: '1234568530', size: "40", stock: 10, color: "Black" },
      { sku: '1234568531', size: "41", stock: 15, color: "Black" },
      { sku: '1234568532', size: "42", stock: 20, color: "Black" },
      { sku: '1234568533', size: "43", stock: 15, color: "Black" }
    ],
    tags: ["shoes", "adizero", "evosl"],
    brand: "Adidas",
    status: "active"
  },
  // Hoodie Products
  {
    name: "Future Icons 3 Bar Logo Hoodie",
    description: "Premium hoodie featuring the iconic 3 Bar Logo design. Made with high-quality materials for ultimate comfort and style.",
    price: 2899000,
    discountPrice: 2599000,
    categoryPath: ['Men', 'Adidas', 'Hoodies'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752591255/Future_Icons_3_Bar_Logo_Hoodie_Brown_JW7168_21_model_bj1cn7.avif'],
    sizes: [
      { sku: '1234568534', size: 'S', stock: 20, color: 'Brown' },
      { sku: '1234568535', size: 'M', stock: 25, color: 'Brown' },
      { sku: '1234568536', size: 'L', stock: 20, color: 'Brown' },
      { sku: '1234568537', size: 'XL', stock: 15, color: 'Brown' }
    ],
    tags: ['hoodie', 'adidas', 'future-icons', '3-bar-logo', 'brown'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Essentials 3-Stripes French Terry Full-Zip Hoodie",
    description: "Classic essentials hoodie with 3-stripes design. French terry construction for superior comfort and durability.",
    price: 2699000,
    discountPrice: 2399000,
    categoryPath: ['Men', 'Adidas', 'Hoodies'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752591255/Essentials_3-Stripes_French_Terry_Full-Zip_Hoodie_Grey_JE6338_21_model_pfnakv.avif'],
    sizes: [
      { sku: '1234568538', size: 'S', stock: 15, color: 'Grey' },
      { sku: '1234568539', size: 'M', stock: 20, color: 'Grey' },
      { sku: '1234568540', size: 'L', stock: 18, color: 'Grey' },
      { sku: '1234568541', size: 'XL', stock: 12, color: 'Grey' },
      { sku: '1234568542', size: 'S', stock: 15, color: 'Black' },
      { sku: '1234568543', size: 'M', stock: 20, color: 'Black' },
      { sku: '1234568544', size: 'L', stock: 18, color: 'Black' },
      { sku: '1234568545', size: 'XL', stock: 12, color: 'Black' }
    ],
    tags: ['hoodie', 'adidas', 'essentials', '3-stripes', 'french-terry', 'full-zip', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Elevated ALL SZN Terry Loop Hoodie",
    description: "Elevated comfort hoodie with terry loop construction. Perfect for all seasons with premium materials and modern design.",
    price: 2999000,
    discountPrice: 2699000,
    categoryPath: ['Men', 'Adidas', 'Hoodies'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752591255/Elevated_ALL_SZN_Terry_Loop_Hoodie_Black_IV5212_21_model_wtlnh6.avif'],
    sizes: [
      { sku: '1234568546', size: 'S', stock: 18, color: 'Black' },
      { sku: '1234568547', size: 'M', stock: 22, color: 'Black' },
      { sku: '1234568548', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568549', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568550', size: 'S', stock: 18, color: 'Grey' },
      { sku: '1234568551', size: 'M', stock: 22, color: 'Grey' },
      { sku: '1234568552', size: 'L', stock: 20, color: 'Grey' },
      { sku: '1234568553', size: 'XL', stock: 15, color: 'Grey' },
      { sku: '1234568554', size: 'S', stock: 18, color: 'White' },
      { sku: '1234568555', size: 'M', stock: 22, color: 'White' },
      { sku: '1234568556', size: 'L', stock: 20, color: 'White' },
      { sku: '1234568557', size: 'XL', stock: 15, color: 'White' }
    ],
    tags: ['hoodie', 'adidas', 'elevated', 'terry-loop', 'all-season', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Z.N.E. Full-Zip Hoodie",
    description: "Zero Negative Energy hoodie with full-zip design. Premium comfort and style for active lifestyle.",
    price: 2799000,
    discountPrice: 2499000,
    categoryPath: ['Men', 'Adidas', 'Hoodies'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752591254/Z.N.E._Full-Zip_Hoodie_White_JF2443_21_model_r1cpxj.avif'],
    sizes: [
      { sku: '1234568558', size: 'S', stock: 16, color: 'White' },
      { sku: '1234568559', size: 'M', stock: 21, color: 'White' },
      { sku: '1234568560', size: 'L', stock: 19, color: 'White' },
      { sku: '1234568561', size: 'XL', stock: 14, color: 'White' },
      { sku: '1234568562', size: 'S', stock: 16, color: 'Green' },
      { sku: '1234568563', size: 'M', stock: 21, color: 'Green' },
      { sku: '1234568564', size: 'L', stock: 19, color: 'Green' },
      { sku: '1234568565', size: 'XL', stock: 14, color: 'Green' },
      { sku: '1234568566', size: 'S', stock: 16, color: 'Black' },
      { sku: '1234568567', size: 'M', stock: 21, color: 'Black' },
      { sku: '1234568568', size: 'L', stock: 19, color: 'Black' },
      { sku: '1234568569', size: 'XL', stock: 14, color: 'Black' }
    ],
    tags: ['hoodie', 'adidas', 'z.n.e', 'full-zip', 'white', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  // Women Jacket/Vest Products
  {
    name: "Clot Crochet Vest by Edison Chen",
    description: "Exclusive collaboration vest by Edison Chen featuring unique crochet design. Premium comfort and stylish appearance.",
    price: 3299000,
    discountPrice: 2999000,
    categoryPath: ['Women', 'Adidas', 'Jackets'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752594828/Clot_Crochet_Vest_by_Edison_Chen_Green_JP1606_21_model_xkn8fc.avif'],
    sizes: [
      { sku: '1234568570', size: 'XS', stock: 12, color: 'Green' },
      { sku: '1234568571', size: 'S', stock: 18, color: 'Green' },
      { sku: '1234568572', size: 'M', stock: 22, color: 'Green' },
      { sku: '1234568573', size: 'L', stock: 16, color: 'Green' }
    ],
    tags: ['vest', 'adidas', 'clot', 'edison-chen', 'crochet', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "City Escape Lightweight Windbreaker",
    description: "Lightweight windbreaker perfect for city adventures. Breathable and stylish design for active women.",
    price: 2899000,
    discountPrice: 2599000,
    categoryPath: ['Women', 'Adidas', 'Jackets'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752594830/City_Escape_Lightweight_Windbreaker_Grey_JF3403_21_model_fmvniw.avif'],
    sizes: [
      { sku: '1234568574', size: 'XS', stock: 15, color: 'Grey' },
      { sku: '1234568575', size: 'S', stock: 20, color: 'Grey' },
      { sku: '1234568576', size: 'M', stock: 25, color: 'Grey' },
      { sku: '1234568577', size: 'L', stock: 18, color: 'Grey' }
    ],
    tags: ['windbreaker', 'adidas', 'city-escape', 'lightweight', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Own The Run Spray Dye Vest",
    description: "Unique spray dye vest for runners. Eye-catching design with premium comfort for active lifestyle.",
    price: 2699000,
    discountPrice: 2399000,
    categoryPath: ['Women', 'Adidas', 'Jackets'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752594831/Own_The_Run_Spray_Dye_Vest_Grey_JL8726_21_model_pccabo.avif'],
    sizes: [
      { sku: '1234568578', size: 'XS', stock: 14, color: 'Grey' },
      { sku: '1234568579', size: 'S', stock: 19, color: 'Grey' },
      { sku: '1234568580', size: 'M', stock: 23, color: 'Grey' },
      { sku: '1234568581', size: 'L', stock: 17, color: 'Grey' }
    ],
    tags: ['vest', 'adidas', 'own-the-run', 'spray-dye', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "WIND.RDY Hyperglam Windbreaker",
    description: "Hyperglam windbreaker with WIND.RDY technology. Stylish and functional for all weather conditions.",
    price: 3099000,
    discountPrice: 2799000,
    categoryPath: ['Women', 'Adidas', 'Jackets'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752594828/WIND.RDY_Hyperglam_Windbreaker_Purple_IX3213_21_model_rbwfv0.avif'],
    sizes: [
      { sku: '1234568582', size: 'XS', stock: 13, color: 'Purple' },
      { sku: '1234568583', size: 'S', stock: 18, color: 'Purple' },
      { sku: '1234568584', size: 'M', stock: 22, color: 'Purple' },
      { sku: '1234568585', size: 'L', stock: 16, color: 'Purple' },
      { sku: '1234568586', size: 'XS', stock: 13, color: 'Green' },
      { sku: '1234568587', size: 'S', stock: 18, color: 'Green' },
      { sku: '1234568588', size: 'M', stock: 22, color: 'Green' },
      { sku: '1234568589', size: 'L', stock: 16, color: 'Green' },
      { sku: '1234568590', size: 'XS', stock: 13, color: 'Black' },
      { sku: '1234568591', size: 'S', stock: 18, color: 'Black' },
      { sku: '1234568592', size: 'M', stock: 22, color: 'Black' },
      { sku: '1234568593', size: 'L', stock: 16, color: 'Black' }
    ],
    tags: ['windbreaker', 'adidas', 'wind-rdy', 'hyperglam', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  // Kids Products
  {
    name: "Smiley World Cap Kids",
    description: "Fun and colorful cap featuring the iconic Smiley World design. Perfect for kids who love to express their personality.",
    price: 899000,
    discountPrice: 799000,
    categoryPath: ['Kids', 'Adidas', 'Smiley World'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752595934/Smiley_World_Cap_Kids_Blue_JG5803_01_00_standard_qnqeqw.avif'],
    sizes: [
      { sku: '1234568594', size: '4-5Y', stock: 25, color: 'Blue' },
      { sku: '1234568595', size: '6-7Y', stock: 30, color: 'Blue' },
      { sku: '1234568596', size: '8-9Y', stock: 25, color: 'Blue' },
      { sku: '1234568597', size: '10-11Y', stock: 20, color: 'Blue' }
    ],
    tags: ['cap', 'adidas', 'smiley-world', 'kids', 'blue'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Advantage 2.0 Shoes",
    description: "Comfortable and durable shoes perfect for active kids. Lightweight design with excellent support for daily activities.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ['Kids', 'Adidas', 'Smiley World'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752595930/Advantage_2.0_Shoes_White_IH6251_01_00_standard_xxp8ce.avif'],
    sizes: [
      { sku: '1234568598', size: '4-5Y', stock: 20, color: 'White' },
      { sku: '1234568599', size: '6-7Y', stock: 25, color: 'White' },
      { sku: '1234568600', size: '8-9Y', stock: 22, color: 'White' },
      { sku: '1234568601', size: '10-11Y', stock: 18, color: 'White' }
    ],
    tags: ['shoes', 'adidas', 'advantage', 'kids', 'white'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "adidas Originals x Smiley Kids Backpack",
    description: "Collaboration backpack featuring the iconic Smiley design. Spacious and comfortable for school and outdoor activities.",
    price: 1299000,
    discountPrice: 1099000,
    categoryPath: ['Kids', 'Adidas', 'Smiley World'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752595932/adidas_Originals_x_Smiley_Kids_Backpack_Black_JC8521_01_00_standard_lvyt9s.avif'],
    sizes: [
      { sku: '1234568602', size: '4-5Y', stock: 15, color: 'Black' },
      { sku: '1234568603', size: '6-7Y', stock: 20, color: 'Black' },
      { sku: '1234568604', size: '8-9Y', stock: 18, color: 'Black' },
      { sku: '1234568605', size: '10-11Y', stock: 15, color: 'Black' }
    ],
    tags: ['backpack', 'adidas', 'originals', 'smiley', 'kids'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Smiley World Backpack Kids",
    description: "Vibrant and fun backpack with Smiley World design. Perfect size for kids with comfortable straps and multiple compartments.",
    price: 1199000,
    discountPrice: 999000,
    categoryPath: ['Kids', 'Adidas', 'Smiley World'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1752595931/Smiley_World_Backpack_Kids_Multicolor_JH3417_01_00_standard_ig9ouc.avif'],
    sizes: [
      { sku: '1234568606', size: '4-5Y', stock: 18, color: 'Blue' },
      { sku: '1234568607', size: '6-7Y', stock: 22, color: 'Blue' },
      { sku: '1234568608', size: '8-9Y', stock: 20, color: 'Blue' },
      { sku: '1234568609', size: '10-11Y', stock: 16, color: 'Blue' }
    ],
    tags: ['backpack', 'adidas', 'smiley-world', 'kids', 'blue', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  // Men's Socks Products
  {
    name: "Cushioned Sportswear Ankle Socks 3 Pairs",
    description: "Comfortable ankle socks with cushioned sole for maximum comfort during sports and daily activities. Available in Black and White.",
    price: 399000,
    discountPrice: 359000,
    categoryPath: ['Accessories', 'Men', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093482/Cushioned_Sportswear_Ankle_Socks_3_Pairs_Black_IA3947_03_standard_glsyjp.avif'],
    sizes: [
      { sku: '1234568610', size: 'S', stock: 30, color: 'Black' },
      { sku: '1234568611', size: 'M', stock: 35, color: 'Black' },
      { sku: '1234568612', size: 'L', stock: 25, color: 'Black' },
      { sku: '1234568613', size: 'XL', stock: 20, color: 'Black' },
      { sku: '1234568614', size: 'S', stock: 30, color: 'White' },
      { sku: '1234568615', size: 'M', stock: 35, color: 'White' },
      { sku: '1234568616', size: 'L', stock: 25, color: 'White' },
      { sku: '1234568617', size: 'XL', stock: 20, color: 'White' }
    ],
    tags: ['socks', 'adidas', 'cushioned', 'ankle', 'sportswear', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Cushioned Sportswear Crew Socks 6 Pairs",
    description: "Premium crew socks with cushioned sole for ultimate comfort. Perfect for sports and everyday wear. Available in Black and White.",
    price: 599000,
    discountPrice: 539000,
    categoryPath: ['Accessories', 'Men', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093480/Cushioned_Sportswear_Crew_Socks_6_Pairs_Black_IC1316_03_standard_pnv0bu.avif'],
    sizes: [
      { sku: '1234568618', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568619', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568620', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568621', size: 'XL', stock: 15, color: 'Black' },
      { sku: '1234568622', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568623', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568624', size: 'L', stock: 20, color: 'White' },
      { sku: '1234568625', size: 'XL', stock: 15, color: 'White' }
    ],
    tags: ['socks', 'adidas', 'cushioned', 'crew', 'sportswear', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Essentials CLIMACOOL Low Cut Socks 3 Pairs",
    description: "Low cut socks with CLIMACOOL technology for breathability and comfort. Perfect for casual and sports activities. Available in Black and White.",
    price: 449000,
    discountPrice: 399000,
    categoryPath: ['Accessories', 'Men', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093477/Essentials_CLIMACOOL_Low_Cut_Socks_3_Pairs_White_JD9573_01_04_standard_tvrtyh.avif'],
    sizes: [
      { sku: '1234568626', size: 'S', stock: 28, color: 'White' },
      { sku: '1234568627', size: 'M', stock: 32, color: 'White' },
      { sku: '1234568628', size: 'L', stock: 22, color: 'White' },
      { sku: '1234568629', size: 'XL', stock: 18, color: 'White' },
      { sku: '1234568630', size: 'S', stock: 28, color: 'Black' },
      { sku: '1234568631', size: 'M', stock: 32, color: 'Black' },
      { sku: '1234568632', size: 'L', stock: 22, color: 'Black' },
      { sku: '1234568633', size: 'XL', stock: 18, color: 'Black' }
    ],
    tags: ['socks', 'adidas', 'essentials', 'climacool', 'low-cut', 'men', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Mid Cut Crew Socks 3 Pairs",
    description: "Mid cut crew socks with comfortable fit and durable construction. Ideal for daily wear and light sports activities. Available in Black and White.",
    price: 399000,
    discountPrice: 359000,
    categoryPath: ['Accessories', 'Men', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093481/Mid_Cut_Crew_Socks_3_Pairs_White_IJ0733_01_01_00_standard_b3j0iv.avif'],
    sizes: [
      { sku: '1234568634', size: 'S', stock: 26, color: 'White' },
      { sku: '1234568635', size: 'M', stock: 30, color: 'White' },
      { sku: '1234568636', size: 'L', stock: 24, color: 'White' },
      { sku: '1234568637', size: 'XL', stock: 20, color: 'White' },
      { sku: '1234568638', size: 'S', stock: 26, color: 'Black' },
      { sku: '1234568639', size: 'M', stock: 30, color: 'Black' },
      { sku: '1234568640', size: 'L', stock: 24, color: 'Black' },
      { sku: '1234568641', size: 'XL', stock: 20, color: 'Black' }
    ],
    tags: ['socks', 'adidas', 'mid-cut', 'crew', 'men'],
    brand: 'Adidas',
    status: 'active'
  },
  // Women's Socks Products (same products for women)
  {
    name: "Cushioned Sportswear Ankle Socks 3 Pairs",
    description: "Comfortable ankle socks with cushioned sole for maximum comfort during sports and daily activities. Available in Black and White.",
    price: 399000,
    discountPrice: 359000,
    categoryPath: ['Accessories', 'Women', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093482/Cushioned_Sportswear_Ankle_Socks_3_Pairs_Black_IA3947_03_standard_glsyjp.avif'],
    sizes: [
      { sku: '1234568642', size: 'XS', stock: 25, color: 'Black' },
      { sku: '1234568643', size: 'S', stock: 30, color: 'Black' },
      { sku: '1234568644', size: 'M', stock: 25, color: 'Black' },
      { sku: '1234568645', size: 'L', stock: 20, color: 'Black' },
      { sku: '1234568646', size: 'XS', stock: 25, color: 'White' },
      { sku: '1234568647', size: 'S', stock: 30, color: 'White' },
      { sku: '1234568648', size: 'M', stock: 25, color: 'White' },
      { sku: '1234568649', size: 'L', stock: 20, color: 'White' }
    ],
    tags: ['socks', 'adidas', 'cushioned', 'ankle', 'sportswear', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Cushioned Sportswear Crew Socks 6 Pairs",
    description: "Premium crew socks with cushioned sole for ultimate comfort. Perfect for sports and everyday wear. Available in Black and White.",
    price: 599000,
    discountPrice: 539000,
    categoryPath: ['Accessories', 'Women', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093480/Cushioned_Sportswear_Crew_Socks_6_Pairs_Black_IC1316_03_standard_pnv0bu.avif'],
    sizes: [
      { sku: '1234568650', size: 'XS', stock: 20, color: 'Black' },
      { sku: '1234568651', size: 'S', stock: 25, color: 'Black' },
      { sku: '1234568652', size: 'M', stock: 20, color: 'Black' },
      { sku: '1234568653', size: 'L', stock: 15, color: 'Black' },
      { sku: '1234568654', size: 'XS', stock: 20, color: 'White' },
      { sku: '1234568655', size: 'S', stock: 25, color: 'White' },
      { sku: '1234568656', size: 'M', stock: 20, color: 'White' },
      { sku: '1234568657', size: 'L', stock: 15, color: 'White' }
    ],
    tags: ['socks', 'adidas', 'cushioned', 'crew', 'sportswear', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
    name: "Essentials CLIMACOOL Low Cut Socks 3 Pairs",
    description: "Low cut socks with CLIMACOOL technology for breathability and comfort. Perfect for casual and sports activities. Available in Black and White.",
    price: 449000,
    discountPrice: 399000,
    categoryPath: ['Accessories', 'Women', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093477/Essentials_CLIMACOOL_Low_Cut_Socks_3_Pairs_White_JD9573_01_04_standard_tvrtyh.avif'],
    sizes: [
      { sku: '1234568658', size: 'XS', stock: 22, color: 'White' },
      { sku: '1234568659', size: 'S', stock: 28, color: 'White' },
      { sku: '1234568660', size: 'M', stock: 22, color: 'White' },
      { sku: '1234568661', size: 'L', stock: 18, color: 'White' },
      { sku: '1234568662', size: 'XS', stock: 22, color: 'Black' },
      { sku: '1234568663', size: 'S', stock: 28, color: 'Black' },
      { sku: '1234568664', size: 'M', stock: 22, color: 'Black' },
      { sku: '1234568665', size: 'L', stock: 18, color: 'Black' }
    ],
    tags: ['socks', 'adidas', 'essentials', 'climacool', 'low-cut', 'women'],
    brand: 'Adidas',
    status: 'active'
  },
  {
        name: "Mid Cut Crew Socks 3 Pairs",
    description: "Mid cut crew socks with comfortable fit and durable construction. Ideal for daily wear and light sports activities. Available in Black and White.",
    price: 399000,
    discountPrice: 359000,
    categoryPath: ['Accessories', 'Women', 'Socks'],
    images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093481/Mid_Cut_Crew_Socks_3_Pairs_White_IJ0733_01_01_00_standard_b3j0iv.avif'],
    sizes: [
      { sku: '1234568666', size: 'XS', stock: 24, color: 'White' },
      { sku: '1234568667', size: 'S', stock: 28, color: 'White' },
      { sku: '1234568668', size: 'M', stock: 24, color: 'White' },
      { sku: '1234568669', size: 'L', stock: 20, color: 'White' },
      { sku: '1234568670', size: 'XS', stock: 24, color: 'Black' },
      { sku: '1234568671', size: 'S', stock: 28, color: 'Black' },
      { sku: '1234568672', size: 'M', stock: 24, color: 'Black' },
      { sku: '1234568673', size: 'L', stock: 20, color: 'Black' }
    ],
    tags: ['socks', 'adidas', 'mid-cut', 'crew', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   // Men's Bags Products
   {
     name: "Adicolor Archive Backpack",
     description: "Classic archive backpack with modern design and comfortable straps. Perfect for daily use and outdoor activities. Available in Turquoise and Red.",
     price: 899000,
     discountPrice: 799000,
     categoryPath: ['Accessories', 'Men', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093464/Adicolor_Archive_Backpack_Turquoise_IQ3514_01_standard_idiuew.avif'],
     sizes: [
       { sku: '1234568674', size: 'S', stock: 15, color: 'Turquoise' },
       { sku: '1234568675', size: 'M', stock: 20, color: 'Turquoise' },
       { sku: '1234568676', size: 'L', stock: 15, color: 'Turquoise' },
       { sku: '1234568677', size: 'XL', stock: 10, color: 'Turquoise' },
       { sku: '1234568678', size: 'S', stock: 12, color: 'Red' },
       { sku: '1234568679', size: 'M', stock: 18, color: 'Red' },
       { sku: '1234568680', size: 'L', stock: 12, color: 'Red' },
       { sku: '1234568681', size: 'XL', stock: 8, color: 'Red' }
     ],
     tags: ['backpack', 'adidas', 'adicolor', 'archive', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Adicolor Backpack",
     description: "Versatile backpack with classic Adicolor design. Spacious interior with multiple compartments for organization. Available in White, Burgundy, Blue, and Green.",
     price: 799000,
     discountPrice: 699000,
     categoryPath: ['Accessories', 'Men', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093464/Adicolor_Backpack_White_IX7459_01_standard_dhicw1.avif'],
     sizes: [
       { sku: '1234568682', size: 'S', stock: 20, color: 'White' },
       { sku: '1234568683', size: 'M', stock: 25, color: 'White' },
       { sku: '1234568684', size: 'L', stock: 20, color: 'White' },
       { sku: '1234568685', size: 'XL', stock: 15, color: 'White' },
       { sku: '1234568686', size: 'S', stock: 18, color: 'Burgundy' },
       { sku: '1234568687', size: 'M', stock: 22, color: 'Burgundy' },
       { sku: '1234568688', size: 'L', stock: 18, color: 'Burgundy' },
       { sku: '1234568689', size: 'XL', stock: 12, color: 'Burgundy' },
       { sku: '1234568690', size: 'S', stock: 18, color: 'Blue' },
       { sku: '1234568691', size: 'M', stock: 22, color: 'Blue' },
       { sku: '1234568692', size: 'L', stock: 18, color: 'Blue' },
       { sku: '1234568693', size: 'XL', stock: 12, color: 'Blue' },
       { sku: '1234568694', size: 'S', stock: 18, color: 'Green' },
       { sku: '1234568695', size: 'M', stock: 22, color: 'Green' },
       { sku: '1234568696', size: 'L', stock: 18, color: 'Green' },
       { sku: '1234568697', size: 'XL', stock: 12, color: 'Green' }
     ],
     tags: ['backpack', 'adidas', 'adicolor', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "adidas Adventure Backpack",
     description: "Durable adventure backpack designed for outdoor activities and travel. Water-resistant material with ergonomic design for maximum comfort. Available in Green and Black.",
     price: 999000,
     discountPrice: 899000,
     categoryPath: ['Accessories', 'Men', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093466/adidas_Adventure_Backpack_Green_II3334_01_00_standard_xirweu.avif'],
     sizes: [
       { sku: '1234568698', size: 'S', stock: 15, color: 'Green' },
       { sku: '1234568699', size: 'M', stock: 20, color: 'Green' },
       { sku: '1234568700', size: 'L', stock: 15, color: 'Green' },
       { sku: '1234568701', size: 'XL', stock: 10, color: 'Green' },
       { sku: '1234568702', size: 'S', stock: 18, color: 'Black' },
       { sku: '1234568703', size: 'M', stock: 22, color: 'Black' },
       { sku: '1234568704', size: 'L', stock: 18, color: 'Black' },
       { sku: '1234568705', size: 'XL', stock: 12, color: 'Black' }
     ],
     tags: ['backpack', 'adidas', 'adventure', 'outdoor', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Adidas Originals X Liberty London Small Shoulder Bag",
     description: "Exclusive collaboration shoulder bag with Liberty London design. Compact and stylish with adjustable strap for versatile carrying options. Available in Multicolor.",
     price: 1299000,
     discountPrice: 1099000,
     categoryPath: ['Accessories', 'Men', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093466/Adidas_Originals_X_Liberty_London_Small_Shoulder_Bag_Multicolour_JX3197_01_00_standard_hgowof.avif'],
     sizes: [
       { sku: '1234568706', size: 'S', stock: 8, color: 'Multicolor' },
       { sku: '1234568707', size: 'M', stock: 12, color: 'Multicolor' },
       { sku: '1234568708', size: 'L', stock: 8, color: 'Multicolor' },
       { sku: '1234568709', size: 'XL', stock: 5, color: 'Multicolor' }
     ],
     tags: ['shoulder-bag', 'adidas', 'originals', 'liberty-london', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   // Men's Eyewear Products
   {
     name: "Dunamis EVO L Sunglasses",
     description: "Premium sports sunglasses with advanced lens technology for optimal performance. Lightweight frame with superior UV protection. Available in Purple, Blue, and Orange.",
     price: 899000,
     discountPrice: 799000,
     categoryPath: ['Accessories', 'Men', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093467/Dunamis_EVO_L_Sunglasses_Blue_JK9720_01_hover_standard_qjenus.avif'],
     sizes: [
       { sku: '1234568710', size: 'S', stock: 12, color: 'Purple' },
       { sku: '1234568711', size: 'M', stock: 18, color: 'Purple' },
       { sku: '1234568712', size: 'L', stock: 12, color: 'Purple' },
       { sku: '1234568713', size: 'S', stock: 15, color: 'Blue' },
       { sku: '1234568714', size: 'M', stock: 22, color: 'Blue' },
       { sku: '1234568715', size: 'L', stock: 15, color: 'Blue' },
       { sku: '1234568716', size: 'S', stock: 10, color: 'Orange' },
       { sku: '1234568717', size: 'M', stock: 15, color: 'Orange' },
       { sku: '1234568718', size: 'L', stock: 10, color: 'Orange' }
     ],
     tags: ['sunglasses', 'adidas', 'dunamis', 'evo-l', 'sports', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Originals Sunglasses OR0132",
     description: "Classic design sunglasses with timeless appeal. High-quality materials and comfortable fit for everyday wear. Available in Stone Black, Red, and Black.",
     price: 699000,
     discountPrice: 599000,
     categoryPath: ['Accessories', 'Men', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093470/Originals_Sunglasses_OR0132_Stone_Black_JK9816_01_hover_standard_tevixg.avif'],
     sizes: [
       { sku: '1234568719', size: 'S', stock: 12, color: 'Stone Black' },
       { sku: '1234568720', size: 'M', stock: 18, color: 'Stone Black' },
       { sku: '1234568721', size: 'L', stock: 12, color: 'Stone Black' },
       { sku: '1234568722', size: 'S', stock: 10, color: 'Red' },
       { sku: '1234568723', size: 'M', stock: 15, color: 'Red' },
       { sku: '1234568724', size: 'L', stock: 10, color: 'Red' },
       { sku: '1234568725', size: 'S', stock: 15, color: 'Black' },
       { sku: '1234568726', size: 'M', stock: 22, color: 'Black' },
       { sku: '1234568727', size: 'L', stock: 15, color: 'Black' }
     ],
     tags: ['sunglasses', 'adidas', 'originals', 'or0132', 'classic', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Sport Sunglasses adidas DUNAMIS",
     description: "High-performance sports sunglasses designed for athletes. Advanced lens technology with superior protection and comfort. Available in Black, Antique Black, and Antique Rainbow.",
     price: 999000,
     discountPrice: 899000,
     categoryPath: ['Accessories', 'Men', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753094816/Sport_Sunglasses_adidas_DUNAMIS_Antique_Black_IV1298_01_hover_standard_whlnza.avif'],
     sizes: [
       { sku: '1234568728', size: 'S', stock: 10, color: 'Black' },
       { sku: '1234568729', size: 'M', stock: 15, color: 'Black' },
       { sku: '1234568730', size: 'L', stock: 10, color: 'Black' },
       { sku: '1234568731', size: 'S', stock: 12, color: 'Antique Black' },
       { sku: '1234568732', size: 'M', stock: 18, color: 'Antique Black' },
       { sku: '1234568733', size: 'L', stock: 12, color: 'Antique Black' },
       { sku: '1234568734', size: 'S', stock: 8, color: 'Antique Rainbow' },
       { sku: '1234568735', size: 'M', stock: 12, color: 'Antique Rainbow' },
       { sku: '1234568736', size: 'L', stock: 8, color: 'Antique Rainbow' }
     ],
     tags: ['sunglasses', 'adidas', 'dunamis', 'sport', 'performance', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   // Women's Eyewear Products
   {
     name: "Dunamis EVO L Sunglasses",
     description: "Premium sports sunglasses with advanced lens technology for optimal performance. Lightweight frame with superior UV protection. Available in Purple, Blue, and Orange.",
     price: 899000,
     discountPrice: 799000,
     categoryPath: ['Accessories', 'Women', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093467/Dunamis_EVO_L_Sunglasses_Blue_JK9720_01_hover_standard_qjenus.avif'],
     sizes: [
       { sku: '1234568737', size: 'XS', stock: 10, color: 'Purple' },
       { sku: '1234568738', size: 'S', stock: 15, color: 'Purple' },
       { sku: '1234568739', size: 'M', stock: 12, color: 'Purple' },
       { sku: '1234568740', size: 'S', stock: 12, color: 'Blue' },
       { sku: '1234568741', size: 'M', stock: 18, color: 'Blue' },
       { sku: '1234568742', size: 'L', stock: 12, color: 'Blue' },
       { sku: '1234568743', size: 'XS', stock: 8, color: 'Orange' },
       { sku: '1234568744', size: 'S', stock: 12, color: 'Orange' },
       { sku: '1234568745', size: 'M', stock: 10, color: 'Orange' }
     ],
     tags: ['sunglasses', 'adidas', 'dunamis', 'evo-l', 'sports', 'women', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Originals Sunglasses OR0132",
     description: "Classic design sunglasses with timeless appeal. High-quality materials and comfortable fit for everyday wear. Available in Stone Black, Red, and Black.",
     price: 699000,
     discountPrice: 599000,
     categoryPath: ['Accessories', 'Women', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093470/Originals_Sunglasses_OR0132_Stone_Black_JK9816_01_hover_standard_tevixg.avif'],
     sizes: [
       { sku: '1234568746', size: 'XS', stock: 10, color: 'Stone Black' },
       { sku: '1234568747', size: 'S', stock: 15, color: 'Stone Black' },
       { sku: '1234568748', size: 'M', stock: 12, color: 'Stone Black' },
       { sku: '1234568749', size: 'XS', stock: 8, color: 'Red' },
       { sku: '1234568750', size: 'S', stock: 12, color: 'Red' },
       { sku: '1234568751', size: 'M', stock: 10, color: 'Red' },
       { sku: '1234568752', size: 'XS', stock: 12, color: 'Black' },
       { sku: '1234568753', size: 'S', stock: 18, color: 'Black' },
       { sku: '1234568754', size: 'M', stock: 12, color: 'Black' }
     ],
     tags: ['sunglasses', 'adidas', 'originals', 'or0132', 'classic', 'women', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Sport Sunglasses adidas DUNAMIS",
     description: "High-performance sports sunglasses designed for athletes. Advanced lens technology with superior protection and comfort. Available in Black, Antique Black, and Antique Rainbow.",
     price: 999000,
     discountPrice: 899000,
     categoryPath: ['Accessories', 'Women', 'Eyewear'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753094816/Sport_Sunglasses_adidas_DUNAMIS_Antique_Black_IV1298_01_hover_standard_whlnza.avif'],
     sizes: [
       { sku: '1234568755', size: 'XS', stock: 8, color: 'Black' },
       { sku: '1234568756', size: 'S', stock: 12, color: 'Black' },
       { sku: '1234568757', size: 'M', stock: 10, color: 'Black' },
       { sku: '1234568758', size: 'XS', stock: 10, color: 'Antique Black' },
       { sku: '1234568759', size: 'S', stock: 15, color: 'Antique Black' },
       { sku: '1234568760', size: 'M', stock: 12, color: 'Antique Black' },
       { sku: '1234568761', size: 'XS', stock: 6, color: 'Antique Rainbow' },
       { sku: '1234568762', size: 'S', stock: 10, color: 'Antique Rainbow' },
       { sku: '1234568763', size: 'M', stock: 8, color: 'Antique Rainbow' }
     ],
     tags: ['sunglasses', 'adidas', 'dunamis', 'sport', 'performance', 'women', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   // Men's Hats Products
   {
     name: "Adicolor Classic Trefoil Baseball Cap",
     description: "Classic baseball cap featuring the iconic Trefoil logo. Comfortable fit with adjustable strap for perfect sizing. Available in Blue, Black, White, and Grey.",
     price: 399000,
     discountPrice: 359000,
     categoryPath: ['Accessories', 'Men', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093474/Adicolor_Classic_Trefoil_Baseball_Cap_Blue_JV7389_01_00_standard_bwbuwr.avif'],
     sizes: [
       { sku: '1234568764', size: 'S', stock: 15, color: 'Blue' },
       { sku: '1234568765', size: 'M', stock: 20, color: 'Blue' },
       { sku: '1234568766', size: 'L', stock: 15, color: 'Blue' },
       { sku: '1234568767', size: 'XL', stock: 10, color: 'Blue' },
       { sku: '1234568768', size: 'S', stock: 18, color: 'Black' },
       { sku: '1234568769', size: 'M', stock: 22, color: 'Black' },
       { sku: '1234568770', size: 'L', stock: 18, color: 'Black' },
       { sku: '1234568771', size: 'XL', stock: 12, color: 'Black' },
       { sku: '1234568772', size: 'S', stock: 16, color: 'White' },
       { sku: '1234568773', size: 'M', stock: 20, color: 'White' },
       { sku: '1234568774', size: 'L', stock: 16, color: 'White' },
       { sku: '1234568775', size: 'XL', stock: 10, color: 'White' },
       { sku: '1234568776', size: 'S', stock: 12, color: 'Grey' },
       { sku: '1234568777', size: 'M', stock: 16, color: 'Grey' },
       { sku: '1234568778', size: 'L', stock: 12, color: 'Grey' },
       { sku: '1234568779', size: 'XL', stock: 8, color: 'Grey' }
     ],
     tags: ['baseball-cap', 'adidas', 'adicolor', 'trefoil', 'classic', 'blue', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Golf Performance Crestable Cap",
     description: "High-performance golf cap designed for comfort during play. Moisture-wicking technology with adjustable fit for optimal performance. Available in Black.",
     price: 499000,
     discountPrice: 449000,
     categoryPath: ['Accessories', 'Men', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093480/Golf_Performance_Crestable_Cap_Black_IM9184_01_standard_pjozkk.avif'],
     sizes: [
       { sku: '1234568780', size: 'S', stock: 8, color: 'Black' },
       { sku: '1234568781', size: 'M', stock: 12, color: 'Black' },
       { sku: '1234568782', size: 'L', stock: 8, color: 'Black' },
       { sku: '1234568783', size: 'XL', stock: 5, color: 'Black' }
     ],
     tags: ['golf-cap', 'adidas', 'performance', 'crestable', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Leopard Bucket Hat",
     description: "Stylish bucket hat with leopard print design. Perfect for casual wear and outdoor activities. Available in Brown and Grey.",
     price: 349000,
     discountPrice: 299000,
     categoryPath: ['Accessories', 'Men', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093478/Leopard_Bucket_Hat_Brown_JX0603_01_00_standard_xwd9y0.avif'],
     sizes: [
       { sku: '1234568784', size: 'S', stock: 10, color: 'Brown' },
       { sku: '1234568785', size: 'M', stock: 15, color: 'Brown' },
       { sku: '1234568786', size: 'L', stock: 10, color: 'Brown' },
       { sku: '1234568787', size: 'XL', stock: 8, color: 'Brown' },
       { sku: '1234568788', size: 'S', stock: 12, color: 'Grey' },
       { sku: '1234568789', size: 'M', stock: 18, color: 'Grey' },
       { sku: '1234568790', size: 'L', stock: 12, color: 'Grey' },
       { sku: '1234568791', size: 'XL', stock: 10, color: 'Grey' }
     ],
     tags: ['bucket-hat', 'adidas', 'leopard', 'casual', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "TOUR BUCKET HAT",
     description: "Tour-inspired bucket hat with comfortable fit and durable construction. Perfect for travel and outdoor adventures. Available in Blue, Brown, and Turquoise.",
     price: 399000,
     discountPrice: 359000,
     categoryPath: ['Accessories', 'Men', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093476/TOUR_BUCKET_HAT_Blue_KQ7990_27_model_owq0x2.avif'],
     sizes: [
       { sku: '1234568792', size: 'S', stock: 12, color: 'Blue' },
       { sku: '1234568793', size: 'M', stock: 18, color: 'Blue' },
       { sku: '1234568794', size: 'L', stock: 12, color: 'Blue' },
       { sku: '1234568795', size: 'XL', stock: 10, color: 'Blue' },
       { sku: '1234568796', size: 'S', stock: 10, color: 'Brown' },
       { sku: '1234568797', size: 'M', stock: 15, color: 'Brown' },
       { sku: '1234568798', size: 'L', stock: 10, color: 'Brown' },
       { sku: '1234568799', size: 'XL', stock: 8, color: 'Brown' },
       { sku: '1234568800', size: 'S', stock: 8, color: 'Turquoise' },
       { sku: '1234568801', size: 'M', stock: 12, color: 'Turquoise' },
       { sku: '1234568802', size: 'L', stock: 8, color: 'Turquoise' },
       { sku: '1234568803', size: 'XL', stock: 6, color: 'Turquoise' }
     ],
     tags: ['bucket-hat', 'adidas', 'tour', 'travel', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   // Women's Hats Products (same products for women)
   {
     name: "Leopard Bucket Hat",
     description: "Stylish bucket hat with leopard print design. Perfect for casual wear and outdoor activities. Available in Brown and Grey.",
     price: 349000,
     discountPrice: 299000,
     categoryPath: ['Women', 'Adidas', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093478/Leopard_Bucket_Hat_Brown_JX0603_01_00_standard_xwd9y0.avif'],
     sizes: [
       { sku: '1234568804', size: 'XS', stock: 8, color: 'Brown' },
       { sku: '1234568805', size: 'S', stock: 12, color: 'Brown' },
       { sku: '1234568806', size: 'M', stock: 10, color: 'Brown' },
       { sku: '1234568807', size: 'L', stock: 8, color: 'Brown' },
       { sku: '1234568808', size: 'XS', stock: 10, color: 'Grey' },
       { sku: '1234568809', size: 'S', stock: 15, color: 'Grey' },
       { sku: '1234568810', size: 'M', stock: 12, color: 'Grey' },
       { sku: '1234568811', size: 'L', stock: 10, color: 'Grey' }
     ],
     tags: ['bucket-hat', 'adidas', 'leopard', 'casual', 'men', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "TOUR BUCKET HAT",
     description: "Tour-inspired bucket hat with comfortable fit and durable construction. Perfect for travel and outdoor adventures. Available in Blue, Brown, and Turquoise.",
     price: 399000,
     discountPrice: 359000,
     categoryPath: ['Women', 'Adidas', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093476/TOUR_BUCKET_HAT_Blue_KQ7990_27_model_owq0x2.avif'],
     sizes: [
       { sku: '1234568812', size: 'XS', stock: 10, color: 'Blue' },
       { sku: '1234568813', size: 'S', stock: 15, color: 'Blue' },
       { sku: '1234568814', size: 'M', stock: 12, color: 'Blue' },
       { sku: '1234568815', size: 'L', stock: 10, color: 'Blue' },
       { sku: '1234568816', size: 'XS', stock: 8, color: 'Brown' },
       { sku: '1234568817', size: 'S', stock: 12, color: 'Brown' },
       { sku: '1234568818', size: 'M', stock: 10, color: 'Brown' },
       { sku: '1234568819', size: 'L', stock: 8, color: 'Brown' },
       { sku: '1234568820', size: 'XS', stock: 6, color: 'Turquoise' },
       { sku: '1234568821', size: 'S', stock: 10, color: 'Turquoise' },
       { sku: '1234568822', size: 'M', stock: 8, color: 'Turquoise' },
       { sku: '1234568823', size: 'L', stock: 6, color: 'Turquoise' }
     ],
     tags: ['bucket-hat', 'adidas', 'tour', 'travel', 'women', 'men'],
     brand: 'Adidas',
     status: 'active'
   },
   // Women's Bags Products
   {
     name: "adidas Originals x Liberty London Mini Bowling Bag",
     description: "Exclusive collaboration mini bowling bag with Liberty London design. Compact and stylish with adjustable strap for versatile carrying options. Available in Multicolor.",
     price: 1499000,
     discountPrice: 1299000,
     categoryPath: ['Accessories', 'Women', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093482/adidas_Originals_x_Liberty_London_Mini_Bowling_Bag_Multicolour_JD5423_01_00_standard_khmd75.avif'],
     sizes: [
       { sku: '1234568824', size: 'XS', stock: 4, color: 'Multicolor' },
       { sku: '1234568825', size: 'S', stock: 6, color: 'Multicolor' },
       { sku: '1234568826', size: 'M', stock: 4, color: 'Multicolor' },
       { sku: '1234568827', size: 'L', stock: 3, color: 'Multicolor' }
     ],
     tags: ['bowling-bag', 'adidas', 'originals', 'liberty-london', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Animal-Print Classic Backpack",
     description: "Stylish classic backpack with animal print design. Spacious interior with multiple compartments for organization. Perfect for everyday use and travel. Available in Blue.",
     price: 899000,
     discountPrice: 799000,
     categoryPath: ['Accessories', 'Women', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093483/Animal-Print_Classic_Backpack_Blue_JG1109_01_00_standard_gq12kz.avif'],
     sizes: [
       { sku: '1234568828', size: 'XS', stock: 8, color: 'Blue' },
       { sku: '1234568829', size: 'S', stock: 12, color: 'Blue' },
       { sku: '1234568830', size: 'M', stock: 10, color: 'Blue' },
       { sku: '1234568831', size: 'L', stock: 8, color: 'Blue' }
     ],
     tags: ['backpack', 'adidas', 'animal-print', 'classic', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Mini Airliner Bag",
     description: "Compact mini airliner bag perfect for travel and daily use. Lightweight design with comfortable straps and organized interior. Available in Blue.",
     price: 699000,
     discountPrice: 599000,
     categoryPath: ['Accessories', 'Women', 'Bags'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093478/Mini_Airliner_Bag_Blue_JC8302_01_00_standard_qv8iwo.avif'],
     sizes: [
       { sku: '1234568832', size: 'XS', stock: 10, color: 'Blue' },
       { sku: '1234568833', size: 'S', stock: 15, color: 'Blue' },
       { sku: '1234568834', size: 'M', stock: 12, color: 'Blue' },
       { sku: '1234568835', size: 'L', stock: 10, color: 'Blue' }
     ],
     tags: ['airliner-bag', 'adidas', 'mini', 'travel', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   // Additional Women's Hats Products
   {
     name: "3-Stripes Swim Hijab",
     description: "Comfortable swim hijab with 3-stripes design. Made with quick-drying fabric perfect for swimming and water activities. Available in Grey.",
     price: 299000,
     discountPrice: 259000,
     categoryPath: ['Accessories', 'Women', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093484/3-Stripes_Swim_Hijab_Grey_JD2437_21_model_xgyshq.avif'],
     sizes: [
       { sku: '1234568836', size: 'XS', stock: 6, color: 'Grey' },
       { sku: '1234568837', size: 'S', stock: 10, color: 'Grey' },
       { sku: '1234568838', size: 'M', stock: 8, color: 'Grey' },
       { sku: '1234568839', size: 'L', stock: 6, color: 'Grey' }
     ],
     tags: ['swim-hijab', 'adidas', '3-stripes', 'swimming', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "adidas Originals x Liberty London Baseball Cap",
     description: "Exclusive collaboration baseball cap with Liberty London design. Classic fit with adjustable strap and premium materials. Available in Multicolor.",
     price: 499000,
     discountPrice: 449000,
     categoryPath: ['Accessories', 'Women', 'Hats'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093485/adidas_Originals_x_Liberty_London_Baseball_Cap_Multicolour_JW8021_01_00_standard_jtmx8t.avif'],
     sizes: [
       { sku: '1234568840', size: 'XS', stock: 4, color: 'Multicolor' },
       { sku: '1234568841', size: 'S', stock: 6, color: 'Multicolor' },
       { sku: '1234568842', size: 'M', stock: 4, color: 'Multicolor' },
       { sku: '1234568843', size: 'L', stock: 3, color: 'Multicolor' }
     ],
     tags: ['baseball-cap', 'adidas', 'originals', 'liberty-london', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   // Additional Women's Socks Products
   {
     name: "adidas Originals x Liberty London Crew Socks 2 Pairs",
     description: "Exclusive collaboration crew socks with Liberty London design. Comfortable fit with premium materials and stylish pattern. Available in White.",
     price: 399000,
     discountPrice: 359000,
     categoryPath: ['Accessories', 'Women', 'Socks'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753093485/adidas_Originals_x_Liberty_London_Crew_Socks_2_Pairs_White_JV7833_01_04_standard_fvwz06.avif'],
     sizes: [
       { sku: '1234568721', size: 'S', stock: 25, color: 'White' },
       { sku: '1234568722', size: 'M', stock: 30, color: 'White' },
       { sku: '1234568723', size: 'L', stock: 20, color: 'White' },
       { sku: '1234568724', size: 'XL', stock: 15, color: 'White' }
     ],
     tags: ['crew-socks', 'adidas', 'originals', 'liberty-london', 'women'],
     brand: 'Adidas',
     status: 'active'
   },
   {
     name: "Ruffle Socks 2 Pairs",
     description: "Stylish ruffle socks with decorative design. Comfortable and fashionable for everyday wear. Available in White and Black & White.",
     price: 299000,
     discountPrice: 259000,
     categoryPath: ['Accessories', 'Women', 'Socks'],
     images: ['https://res.cloudinary.com/dqmb4e2et/image/upload/v1753095630/Ruffle_Socks_2_Pairs_Black_White_JD5623_01_04_standard_nhhpqf.avif'],
     sizes: [
       { sku: '1234568725', size: 'S', stock: 20, color: 'White' },
       { sku: '1234568726', size: 'M', stock: 25, color: 'White' },
       { sku: '1234568727', size: 'L', stock: 18, color: 'White' },
       { sku: '1234568728', size: 'XL', stock: 12, color: 'White' },
       { sku: '1234568729', size: 'S', stock: 20, color: 'Black & White' },
       { sku: '1234568730', size: 'M', stock: 25, color: 'Black & White' },
       { sku: '1234568731', size: 'L', stock: 18, color: 'Black & White' },
       { sku: '1234568732', size: 'XL', stock: 12, color: 'Black & White' }
     ],
     tags: ['ruffle-socks', 'adidas', 'decorative', 'fashion', 'women'],
     brand: 'Adidas',
     status: 'active'
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
          console.log(`   Old images: ${currentImages.join(', ')}`)
          console.log(`   New images: ${newImages.join(', ')}`)
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