import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, index: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Tạo text index cho title và content
DocumentSchema.index({ title: 'text', content: 'text' });

export const DocumentModel: Model<IDocument> = mongoose.model<IDocument>(
  'Document',
  DocumentSchema,
);
