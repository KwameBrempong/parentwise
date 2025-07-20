import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIService } from '@/lib/openai'
import { z } from 'zod'

const generatePlanSchema = z.object({
  childId: z.string().min(1, 'Child ID is required'),
  parentingGoals: z.array(z.string()).min(1, 'At least one parenting goal is required'),
  challenges: z.array(z.string()).default([]),
  familyContext: z.string().optional(),
  timeline: z.enum(['1_month', '3_months', '6_months']).default('3_months'),
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
    const validatedData = generatePlanSchema.parse(body)

    // Get child information
    const child = await prisma.child.findFirst({
      where: {
        id: validatedData.childId,
        parent: {
          email: session.user.email
        }
      },
      include: {
        parent: true,
        family: true
      }
    })

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or access denied' },
        { status: 404 }
      )
    }

    // Calculate child age in months
    const childAge = Math.floor(
      (new Date().getTime() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )

    // Generate AI parenting plan
    const aiResponse = await AIService.generateParentingPlan({
      childName: child.name,
      childAge: childAge,
      childInterests: child.interests,
      parentingGoals: validatedData.parentingGoals,
      challenges: validatedData.challenges,
      familyContext: validatedData.familyContext,
    })

    // Save the generated plan to database
    const parentingPlan = await prisma.parentingPlan.create({
      data: {
        parentId: child.parentId,
        childId: child.id,
        familyId: child.familyId,
        title: aiResponse.title,
        description: aiResponse.description,
        goals: aiResponse.goals,
        strategies: aiResponse.strategies,
        timeline: aiResponse.timeline,
        status: 'DRAFT',
        progress: 0,
        tags: ['ai-generated', 'personalized', validatedData.timeline],
        aiPrompts: {
          input: validatedData,
          childProfile: {
            name: child.name,
            age: childAge,
            interests: child.interests
          },
          generatedAt: new Date().toISOString()
        },
        personalizations: {},
      }
    })

    // Log the AI generation event
    await prisma.auditLog.create({
      data: {
        userId: child.parentId,
        action: 'AI_PLAN_GENERATE',
        resource: 'ParentingPlan',
        resourceId: parentingPlan.id,
        newValues: {
          childId: child.id,
          goals: validatedData.parentingGoals,
          aiGenerated: true
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'AI parenting plan generated successfully',
      data: {
        plan: {
          id: parentingPlan.id,
          title: parentingPlan.title,
          description: parentingPlan.description,
          goals: parentingPlan.goals,
          strategies: parentingPlan.strategies,
          timeline: parentingPlan.timeline,
          status: parentingPlan.status,
          createdAt: parentingPlan.createdAt,
        },
        aiInsights: {
          activities: aiResponse.activities,
          tips: aiResponse.tips,
          personalizedFor: child.name,
          ageAppropriate: `${Math.floor(childAge / 12)} years ${childAge % 12} months`
        }
      },
    })

  } catch (error) {
    console.error('AI parenting plan generation error:', error)

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
      // Handle OpenAI API errors
      if (error.message.includes('OpenAI')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 503 }
        )
      }

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

// Get existing AI-generated plans for a child
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const childId = url.searchParams.get('childId')

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      )
    }

    // Get AI-generated plans for the child
    const plans = await prisma.parentingPlan.findMany({
      where: {
        childId: childId,
        parent: {
          email: session.user.email
        },
        tags: {
          has: 'ai-generated'
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        child: {
          select: {
            name: true,
            dateOfBirth: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        plans: plans.map(plan => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          status: plan.status,
          progress: plan.progress,
          createdAt: plan.createdAt,
          childName: plan.child?.name,
          tags: plan.tags
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching AI plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}