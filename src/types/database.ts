import type {
  User,
  Child,
  Family,
  FamilyMember,
  Activity,
  ActivityLog,
  ParentingPlan,
  Milestone,
  ChildAssessment,
  Notification,
  ContentLibrary,
  AuditLog,
  UserRole,
  Gender,
  ActivityType,
  ActivityDifficulty,
  MilestoneCategory,
  PlanStatus,
  SubscriptionTier,
  NotificationType,
} from '@prisma/client'

// Extended types with relations
export type UserWithRelations = User & {
  familyMembers?: (FamilyMember & {
    family: Family
  })[]
  children?: Child[]
  plans?: ParentingPlan[]
  activities?: ActivityLog[]
  notifications?: Notification[]
}

export type ChildWithDetails = Child & {
  parent: User
  family?: Family
  milestones?: Milestone[]
  activities?: (ActivityLog & {
    activity: Activity
  })[]
  plans?: ParentingPlan[]
  assessments?: ChildAssessment[]
}

export type FamilyWithMembers = Family & {
  members: (FamilyMember & {
    user: User
  })[]
  children?: Child[]
  plans?: ParentingPlan[]
}

export type ActivityWithLogs = Activity & {
  logs?: (ActivityLog & {
    child: Child
    user: User
  })[]
}

export type ParentingPlanWithDetails = ParentingPlan & {
  parent: User
  child?: Child
  family?: Family
  activities?: Activity[]
  logs?: any[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface CreateChildForm {
  name: string
  gender?: Gender
  dateOfBirth: string
  interests?: string[]
  allergies?: string[]
  notes?: string
}

export interface CreateFamilyForm {
  name: string
  description?: string
}

export interface CreateActivityForm {
  title: string
  description: string
  instructions: string
  ageRangeMin: number
  ageRangeMax: number
  duration: number
  difficulty: ActivityDifficulty
  type: ActivityType
  materials?: string[]
  tags?: string[]
}

export interface CreateParentingPlanForm {
  title: string
  description?: string
  childId?: string
  goals: Record<string, any>
  strategies: Record<string, any>
  timeline: Record<string, any>
}

export interface LogActivityForm {
  activityId: string
  childId: string
  duration?: number
  enjoyment?: number
  difficulty?: number
  notes?: string
  observations?: string
  skills?: string[]
}

export interface MilestoneForm {
  title: string
  description: string
  category: MilestoneCategory
  ageRangeMin: number
  ageRangeMax: number
}

export interface ChildAssessmentForm {
  title: string
  assessmentType: string
  questions: Record<string, any>
  scores: Record<string, any>
}

// Search and filter types
export interface ActivityFilters {
  type?: ActivityType
  difficulty?: ActivityDifficulty
  ageMin?: number
  ageMax?: number
  duration?: number
  isPremium?: boolean
  tags?: string[]
  search?: string
}

export interface PlanFilters {
  status?: PlanStatus
  childId?: string
  search?: string
}

export interface ChildFilters {
  familyId?: string
  ageMin?: number
  ageMax?: number
  search?: string
}

// Dashboard types
export interface DashboardStats {
  totalChildren: number
  activePlans: number
  completedActivities: number
  upcomingMilestones: number
  recentActivity: {
    type: string
    description: string
    timestamp: Date
  }[]
}

export interface ChildProgress {
  child: Child
  completedMilestones: number
  totalMilestones: number
  recentActivities: ActivityLog[]
  activePlans: ParentingPlan[]
}

// Notification types
export interface NotificationData {
  childId?: string
  planId?: string
  activityId?: string
  milestoneId?: string
  [key: string]: any
}

// Settings types
export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    milestoneReminders: boolean
    activitySuggestions: boolean
    planUpdates: boolean
  }
  privacy: {
    shareProgress: boolean
    allowAnalytics: boolean
    shareWithFamily: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
  }
  ai: {
    enableSuggestions: boolean
    personalizedRecommendations: boolean
    dataUsageConsent: boolean
  }
}

export interface FamilySettings {
  allowGuestAccess: boolean
  shareProgress: boolean
  childDataAccess: Record<string, string[]> // userId -> permissions
  notifications: {
    milestoneUpdates: boolean
    activitySharing: boolean
    planChanges: boolean
  }
}

// AI and Analytics types
export interface AIInsight {
  type: string
  confidence: number
  suggestion: string
  data?: Record<string, any>
  createdAt: Date
}

export interface ChildAnalytics {
  developmentProgress: {
    category: MilestoneCategory
    completed: number
    total: number
    percentComplete: number
  }[]
  activityEngagement: {
    type: ActivityType
    averageEnjoyment: number
    totalActivities: number
    preferredDifficulty: ActivityDifficulty
  }[]
  skillsDevelopment: {
    skill: string
    progress: number
    activities: number
  }[]
  recommendations: AIInsight[]
}

// Export all Prisma types
export type {
  User,
  Child,
  Family,
  FamilyMember,
  Activity,
  ActivityLog,
  ParentingPlan,
  Milestone,
  ChildAssessment,
  Notification,
  ContentLibrary,
  AuditLog,
  UserRole,
  Gender,
  ActivityType,
  ActivityDifficulty,
  MilestoneCategory,
  PlanStatus,
  SubscriptionTier,
  NotificationType,
}