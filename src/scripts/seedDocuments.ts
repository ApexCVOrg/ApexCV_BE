// src/scripts/seedDocuments.ts
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { DocumentModel } from '../models/Document';

export const seedDocuments = async () => {
  try {
    const dataPath = path.resolve(__dirname, '../data/document.json');
    if (!fs.existsSync(dataPath)) {
      console.error('❌ File document.json không tồn tại!');
      return;
    }

    const docs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (!Array.isArray(docs)) {
      throw new Error('Dữ liệu không phải là một mảng!');
    }

    let added = 0;
    let skipped = 0;
    for (const doc of docs) {
      const exists = await DocumentModel.findOne({ title: doc.title, content: doc.content });
      if (exists) {
        skipped++;
        continue;
      }
      await DocumentModel.create(doc);
      added++;
    }
    console.log(`✅ Imported ${added} new documents. Skipped ${skipped} documents (already exist).`);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    throw error;
  }
};

// Nếu chạy trực tiếp file này thì seed luôn (giống seedCategories)
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as mongoose.ConnectOptions);
      console.log('MongoDB connected for seeding documents');
      await seedDocuments();
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}