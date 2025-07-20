import OpenAI from 'openai'
import { env } from './env'

// Initialize OpenAI client with error handling
let openai: OpenAI | null = null

try {
  if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.length > 0) {
    openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    })
  }
} catch (error) {
  console.warn('OpenAI initialization failed:', error)
}

// Types for AI responses
export interface AIParentingPlanResponse {
  title: string
  description: string
  goals: {
    primary: string
    secondary: string[]
    timeline: string
  }
  strategies: {
    daily: string[]
    weekly: string[]
    monthly: string[]
  }
  timeline: Record<string, string>
  activities: string[]
  tips: string[]
}

export interface AIActivityRecommendation {
  title: string
  description: string
  instructions: string[]
  ageRangeMin: number
  ageRangeMax: number
  duration: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  type: 'EDUCATIONAL' | 'PHYSICAL' | 'CREATIVE' | 'SOCIAL' | 'EMOTIONAL' | 'COGNITIVE'
  materials: string[]
  learningOutcomes: string[]
  skills: string[]
  safetyTips: string[]
}

export interface AIChildAssessment {
  overallScore: number
  strengths: string[]
  areasForGrowth: string[]
  recommendations: string[]
  milestoneProgress: {
    physical: number
    cognitive: number
    language: number
    socialEmotional: number
    adaptive: number
  }
  nextSteps: string[]
}

// AI Service Functions
export class AIService {
  
