# Chat API Integration - Anti-Abuse System

## Tổng quan
Tính năng chat đã được tích hợp vào project hiện có với OpenAI GPT-3.5 và Firebase Firestore, kèm theo hệ thống bảo vệ chống spam và abuse.

## Cấu hình cần thiết

### 1. Environment Variables
Thêm vào file `.env`:
```env
OPENAI_API_KEY=your-openai-api-key
FIREBASE_PROJECT_ID=your-firebase-project-id
JWT_SECRET=your-jwt-secret
```

### 2. Firebase Setup
- Tạo project Firebase mới hoặc sử dụng project hiện có
- Bật Firestore Database
- Tạo service account key và cấu hình credentials

### 3. OpenAI Setup
- Tạo API key tại [OpenAI Platform](https://platform.openai.com/api-keys)
- Sử dụng model `gpt-3.5-turbo` cho tốc độ nhanh và chi phí hợp lý

## 🔒 Anti-Abuse Security Features

### Authentication
- **Header-based**: Sử dụng `x-user-id` header
- **Session-based**: Fallback về `req.session.userId`
- **User isolation**: Mỗi user chỉ có thể gửi và xem chat của chính mình

### Message Validation
- **Length limit**: Tối đa 500 ký tự
- **HTML/Script blocking**: Chặn HTML tags và script injection
- **Banned words**: Chặn từ ngữ không phù hợp
- **Spam detection**: Chặn ký tự lặp lại và URL spam
- **XSS prevention**: Chặn các pattern độc hại

### Rate Limiting
- **Chat messages**: 10 tin nhắn/phút/userId
- **History requests**: 30 requests/phút/userId
- **Per-user tracking**: Rate limit theo từng userId riêng biệt

## API Endpoint

### POST /api/chat

**Headers:**
```
x-user-id: your-user-id
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Tôi cần tư vấn áo sơ mi nữ"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Chào bạn! Tôi có thể giúp bạn tìm áo sơ mi nữ phù hợp...",
    "chatId": "abc123def456"
  }
}
```

**Error Responses:**
```json
// Authentication error
{
  "success": false,
  "message": "User ID is required. Please provide x-user-id header or valid session."
}

// Validation error
{
  "success": false,
  "message": "Message contains inappropriate content",
  "bannedWords": ["ngu", "đm"]
}

// Rate limit error
{
  "success": false,
  "message": "Rate limit exceeded. Maximum 10 messages per minute.",
  "retryAfter": 60
}
```

### GET /api/chat/history

**Headers:**
```
x-user-id: your-user-id
```

**Query Parameters:**
- `limit` (optional): Số lượng chat tối đa trả về (default: 50, max: 100)
- `offset` (optional): Số chat bỏ qua (default: 0)

**Example Request:**
```
GET /api/chat/history?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "userId": "user123",
        "message": "Tôi cần tư vấn áo sơ mi nữ",
        "reply": "Chào bạn! Tôi có thể giúp bạn...",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

## Cấu trúc dữ liệu Firestore

Collection: `chats`
```json
{
  "userId": "string",
  "message": "string", 
  "reply": "string",
  "createdAt": "Firestore Timestamp"
}
```

## Chạy project

```bash
npm run dev
```

## Test API

```bash
# Gửi tin nhắn với userId
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "message": "Tôi cần tư vấn áo sơ mi nữ"
  }'

# Lấy lịch sử chat
curl -X GET "http://localhost:5000/api/chat/history?limit=10" \
  -H "x-user-id: user123"
```

## Security Features

### ✅ Anti-Spam Protection
- Rate limiting per user
- Message length validation
- Banned words filtering
- HTML/script injection blocking

### ✅ User Isolation
- Each user can only access their own chat history
- No cross-user data access
- Secure userId validation

### ✅ Content Validation
- XSS prevention
- Spam pattern detection
- URL limit enforcement
- Inappropriate content blocking

## Files đã thêm/sửa đổi

1. `src/config/firebase.ts` - Cấu hình Firebase Admin SDK
2. `src/types/chat.ts` - TypeScript types cho chat
3. `src/types/express/index.d.ts` - Extend Express Request interface
4. `src/middlewares/chatAuth.ts` - Authentication middleware
5. `src/middlewares/chatValidation.ts` - Message validation middleware
6. `src/middlewares/chatRateLimit.ts` - Rate limiting middleware
7. `src/routes/chat.route.ts` - Chat API route với anti-abuse protection
8. `src/constants/routes.ts` - Thêm CHAT_ROUTES
9. `src/index.ts` - Đăng ký chat route
10. `.env` - Thêm environment variables 