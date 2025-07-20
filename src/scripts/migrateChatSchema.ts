import mongoose from 'mongoose';
import { ChatSessionModel } from '../models/ChatSession';
import { ChatMessageModel } from '../models/ChatMessage';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nidas_db';

async function migrateChatSchema() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update ChatSession documents to add new fields
    console.log('Updating ChatSession documents...');
    const updateResult = await ChatSessionModel.updateMany(
      { 
        $or: [
          { unreadCount: { $exists: false } },
          { lastMessage: { $exists: false } },
          { lastMessageAt: { $exists: false } }
        ]
      },
      {
        $set: {
          unreadCount: 0,
          lastMessage: '',
          lastMessageAt: new Date()
        }
      }
    );
    console.log(`Updated ${updateResult.modifiedCount} ChatSession documents`);

    // Update ChatMessage documents to add isRead field
    console.log('Updating ChatMessage documents...');
    const messageUpdateResult = await ChatMessageModel.updateMany(
      { isRead: { $exists: false } },
      { $set: { isRead: false } }
    );
    console.log(`Updated ${messageUpdateResult.modifiedCount} ChatMessage documents`);

    // Calculate and update unreadCount and lastMessage for existing sessions
    console.log('Calculating unread counts and last messages...');
    const sessions = await ChatSessionModel.find({});
    
    for (const session of sessions) {
      // Get last message
      const lastMessage = await ChatMessageModel.findOne(
        { chatId: session.chatId },
        { content: 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 })
        .lean();

      // Count unread messages
      const unreadCount = await ChatMessageModel.countDocuments({
        chatId: session.chatId,
        isRead: false
      });

      // Update session
      await ChatSessionModel.updateOne(
        { chatId: session.chatId },
        {
          unreadCount,
          lastMessage: lastMessage ? (lastMessage.content.length > 100 ? lastMessage.content.substring(0, 100) + '...' : lastMessage.content) : '',
          lastMessageAt: lastMessage ? lastMessage.createdAt : session.updatedAt
        }
      );
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateChatSchema();
}

export default migrateChatSchema; 