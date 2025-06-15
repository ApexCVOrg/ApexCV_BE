import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Brand } from "../models/Brand";

const productsData = [
  // Arsenal Products
  {
    name: "Arsenal Men's Home Jersey 2024/25",
    description: "Official Arsenal FC home jersey for the 2024/25 season. Made with high-quality materials and featuring the latest team design.",
    price: 2199000,
    discountPrice: 1959000,
    categoryPath: ["Men", "Arsenal", "T-Shirts"],
    images: ["Arsenal_Home_2425.avif"],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 10 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "jersey", "football", "home"],
    brand: "Nike"
  },
  {
    name: "Arsenal Men's Training Jacket",
    description: "Premium training jacket with Arsenal FC branding. Perfect for training sessions and casual wear.",
    price: 3184000,
    discountPrice: 2694000,
    categoryPath: ["Men", "Arsenal", "Jackets"],
    images: ["Arsenal_Training_Jacket.avif"],
    sizes: [
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "jacket", "training"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Women's Home Jersey 2024/25",
    description: "Official Arsenal FC women's home jersey for the 2024/25 season. Designed specifically for female fans.",
    price: 1999000,
    discountPrice: 1799000,
    categoryPath: ["Women", "Arsenal", "T-Shirts"],
    images: ["/images/products/arsenal-women-home-jersey-2024.jpg"],
    sizes: [
      { size: "XS", stock: 10 },
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "jersey", "football", "home", "women"],
    brand: "Nike"
  },
  {
    name: "Arsenal Women's Training Hoodie",
    description: "Comfortable and stylish hoodie for Arsenal women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Arsenal", "Hoodies"],
    images: ["/images/products/arsenal-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "hoodie", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Kids Home Jersey 2024/25",
    description: "Official Arsenal FC home jersey for kids, perfect for young fans. Made with comfortable, breathable materials.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Kids", "Arsenal", "T-Shirts"],
    images: ["/images/products/arsenal-kids-home-jersey-2024.jpg"],
    sizes: [
      { size: "4-5Y", stock: 20 },
      { size: "6-7Y", stock: 25 },
      { size: "8-9Y", stock: 20 },
      { size: "10-11Y", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "jersey", "football", "home", "kids"],
    brand: "Nike"
  },
  {
    name: "Arsenal Kids Training Shoes",
    description: "Comfortable and durable training shoes for young Arsenal fans. Perfect for both training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Arsenal", "Training Shoes"],
    images: ["/images/products/arsenal-kids-training-shoes.jpg"],
    sizes: [
      { size: "28", stock: 15 },
      { size: "29", stock: 20 },
      { size: "30", stock: 25 },
      { size: "31", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "shoes", "training", "kids"],
    brand: "Adidas"
  },
  // Real Madrid Products
  {
    name: "Real Madrid Men's Home Jersey 2024/25",
    description: "Official Real Madrid home jersey for the 2024/25 season. Premium quality with the latest team design.",
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ["Men", "Real Madrid", "T-Shirts"],
    images: ["Real_Madrid_24-25_Home.avif"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "jersey", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Men's Training Jacket",
    description: "Professional training jacket with Real Madrid branding. Ideal for training and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Men", "Real Madrid", "Jackets"],
    images: ["Real_Madrid_Training_Jacket.avif"],
    sizes: [
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["real-madrid", "jacket", "training"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Women's Home Jersey 2024/25",
    description: "Official Real Madrid women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Real Madrid", "T-Shirts"],
    images: ["/images/products/real-madrid-women-home-jersey-2024.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "jersey", "football", "home", "women"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Women's Training Hoodie",
    description: "Stylish and comfortable hoodie for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Women", "Real Madrid", "Hoodies"],
    images: ["/images/products/real-madrid-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["real-madrid", "hoodie", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Kids Home Jersey 2024/25",
    description: "Official Real Madrid home jersey for kids. Perfect for young fans with comfortable materials.",
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Real Madrid", "T-Shirts"],
    images: ["/images/products/real-madrid-kids-home-jersey-2024.jpg"],
    sizes: [
      { size: "4-5Y", stock: 25 },
      { size: "6-7Y", stock: 30 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "jersey", "football", "home", "kids"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Kids Training Shoes",
    description: "Comfortable and durable training shoes for young Real Madrid fans. Perfect for both training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Kids", "Real Madrid", "Training Shoes"],
    images: ["/images/products/real-madrid-kids-training-shoes.jpg"],
    sizes: [
      { size: "28", stock: 20 },
      { size: "29", stock: 25 },
      { size: "30", stock: 30 },
      { size: "31", stock: 25 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "shoes", "training", "kids"],
    brand: "Adidas"
  },
  // Bayern Munich Products
  {
    name: "Bayern Munich Men's Home Jersey 2024/25",
    description: "Official Bayern Munich home jersey for the 2024/25 season. Premium quality with the latest team design.",
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ["Men", "Bayern Munich", "T-Shirts"],
    images: ["/images/products/bayern-home-jersey-2024.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "jersey", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Men's Training Jacket",
    description: "Professional training jacket with Bayern Munich branding. Ideal for training and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Men", "Bayern Munich", "Jackets"],
    images: ["/images/products/bayern-training-jacket.jpg"],
    sizes: [
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["bayern", "jacket", "training"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Women's Home Jersey 2024/25",
    description: "Official Bayern Munich women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Bayern Munich", "T-Shirts"],
    images: ["/images/products/bayern-women-home-jersey-2024.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "jersey", "football", "home", "women"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Women's Training Hoodie",
    description: "Stylish and comfortable hoodie for Bayern Munich women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Women", "Bayern Munich", "Hoodies"],
    images: ["/images/products/bayern-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["bayern", "hoodie", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Kids Home Jersey 2024/25",
    description: "Official Bayern Munich home jersey for kids. Perfect for young fans with comfortable materials.",
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Bayern Munich", "T-Shirts"],
    images: ["/images/products/bayern-kids-home-jersey-2024.jpg"],
    sizes: [
      { size: "4-5Y", stock: 25 },
      { size: "6-7Y", stock: 30 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "jersey", "football", "home", "kids"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Kids Training Shoes",
    description: "Comfortable and durable training shoes for young Bayern Munich fans. Perfect for both training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Kids", "Bayern Munich", "Training Shoes"],
    images: ["/images/products/bayern-kids-training-shoes.jpg"],
    sizes: [
      { size: "28", stock: 20 },
      { size: "29", stock: 25 },
      { size: "30", stock: 30 },
      { size: "31", stock: 25 }
    ],
    colors: ["Red", "Black"],
    tags: ["bayern", "shoes", "training", "kids"],
    brand: "Adidas"
  },
  // Juventus Products
  {
    name: "Juventus Men's Home Jersey 2024/25",
    description: "Official Juventus home jersey for the 2024/25 season. Premium quality with the latest team design.",
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ["Men", "Juventus", "T-Shirts"],
    images: ["/images/products/juventus-home-jersey-2024.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "jersey", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Juventus Men's Training Jacket",
    description: "Professional training jacket with Juventus branding. Ideal for training and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Men", "Juventus", "Jackets"],
    images: ["/images/products/juventus-training-jacket.jpg"],
    sizes: [
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "jacket", "training"],
    brand: "Adidas"
  },
  {
    name: "Juventus Women's Home Jersey 2024/25",
    description: "Official Juventus women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Juventus", "T-Shirts"],
    images: ["/images/products/juventus-women-home-jersey-2024.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "jersey", "football", "home", "women"],
    brand: "Adidas"
  },
  {
    name: "Juventus Women's Training Hoodie",
    description: "Stylish and comfortable hoodie for Juventus women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Women", "Juventus", "Hoodies"],
    images: ["/images/products/juventus-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "hoodie", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Juventus Kids Home Jersey 2024/25",
    description: "Official Juventus home jersey for kids. Perfect for young fans with comfortable materials.",
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Juventus", "T-Shirts"],
    images: ["/images/products/juventus-kids-home-jersey-2024.jpg"],
    sizes: [
      { size: "4-5Y", stock: 25 },
      { size: "6-7Y", stock: 30 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "jersey", "football", "home", "kids"],
    brand: "Adidas"
  },
  {
    name: "Juventus Kids Training Shoes",
    description: "Comfortable and durable training shoes for young Juventus fans. Perfect for both training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Kids", "Juventus", "Training Shoes"],
    images: ["/images/products/juventus-kids-training-shoes.jpg"],
    sizes: [
      { size: "28", stock: 20 },
      { size: "29", stock: 25 },
      { size: "30", stock: 30 },
      { size: "31", stock: 25 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shoes", "training", "kids"],
    brand: "Adidas"
  },
  // Manchester United Products
  {
    name: "Manchester United Men's Home Jersey 2024/25",
    description: "Official Manchester United home jersey for the 2024/25 season. Premium quality with the latest team design.",
    price: 2299000,
    discountPrice: 1999000,
    categoryPath: ["Men", "Manchester United", "T-Shirts"],
    images: ["Manchester_United_24-25_Home_Jersey_Red.avif"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "jersey", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Men's Training Jacket",
    description: "Professional training jacket with Manchester United branding. Ideal for training and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Men", "Manchester United", "Jackets"],
    images: ["MU_Training_Jacket.avif"],
    sizes: [
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "jacket", "training"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Women's Home Jersey 2024/25",
    description: "Official Manchester United women's home jersey for the 2024/25 season. Stylish and comfortable design.",
    price: 2099000,
    discountPrice: 1899000,
    categoryPath: ["Women", "Manchester United", "T-Shirts"],
    images: ["/images/products/man-utd-women-home-jersey-2024.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "jersey", "football", "home", "women"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Women's Training Hoodie",
    description: "Stylish and comfortable hoodie for Manchester United women's collection. Perfect for training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Women", "Manchester United", "Hoodies"],
    images: ["/images/products/man-utd-women-hoodie.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "hoodie", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Kids Home Jersey 2024/25",
    description: "Official Manchester United home jersey for kids. Perfect for young fans with comfortable materials.",
    price: 1699000,
    discountPrice: 1499000,
    categoryPath: ["Kids", "Manchester United", "T-Shirts"],
    images: ["/images/products/man-utd-kids-home-jersey-2024.jpg"],
    sizes: [
      { size: "4-5Y", stock: 25 },
      { size: "6-7Y", stock: 30 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "jersey", "football", "home", "kids"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Kids Training Shoes",
    description: "Comfortable and durable training shoes for young Manchester United fans. Perfect for both training and casual wear.",
    price: 1999000,
    discountPrice: 1699000,
    categoryPath: ["Kids", "Manchester United", "Training Shoes"],
    images: ["/images/products/man-utd-kids-training-shoes.jpg"],
    sizes: [
      { size: "28", stock: 20 },
      { size: "29", stock: 25 },
      { size: "30", stock: 30 },
      { size: "31", stock: 25 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "shoes", "training", "kids"],
    brand: "Adidas"
  },
  // Additional Arsenal Products
  {
    name: "Arsenal Men's Home Shorts 2024/25",
    description: "Official Arsenal FC home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Arsenal", "Shorts"],
    images: ["Arsenal_24-25_Home_Shorts.avif"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "shorts", "football", "home"],
    brand: "Nike"
  },
  {
    name: "Arsenal Men's Training Shoes",
    description: "Professional training shoes endorsed by Arsenal FC. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Arsenal", "Training Shoes"],
    images: ["Arsenal_Men's_Training_Shoes.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "shoes", "training"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Women's Training Pants",
    description: "Comfortable and stylish training pants for Arsenal women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Arsenal", "Training Pants"],
    images: ["/images/products/arsenal-women-training-pants.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "pants", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Women's Training Shoes",
    description: "Professional training shoes for Arsenal women's collection. Perfect for training sessions and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Women", "Arsenal", "Training Shoes"],
    images: ["/images/products/arsenal-women-training-shoes.jpg"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "shoes", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Kids Tracksuit",
    description: "Stylish and comfortable tracksuit for young Arsenal fans. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Arsenal", "Tracksuits"],
    images: ["/images/products/arsenal-kids-tracksuit.jpg"],
    sizes: [
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 20 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Red", "White"],
    tags: ["arsenal", "tracksuit", "training", "kids"],
    brand: "Adidas"
  },
  {
    name: "Arsenal Kids Football Boots",
    description: "Lightweight and comfortable football boots for young Arsenal players. Perfect for training and matches.",
    price: 2499000,
    discountPrice: 2199000,
    categoryPath: ["Kids", "Arsenal", "Football Boots"],
    images: ["/images/products/arsenal-kids-boots.jpg"],
    sizes: [
      { size: "28", stock: 10 },
      { size: "29", stock: 15 },
      { size: "30", stock: 20 },
      { size: "31", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "boots", "football", "kids"],
    brand: "Nike"
  },
  // Additional Real Madrid Products
  {
    name: "Real Madrid Men's Home Shorts 2024/25",
    description: "Official Real Madrid home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Real Madrid", "Shorts"],
    images: ["Real_Madrid_25-26_Home_Shorts.avif"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "shorts", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Men's Training Shoes",
    description: "Professional training shoes endorsed by Real Madrid. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Real Madrid", "Training Shoes"],
    images: ["Real_Madrid_Shoes_White.avif"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "shoes", "training"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Women's Training Pants",
    description: "Comfortable and stylish training pants for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Real Madrid", "Training Pants"],
    images: ["/images/products/real-madrid-women-training-pants.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["real-madrid", "pants", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Women's Training Shoes",
    description: "Professional training shoes for Real Madrid women's collection. Perfect for training sessions and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Women", "Real Madrid", "Training Shoes"],
    images: ["/images/products/real-madrid-women-training-shoes.jpg"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "shoes", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Kids Tracksuit",
    description: "Stylish and comfortable tracksuit for young Real Madrid fans. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Real Madrid", "Tracksuits"],
    images: ["/images/products/real-madrid-kids-tracksuit.jpg"],
    sizes: [
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 20 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["White", "Black"],
    tags: ["real-madrid", "tracksuit", "training", "kids"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Kids Football Boots",
    description: "Lightweight and comfortable football boots for young Real Madrid players. Perfect for training and matches.",
    price: 2499000,
    discountPrice: 2199000,
    categoryPath: ["Kids", "Real Madrid", "Football Boots"],
    images: ["/images/products/real-madrid-kids-boots.jpg"],
    sizes: [
      { size: "28", stock: 10 },
      { size: "29", stock: 15 },
      { size: "30", stock: 20 },
      { size: "31", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["real-madrid", "boots", "football", "kids"],
    brand: "Adidas"
  },
  // Additional Bayern Munich Products
  {
    name: "Bayern Munich Men's Home Shorts 2024/25",
    description: "Official Bayern Munich home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Bayern Munich", "Shorts"],
    images: ["/images/products/bayern-home-shorts-2024.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "shorts", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Men's Training Shoes",
    description: "Professional training shoes endorsed by Bayern Munich. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Bayern Munich", "Training Shoes"],
    images: ["/images/products/bayern-training-shoes.jpg"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "shoes", "training"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Women's Training Pants",
    description: "Comfortable and stylish training pants for Bayern Munich women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Bayern Munich", "Training Pants"],
    images: ["/images/products/bayern-women-training-pants.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["bayern", "pants", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Women's Training Shoes",
    description: "Professional training shoes for Bayern Munich women's collection. Perfect for training sessions and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Women", "Bayern Munich", "Training Shoes"],
    images: ["/images/products/bayern-women-training-shoes.jpg"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "shoes", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Kids Tracksuit",
    description: "Stylish and comfortable tracksuit for young Bayern Munich fans. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Bayern Munich", "Tracksuits"],
    images: ["/images/products/bayern-kids-tracksuit.jpg"],
    sizes: [
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 20 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Red", "White"],
    tags: ["bayern", "tracksuit", "training", "kids"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Kids Football Boots",
    description: "Lightweight and comfortable football boots for young Bayern Munich players. Perfect for training and matches.",
    price: 2499000,
    discountPrice: 2199000,
    categoryPath: ["Kids", "Bayern Munich", "Football Boots"],
    images: ["/images/products/bayern-kids-boots.jpg"],
    sizes: [
      { size: "28", stock: 10 },
      { size: "29", stock: 15 },
      { size: "30", stock: 20 },
      { size: "31", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["bayern", "boots", "football", "kids"],
    brand: "Adidas"
  },
  // Additional Juventus Products
  {
    name: "Juventus Men's Home Shorts 2024/25",
    description: "Official Juventus home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Juventus", "Shorts"],
    images: ["/images/products/juventus-home-shorts-2024.jpg"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shorts", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Juventus Men's Training Shoes",
    description: "Professional training shoes endorsed by Juventus. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Juventus", "Training Shoes"],
    images: ["/images/products/juventus-training-shoes.jpg"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shoes", "training"],
    brand: "Adidas"
  },
  {
    name: "Juventus Women's Training Pants",
    description: "Comfortable and stylish training pants for Juventus women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Juventus", "Training Pants"],
    images: ["/images/products/juventus-women-training-pants.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "pants", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Juventus Women's Training Shoes",
    description: "Professional training shoes for Juventus women's collection. Perfect for training sessions and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Women", "Juventus", "Training Shoes"],
    images: ["/images/products/juventus-women-training-shoes.jpg"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shoes", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Juventus Kids Tracksuit",
    description: "Stylish and comfortable tracksuit for young Juventus fans. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Juventus", "Tracksuits"],
    images: ["/images/products/juventus-kids-tracksuit.jpg"],
    sizes: [
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 20 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "tracksuit", "training", "kids"],
    brand: "Adidas"
  },
  {
    name: "Juventus Kids Football Boots",
    description: "Lightweight and comfortable football boots for young Juventus players. Perfect for training and matches.",
    price: 2499000,
    discountPrice: 2199000,
    categoryPath: ["Kids", "Juventus", "Football Boots"],
    images: ["/images/products/juventus-kids-boots.jpg"],
    sizes: [
      { size: "28", stock: 10 },
      { size: "29", stock: 15 },
      { size: "30", stock: 20 },
      { size: "31", stock: 15 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "boots", "football", "kids"],
    brand: "Adidas"
  },
  // Additional Manchester United Products
  {
    name: "Manchester United Men's Home Shorts 2024/25",
    description: "Official Manchester United home shorts for the 2024/25 season. Lightweight and comfortable for match day.",
    price: 1126000,
    discountPrice: 979000,
    categoryPath: ["Men", "Manchester United", "Shorts"],
    images: ["Manchester_United_24-25_Home_Shorts.avif"],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 25 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "shorts", "football", "home"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Men's Training Shoes",
    description: "Professional training shoes endorsed by Manchester United. Perfect for training sessions and casual wear.",
    price: 3674000,
    discountPrice: 3184000,
    categoryPath: ["Men", "Manchester United", "Training Shoes"],
    images: ["MU_shoes.jpg"],
    sizes: [
      { size: "40", stock: 10 },
      { size: "41", stock: 15 },
      { size: "42", stock: 20 },
      { size: "43", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "shoes", "training"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Women's Training Pants",
    description: "Comfortable and stylish training pants for Manchester United women's collection. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Women", "Manchester United", "Training Pants"],
    images: ["/images/products/man-utd-women-training-pants.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "pants", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Women's Training Shoes",
    description: "Professional training shoes for Manchester United women's collection. Perfect for training sessions and casual wear.",
    price: 3299000,
    discountPrice: 2799000,
    categoryPath: ["Women", "Manchester United", "Training Shoes"],
    images: ["/images/products/man-utd-women-training-shoes.jpg"],
    sizes: [
      { size: "36", stock: 10 },
      { size: "37", stock: 15 },
      { size: "38", stock: 20 },
      { size: "39", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "shoes", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Kids Tracksuit",
    description: "Stylish and comfortable tracksuit for young Manchester United fans. Perfect for training and casual wear.",
    price: 1899000,
    discountPrice: 1599000,
    categoryPath: ["Kids", "Manchester United", "Tracksuits"],
    images: ["/images/products/man-utd-kids-tracksuit.jpg"],
    sizes: [
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 20 },
      { size: "8-9Y", stock: 25 },
      { size: "10-11Y", stock: 20 }
    ],
    colors: ["Red", "Black"],
    tags: ["manchester-united", "tracksuit", "training", "kids"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Kids Football Boots",
    description: "Lightweight and comfortable football boots for young Manchester United players. Perfect for training and matches.",
    price: 2499000,
    discountPrice: 2199000,
    categoryPath: ["Kids", "Manchester United", "Football Boots"],
    images: ["/images/products/man-utd-kids-boots.jpg"],
    sizes: [
      { size: "28", stock: 10 },
      { size: "29", stock: 15 },
      { size: "30", stock: 20 },
      { size: "31", stock: 15 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "boots", "football", "kids"],
    brand: "Adidas"
  },
  // Additional Women's Training Shorts
  {
    name: "Arsenal Women's Training Shorts",
    description: "Comfortable and stylish training shorts for Arsenal women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Arsenal", "Shorts"],
    images: ["/images/products/arsenal-women-training-shorts.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["arsenal", "shorts", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Real Madrid Women's Training Shorts",
    description: "Comfortable and stylish training shorts for Real Madrid women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Real Madrid", "Shorts"],
    images: ["/images/products/real-madrid-women-training-shorts.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["real-madrid", "shorts", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Bayern Munich Women's Training Shorts",
    description: "Comfortable and stylish training shorts for Bayern Munich women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Bayern Munich", "Shorts"],
    images: ["/images/products/bayern-women-training-shorts.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["bayern", "shorts", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Juventus Women's Training Shorts",
    description: "Comfortable and stylish training shorts for Juventus women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Juventus", "Shorts"],
    images: ["/images/products/juventus-women-training-shorts.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "White"],
    tags: ["juventus", "shorts", "training", "women"],
    brand: "Adidas"
  },
  {
    name: "Manchester United Women's Training Shorts",
    description: "Comfortable and stylish training shorts for Manchester United women's collection. Perfect for training and casual wear.",
    price: 1599000,
    discountPrice: 1399000,
    categoryPath: ["Women", "Manchester United", "Shorts"],
    images: ["/images/products/man-utd-women-training-shorts.jpg"],
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 30 },
      { size: "L", stock: 20 }
    ],
    colors: ["Black", "Red"],
    tags: ["manchester-united", "shorts", "training", "women"],
    brand: "Adidas"
  }
];

// Helper function to find category IDs by path
const findCategoryIdsByPath = async (categoryPath: string[]) => {
  const categoryIds: mongoose.Types.ObjectId[] = [];
  
  // Find parent category
  const parentCategory = await Category.findOne({ 
    name: categoryPath[0],
    parentCategory: null 
  }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
  
  if (!parentCategory) {
    throw new Error(`Parent category not found: ${categoryPath[0]}`);
  }
  categoryIds.push(parentCategory._id);

  // Find team category
  const teamCategory = await Category.findOne({ 
    name: categoryPath[1],
    parentCategory: parentCategory._id 
  }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
  
  if (!teamCategory) {
    throw new Error(`Team category not found: ${categoryPath[1]}`);
  }
  categoryIds.push(teamCategory._id);

  // Find product type category
  const productTypeCategory = await Category.findOne({ 
    name: categoryPath[2],
    parentCategory: teamCategory._id 
  }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
  
  if (!productTypeCategory) {
    throw new Error(`Product type category not found: ${categoryPath[2]}`);
  }
  categoryIds.push(productTypeCategory._id);

  return categoryIds;
};

export const seedProducts = async () => {
  try {
    console.log("🔄 Starting product seeding...");
    
    // Get all existing products
    const existingProducts = await Product.find({});
    
    // Create a set of all product names from seed data
    const seedProductNames = new Set(productsData.map(product => product.name));
    
    // Find products to delete (those that exist in DB but not in seed data)
    const productsToDelete = existingProducts.filter(product => !seedProductNames.has(product.name));
    
    // Delete products that are not in seed data
    if (productsToDelete.length > 0) {
      await Product.deleteMany({
        _id: { $in: productsToDelete.map(product => product._id) }
      });
      console.log(`🗑️ Deleted ${productsToDelete.length} products that are not in seed data`);
    }
    
    for (const product of productsData) {
      console.log(`\n📦 Processing product: ${product.name}`);
      
      // Check if product already exists
      const existing = await Product.findOne({ name: product.name });

      // Get brand ObjectId
      const brand = await Brand.findOne({ name: product.brand });
      if (!brand) {
        console.error(`❌ Brand not found: ${product.brand}`);
        continue;
      }

      try {
        // Get category IDs from path
        const categoryIds = await findCategoryIdsByPath(product.categoryPath);
        console.log(`✅ Found categories for ${product.name}:`, categoryIds);

        if (existing) {
          // Update existing product
          const updatedProduct = await Product.findByIdAndUpdate(
            existing._id,
            {
              name: product.name,
              description: product.description,
              price: product.price,
              discountPrice: product.discountPrice || null,
              categories: categoryIds,
              images: product.images,
              sizes: product.sizes || [],
              colors: product.colors || [],
              tags: product.tags || [],
              brand: brand._id
            },
            { new: true }
          );
          if (updatedProduct) {
            console.log(`✅ Updated product: ${product.name} with ID: ${updatedProduct._id}`);
          } else {
            console.error(`❌ Failed to update product: ${product.name}`);
          }
        } else {
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
            brand: brand._id
          }).save();
          console.log(`✅ Created product: ${product.name} with ID: ${newProduct._id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing categories for ${product.name}:`, error);
        continue;
      }
    }

    console.log("\n✅ Product seeding completed.");
  } catch (error) {
    console.error("\n❌ Error seeding products:", error);
    throw error;
  }
}; 