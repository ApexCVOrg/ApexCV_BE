import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IChatSession extends MongooseDocument {
  chatId: string;
  userId: string;
  managerId?: string;
  status: 'open' | 'closed' | 'manager_joined';
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    chatId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    userId: { 
      type: String, 
      required: true,
      index: true 
    },
    managerId: {
      type: String,
      required: false,
      index: true
    },
    status: { 
      type: String, 
      enum: ['open', 'closed', 'manager_joined'], 
      default: 'open',
      index: true 
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastMessage: {
      type: String,
      maxlength: 100
    },
    lastMessageAt: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index cho tìm kiếm hiệu quả
ChatSessionSchema.index({ status: 1, updatedAt: -1 });
ChatSessionSchema.index({ userId: 1, status: 1 });
ChatSessionSchema.index({ unreadCount: 1, lastMessageAt: -1 });

export const ChatSessionModel: Model<IChatSession> = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema); 