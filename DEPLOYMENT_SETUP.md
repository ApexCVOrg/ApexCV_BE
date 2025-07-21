# Production Deployment Setup Guide

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# MongoDB - Choose one option:
# Option 1: MongoDB Atlas (Recommended for production)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Option 2: Local MongoDB (for development)
# MONGO_URI=mongodb://localhost:27017/nidas

# Frontend URL
FRONTEND_URL=https://nidas-fe.vercel.app
EXTRA_ORIGINS=https://apex-cv-fe.vercel.app

# Session & JWT Secrets (Change these!)
SESSION_SECRET=your_very_secure_session_secret_key_here
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key

# VNPAY (Optional)
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Known Issues & Solutions

### 1. MongoDB Connection Issues
- **Problem**: "mongodb+srv URI cannot have multiple service names"
- **Solution**: Use simplified connection string format
- **Problem**: "Invalid MongoDB connection string format"
- **Solution**: Check if MONGO_URI has prefix "MONGO_URI=" and remove it

### 2. Category Seeding Issues
- **Problem**: "Team category not found: Bayern Munich"
- **Solution**: Script now skips team categories for production deployment

### 3. User Seeding Issues
- **Problem**: "User with email user01@example.com not found"
- **Solution**: Users are now automatically seeded in production

### 4. CORS Issues
- **Problem**: Frontend can't connect to backend
- **Solution**: All production URLs are added to allowedOrigins

## Deployment Platforms

### Render.com (Backend)
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

### Vercel (Frontend)
1. Connect your GitHub repository
2. Framework preset: Next.js
3. Build command: `npm run build`
4. Output directory: `.next`

## Testing Production

### Test Users (Auto-created)
- **Regular User**: user01@example.com / password
- **Admin User**: admin@example.com / password
- **Manager User**: manager@example.com / password

### Health Check
- Backend: `https://apexcv-be.onrender.com/`
- Frontend: `https://apex-cv-fe-git-main-nidas-projects-e8bff2a3.vercel.app/`

## Troubleshooting

### If MongoDB still doesn't connect:
1. Check your MongoDB Atlas network access settings
2. Ensure your IP is whitelisted or use 0.0.0.0/0 for all IPs
3. Verify username/password in connection string
4. Check if database name is correct

### If categories don't load:
1. Check if categories were seeded properly
2. Verify category structure in database
3. Check API endpoints for category data

### If users can't login:
1. Verify JWT_SECRET is set
2. Check if users were seeded properly
3. Verify session configuration 