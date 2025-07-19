'use client'

import { useSession } from 'next-auth/react'
import { UserWithRelations } from '@/types/database'

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user as UserWithRelations | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === 'ADMIN',
    isParent: session?.user?.role === 'PARENT',
    subscriptionTier: session?.user?.subscriptionTier,
    session,
  }
}

export function useRequireAuth() {
  const auth = useAuth()
  
  if (!auth.isAuthenticated && !auth.isLoading) {
    throw new Error('Authentication required')
  }
  
  return auth
}