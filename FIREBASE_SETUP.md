# Firebase Setup Guide

## Chuyển đổi từ JSON sang Environment Variables

Dự án đã được chuyển đổi từ sử dụng file JSON credentials sang environment variables để bảo mật hơn.

### Các bước setup:

1. **Copy file `.env.example` thành `.env`**

   ```bash
   cp .env.example .env
   ```

2. **Cập nhật các giá trị trong file `.env`**
   - `FIREBASE_PROJECT_ID`: ID của project Firebase
   - `FIREBASE_PRIVATE_KEY`: Private key từ service account (đã được format sẵn)
   - `FIREBASE_CLIENT_EMAIL`: Email của service account

3. **Đảm bảo file `.env` đã được thêm vào `.gitignore`**
   - File `.env` không được commit lên git
   - Chỉ commit file `.env.example` làm template

### Cấu trúc file `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

### Lưu ý bảo mật:

- ✅ **KHÔNG BAO GIỜ** commit file `.env` lên git
- ✅ **KHÔNG BAO GIỜ** commit file JSON credentials
- ✅ Sử dụng environment variables cho production
- ✅ Rotate credentials nếu đã bị lộ

### Troubleshooting:

- Nếu gặp lỗi "Missing required environment variable", kiểm tra file `.env` có đầy đủ các biến cần thiết
- Đảm bảo private key được format đúng với `\n` thay vì xuống dòng thật
