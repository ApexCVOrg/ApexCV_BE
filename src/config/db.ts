const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Thay YOUR_MONGO_URI bằng connection string MongoDB của bạn
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nidas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1); // Dừng app nếu không kết nối được
  }
};

module.exports = connectDB;
