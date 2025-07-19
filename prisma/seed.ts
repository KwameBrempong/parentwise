import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const parentUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'parent@parentwise.com',
      name: 'Sarah Johnson',
      role: 'PARENT',
      subscriptionTier: 'PREMIUM',
      timezone: 'America/New_York',
      language: 'en',
      preferences: {
        notifications: true,
        emailUpdates: true,
        theme: 'light',
      },
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@parentwise.com',
      name: 'Admin User',
      role: 'ADMIN',
      subscriptionTier: 'PREMIUM_PLUS',
    },
  })

  console.log('✅ Created users')

  // Create family
  const family = await prisma.family.create({
    data: {
      id: uuidv4(),
      name: 'The Johnson Family',
      description: 'A loving family focused on child development',
      familyCode: 'JOHN123',
      settings: {
        allowGuestAccess: false,
        shareProgress: true,
      },
    },
  })

  // Add parent to family
  await prisma.familyMember.create({
    data: {
      id: uuidv4(),
      familyId: family.id,
      userId: parentUser.id,
      role: 'parent',
      isOwner: true,
    },
  })

  console.log('✅ Created family')

  // Create children
  const child1 = await prisma.child.create({
    data: {
      id: uuidv4(),
      parentId: parentUser.id,
      familyId: family.id,
      name: 'Emma Johnson',
      gender: 'FEMALE',
      dateOfBirth: new Date('2021-03-15'), // ~3 years old
      interests: ['books', 'puzzles', 'singing', 'drawing'],
      allergies: ['peanuts'],
      notes: 'Very curious and loves to ask questions. Shows early reading interest.',
    },
  })

  const child2 = await prisma.child.create({
    data: {
      id: uuidv4(),
      parentId: parentUser.id,
      familyId: family.id,
      name: 'Alex Johnson',
      gender: 'MALE',
      dateOfBirth: new Date('2019-08-22'), // ~5 years old
      interests: ['sports', 'building blocks', 'dinosaurs', 'outdoor play'],
      allergies: [],
      notes: 'Very active and loves physical activities. Starting to show interest in team sports.',
    },
  })

  console.log('✅ Created children')

  // Create milestones
  const milestones = [
    {
      childId: child1.id,
      title: 'Speaks in 3-word sentences',
      description: 'Child can form sentences with 3 or more words',
      category: 'LANGUAGE' as const,
      ageRangeMin: 24,
      ageRangeMax: 36,
      isCompleted: true,
      completedAt: new Date('2023-11-15'),
      notes: 'Emma started speaking in full sentences early!',
    },
    {
      childId: child1.id,
      title: 'Potty training success',
      description: 'Child is fully potty trained during the day',
      category: 'ADAPTIVE' as const,
      ageRangeMin: 30,
      ageRangeMax: 42,
      isCompleted: false,
    },
    {
      childId: child2.id,
      title: 'Rides bicycle with training wheels',
      description: 'Child can ride a bicycle with training wheels independently',
      category: 'PHYSICAL' as const,
      ageRangeMin: 48,
      ageRangeMax: 72,
      isCompleted: true,
      completedAt: new Date('2024-06-01'),
      notes: 'Alex learned quickly and loves riding around the neighborhood!',
    },
  ]

  for (const milestone of milestones) {
    await prisma.milestone.create({
      data: {
        id: uuidv4(),
        ...milestone,
      },
    })
  }

  console.log('✅ Created milestones')

  // Create activities
  const activities = [
    {
      title: 'Color Sorting Game',
      description: 'A fun activity to help children learn colors and develop sorting skills',
      instructions: '1. Gather objects of different colors\n2. Sort them into color groups\n3. Name each color as you sort\n4. Celebrate successes!',
      ageRangeMin: 24,
      ageRangeMax: 48,
      duration: 15,
      difficulty: 'EASY' as const,
      type: 'EDUCATIONAL' as const,
      materials: ['colored objects', 'sorting containers'],
      tags: ['colors', 'sorting', 'cognitive'],
      learningOutcomes: ['color recognition', 'categorization', 'fine motor skills'],
      skills: ['observation', 'classification', 'concentration'],
    },
    {
      title: 'Outdoor Nature Walk',
      description: 'Explore nature and develop observation skills',
      instructions: '1. Take a walk outside\n2. Look for different plants and animals\n3. Collect interesting natural objects\n4. Discuss what you found',
      ageRangeMin: 36,
      ageRangeMax: 84,
      duration: 30,
      difficulty: 'EASY' as const,
      type: 'PHYSICAL' as const,
      materials: ['comfortable shoes', 'collection bag'],
      tags: ['nature', 'exercise', 'observation'],
      learningOutcomes: ['nature awareness', 'physical activity', 'vocabulary'],
      skills: ['observation', 'walking', 'communication'],
    },
    {
      title: 'Story Building Exercise',
      description: 'Create stories together to develop language and creativity',
      instructions: '1. Start with "Once upon a time..."\n2. Take turns adding sentences\n3. Use props or pictures for inspiration\n4. Draw the story afterward',
      ageRangeMin: 36,
      ageRangeMax: 72,
      duration: 20,
      difficulty: 'MEDIUM' as const,
      type: 'CREATIVE' as const,
      materials: ['paper', 'crayons', 'picture books'],
      tags: ['storytelling', 'creativity', 'language'],
      learningOutcomes: ['language development', 'imagination', 'sequence understanding'],
      skills: ['communication', 'creativity', 'listening'],
      isPremium: true,
    },
  ]

  const createdActivities = []
  for (const activity of activities) {
    const created = await prisma.activity.create({
      data: {
        id: uuidv4(),
        ...activity,
      },
    })
    createdActivities.push(created)
  }

  console.log('✅ Created activities')

  // Create a parenting plan
  const parentingPlan = await prisma.parentingPlan.create({
    data: {
      id: uuidv4(),
      parentId: parentUser.id,
      childId: child1.id,
      familyId: family.id,
      title: 'Emma\'s Language Development Plan',
      description: 'A comprehensive plan to support Emma\'s language and communication skills',
      goals: {
        primary: 'Enhance vocabulary and sentence formation',
        secondary: ['Improve listening skills', 'Encourage storytelling'],
        timeline: '3 months',
      },
      strategies: {
        daily: ['Read books together', 'Practice new words', 'Ask open-ended questions'],
        weekly: ['Visit library', 'Arrange playdates', 'Story creation time'],
        monthly: ['Assess progress', 'Introduce new topics', 'Celebrate achievements'],
      },
      timeline: {
        week1: 'Establish reading routine',
        week4: 'Introduce storytelling',
        week8: 'Assessment and adjustment',
        week12: 'Final evaluation',
      },
      status: 'ACTIVE',
      progress: 35,
      tags: ['language', 'communication', 'reading'],
      startedAt: new Date('2024-01-01'),
    },
  })

  console.log('✅ Created parenting plan')

  // Create activity logs
  await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      activityId: createdActivities[0].id,
      childId: child1.id,
      userId: parentUser.id,
      completedAt: new Date('2024-07-15'),
      duration: 20,
      enjoyment: 5,
      difficulty: 2,
      notes: 'Emma loved sorting colors and learned two new color names!',
      observations: 'Shows excellent focus for her age',
      skills: ['color recognition', 'sorting', 'concentration'],
    },
  })

  console.log('✅ Created activity logs')

  // Create child assessment
  await prisma.childAssessment.create({
    data: {
      id: uuidv4(),
      childId: child1.id,
      title: 'Language Development Assessment',
      assessmentType: 'development',
      completedBy: parentUser.id,
      questions: {
        vocabulary: {
          question: 'How many words can your child say clearly?',
          answer: 'More than 50 words',
          score: 4,
        },
        sentences: {
          question: 'Can your child form 2-3 word sentences?',
          answer: 'Yes, frequently',
          score: 5,
        },
        listening: {
          question: 'Does your child follow simple instructions?',
          answer: 'Most of the time',
          score: 4,
        },
      },
      scores: {
        vocabulary: 4,
        sentences: 5,
        listening: 4,
        overall: 4.3,
      },
      insights: {
        strengths: ['Excellent sentence formation', 'Good vocabulary for age'],
        areas_for_growth: ['Active listening skills'],
        recommendations: ['Continue reading together', 'Practice following multi-step instructions'],
      },
    },
  })

  console.log('✅ Created child assessment')

  // Create notifications
  await prisma.notification.create({
    data: {
      id: uuidv4(),
      userId: parentUser.id,
      type: 'MILESTONE_REMINDER',
      title: 'Milestone Check',
      message: 'Time to check Emma\'s potty training progress!',
      data: {
        childId: child1.id,
        milestoneCategory: 'ADAPTIVE',
      },
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    },
  })

  console.log('✅ Created notifications')

  // Create content library entries
  await prisma.contentLibrary.create({
    data: {
      id: uuidv4(),
      title: 'Understanding Toddler Tantrums',
      content: 'Tantrums are a normal part of child development...',
      contentType: 'article',
      category: 'behavior',
      tags: ['tantrums', 'toddler', 'behavior', 'parenting'],
      slug: 'understanding-toddler-tantrums',
      metaTitle: 'Understanding and Managing Toddler Tantrums',
      metaDescription: 'Learn effective strategies for dealing with toddler tantrums',
      views: 1250,
      likes: 89,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Created content library')

  // Create audit log
  await prisma.auditLog.create({
    data: {
      id: uuidv4(),
      userId: parentUser.id,
      action: 'CREATE',
      resource: 'Child',
      resourceId: child1.id,
      newValues: {
        name: 'Emma Johnson',
        dateOfBirth: '2021-03-15',
      },
      ipAddress: '127.0.0.1',
      userAgent: 'Seed Script',
    },
  })

  console.log('✅ Created audit logs')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`👤 Users: ${await prisma.user.count()}`)
  console.log(`👨‍👩‍👧‍👦 Families: ${await prisma.family.count()}`)
  console.log(`👶 Children: ${await prisma.child.count()}`)
  console.log(`🎯 Milestones: ${await prisma.milestone.count()}`)
  console.log(`🎮 Activities: ${await prisma.activity.count()}`)
  console.log(`📋 Parenting Plans: ${await prisma.parentingPlan.count()}`)
  console.log(`📚 Content: ${await prisma.contentLibrary.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })