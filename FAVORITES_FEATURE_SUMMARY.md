# 🎯 Tính năng Favorites - ApexCV Backend

## 📋 Tổng quan

Đã thêm thành công tính năng **"Yêu thích" (Favorites)** vào backend ApexCV. Tính năng này cho phép người dùng:

- Thêm/xóa sản phẩm vào danh sách yêu thích
- Xem danh sách sản phẩm yêu thích
- Truy cập favorites từ dropdown menu user
- Embed favorites trong User document

## 🏗️ Cấu trúc đã thêm

### 1. **Database Schema**

- **File:** `src/models/User.ts`
- **Thay đổi:** Thêm trường `favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }]`
- **Mô tả:** Array chứa ObjectId của các sản phẩm yêu thích

### 2. **Controllers**

- **File:** `src/controllers/favorites.controller.ts` (mới)
- **File:** `src/controllers/user.controller.ts` (cập nhật)
- **Chức năng:**
  - `getFavorites()` - Lấy danh sách favorites
  - `addToFavorites()` - Thêm sản phẩm vào favorites
  - `removeFromFavorites()` - Xóa sản phẩm khỏi favorites
  - `checkFavorite()` - Kiểm tra sản phẩm có trong favorites không
  - `toggleFavorite()` - Toggle thêm/xóa favorites
  - `clearFavorites()` - Xóa tất cả favorites

### 3. **Routes**

- **File:** `src/routes/favorites.ts` (mới)
- **File:** `src/routes/users.ts` (cập nhật)
- **Endpoints:**
  - `GET /api/favorites` - Lấy danh sách favorites
  - `POST /api/favorites/add/:productId` - Thêm vào favorites
  - `DELETE /api/favorites/remove/:productId` - Xóa khỏi favorites
  - `GET /api/favorites/check/:productId` - Kiểm tra trạng thái
  - `POST /api/favorites/toggle/:productId` - Toggle favorites
  - `DELETE /api/favorites/clear` - Xóa tất cả

### 4. **Constants**

- **File:** `src/constants/routes.ts` (cập nhật)
- **Thêm:** `FAVORITES_ROUTES` với các endpoint constants

### 5. **Main App**

- **File:** `src/index.ts` (cập nhật)
- **Thêm:** Đăng ký favorites router

## 🔗 API Endpoints

### Base URL: `http://localhost:5000/api/favorites`

| Method | Endpoint             | Mô tả                        |
| ------ | -------------------- | ---------------------------- |
| GET    | `/`                  | Lấy danh sách favorites      |
| POST   | `/add/:productId`    | Thêm sản phẩm vào favorites  |
| DELETE | `/remove/:productId` | Xóa sản phẩm khỏi favorites  |
| GET    | `/check/:productId`  | Kiểm tra trạng thái favorite |
| POST   | `/toggle/:productId` | Toggle thêm/xóa favorites    |
| DELETE | `/clear`             | Xóa tất cả favorites         |

## 🔐 Authentication

- Tất cả endpoints đều yêu cầu JWT token
- Header: `Authorization: Bearer YOUR_TOKEN`

## 📊 Response Format

### Success Response

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

### Error Response

```json
{
  "success": false,
  "message": "Product is already in favorites"
}
```

## 🔄 Integration với User Profile

### User Profile Response (cập nhật)

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "fullName": "User Name",
  "favorites": [...], // Thêm trường này
  "count": 2
}
```

## 🧪 Testing

### Test Script

- **File:** `test_favorites_api.js`
- **Chạy:** `node test_favorites_api.js`
- **Chức năng:** Test tất cả endpoints favorites

### Manual Testing với Postman

1. Login để lấy token
2. Sử dụng token trong header `Authorization: Bearer YOUR_TOKEN`
3. Test các endpoints favorites

## 📁 Files đã tạo/cập nhật

### Files mới:

- ✅ `src/controllers/favorites.controller.ts`
- ✅ `src/routes/favorites.ts`
- ✅ `FAVORITES_API_GUIDE.md`
- ✅ `test_favorites_api.js`
- ✅ `FAVORITES_FEATURE_SUMMARY.md`

### Files cập nhật:

- ✅ `src/models/User.ts` - Thêm trường favorites
- ✅ `src/controllers/user.controller.ts` - Thêm functions favorites
- ✅ `src/routes/users.ts` - Thêm routes favorites
- ✅ `src/constants/routes.ts` - Thêm FAVORITES_ROUTES
- ✅ `src/index.ts` - Đăng ký favorites router

## 🎨 Frontend Integration

### Dropdown Menu User

```javascript
// Thêm option "Favorites" vào dropdown
{
  label: "Favorites",
  icon: "heart",
  onClick: () => navigate('/favorites')
}
```

### Favorites Page

```javascript
// Component hiển thị danh sách favorites
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
```

### Product Card với Favorite Button

```javascript
const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    const response = await fetch(`/api/favorites/toggle/${product._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setIsFavorite(data.data.isFavorite);
  };

  return (
    <div>
      <button onClick={toggleFavorite}>{isFavorite ? '❤️' : '🤍'}</button>
    </div>
  );
};
```

## 🚀 Cách sử dụng

1. **Start server:**

   ```bash
   npm run dev
   ```

2. **Test API:**

   ```bash
   node test_favorites_api.js
   ```

3. **Frontend integration:**
   - Thêm "Favorites" vào dropdown menu user
   - Tạo trang `/favorites` để hiển thị danh sách
   - Thêm favorite button vào product cards

## ✅ Tính năng hoàn thành

- [x] Database schema với favorites array
- [x] CRUD operations cho favorites
- [x] Authentication middleware
- [x] API endpoints đầy đủ
- [x] Error handling
- [x] Response formatting
- [x] Integration với User profile
- [x] Documentation đầy đủ
- [x] Test script
- [x] Ready for frontend integration

## 🎯 Kết quả

Tính năng Favorites đã được implement hoàn chỉnh và sẵn sàng cho frontend integration. Người dùng có thể:

- Thêm/xóa sản phẩm yêu thích
- Xem danh sách favorites từ dropdown menu
- Truy cập trang favorites riêng biệt
- Favorites được lưu trữ an toàn trong database
