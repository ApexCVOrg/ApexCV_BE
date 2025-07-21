# Chat System for Manager

Hệ thống chat cho phép manager tương tác với khách hàng thông qua chat interface.

## Cấu trúc Database

### Collection: ChatSession

```typescript
{
  chatId: string; // Unique identifier cho session
  userId: string; // ID của user
  status: 'open' | 'closed'; // Trạng thái session
  updatedAt: Date; // Thời gian cập nhật cuối
  createdAt: Date; // Thời gian tạo
}
```

### Collection: ChatMessage

```typescript
{
  chatId: string; // Reference đến ChatSession
  role: 'user' | 'manager'; // Người gửi tin nhắn
  content: string; // Nội dung tin nhắn (max 1000 chars)
  createdAt: Date; // Thời gian gửi
}
```

## API Endpoints

### 1. GET /api/manager/chats

Lấy danh sách chat sessions với phân trang và filter.

**Query Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số lượng per page (default: 10, max: 100)
- `status` (optional): Filter theo status ('open' | 'closed')

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "chatId": "chat_1703123456789_abc123",
      "userId": "user_001",
      "status": "open",
      "updatedAt": "2023-12-21T10:30:00.000Z",
      "createdAt": "2023-12-21T10:00:00.000Z",
      "lastMessage": {
        "content": "Tôi muốn mua áo đấu Arsenal nam",
        "role": "user",
        "createdAt": "2023-12-21T10:30:00.000Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. GET /api/manager/chats/:chatId/messages

Lấy toàn bộ tin nhắn của một chat session.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "chatId": "chat_1703123456789_abc123",
      "role": "user",
      "content": "Xin chào, tôi muốn hỏi về sản phẩm Arsenal",
      "createdAt": "2023-12-21T10:00:00.000Z"
    },
    {
      "chatId": "chat_1703123456789_abc123",
      "role": "manager",
      "content": "Chào bạn! Chúng tôi có nhiều sản phẩm Arsenal...",
      "createdAt": "2023-12-21T10:01:00.000Z"
    }
  ]
}
```

### 3. POST /api/manager/chats/:chatId/messages

Gửi tin nhắn từ manager.

**Request Body:**

```json
{
  "content": "Nội dung tin nhắn"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "message_id",
    "content": "Nội dung tin nhắn",
    "role": "manager",
    "createdAt": "2023-12-21T10:35:00.000Z"
  }
}
```

### 4. PATCH /api/manager/chats/:chatId/close

Đóng chat session.

**Request Body:**

```json
{
  "note": "Ghi chú khi đóng session (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Chat session closed successfully"
}
```

## Authentication & Authorization

Tất cả endpoints yêu cầu:

- **Authorization Header**: `Bearer <token>`
- **Role**: `manager`

### Middleware: checkManagerAuth

- Verify JWT token
- Kiểm tra role = 'manager'
- Thêm user info vào request

## Validation

### Input Validation

- `page`: Integer >= 1
- `limit`: Integer 1-100
- `status`: Enum ['open', 'closed']
- `chatId`: Required string
- `content`: Required string, 1-1000 characters
- `note`: Optional string, max 500 characters

### Error Responses

- **400**: Validation failed
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (wrong role)
- **404**: Chat session not found
- **500**: Internal server error

## Service Layer

### ChatService Methods

- `getSessions(page, limit, filter?)`: Lấy danh sách sessions
- `getMessages(chatId)`: Lấy tin nhắn của session
- `sendManagerMessage(chatId, managerId, content)`: Gửi tin nhắn
- `closeSession(chatId, managerId, note?)`: Đóng session
- `createSession(userId)`: Tạo session mới (cho user)
- `sendUserMessage(chatId, content)`: Gửi tin nhắn từ user

## Usage Examples

### 1. Lấy danh sách chat sessions đang mở

```bash
GET /api/manager/chats?status=open&page=1&limit=20
Authorization: Bearer <manager_token>
```

### 2. Gửi tin nhắn

```bash
POST /api/manager/chats/chat_1703123456789_abc123/messages
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "content": "Cảm ơn bạn đã liên hệ! Tôi sẽ hỗ trợ bạn ngay."
}
```

### 3. Đóng session với ghi chú

```bash
PATCH /api/manager/chats/chat_1703123456789_abc123/close
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "note": "Khách hàng đã được hỗ trợ đầy đủ"
}
```

## Testing

### Seed Data

Script `seedChatData.ts` tạo dữ liệu mẫu:

- 3 chat sessions (2 open, 1 closed)
- 10 tin nhắn mẫu với nội dung thực tế
- Timestamps hợp lý cho testing

### Test Cases

1. **Authentication**: Test với token không hợp lệ
2. **Authorization**: Test với role không phải manager
3. **Validation**: Test với input không hợp lệ
4. **Business Logic**: Test đóng session, gửi tin nhắn
5. **Error Handling**: Test với session không tồn tại

## Security Considerations

1. **JWT Token**: Sử dụng JWT_SECRET environment variable
2. **Role-based Access**: Chỉ manager mới có quyền truy cập
3. **Input Validation**: Validate tất cả input từ client
4. **Rate Limiting**: Có thể thêm rate limiting cho API
5. **Data Sanitization**: Sanitize content trước khi lưu database
