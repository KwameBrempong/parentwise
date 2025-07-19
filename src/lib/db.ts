import { prisma } from './prisma'
import { User, Child, Family, Activity, ParentingPlan } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

// User Management
export const userService = {
  async createUser(data: {
    email: string
    name?: string
    password?: string
    role?: 'PARENT' | 'CHILD' | 'ADMIN'
  }) {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : undefined
    
    return prisma.user.create({
      data: {
        id: uuidv4(),
        email: data.email,
        name: data.name,
        role: data.role || 'PARENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        familyMembers: {
          include: {
            family: true,
          },
        },
        children: true,
      },
    })
  },

  async updateUserPreferences(userId: string, preferences: Record<string, any>) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        preferences,
        updatedAt: new Date(),
      },
    })
  },

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },
}

// Family Management
export const familyService = {
  async createFamily(data: {
    name: string
    description?: string
    ownerId: string
  }) {
    const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    return prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          familyCode,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await tx.familyMember.create({
        data: {
          id: uuidv4(),
          familyId: family.id,
          userId: data.ownerId,
          role: 'parent',
          isOwner: true,
          joinedAt: new Date(),
        },
      })

      return family
    })
  },

  async addFamilyMember(data: {
    familyCode: string
    userId: string
    role: string
  }) {
    const family = await prisma.family.findUnique({
      where: { familyCode: data.familyCode },
    })

    if (!family) {
      throw new Error('Invalid family code')
    }

    return prisma.familyMember.create({
      data: {
        id: uuidv4(),
        familyId: family.id,
        userId: data.userId,
        role: data.role,
        joinedAt: new Date(),
      },
    })
  },

  async getFamilyWithMembers(familyId: string) {
    return prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        children: true,
        plans: true,
      },
    })
  },
}

// Child Management
export const childService = {
  async createChild(data: {
    parentId: string
    familyId?: string
    name: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    dateOfBirth: Date
    interests?: string[]
    allergies?: string[]
  }) {
    return prisma.child.create({
      data: {
        id: uuidv4(),
        parentId: data.parentId,
        familyId: data.familyId,
        name: data.name,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        interests: data.interests || [],
        allergies: data.allergies || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },

  async getChildWithDetails(childId: string) {
    return prisma.child.findUnique({
      where: { id: childId },
      include: {
        parent: true,
        family: true,
        milestones: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          include: {
            activity: true,
          },
          orderBy: { completedAt: 'desc' },
        },
        plans: {
          where: { status: 'ACTIVE' },
        },
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async updateChild(childId: string, data: Partial<{
    name: string
    interests: string[]
    challenges: string[]
    notes: string
    allergies: string[]
    medications: string[]
    healthNotes: string
  }>) {
    return prisma.child.update({
      where: { id: childId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  },

  async getChildrenByParent(parentId: string) {
    return prisma.child.findMany({
      where: { parentId },
      include: {
        milestones: {
          where: { isCompleted: false },
          take: 3,
        },
        activities: {
          take: 5,
          orderBy: { completedAt: 'desc' },
        },
      },
      orderBy: { dateOfBirth: 'desc' },
    })
  },
}

// Milestone Management
export const milestoneService = {
  async createMilestone(data: {
    childId: string
    title: string
    description: string
    category: 'PHYSICAL' | 'COGNITIVE' | 'LANGUAGE' | 'SOCIAL_EMOTIONAL' | 'ADAPTIVE'
    ageRangeMin: number
    ageRangeMax: number
  }) {
    return prisma.milestone.create({
      data: {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },

  async completeMilestone(milestoneId: string, data: {
    notes?: string
    evidence?: string[]
  }) {
    return prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        notes: data.notes,
        evidence: data.evidence || [],
        updatedAt: new Date(),
      },
    })
  },

  async getMilestonesByChild(childId: string, completed?: boolean) {
    return prisma.milestone.findMany({
      where: {
        childId,
        ...(completed !== undefined && { isCompleted: completed }),
      },
      orderBy: { ageRangeMin: 'asc' },
    })
  },
}

// Activity Management
export const activityService = {
  async createActivity(data: {
    title: string
    description: string
    instructions: string
    ageRangeMin: number
    ageRangeMax: number
    duration: number
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
    type: 'EDUCATIONAL' | 'PHYSICAL' | 'CREATIVE' | 'SOCIAL' | 'EMOTIONAL' | 'COGNITIVE' | 'ROUTINE'
    materials?: string[]
    tags?: string[]
    isPremium?: boolean
  }) {
    return prisma.activity.create({
      data: {
        id: uuidv4(),
        ...data,
        materials: data.materials || [],
        tags: data.tags || [],
        isPremium: data.isPremium || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },

  async getActivitiesForChild(childAge: number, filters?: {
    type?: string
    difficulty?: string
    duration?: number
    isPremium?: boolean
  }) {
    return prisma.activity.findMany({
      where: {
        ageRangeMin: { lte: childAge },
        ageRangeMax: { gte: childAge },
        ...(filters?.type && { type: filters.type as any }),
        ...(filters?.difficulty && { difficulty: filters.difficulty as any }),
        ...(filters?.duration && { duration: { lte: filters.duration } }),
        ...(filters?.isPremium !== undefined && { isPremium: filters.isPremium }),
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async logActivity(data: {
    activityId: string
    childId: string
    userId: string
    duration?: number
    enjoyment?: number
    difficulty?: number
    notes?: string
    observations?: string
    skills?: string[]
  }) {
    return prisma.activityLog.create({
      data: {
        id: uuidv4(),
        activityId: data.activityId,
        childId: data.childId,
        userId: data.userId,
        completedAt: new Date(),
        duration: data.duration,
        enjoyment: data.enjoyment,
        difficulty: data.difficulty,
        notes: data.notes,
        observations: data.observations,
        skills: data.skills || [],
        photos: [],
        challenges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },
}

// Parenting Plan Management
export const planService = {
  async createParentingPlan(data: {
    parentId: string
    childId?: string
    familyId?: string
    title: string
    description?: string
    goals: any
    strategies: any
    timeline: any
  }) {
    return prisma.parentingPlan.create({
      data: {
        id: uuidv4(),
        ...data,
        status: 'DRAFT',
        progress: 0,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  },

  async updatePlanProgress(planId: string, progress: number) {
    const status = progress >= 100 ? 'COMPLETED' : 'ACTIVE'
    
    return prisma.parentingPlan.update({
      where: { id: planId },
      data: {
        progress,
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        updatedAt: new Date(),
      },
    })
  },

  async getPlansForUser(userId: string, status?: string) {
    return prisma.parentingPlan.findMany({
      where: {
        parentId: userId,
        ...(status && { status: status as any }),
      },
      include: {
        child: true,
        activities: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
  },
}

// Audit Logging
export const auditService = {
  async log(data: {
    userId?: string
    action: string
    resource: string
    resourceId?: string
    oldValues?: any
    newValues?: any
    ipAddress?: string
    userAgent?: string
    sessionId?: string
  }) {
    return prisma.auditLog.create({
      data: {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
      },
    })
  },

  async getAuditLogs(filters?: {
    userId?: string
    resource?: string
    action?: string
    limit?: number
  }) {
    return prisma.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.resource && { resource: filters.resource }),
        ...(filters?.action && { action: filters.action }),
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
    })
  },
}