# Favorites API Guide - ApexCV Backend

## Tổng quan
API Favorites cho phép người dùng quản lý danh sách sản phẩm yêu thích của họ. Tất cả endpoints đều yêu cầu authentication.

## Base URL
```
http://localhost:5000/api/favorites
```

## Authentication
Tất cả requests phải include JWT token trong header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### 1. Lấy danh sách favorites
**GET** `/api/favorites`

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 100,
        "discountPrice": 80,
        "images": ["image1.jpg", "image2.jpg"],
        "brand": {
          "_id": "brand_id",
          "name": "Brand Name"
        },
        "categories": [
          {
            "_id": "category_id",
            "name": "Category Name"
          }
        ],
        "sizes": [
          {
            "size": "M",
            "stock": 10
          }
        ],
        "colors": ["Red", "Blue"],
        "tags": ["tag1", "tag2"],
        "status": "active",
        "ratingsAverage": 4.5,
        "ratingsQuantity": 10,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

### 2. Thêm sản phẩm vào favorites
**POST** `/api/favorites/add/:productId`

**Parameters:**
- `productId` (string): ID của sản phẩm

**Response:**
```json
{
  "success": true,
  "message": "Product added to favorites successfully",
  "data": {
    "favorites": [...],
    "count": 2
  }
}
```

### 3. Xóa sản phẩm khỏi favorites
**DELETE** `/api/favorites/remove/:productId`

**Parameters:**
- `productId` (string): ID của sản phẩm

**Response:**
```json
{
  "success": true,
  "message": "Product removed from favorites successfully",
  "data": {
    "favorites": [...],
    "count": 1
  }
}
```

### 4. Kiểm tra sản phẩm có trong favorites không
**GET** `/api/favorites/check/:productId`

**Parameters:**
- `productId` (string): ID của sản phẩm

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true,
    "productId": "product_id"
  }
}
```

### 5. Toggle favorite (thêm/xóa)
**POST** `/api/favorites/toggle/:productId`

**Parameters:**
- `productId` (string): ID của sản phẩm

**Response:**
```json
{
  "success": true,
  "message": "Product added to favorites",
  "data": {
    "favorites": [...],
    "count": 2,
    "isFavorite": true
  }
}
```

### 6. Xóa tất cả favorites
**DELETE** `/api/favorites/clear`

**Response:**
```json
{
  "success": true,
  "message": "All favorites cleared successfully",
  "data": {
    "favorites": [],
    "count": 0
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Product is already in favorites"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Sử dụng với Frontend

### 1. Hiển thị danh sách favorites
```javascript
const getFavorites = async () => {
  const response = await fetch('/api/favorites', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.favorites;
};
```

### 2. Toggle favorite button
```javascript
const toggleFavorite = async (productId) => {
  const response = await fetch(`/api/favorites/toggle/${productId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.isFavorite;
};
```

### 3. Kiểm tra trạng thái favorite
```javascript
const checkFavorite = async (productId) => {
  const response = await fetch(`/api/favorites/check/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.isFavorite;
};
```

## Integration với User Profile

Favorites cũng được embed trong User model và có thể truy cập qua:

**GET** `/api/users/profile`

Response sẽ include favorites array:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "fullName": "User Name",
  "favorites": [...],
  "count": 2
}
```

## Notes
- Tất cả endpoints đều yêu cầu user đã đăng nhập
- Product ID phải là MongoDB ObjectId hợp lệ
- Favorites được lưu trữ trong User document dưới dạng array
- Populate tự động được thực hiện để lấy thông tin đầy đủ của sản phẩm 