import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

// Server-side authentication utilities
export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getAuthSession()
  
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      familyMembers: {
        include: {
          family: true,
        },
      },
      children: true,
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth()
  
  if (user.role !== requiredRole) {
    throw new Error(`Role ${requiredRole} required`)
  }
  
  return user
}

export async function requireSubscription(tier: 'PREMIUM' | 'PREMIUM_PLUS') {
  const user = await requireAuth()
  
  const tierHierarchy = {
    FREE: 0,
    PREMIUM: 1,
    PREMIUM_PLUS: 2,
  }
  
  const userTier = user.subscriptionTier
  const requiredTierLevel = tierHierarchy[tier]
  const userTierLevel = tierHierarchy[userTier]
  
  if (userTierLevel < requiredTierLevel) {
    throw new Error(`Subscription tier ${tier} required`)
  }
  
  return user
}

export function hasPermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  const roleHierarchy = {
    CHILD: 0,
    PARENT: 1,
    ADMIN: 2,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessChild(
  userId: string,
  childParentId: string,
  userRole: UserRole
): boolean {
  // Admin can access any child
  if (userRole === 'ADMIN') {
    return true
  }
  
  // Parent can access their own children
  if (userRole === 'PARENT' && userId === childParentId) {
    return true
  }
  
  // TODO: Add family member permissions check
  
  return false
}

export function canAccessFamily(
  userId: string,
  familyMemberIds: string[],
  userRole: UserRole
): boolean {
  // Admin can access any family
  if (userRole === 'ADMIN') {
    return true
  }
  
  // Family member can access their family
  if (familyMemberIds.includes(userId)) {
    return true
  }
  
  return false
}

// Password utilities (for future credentials provider enhancement)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}

// Session utilities
export function isSessionExpired(session: any): boolean {
  if (!session?.expires) {
    return true
  }
  
  return new Date() > new Date(session.expires)
}

export function getSessionTimeRemaining(session: any): number {
  if (!session?.expires) {
    return 0
  }
  
  const expiryTime = new Date(session.expires).getTime()
  const currentTime = new Date().getTime()
  
  return Math.max(0, expiryTime - currentTime)
}

// API route protection
export function createProtectedHandler<T = any>(
  handler: (req: Request, user: any) => Promise<T>,
  options?: {
    requiredRole?: UserRole
    requiredSubscription?: 'PREMIUM' | 'PREMIUM_PLUS'
  }
) {
  return async (req: Request) => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      
      if (options?.requiredRole && !hasPermission(user.role, options.requiredRole)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      
      if (options?.requiredSubscription) {
        try {
          await requireSubscription(options.requiredSubscription)
        } catch {
          return new Response(JSON.stringify({ error: 'Subscription required' }), {
            status: 402,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }
      
      return await handler(req, user)
    } catch (error) {
      console.error('Protected handler error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}