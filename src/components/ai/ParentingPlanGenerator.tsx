'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const planGeneratorSchema = z.object({
  childId: z.string().min(1, 'Please select a child'),
  parentingGoals: z.array(z.string()).min(1, 'Please select at least one parenting goal'),
  challenges: z.array(z.string()).default([]),
  familyContext: z.string().optional(),
  timeline: z.enum(['1_month', '3_months', '6_months']).default('3_months'),
})

type PlanGeneratorForm = z.infer<typeof planGeneratorSchema>

interface Child {
  id: string
  name: string
  dateOfBirth: string
  interests: string[]
}

interface ParentingPlanGeneratorProps {
  children: Child[]
  onPlanGenerated?: (plan: any) => void
}

const PARENTING_GOALS = [
  'Build emotional intelligence',
  'Improve communication skills',
  'Develop independence',
  'Enhance creativity',
  'Strengthen family bonds',
  'Address behavioral challenges',
  'Support academic growth',
  'Encourage physical activity',
  'Develop social skills',
  'Build confidence and self-esteem',
  'Establish healthy routines',
  'Promote problem-solving skills'
]

const COMMON_CHALLENGES = [
  'Tantrums and meltdowns',
  'Bedtime struggles',
  'Picky eating',
  'Screen time management',
  'Sibling rivalry',
  'Difficulty following instructions',
  'Separation anxiety',
  'Lack of motivation',
  'Attention and focus issues',
  'Social interaction difficulties'
]

export default function ParentingPlanGenerator({ children, onPlanGenerated }: ParentingPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlanGeneratorForm>({
    resolver: zodResolver(planGeneratorSchema),
    defaultValues: {
      timeline: '3_months',
      parentingGoals: [],
      challenges: [],
    },
  })

  const selectedChild = watch('childId')
  const child = children.find(c => c.id === selectedChild)

  const toggleGoal = (goal: string) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal]
    
    setSelectedGoals(newGoals)
    setValue('parentingGoals', newGoals)
  }

  const toggleChallenge = (challenge: string) => {
    const newChallenges = selectedChallenges.includes(challenge)
      ? selectedChallenges.filter(c => c !== challenge)
      : [...selectedChallenges, challenge]
    
    setSelectedChallenges(newChallenges)
    setValue('challenges', newChallenges)
  }

  const calculateAge = (dateOfBirth: string) => {
    const age = Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    const years = Math.floor(age / 12)
    const months = age % 12
    return `${years} years ${months} months`
  }

  const onSubmit = async (data: PlanGeneratorForm) => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/parenting-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate parenting plan')
      }

      setGeneratedPlan(result.data)
      onPlanGenerated?.(result.data)
      
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate parenting plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (generatedPlan) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            AI Plan Generated Successfully!
          </h2>
          <p className="text-gray-600">
            Your personalized parenting plan is ready
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {generatedPlan.plan.title}
            </h3>
            <p className="text-gray-600">
              {generatedPlan.plan.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Primary Goal</h4>
            <p className="text-gray-700">{generatedPlan.plan.goals.primary}</p>
          </div>

          {generatedPlan.plan.goals.secondary.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Secondary Goals</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {generatedPlan.plan.goals.secondary.map((goal: string, index: number) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Daily Strategies</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {generatedPlan.plan.strategies.daily.map((strategy: string, index: number) => (
                  <li key={index}>• {strategy}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Weekly Activities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {generatedPlan.plan.strategies.weekly.map((activity: string, index: number) => (
                  <li key={index}>• {activity}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Monthly Reviews</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {generatedPlan.plan.strategies.monthly.map((review: string, index: number) => (
                  <li key={index}>• {review}</li>
                ))}
              </ul>
            </div>
          </div>

          {generatedPlan.aiInsights?.tips && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Insights & Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {generatedPlan.aiInsights.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setGeneratedPlan(null)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Generate Another Plan
          </button>
          <button
            onClick={() => {/* Navigate to plan details */}}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            View Full Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">🤖</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Parenting Plan Generator
        </h2>
        <p className="text-gray-600">
          Create a personalized parenting plan powered by artificial intelligence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Child Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Child
          </label>
          <select
            {...register('childId')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a child...</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({calculateAge(child.dateOfBirth)})
              </option>
            ))}
          </select>
          {errors.childId && (
            <p className="mt-1 text-sm text-red-600">{errors.childId.message}</p>
          )}
        </div>

        {/* Child Interests Display */}
        {child && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              {child.name}'s Profile
            </h4>
            <div className="text-sm text-blue-800">
              <p><strong>Age:</strong> {calculateAge(child.dateOfBirth)}</p>
              {child.interests.length > 0 && (
                <p><strong>Interests:</strong> {child.interests.join(', ')}</p>
              )}
            </div>
          </div>
        )}

        {/* Parenting Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parenting Goals <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Select the areas you'd like to focus on with your child
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PARENTING_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedGoals.includes(goal)
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                {goal}
              </button>
            ))}
          </div>
          {errors.parentingGoals && (
            <p className="mt-1 text-sm text-red-600">{errors.parentingGoals.message}</p>
          )}
        </div>

        {/* Current Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Challenges (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Select any challenges you're currently facing
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_CHALLENGES.map((challenge) => (
              <button
                key={challenge}
                type="button"
                onClick={() => toggleChallenge(challenge)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChallenges.includes(challenge)
                    ? 'bg-orange-100 text-orange-800 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        {/* Family Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family Context (Optional)
          </label>
          <textarea
            {...register('familyContext')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about your family situation, any special circumstances, or additional context that might help create a better plan..."
          />
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Timeline
          </label>
          <select
            {...register('timeline')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1_month">1 Month Plan</option>
            <option value="3_months">3 Months Plan (Recommended)</option>
            <option value="6_months">6 Months Plan</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating AI Plan...
            </div>
          ) : (
            '🤖 Generate AI Parenting Plan'
          )}
        </button>
      </form>
    </div>
  )
}