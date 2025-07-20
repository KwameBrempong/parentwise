'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ParentingPlanGenerator from '@/components/ai/ParentingPlanGenerator'

interface Child {
  id: string
  name: string
  dateOfBirth: string
  interests: string[]
}

function AIFeaturesContent() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [activeFeature, setActiveFeature] = useState<'plan' | 'activities' | 'assessment'>('plan')
  const [isLoadingChildren, setIsLoadingChildren] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchChildren()
    }
  }, [isAuthenticated])

  const fetchChildren = async () => {
    try {
      // For now, we'll use mock data since we don't have the children API endpoint yet
      // In production, this would fetch from /api/children
      setChildren([
        {
          id: '1',
          name: 'Emma',
          dateOfBirth: '2021-03-15',
          interests: ['reading', 'puzzles', 'drawing']
        },
        {
          id: '2',
          name: 'Alex',
          dateOfBirth: '2019-08-22',
          interests: ['sports', 'building', 'dinosaurs']
        }
      ])
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setIsLoadingChildren(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access AI-powered parenting features
          </p>
          <a
            href="/auth/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const aiFeatures = [
    {
      id: 'plan',
      title: 'AI Parenting Plans',
      description: 'Generate personalized parenting strategies powered by AI',
      icon: '🎯',
      color: 'blue',
      status: 'Available'
    },
    {
      id: 'activities',
      title: 'Smart Activity Recommendations',
      description: 'AI-curated activities based on your child\'s interests and development',
      icon: '🎮',
      color: 'green',
      status: 'Coming Soon'
    },
    {
      id: 'assessment',
      title: 'AI Development Insights',
      description: 'Get AI-powered insights on your child\'s developmental progress',
      icon: '📊',
      color: 'purple',
      status: 'Coming Soon'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">🤖</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Parenting Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to create personalized parenting strategies, 
            track development, and get expert insights tailored to your child's unique needs.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id as any)}
              disabled={feature.status === 'Coming Soon'}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                activeFeature === feature.id
                  ? `border-${feature.color}-500 bg-${feature.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${
                feature.status === 'Coming Soon' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  feature.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </button>
          ))}
        </div>

        {/* Active Feature Content */}
        <div className="max-w-4xl mx-auto">
          {activeFeature === 'plan' && (
            <div>
              <ParentingPlanGenerator
                children={children}
                onPlanGenerated={(plan) => {
                  console.log('Plan generated:', plan)
                  // Handle plan generation success
                }}
              />
            </div>
          )}

          {activeFeature === 'activities' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Activity Recommendations
              </h3>
              <p className="text-gray-600 mb-6">
                AI-powered activity suggestions are coming soon! This feature will analyze your child's 
                interests, developmental stage, and learning goals to recommend perfect activities.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Coming Features:</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Personalized activity recommendations based on AI analysis</li>
                  <li>• Real-time difficulty adjustment</li>
                  <li>• Progress tracking and skill development insights</li>
                  <li>• Integration with developmental milestones</li>
                </ul>
              </div>
            </div>
          )}

          {activeFeature === 'assessment' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Development Insights
              </h3>
              <p className="text-gray-600 mb-6">
                Advanced AI analysis of your child's development patterns is in development. 
                Get deep insights and personalized recommendations.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Coming Features:</h4>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>• AI-powered developmental milestone analysis</li>
                  <li>• Behavioral pattern recognition</li>
                  <li>• Personalized intervention suggestions</li>
                  <li>• Progress prediction and goal setting</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose AI-Powered Parenting?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Insights</h3>
              <p className="text-gray-600 text-sm">
                Get personalized recommendations in seconds, not hours of research
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
              <p className="text-gray-600 text-sm">
                Every recommendation is tailored to your child's unique personality and needs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based</h3>
              <p className="text-gray-600 text-sm">
                Built on proven child development research and expert knowledge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AIFeaturesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AIFeaturesContent />
    </Suspense>
  )
}