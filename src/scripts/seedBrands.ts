import mongoose from "mongoose";
import { Brand } from "../models/Brand";

const brandsData = [
  {
    name: "Nike",
    description: "Just Do It",
    logo: "https://example.com/nike-logo.png",
    website: "https://www.nike.com"
  },
  {
    name: "Adidas",
    description: "Impossible Is Nothing",
    logo: "https://example.com/adidas-logo.png",
    website: "https://www.adidas.com"
  }
];

export const seedBrands = async () => {
  try {
    console.log("🔄 Starting brand seeding...");
    
    // Get all existing brands
    const existingBrands = await Brand.find({});
    
    // Create a set of all brand names from seed data
    const seedBrandNames = new Set<string>(brandsData.map(brand => brand.name));
    
    // Find brands to delete (those that exist in DB but not in seed data)
    const brandsToDelete = existingBrands.filter(brand => !seedBrandNames.has(brand.name));
    
    // Delete brands that are not in seed data
    if (brandsToDelete.length > 0) {
      await Brand.deleteMany({
        _id: { $in: brandsToDelete.map(brand => brand._id) }
      });
      console.log(`🗑️ Deleted ${brandsToDelete.length} brands that are not in seed data`);
    }
    
    // Create or update brands
    for (const brandData of brandsData) {
      const existingBrand = await Brand.findOne({ name: brandData.name }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
      
      if (existingBrand) {
        console.log(`ℹ️ Brand already exists: ${brandData.name}`);
        continue;
      }

      const newBrand = await new Brand(brandData).save();
      console.log(`✅ Created brand: ${brandData.name} with ID: ${newBrand._id}`);
    }

    console.log("\n✅ Brand seeding completed.");
  } catch (error) {
    console.error("\n❌ Error seeding brands:", error);
    throw error;
  }
}; 