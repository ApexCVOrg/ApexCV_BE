import mongoose from 'mongoose';
import { ChatSessionModel } from '../models/ChatSession';
import { ChatMessageModel } from '../models/ChatMessage';

const chatSessionsData = [
  {
    chatId: 'chat_1703123456789_abc123',
    userId: 'user_001',
    status: 'open'
  },
  {
    chatId: 'chat_1703123456790_def456',
    userId: 'user_002',
    status: 'open'
  },
  {
    chatId: 'chat_1703123456791_ghi789',
    userId: 'user_003',
    status: 'closed'
  }
];

const chatMessagesData = [
  // Messages for chat_1703123456789_abc123
  {
    chatId: 'chat_1703123456789_abc123',
    role: 'user',
    content: 'Xin chào, tôi muốn hỏi về sản phẩm Arsenal'
  },
  {
    chatId: 'chat_1703123456789_abc123',
    role: 'manager',
    content: 'Chào bạn! Chúng tôi có nhiều sản phẩm Arsenal cho nam, nữ và trẻ em. Bạn quan tâm đến sản phẩm nào?'
  },
  {
    chatId: 'chat_1703123456789_abc123',
    role: 'user',
    content: 'Tôi muốn mua áo đấu Arsenal nam'
  },
  {
    chatId: 'chat_1703123456789_abc123',
    role: 'manager',
    content: 'Tuyệt! Chúng tôi có Arsenal Men\'s Home Jersey 2024/25 với giá 1.959.000đ (giảm từ 2.199.000đ). Bạn muốn size nào?'
  },

  // Messages for chat_1703123456790_def456
  {
    chatId: 'chat_1703123456790_def456',
    role: 'user',
    content: 'Chào shop, tôi muốn hỏi về chính sách đổi trả'
  },
  {
    chatId: 'chat_1703123456790_def456',
    role: 'manager',
    content: 'Chào bạn! Chúng tôi có chính sách đổi trả trong vòng 30 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tem mác và chưa qua sử dụng.'
  },

  // Messages for chat_1703123456791_ghi789 (closed session)
  {
    chatId: 'chat_1703123456791_ghi789',
    role: 'user',
    content: 'Tôi muốn hủy đơn hàng'
  },
  {
    chatId: 'chat_1703123456791_ghi789',
    role: 'manager',
    content: 'Bạn có thể hủy đơn hàng trước khi đơn được chuyển sang trạng thái "Đang giao". Bạn cho tôi biết mã đơn hàng để tôi kiểm tra nhé.'
  },
  {
    chatId: 'chat_1703123456791_ghi789',
    role: 'user',
    content: 'Mã đơn hàng là ORD123456'
  },
  {
    chatId: 'chat_1703123456791_ghi789',
    role: 'manager',
    content: 'Tôi đã kiểm tra và hủy đơn hàng ORD123456 cho bạn. Bạn sẽ nhận được email xác nhận trong vài phút.'
  }
];

export const seedChatData = async () => {
  try {
    console.log('🌱 Seeding chat data...');

    // Clear existing data
    await ChatSessionModel.deleteMany({});
    await ChatMessageModel.deleteMany({});

    // Insert chat sessions
    for (const sessionData of chatSessionsData) {
      const session = new ChatSessionModel(sessionData);
      await session.save();
    }

    // Insert chat messages with proper timestamps
    for (let i = 0; i < chatMessagesData.length; i++) {
      const messageData = chatMessagesData[i];
      const message = new ChatMessageModel({
        ...messageData,
        createdAt: new Date(Date.now() - (chatMessagesData.length - i) * 60000) // 1 minute apart
      });
      await message.save();
    }

    // Update session updatedAt timestamps
    for (const sessionData of chatSessionsData) {
      const lastMessage = await ChatMessageModel.findOne(
        { chatId: sessionData.chatId },
        {},
        { sort: { createdAt: -1 } }
      );
      
      if (lastMessage) {
        await ChatSessionModel.updateOne(
          { chatId: sessionData.chatId },
          { updatedAt: lastMessage.createdAt }
        );
      }
    }

    console.log('✅ Chat data seeded successfully');
    console.log(`   - ${chatSessionsData.length} chat sessions created`);
    console.log(`   - ${chatMessagesData.length} chat messages created`);
  } catch (error) {
    console.error('❌ Error seeding chat data:', error);
    throw error;
  }
}; 