# Deployment Guide

## Environment Variables

### Required Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

### Vercel Deployment

1. **Vercel Secrets Setup**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add OPENAI_API_KEY
   # Add other secrets as needed
   ```

2. **GitHub Actions Secrets**
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### Environment Configuration by Stage

#### Development
- Uses `.env.local`
- Database: Local PostgreSQL
- Redis: Local Redis instance

#### Production
- Uses Vercel environment variables
- Database: Hosted PostgreSQL (e.g., Supabase, PlanetScale)
- Redis: Hosted Redis (e.g., Upstash, Redis Cloud)

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Test Stage**
   - Type checking with TypeScript
   - ESLint code quality checks
   - Jest unit tests
   - Build verification

2. **Security Stage**
   - npm audit for vulnerabilities
   - Dependency security scanning

3. **Deploy Stage**
   - Preview deployments for PRs
   - Production deployment for main branch

### Manual Deployment

```bash
# Development
npm run dev

# Build and test locally
npm run build
npm run start

# Deploy to Vercel
vercel --prod
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **API Keys**
   - Store in environment variables only
   - Use least privilege principle
   - Monitor API usage

3. **Database**
   - Use connection pooling
   - Enable SSL connections
   - Regular backups

## Monitoring and Logging

### Production Monitoring
- Vercel Analytics for performance
- Sentry for error tracking
- Database monitoring
- API rate limiting

### Development Tools
- Next.js development server
- TypeScript type checking
- Jest testing framework
- ESLint code quality