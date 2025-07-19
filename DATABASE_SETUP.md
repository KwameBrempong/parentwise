# Database Setup Guide

## Overview

ParentWise uses PostgreSQL with Prisma ORM for data management. This guide will help you set up the database for development.

## Prerequisites

1. **PostgreSQL Installation**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use Docker: `docker run --name parentwise-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15`

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Update DATABASE_URL in .env.local
   ```

## Database Schema

Our schema includes:

### Core Entities
- **Users**: Parent accounts with subscription management
- **Families**: Multi-generational family units
- **Children**: Child profiles with development tracking
- **Activities**: Educational and developmental activities
- **Parenting Plans**: AI-generated personalized plans
- **Milestones**: Developmental milestone tracking

### Advanced Features
- **Audit Logging**: Complete activity and change tracking
- **Notifications**: Smart reminder system
- **Content Library**: Educational resources and articles
- **Child Assessments**: Development evaluation tools

## Setup Commands

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

3. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

4. **Seed Development Data**
   ```bash
   npm run db:seed
   ```

5. **Open Prisma Studio** (Optional)
   ```bash
   npm run db:studio
   ```

## Development Workflow

### Making Schema Changes

1. **Edit `prisma/schema.prisma`**
2. **Create Migration**
   ```bash
   npm run db:migrate
   ```
3. **Generate New Client**
   ```bash
   npm run db:generate
   ```

### Resetting Database
```bash
npm run db:reset
```

## Production Setup

### Environment Variables
Set these in your production environment:
- `DATABASE_URL`: Production PostgreSQL connection string
- `DIRECT_URL`: Direct connection for migrations

### Migration Commands
```bash
npx prisma migrate deploy
npx prisma generate
```

## Key Features of Our Schema

### 1. User Management
- Role-based access (Parent, Child, Admin)
- Subscription tiers (Free, Premium, Premium Plus)
- Comprehensive profile management
- Multi-family support

### 2. Child Development Tracking
- Age-appropriate milestones
- Development categories (Physical, Cognitive, Language, etc.)
- Progress tracking with evidence
- AI-powered insights

### 3. Activity System
- Age-range targeting
- Difficulty levels
- Material requirements
- Learning outcomes tracking
- Activity logging with ratings

### 4. Parenting Plans
- AI-generated personalized plans
- Goal tracking and progress
- Timeline management
- Template system

### 5. Family Collaboration
- Multi-parent access
- Role-based permissions
- Family activity sharing
- Progress visibility controls

### 6. Security & Compliance
- Comprehensive audit logging
- Data encryption support
- COPPA compliance features
- Privacy controls

## Seeded Development Data

The seed script creates:
- Sample parent and admin users
- Family structure with children
- Development milestones
- Sample activities and logs
- Parenting plan example
- Notifications and content

### Test Accounts
- **Parent**: `parent@parentwise.com`
- **Admin**: `admin@parentwise.com`

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Migration Errors**
   - Reset database: `npm run db:reset`
   - Check schema syntax
   - Verify environment variables

3. **Type Errors**
   - Regenerate client: `npm run db:generate`
   - Restart TypeScript server

### Performance Tips

1. **Use Indexes**
   - Add `@@index` for frequently queried fields
   - Consider composite indexes

2. **Connection Pooling**
   - Use connection pooling in production
   - Set appropriate pool sizes

3. **Query Optimization**
   - Use `include` and `select` carefully
   - Implement pagination for large datasets

## API Integration

Use the database services in `src/lib/db.ts`:

```typescript
import { userService, childService, activityService } from '@/lib/db'

// Create a child
const child = await childService.createChild({
  parentId: 'user-id',
  name: 'Emma',
  dateOfBirth: new Date('2021-03-15'),
})

// Get activities for child
const activities = await activityService.getActivitiesForChild(36) // 36 months old
```

## Next Steps

After database setup:
1. Set up authentication (NextAuth.js)
2. Create API routes
3. Build dashboard UI
4. Implement AI integration