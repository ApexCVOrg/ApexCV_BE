# MongoDB SSL Connection Fix

## Vấn đề
Lỗi SSL/TLS khi kết nối MongoDB Atlas trên Render.com:
```
MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## Nguyên nhân
1. Node.js version quá mới (v22.16.0) có vấn đề với SSL handshake
2. MongoDB Atlas yêu cầu TLS 1.2+ nhưng Node.js mới có thể gây conflict

## Giải pháp

### 1. Downgrade Node.js Version
Thêm vào `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### 2. Sử dụng Connection String đơn giản
```javascript
const mongoUri = 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority'
```

### 3. Thêm SSL Options
```javascript
await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority'
})
```

### 4. Render.com Environment Variables
Đảm bảo set đúng trong Render dashboard:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 5. MongoDB Atlas Settings
1. Vào MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Thêm `0.0.0.0/0` để cho phép tất cả IPs
4. Hoặc thêm IP của Render.com

### 6. Alternative Connection String
Nếu vẫn lỗi, thử:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&tls=true&tlsInsecure=true
```

## Kiểm tra
1. Deploy lại trên Render.com
2. Kiểm tra logs trong Render dashboard
3. Test connection với MongoDB Compass

## Troubleshooting
- Nếu vẫn lỗi, thử tạo MongoDB cluster mới
- Kiểm tra username/password trong connection string
- Đảm bảo database name đúng 