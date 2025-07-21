# Postman Guide - Manager Dashboard

## 1. Login để lấy token

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "password"
}
```

## 2. Dashboard Endpoints

### Summary Dashboard

```
GET http://localhost:3000/api/manager/dashboard/summary
Authorization: Bearer YOUR_TOKEN
```

### Low Stock Products

```
GET http://localhost:3000/api/manager/dashboard/low-stock
Authorization: Bearer YOUR_TOKEN
```

### Today Sales

```
GET http://localhost:3000/api/manager/dashboard/today-sales
Authorization: Bearer YOUR_TOKEN
```

### Order Stats

```
GET http://localhost:3000/api/manager/dashboard/order-stats
Authorization: Bearer YOUR_TOKEN
```

### Top Products

```
GET http://localhost:3000/api/manager/dashboard/top-products?limit=5&days=30
Authorization: Bearer YOUR_TOKEN
```

### Sales Chart

```
GET http://localhost:3000/api/manager/dashboard/sales-chart?months=12
Authorization: Bearer YOUR_TOKEN
```

## 3. Headers cho tất cả requests

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## 4. Expected Status Codes

- 200: Success
- 401: No token/invalid token
- 403: Not manager role
- 500: Server error
