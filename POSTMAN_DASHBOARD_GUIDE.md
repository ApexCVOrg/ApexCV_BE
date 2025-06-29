# Hướng dẫn Test Dashboard Manager với Postman

## 1. Thiết lập Postman

### Base URL
```
http://localhost:3000/api/manager
```

### Headers cần thiết
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

## 2. Lấy JWT Token (Đăng nhập Manager)

### Request
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "manager@example.com",
    "password": "your_password"
  }
  ```

### Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "manager@example.com",
    "role": "manager"
  }
}
```

**Lưu token này để sử dụng cho các request tiếp theo**

## 3. Test các Dashboard Endpoints

### 3.1. Dashboard Summary
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/summary`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "lowStockCount": 5,
    "todaySales": 1500000,
    "deliveredOrders": 25,
    "conversionRate": 85,
    "completionRate": 80,
    "cancelledOrders": 3,
    "salesChart": [
      {
        "month": "January",
        "revenue": 5000000,
        "orders": 50
      }
    ],
    "topProducts": [
      {
        "_id": "...",
        "name": "Product Name",
        "category": "Category Name",
        "image": "image_url",
        "totalSold": 100,
        "revenue": 5000000
      }
    ],
    "orderStats": [
      {
        "status": "delivered",
        "count": 25,
        "percent": 50,
        "color": "#4CAF50"
      }
    ]
  }
}
```

### 3.2. Low Stock Products
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/low-stock`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "products": [
      {
        "_id": "...",
        "name": "Product Name",
        "price": 100000,
        "status": "out_of_stock",
        "images": ["image_url"]
      }
    ]
  }
}
```

### 3.3. Today Sales
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/today-sales`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "sales": 1500000,
    "orders": 15,
    "date": "2024-01-15"
  }
}
```

### 3.4. Order Statistics
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/order-stats`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 50,
    "stats": [
      {
        "status": "delivered",
        "count": 25,
        "percent": 50,
        "color": "#4CAF50"
      },
      {
        "status": "pending",
        "count": 15,
        "percent": 30,
        "color": "#FFA500"
      }
    ]
  }
}
```

### 3.5. Top Selling Products
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/top-products`
- **Query Parameters** (optional):
  - `limit`: 5 (default)
  - `days`: 30 (default)
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Example URLs:**
- `http://localhost:3000/api/manager/dashboard/top-products`
- `http://localhost:3000/api/manager/dashboard/top-products?limit=10&days=7`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "products": [
      {
        "_id": "...",
        "name": "Product Name",
        "category": "Category Name",
        "image": "image_url",
        "totalSold": 100,
        "revenue": 5000000
      }
    ]
  }
}
```

### 3.6. Sales Chart
- **Method**: GET
- **URL**: `http://localhost:3000/api/manager/dashboard/sales-chart`
- **Query Parameters** (optional):
  - `months`: 12 (default)
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

**Example URLs:**
- `http://localhost:3000/api/manager/dashboard/sales-chart`
- `http://localhost:3000/api/manager/dashboard/sales-chart?months=6`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period": "12 months",
    "chart": [
      {
        "month": "January",
        "revenue": 5000000,
        "orders": 50
      },
      {
        "month": "February",
        "revenue": 6000000,
        "orders": 60
      }
    ]
  }
}
```

## 4. Error Responses

### 401 Unauthorized (Không có token)
```json
{
  "message": "Không tìm thấy token xác thực"
}
```

### 403 Forbidden (Không đủ quyền)
```json
{
  "message": "Không có quyền truy cập"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching dashboard data",
  "error": "Error details"
}
```

## 5. Test Cases

### Test Case 1: Không có token
1. Gọi endpoint mà không có header Authorization
2. Expected: 401 Unauthorized

### Test Case 2: Token không hợp lệ
1. Gọi endpoint với token sai
2. Expected: 401 Unauthorized

### Test Case 3: User không phải manager
1. Đăng nhập với user thường
2. Gọi dashboard endpoint
3. Expected: 403 Forbidden

### Test Case 4: Token hết hạn
1. Sử dụng token cũ
2. Expected: 401 Unauthorized

## 6. Tips

1. **Lưu token**: Sau khi đăng nhập, copy token và sử dụng cho tất cả request
2. **Environment Variables**: Tạo environment trong Postman để lưu base URL và token
3. **Collection**: Tạo collection cho tất cả dashboard endpoints
4. **Tests**: Thêm tests để verify response status và data structure

## 7. Environment Setup trong Postman

### Variables
- `base_url`: `http://localhost:3000/api/manager`
- `auth_token`: Token từ login response

### Headers (Collection Level)
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

## 8. Troubleshooting

### Server không chạy
```bash
npm run dev
```

### Database connection error
Kiểm tra MongoDB connection string trong `.env`

### No data returned
Đảm bảo có dữ liệu trong database (orders, products, users)

### CORS error
Kiểm tra CORS configuration trong server 