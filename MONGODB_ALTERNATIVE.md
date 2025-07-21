# MongoDB Alternative Solutions

## Vấn đề hiện tại
Node.js v22.16.0 có conflict với MongoDB Atlas SSL/TLS connection.

## Giải pháp thay thế

### 1. Sử dụng MongoDB Local (Development)
```bash
# Install MongoDB locally
npm install -g mongodb-memory-server

# Hoặc sử dụng Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Tạo MongoDB Atlas Cluster mới
1. Vào MongoDB Atlas Dashboard
2. Create New Cluster
3. Chọn M0 (Free tier)
4. Cloud Provider: AWS
5. Region: Singapore (ap-southeast-1)
6. Cluster Name: nidas-new

### 3. Sử dụng MongoDB Atlas với connection string mới
```
mongodb+srv://nidasorgweb:Thithithi%400305@nidas-new.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority
```

### 4. Sử dụng MongoDB Atlas với Network Access mới
1. Network Access → Add IP Address
2. Add: `0.0.0.0/0` (Allow access from anywhere)
3. Database Access → Add Database User
4. Username: nidasorgweb
5. Password: Thithithi@0305
6. Built-in Role: Atlas admin

### 5. Sử dụng MongoDB Atlas với TLS 1.2
```javascript
const mongoUri = 'mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority&ssl=true&tls=true&tlsInsecure=true&tlsAllowInvalidCertificates=true'
```

### 6. Sử dụng MongoDB Atlas với connection options
```javascript
await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  sslValidate: false,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
})
```

### 7. Sử dụng MongoDB Atlas với Node.js 18
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

## Khuyến nghị
1. **Development**: Sử dụng MongoDB local
2. **Production**: Tạo MongoDB Atlas cluster mới với Node.js 18
3. **Testing**: Sử dụng MongoDB memory server

## Environment Variables
```env
# Development
MONGO_URI=mongodb://localhost:27017/nidas

# Production (new cluster)
MONGO_URI=mongodb+srv://nidasorgweb:Thithithi%400305@nidas-new.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority
``` 