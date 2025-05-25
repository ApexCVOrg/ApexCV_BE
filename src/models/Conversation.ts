import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  title: String,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }], // người tham gia
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
