const mongoose = require('mongoose');
require('dotenv').config();

async function debugDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Define schemas inline for debugging
    const CategorySchema = new mongoose.Schema({
      name: String,
      description: String,
      parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      status: String,
      createdAt: Date,
      updatedAt: Date
    });
    
    const ProductSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      discountPrice: Number,
      categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
      images: [String],
      sizes: [{ size: String, stock: Number }],
      colors: [String],
      tags: [String],
      status: String,
      createdAt: Date
    });
    
    const BrandSchema = new mongoose.Schema({
      name: String,
      description: String,
      logo: String,
      website: String
    });
    
    const Category = mongoose.model('Category', CategorySchema);
    const Product = mongoose.model('Product', ProductSchema);
    const Brand = mongoose.model('Brand', BrandSchema);
    
    // Check counts
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const brandCount = await Brand.countDocuments();
    
    console.log('\n📊 Database Statistics:');
    console.log(`Categories: ${categoryCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Brands: ${brandCount}`);
    
    if (categoryCount === 0) {
      console.log('\n❌ No categories found! Need to run seed script.');
      return;
    }
    
    if (productCount === 0) {
      console.log('\n❌ No products found! Need to run seed script.');
      return;
    }
    
    // Check Men category structure
    console.log('\n🔍 Checking Men category structure...');
    const menCategory = await Category.findOne({ name: 'Men', parentCategory: null });
    
    if (!menCategory) {
      console.log('❌ Men category not found!');
      return;
    }
    
    console.log(`✅ Found Men category: ${menCategory._id}`);
    
    // Find team categories under Men
    const menTeamCategories = await Category.find({ parentCategory: menCategory._id });
    console.log(`📁 Men team categories: ${menTeamCategories.length}`);
    menTeamCategories.forEach(team => {
      console.log(`  - ${team.name} (${team._id})`);
    });
    
    if (menTeamCategories.length === 0) {
      console.log('❌ No team categories under Men!');
      return;
    }
    
    // Find product type categories under teams
    const productTypeCategories = await Category.find({
      parentCategory: { $in: menTeamCategories.map(cat => cat._id) }
    });
    
    console.log(`📦 Product type categories: ${productTypeCategories.length}`);
    productTypeCategories.forEach(type => {
      console.log(`  - ${type.name} (${type._id})`);
    });
    
    if (productTypeCategories.length === 0) {
      console.log('❌ No product type categories found!');
      return;
    }
    
    // Check products with these categories
    const menProducts = await Product.find({
      categories: { $in: productTypeCategories.map(cat => cat._id) }
    }).populate('categories', 'name').populate('brand', 'name');
    
    console.log(`\n👕 Men products found: ${menProducts.length}`);
    menProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.brand?.name})`);
      console.log(`    Categories: ${product.categories.map(cat => cat.name).join(', ')}`);
    });
    
    // Test the API logic
    console.log('\n🧪 Testing API logic...');
    
    // Simulate the API logic
    const genderName = 'men';
    const genderCategory = await Category.findOne({
      name: genderName.charAt(0).toUpperCase() + genderName.slice(1),
      parentCategory: null
    });
    
    if (!genderCategory) {
      console.log('❌ Gender category not found in API logic');
      return;
    }
    
    const genderCategories = await Category.find({
      parentCategory: genderCategory._id
    });
    
    if (!genderCategories.length) {
      console.log('❌ No team categories found in API logic');
      return;
    }
    
    const productTypeCategoriesAPI = await Category.find({
      parentCategory: { $in: genderCategories.map((cat) => cat._id) }
    });
    
    if (!productTypeCategoriesAPI.length) {
      console.log('❌ No product categories found in API logic');
      return;
    }
    
    const productsAPI = await Product.find({
      categories: { $in: productTypeCategoriesAPI.map((cat) => cat._id) }
    });
    
    console.log(`✅ API logic found ${productsAPI.length} products for men`);
    
  } catch (error) {
    console.error('❌ Error debugging database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

debugDatabase(); 