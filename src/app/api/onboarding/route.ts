import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userService, auditService } from '@/lib/db'
import { z } from 'zod'

const onboardingSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  timezone: z.string().min(1, 'Please select your timezone'),
  
  // Family Setup
  familySetup: z.enum(['create', 'join']),
  familyName: z.string().optional(),
  familyCode: z.string().optional(),
  
  // First Child
  childName: z.string().min(1, 'Child name is required'),
  childDateOfBirth: z.string().min(1, 'Date of birth is required'),
  childGender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  childInterests: z.array(z.string()).optional(),
  
  // Privacy & Terms
  privacySettings: z.object({
    shareProgress: z.boolean(),
    allowAnalytics: z.boolean(),
    emailNotifications: z.boolean(),
  }),
  
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
})

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = onboardingSchema.parse(body)

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user profile
      const updatedUser = await tx.user.update({
        where: { email: session.user.email },
        data: {
          name: validatedData.name,
          timezone: validatedData.timezone,
          preferences: {
            shareProgress: validatedData.privacySettings.shareProgress,
            allowAnalytics: validatedData.privacySettings.allowAnalytics,
            emailNotifications: validatedData.privacySettings.emailNotifications,
            onboardingCompleted: true,
          },
        },
      })

      let family
      let familyMember

      // Handle family setup
      if (validatedData.familySetup === 'create') {
        // Create new family
        family = await tx.family.create({
          data: {
            name: validatedData.familyName || `${validatedData.name}'s Family`,
            familyCode: generateFamilyCode(),
            settings: {
              shareProgress: validatedData.privacySettings.shareProgress,
            },
          },
        })

        // Add user as family owner
        familyMember = await tx.familyMember.create({
          data: {
            familyId: family.id,
            userId: updatedUser.id,
            role: 'parent',
            isOwner: true,
          },
        })
      } else if (validatedData.familySetup === 'join' && validatedData.familyCode) {
        // Join existing family
        family = await tx.family.findUnique({
          where: { familyCode: validatedData.familyCode },
        })

        if (!family) {
          throw new Error('Family code not found')
        }

        // Add user to family
        familyMember = await tx.familyMember.create({
          data: {
            familyId: family.id,
            userId: updatedUser.id,
            role: 'parent',
            isOwner: false,
          },
        })
      }

      // Create child profile
      const child = await tx.child.create({
        data: {
          parentId: updatedUser.id,
          familyId: family?.id,
          name: validatedData.childName,
          dateOfBirth: new Date(validatedData.childDateOfBirth),
          gender: validatedData.childGender || 'PREFER_NOT_TO_SAY',
          interests: validatedData.childInterests || [],
          allergies: [],
          medications: [],
        },
      })

      // Create initial welcome notification
      await tx.notification.create({
        data: {
          userId: updatedUser.id,
          type: 'SYSTEM_NOTIFICATION',
          title: 'Welcome to ParentWise!',
          message: `Welcome ${validatedData.name}! Your account is set up and ready to go. Explore activities for ${validatedData.childName} and create your first parenting plan.`,
          data: {
            childId: child.id,
            onboarding: true,
          },
        },
      })

      // Log onboarding completion
      await tx.auditLog.create({
        data: {
          userId: updatedUser.id,
          action: 'ONBOARDING_COMPLETE',
          resource: 'User',
          resourceId: updatedUser.id,
          newValues: {
            familySetup: validatedData.familySetup,
            childName: validatedData.childName,
            familyId: family?.id,
          },
          ipAddress: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          userAgent: request.headers.get('user-agent'),
        },
      })

      return {
        user: updatedUser,
        family,
        child,
        familyMember,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          timezone: result.user.timezone,
        },
        family: result.family ? {
          id: result.family.id,
          name: result.family.name,
          familyCode: result.family.familyCode,
        } : null,
        child: {
          id: result.child.id,
          name: result.child.name,
          dateOfBirth: result.child.dateOfBirth,
          interests: result.child.interests,
        },
      },
    })

  } catch (error) {
    console.error('Onboarding error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate unique family codes
function generateFamilyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}