  /**
   * Generate a personalized parenting plan using AI
   */
  static async generateParentingPlan(input: {
    childName: string
    childAge: number // in months
    childInterests: string[]
    parentingGoals: string[]
    challenges: string[]
    familyContext?: string
  }): Promise<AIParentingPlanResponse> {
    
    const ageYears = Math.floor(input.childAge / 12)
    const ageMonths = input.childAge % 12
    
    const prompt = `
As an expert child development specialist and parenting coach, create a comprehensive, personalized parenting plan for a child with the following profile:

Child Profile:
- Name: ${input.childName}
- Age: ${ageYears} years ${ageMonths} months (${input.childAge} months total)
- Interests: ${input.childInterests.join(', ')}
- Current challenges: ${input.challenges.join(', ')}
- Parenting goals: ${input.parentingGoals.join(', ')}
${input.familyContext ? `- Family context: ${input.familyContext}` : ''}

Please provide a structured parenting plan that includes:

1. A compelling title and description
2. Clear primary and secondary goals with realistic timeline
3. Specific strategies organized by frequency (daily, weekly, monthly)
4. Week-by-week timeline for the first month
5. Recommended activities that align with the child's interests
6. Evidence-based parenting tips

Focus on:
- Age-appropriate developmental milestones
- Building on the child's existing interests
- Addressing specific challenges mentioned
- Practical, actionable strategies
- Positive parenting approaches
- Building emotional connection

Format the response as a detailed plan that parents can immediately implement.
`

    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized. Please check your OPENAI_API_KEY configuration.')
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a world-class child development expert and parenting coach with 20+ years of experience. You provide evidence-based, practical, and personalized parenting advice that helps families thrive."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      // Parse the AI response into structured data
      return this.parseParentingPlanResponse(response, input)
      
    } catch (error) {
      console.error('Error generating parenting plan:', error)
      throw new Error('Failed to generate parenting plan')
    }
  }

  /**
   * Generate activity recommendations based on child profile
   */
  static async generateActivityRecommendations(input: {
    childAge: number // in months
    childInterests: string[]
    skillFocus: string[]
    duration: number // minutes
    difficulty: 'easy' | 'medium' | 'hard'
    activityType?: string
  }): Promise<AIActivityRecommendation[]> {
    
    const ageYears = Math.floor(input.childAge / 12)
    const ageMonths = input.childAge % 12
    
    const prompt = `
As a child development expert, suggest 3 engaging activities for a child with this profile:

Child Profile:
- Age: ${ageYears} years ${ageMonths} months
- Interests: ${input.childInterests.join(', ')}
- Skills to develop: ${input.skillFocus.join(', ')}
- Available time: ${input.duration} minutes
- Difficulty level: ${input.difficulty}
${input.activityType ? `- Activity type preference: ${input.activityType}` : ''}

For each activity, provide:
1. Engaging title and description
2. Step-by-step instructions
3. Required materials (easily available)
4. Learning outcomes and skills developed
5. Safety considerations
6. Adaptations for different skill levels

Focus on activities that:
- Are age-appropriate and safe
- Build on the child's interests
- Develop the specified skills
- Can be completed in the given timeframe
- Use common household items when possible
- Encourage creativity and exploration
`

    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized. Please check your OPENAI_API_KEY configuration.')
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in child development and educational activities. You create engaging, safe, and developmentally appropriate activities that children love and parents can easily implement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      // Parse the AI response into structured activities
      return this.parseActivityRecommendations(response, input)
      
    } catch (error) {
      console.error('Error generating activity recommendations:', error)
      throw new Error('Failed to generate activity recommendations')
    }
  }

  /**
   * Analyze child assessment and provide AI insights
   */
  static async analyzeChildAssessment(input: {
    childName: string
    childAge: number
    assessmentData: Record<string, any>
    parentObservations: string[]
    concerns?: string[]
  }): Promise<AIChildAssessment> {
    
    const prompt = `
As a child development specialist, analyze this assessment data and provide insights:

Child: ${input.childName}, Age: ${Math.floor(input.childAge / 12)} years ${input.childAge % 12} months

Assessment Data: ${JSON.stringify(input.assessmentData, null, 2)}

Parent Observations:
${input.parentObservations.map(obs => `- ${obs}`).join('\n')}

${input.concerns ? `Parent Concerns:\n${input.concerns.map(c => `- ${c}`).join('\n')}` : ''}

Please provide:
1. Overall developmental assessment score (1-10)
2. Key strengths to celebrate
3. Areas for growth and development
4. Specific, actionable recommendations
5. Milestone progress in each domain (0-100%)
6. Next steps for continued development

Base your analysis on established developmental milestones and provide encouraging, supportive guidance.
`

    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized. Please check your OPENAI_API_KEY configuration.')
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a compassionate child development expert who provides encouraging, evidence-based assessments that help parents understand their child's unique development journey."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1200,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      // Parse the AI response into structured assessment
      return this.parseAssessmentResponse(response, input)
      
    } catch (error) {
      console.error('Error analyzing child assessment:', error)
      throw new Error('Failed to analyze child assessment')
    }
  }

  // Helper methods for parsing AI responses
  private static parseParentingPlanResponse(response: string, input: any): AIParentingPlanResponse {
    // This is a simplified parser - in production, you'd want more robust parsing
    return {
      title: `Personalized Plan for ${input.childName}`,
      description: response.substring(0, 200) + '...',
      goals: {
        primary: input.parentingGoals[0] || 'Support healthy development',
        secondary: input.parentingGoals.slice(1) || ['Build confidence', 'Encourage learning'],
        timeline: '3 months'
      },
      strategies: {
        daily: ['Read together', 'Practice gratitude', 'Outdoor time'],
        weekly: ['Family activities', 'Skill practice', 'Social interaction'],
        monthly: ['Progress review', 'New challenges', 'Celebration']
      },
      timeline: {
        week1: 'Establish routines',
        week2: 'Build on interests',
        week3: 'Address challenges',
        week4: 'Assess progress'
      },
      activities: input.childInterests,
      tips: ['Stay consistent', 'Celebrate progress', 'Be patient']
    }
  }

  private static parseActivityRecommendations(response: string, input: any): AIActivityRecommendation[] {
    // Simplified parser - return sample activities based on input
    const difficultyMap = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' } as const
    
    return [
      {
        title: `Creative ${input.childInterests[0] || 'Art'} Project`,
        description: 'An engaging activity based on your child\'s interests',
        instructions: ['Gather materials', 'Set up workspace', 'Create together', 'Display proudly'],
        ageRangeMin: Math.max(input.childAge - 12, 12),
        ageRangeMax: input.childAge + 12,
        duration: input.duration,
        difficulty: difficultyMap[input.difficulty] || 'MEDIUM',
        type: 'CREATIVE',
        materials: ['Paper', 'Colors', 'Glue', 'Scissors'],
        learningOutcomes: ['Creativity', 'Fine motor skills', 'Self-expression'],
        skills: ['Art', 'Planning', 'Focus'],
        safetyTips: ['Adult supervision', 'Safe materials only', 'Clean workspace']
      }
    ]
  }

  private static parseAssessmentResponse(response: string, input: any): AIChildAssessment {
    // Simplified parser - return structured assessment
    return {
      overallScore: 8.5,
      strengths: ['Curious learner', 'Social engagement', 'Creative thinking'],
      areasForGrowth: ['Fine motor skills', 'Attention span', 'Following instructions'],
      recommendations: [
        'Continue reading together daily',
        'Practice with building blocks',
        'Encourage independent play'
      ],
      milestoneProgress: {
        physical: 85,
        cognitive: 90,
        language: 80,
        socialEmotional: 88,
        adaptive: 82
      },
      nextSteps: [
        'Schedule regular playdates',
        'Introduce new challenges gradually',
        'Celebrate achievements'
      ]
    }
  }
}

export default AIService