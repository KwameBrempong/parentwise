# ParentWise Production Deployment Guide

## 🚀 Railway Deployment Steps

### 1. Prerequisites
- GitHub repository with latest code pushed
- Railway account created and connected to GitHub

### 2. Database Setup (PostgreSQL)

1. **Create PostgreSQL Database on Railway:**
   ```bash
   # In Railway dashboard:
   # 1. Create new project
   # 2. Add PostgreSQL service
   # 3. Copy the DATABASE_URL from PostgreSQL service
   ```

2. **Database Variables:**
   - `DATABASE_URL`: Copy from Railway PostgreSQL service
   - `DIRECT_URL`: Same as DATABASE_URL

### 3. Environment Variables Setup

**Required Environment Variables in Railway:**

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database

# NextAuth.js
NEXTAUTH_URL=https://your-app-name.railway.app
NEXTAUTH_SECRET=your-super-secure-random-secret-32-chars-minimum

# OAuth Providers (Optional for MVP)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Optional for MVP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=ParentWise <noreply@parentwise.app>

# Application
NODE_ENV=production
APP_URL=https://your-app-name.railway.app
```

### 4. Deployment Steps

1. **Connect GitHub to Railway:**
   - Go to Railway dashboard
   - Create new project
   - Connect GitHub repository: `KwameBrempong/parentwise`

2. **Configure Build:**
   - Railway will auto-detect Next.js
   - Build command: `npm run build`
   - Start command: `npm run start`

3. **Database Migration:**
   ```bash
   # After first deployment, run in Railway console:
   npx prisma db push
   npx prisma db seed  # Optional: Add sample data
   ```

### 5. Post-Deployment Verification

**Test these URLs on your deployed app:**

1. **Homepage:** `https://your-app.railway.app`
   - ✅ Styled landing page loads
   - ✅ Gradient backgrounds working

2. **Authentication:** `https://your-app.railway.app/auth/signin`
   - ✅ Sign-in form loads
   - ✅ SessionProvider working

3. **Onboarding:** `https://your-app.railway.app/onboarding`
   - ✅ 6-step wizard functional
   - ✅ Forms validate properly

4. **Protected Routes:** `https://your-app.railway.app/dashboard`
   - ✅ Redirects to auth when not logged in

### 6. Security Checklist

- ✅ NEXTAUTH_SECRET is 32+ random characters
- ✅ Database credentials are secure
- ✅ No secrets in code repository
- ✅ Environment variables set in Railway only

### 7. Performance Optimization

- ✅ Next.js standalone output enabled
- ✅ Static site generation for homepage
- ✅ Prisma client generation optimized
- ✅ CSS optimization with Tailwind

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check environment variables are set
   - Verify DATABASE_URL format

2. **Database Connection Issues:**
   - Ensure PostgreSQL service is running
   - Check DATABASE_URL and DIRECT_URL match

3. **Authentication Issues:**
   - Verify NEXTAUTH_URL matches deployment URL
   - Check NEXTAUTH_SECRET is set

4. **Styling Issues:**
   - Verify Tailwind CSS is processing correctly
   - Check for CSS import order

## 📊 Current Deployment Status

**Phase 1 Features Ready for Production:**

✅ **Core Functionality:**
- Landing page with proper styling
- User authentication system
- 6-step onboarding wizard
- Family and child profile creation
- Protected routes with middleware

✅ **Technical Stack:**
- Next.js 14 with App Router
- NextAuth.js authentication
- Prisma ORM with PostgreSQL
- Tailwind CSS styling
- TypeScript throughout

✅ **Production Ready:**
- Error handling and validation
- Responsive design
- Security best practices
- Performance optimizations

## 🎯 Next Steps After Deployment

1. **Test complete user flow**
2. **Monitor application performance**
3. **Set up production authentication providers**
4. **Implement database backup strategy**
5. **Begin Phase 2: AI Features development**