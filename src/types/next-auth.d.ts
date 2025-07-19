import NextAuth from 'next-auth'
import { UserRole, SubscriptionTier } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      subscriptionTier: SubscriptionTier
      timezone?: string
      language?: string
      onboardingCompleted?: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: UserRole
    subscriptionTier?: SubscriptionTier
    timezone?: string
    language?: string
    onboardingCompleted?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    subscriptionTier: SubscriptionTier
    timezone?: string
    language?: string
    onboardingCompleted?: boolean
  }
}