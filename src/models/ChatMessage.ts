import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IChatMessage extends MongooseDocument {
  chatId: string;
  role: 'user' | 'manager';
  content: string;
  createdAt: Date;
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
      enum: ['user', 'manager'], 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      maxlength: 1000 
    }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Index cho tìm kiếm hiệu quả
ChatMessageSchema.index({ chatId: 1, createdAt: 1 });

export const ChatMessageModel: Model<IChatMessage> = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 