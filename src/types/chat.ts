import admin from 'firebase-admin'

export interface ChatRequest {
  message: string
  userId: string
}

export interface ChatResponse {
  reply: string
  chatId: string
}

export interface ChatRecord {
  userId: string
  message: string
  reply: string
  createdAt: admin.firestore.Timestamp
} 