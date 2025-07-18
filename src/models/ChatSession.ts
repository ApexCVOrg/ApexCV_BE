import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IChatSession extends MongooseDocument {
  chatId: string;
  userId: string;
  status: 'open' | 'closed';
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
    status: { 
      type: String, 
      enum: ['open', 'closed'], 
      default: 'open',
      index: true 
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

export const ChatSessionModel: Model<IChatSession> = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema); 