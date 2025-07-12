# Chat API Guide - User vs Manager

Hướng dẫn sử dụng API chat cho User và Manager trong hệ thống ApexCV.

## 🔐 Authentication

Tất cả API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 **USER APIs** - Cho khách hàng gửi tin nhắn

### **Base URL:** `/api/user/chats`

### 1. **Tạo chat session mới**
```http
POST /api/user/chats
```

**Mục đích:** Tạo session chat mới cho user
**Body:** Không cần body
**Response:**
```json
{
  "success": true,
  "message": "Chat session created successfully",
  "data": {
    "chatId": "chat_1703123456789_abc123",
    "userId": "user_001",
    "status": "open",
    "createdAt": "2023-12-21T10:00:00.000Z"
  }
}
```

### 2. **Gửi tin nhắn**
```http
POST /api/user/chats/:chatId/messages
```

**Mục đích:** User gửi tin nhắn đến manager
**Body:**
```json
{
  "content": "Xin chào, tôi cần hỗ trợ về sản phẩm"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "message_id",
    "content": "Xin chào, tôi cần hỗ trợ về sản phẩm",
    "role": "user",
    "createdAt": "2023-12-21T10:05:00.000Z"
  }
}
```

### 3. **Lấy tin nhắn**
```http
GET /api/user/chats/:chatId/messages
```

**Mục đích:** Xem toàn bộ tin nhắn trong session
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chatId": "chat_1703123456789_abc123",
      "role": "user",
      "content": "Xin chào, tôi cần hỗ trợ",
      "createdAt": "2023-12-21T10:00:00.000Z"
    },
    {
      "chatId": "chat_1703123456789_abc123",
      "role": "manager",
      "content": "Chào bạn! Tôi sẽ hỗ trợ bạn ngay",
      "createdAt": "2023-12-21T10:01:00.000Z"
    }
  ]
}
```

### 4. **Lấy danh sách chat sessions**
```http
GET /api/user/chats?page=1&limit=10
```

**Mục đích:** Xem tất cả chat sessions của user
**Query params:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số lượng per page (default: 10)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chatId": "chat_1703123456789_abc123",
      "userId": "user_001",
      "status": "open",
      "updatedAt": "2023-12-21T10:05:00.000Z",
      "createdAt": "2023-12-21T10:00:00.000Z",
      "lastMessage": {
        "content": "Tôi cần hỗ trợ",
        "role": "user",
        "createdAt": "2023-12-21T10:05:00.000Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 👨‍💼 **MANAGER APIs** - Cho nhân viên hỗ trợ

### **Base URL:** `/api/manager/chats`

### 1. **Lấy danh sách chat sessions**
```http
GET /api/manager/chats?page=1&limit=10&status=open
```

**Mục đích:** Manager xem tất cả chat sessions
**Query params:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số lượng per page (default: 10, max: 100)
- `status` (optional): Filter theo status ('open' | 'closed')
**Response:** Tương tự user API nhưng hiển thị tất cả sessions

### 2. **Xem tin nhắn của session**
```http
GET /api/manager/chats/:chatId/messages
```

**Mục đích:** Manager xem tin nhắn của một session cụ thể
**Response:** Tương tự user API

### 3. **Gửi tin nhắn trả lời**
```http
POST /api/manager/chats/:chatId/messages
```

**Mục đích:** Manager trả lời tin nhắn của user
**Body:**
```json
{
  "content": "Cảm ơn bạn đã liên hệ! Tôi sẽ hỗ trợ bạn ngay."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "message_id",
    "content": "Cảm ơn bạn đã liên hệ! Tôi sẽ hỗ trợ bạn ngay.",
    "role": "manager",
    "createdAt": "2023-12-21T10:06:00.000Z"
  }
}
```

### 4. **Đóng chat session**
```http
PATCH /api/manager/chats/:chatId/close
```

**Mục đích:** Manager đóng session khi đã hỗ trợ xong
**Body:**
```json
{
  "note": "Khách hàng đã được hỗ trợ đầy đủ"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Chat session closed successfully"
}
```

---

## 🔄 **Luồng hoạt động hoàn chỉnh:**

### **Bước 1: User tạo chat session**
```javascript
// User tạo session
const response = await fetch('/api/user/chats', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` }
});
const { chatId } = await response.json();
```

### **Bước 2: User gửi tin nhắn**
```javascript
// User gửi tin nhắn
await fetch(`/api/user/chats/${chatId}/messages`, {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'Tôi cần hỗ trợ' })
});
```

### **Bước 3: Manager xem và trả lời**
```javascript
// Manager xem danh sách sessions
const sessions = await fetch('/api/manager/chats?status=open', {
  headers: { 'Authorization': `Bearer ${managerToken}` }
});

// Manager trả lời
await fetch(`/api/manager/chats/${chatId}/messages`, {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${managerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'Tôi sẽ hỗ trợ bạn ngay' })
});
```

### **Bước 4: Manager đóng session**
```javascript
// Manager đóng session
await fetch(`/api/manager/chats/${chatId}/close`, {
  method: 'PATCH',
  headers: { 
    'Authorization': `Bearer ${managerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ note: 'Đã hỗ trợ xong' })
});
```

---

## ⚠️ **Lưu ý quan trọng:**

### **User APIs:**
- ✅ Chỉ có thể truy cập chat sessions của mình
- ✅ Chỉ có thể gửi tin nhắn vào session của mình
- ✅ Không thể đóng session

### **Manager APIs:**
- ✅ Có thể xem tất cả chat sessions
- ✅ Có thể trả lời bất kỳ session nào
- ✅ Có thể đóng session
- ✅ Cần role = 'manager'

### **Bảo mật:**
- 🔐 Tất cả API đều yêu cầu JWT token
- 🔐 User chỉ có thể truy cập dữ liệu của mình
- 🔐 Manager cần role phù hợp
- 🔐 Validation input trước khi lưu database

---

## 🧪 **Test với cURL:**

### **User test:**
```bash
# Tạo session
curl -X POST http://localhost:5000/api/user/chats \
  -H "Authorization: Bearer USER_TOKEN"

# Gửi tin nhắn
curl -X POST http://localhost:5000/api/user/chats/CHAT_ID/messages \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

### **Manager test:**
```bash
# Xem sessions
curl -X GET http://localhost:5000/api/manager/chats \
  -H "Authorization: Bearer MANAGER_TOKEN"

# Trả lời tin nhắn
curl -X POST http://localhost:5000/api/manager/chats/CHAT_ID/messages \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Manager reply"}'
``` 