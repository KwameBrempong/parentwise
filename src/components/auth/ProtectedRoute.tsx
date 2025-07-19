'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requireAuth?: boolean
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  fallbackUrl = '/auth/signin',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(fallbackUrl)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, requireAuth, router, fallbackUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || null
  }

  return <>{children}</>
}

interface SubscriptionGuardProps {
  children: React.ReactNode
  requiredTier: 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS'
  fallback?: React.ReactNode
}

export function SubscriptionGuard({ children, requiredTier, fallback }: SubscriptionGuardProps) {
  const { user } = useAuth()

  const tierHierarchy = {
    FREE: 0,
    PREMIUM: 1,
    PREMIUM_PLUS: 2,
  }

  const userTier = user?.subscriptionTier || 'FREE'
  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[requiredTier]

  if (!hasAccess) {
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">This feature requires a {requiredTier} subscription.</p>
      </div>
    )
  }

  return <>{children}</>
}