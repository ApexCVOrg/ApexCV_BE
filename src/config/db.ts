import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Thay YOUR_MONGO_URI bằng connection string MongoDB của bạn
    const conn = await mongoose.connect(process.env.MONGO_URI || "YOUR_MONGODB_URI", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1); // Dừng app nếu không kết nối được
  }
};

export default connectDB;
