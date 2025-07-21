# Google OAuth Redirect Fix - Backend

## 🎯 Vấn đề

User muốn sau khi login Google/Facebook thành công, redirect đến homepage với locale hiện tại:

```
http://localhost:3000/vi/auth/success?token=... → http://localhost:3000/vi
```

Locale sẽ dựa vào ngôn ngữ user đang sử dụng (vi/en).

## 🔧 Nguyên nhân

Backend cần redirect đến success page với locale đúng, sau đó frontend sẽ redirect đến homepage với locale tương ứng.

## ✅ Giải pháp

### 1. **Sửa Google OAuth Redirect**

```typescript
// Trước
res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);

// Sau
res.redirect(`${process.env.FRONTEND_URL}/vi/auth/success?token=${token}`);
```

### 2. **Sửa Facebook OAuth Redirect**

```typescript
// Trước
res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);

// Sau
res.redirect(`${process.env.FRONTEND_URL}/vi/auth/success?token=${token}`);
```

## 🎨 Flow hoàn chỉnh

### **Google OAuth Flow:**

1. User click "Login with Google"
2. Frontend redirect đến: `/api/auth/google`
3. Backend redirect đến Google OAuth
4. Google callback về: `/api/auth/google/callback`
5. Backend xử lý token và redirect đến: `/vi/auth/success?token=...`
6. Frontend success page xử lý token và redirect đến homepage với locale

### **Facebook OAuth Flow:**

1. User click "Login with Facebook"
2. Frontend redirect đến: `/api/auth/facebook`
3. Backend redirect đến Facebook OAuth
4. Facebook callback về: `/api/auth/facebook/callback`
5. Backend xử lý token và redirect đến: `/vi/auth/success?token=...`
6. Frontend success page xử lý token và redirect đến homepage với locale

## 🔧 Technical Details

### **Backend Redirect Logic:**

```typescript
// Google OAuth
export const handleGoogleCallback: RequestHandler = async (req, res) => {
  try {
    // ... xử lý Google token ...

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' },
    );

    // Redirect đến success page với locale
    res.redirect(`${process.env.FRONTEND_URL}/vi/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/vi/auth/error`);
  }
};
```

### **Frontend Success Page:**

```typescript
// success.tsx
const handleAuthSuccess = async () => {
  const token = searchParams.get('token');
  const role = searchParams.get('role') || 'user';

  // Lưu token
  localStorage.setItem('auth_token', token);
  window.dispatchEvent(new Event('storage'));

  // Redirect theo role với locale hiện tại
  const pathParts = window.location.pathname.split('/');
  const currentLocale = pathParts[1] || 'en';

  let redirectPath = `/${currentLocale}`; // Homepage với locale hiện tại

  if (role === 'admin') {
    redirectPath = `/${currentLocale}/admin/dashboard`;
  } else if (role === 'manager') {
    redirectPath = `/${currentLocale}/manager/dashboard`;
  }

  setTimeout(() => {
    router.push(redirectPath);
  }, 1000);
};
```

## 🧪 Testing

### **Test Cases:**

1. **Google Login**: Click login với Google
2. **OAuth Redirect**: Kiểm tra redirect đến Google
3. **Callback URL**: Kiểm tra callback về `/vi/auth/success`
4. **Token Processing**: Kiểm tra token được xử lý đúng
5. **Homepage Redirect**: Kiểm tra redirect đến homepage với locale
6. **Facebook Login**: Tương tự với Facebook

### **Expected Behavior:**

- ✅ Google OAuth redirect đến `/vi/auth/success`
- ✅ Facebook OAuth redirect đến `/vi/auth/success`
- ✅ Token được xử lý đúng trong success page
- ✅ Redirect đến homepage với locale đúng (vi/en)
- ✅ Authentication state được refresh
- ✅ Header hiển thị user dropdown

## 📝 Notes

- Backend redirect đến `/vi/auth/success` với locale đúng
- Frontend success page sẽ xử lý token và redirect đến homepage với locale
- Cả Google và Facebook OAuth đều cần sửa
- URL pattern: `FRONTEND_URL/vi/auth/success?token=...`
- Locale sẽ dựa vào ngôn ngữ user đang sử dụng
