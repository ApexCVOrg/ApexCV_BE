import mongoose from 'mongoose';
import { ChatMessageModel } from '../models/ChatMessage';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apexcv');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migrate bot messages from role 'manager' to 'bot'
const migrateBotMessages = async () => {
  try {
    console.log('Starting bot messages migration...');

    // Find all messages with role 'manager' that are likely bot messages
    // We'll identify them by common bot response patterns
    const botPatterns = [
      'Xin chào! Cảm ơn bạn đã liên hệ',
      'Cảm ơn bạn đã liên hệ!',
      'Xin chào! Nhân viên của chúng tôi',
      'Chúng tôi sẽ phản hồi trong thời gian sớm nhất',
      'Nhân viên sẽ phản hồi trong',
      'Cảm ơn bạn đã quan tâm!',
      'Xin chào! Bạn cần hỗ trợ gì ạ?',
      'Chúng tôi sẵn sàng giúp đỡ',
      'Shop:',
      'Bot:',
    ];

    // Update messages that match bot patterns
    const updateResult = await ChatMessageModel.updateMany(
      {
        role: 'manager',
        content: { $regex: botPatterns.join('|'), $options: 'i' },
      },
      {
        $set: {
          role: 'bot',
          isBotMessage: true,
        },
      },
    );

    console.log(`Migration completed! Updated ${updateResult.modifiedCount} messages.`);

    // Also update messages that have isBotMessage flag but wrong role
    const updateBotFlagResult = await ChatMessageModel.updateMany(
      {
        role: 'manager',
        isBotMessage: true,
      },
      {
        $set: {
          role: 'bot',
        },
      },
    );

    console.log(`Updated ${updateBotFlagResult.modifiedCount} messages with isBotMessage flag.`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run migration
if (require.main === module) {
  connectDB().then(() => {
    migrateBotMessages();
  });
}

export { migrateBotMessages };
