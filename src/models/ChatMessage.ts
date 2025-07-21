import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IChatMessage extends MongooseDocument {
  chatId: string;
  role: 'user' | 'manager' | 'bot';
  content: string;
  createdAt: Date;
  isBotMessage?: boolean; // Flag to identify bot messages
  isRead?: boolean; // Flag to track if message is read
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  }>;
  messageType: 'text' | 'file' | 'image';
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: { 
      type: String, 
      required: true,
      index: true 
    },
    role: { 
      type: String, 
      enum: ['user', 'manager', 'bot'], 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      maxlength: 1000 
    },
    isBotMessage: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    },
    attachments: [{
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true }
    }],
    messageType: {
      type: String,
      enum: ['text', 'file', 'image'],
      default: 'text'
    }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Index cho tìm kiếm hiệu quả
ChatMessageSchema.index({ chatId: 1, createdAt: 1 });
ChatMessageSchema.index({ chatId: 1, isRead: 1 });

export const ChatMessageModel: Model<IChatMessage> = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 