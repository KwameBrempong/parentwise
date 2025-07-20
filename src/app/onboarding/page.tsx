'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

type OnboardingForm = z.infer<typeof onboardingSchema>

const STEP_TITLES = [
  'Welcome to ParentWise',
  'Set Up Your Profile',
  'Family Setup',
  'Add Your First Child',
  'Privacy Settings',
  'You\'re All Set!',
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const INTERESTS = [
  'Reading', 'Sports', 'Music', 'Art', 'Science', 'Cooking',
  'Building', 'Nature', 'Animals', 'Dancing', 'Gaming', 'Math'
]

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const familyCodeParam = searchParams.get('familyCode')
  const nameParam = searchParams.get('name')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: nameParam || user?.name || '',
      familyCode: familyCodeParam || '',
      familySetup: familyCodeParam ? 'join' : 'create',
      timezone: 'America/New_York',
      privacySettings: {
        shareProgress: true,
        allowAnalytics: true,
        emailNotifications: true,
      },
      childInterests: [],
    },
  })

  const watchedValues = watch()

  const nextStep = () => {
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: OnboardingForm) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete onboarding')
      }

      console.log('Onboarding completed:', result)
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      // You could add a toast notification here
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = (interest: string) => {
    const currentInterests = watchedValues.childInterests || []
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    
    setValue('childInterests', newInterests)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to ParentWise!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Let's set up your account and create your first parenting plan. 
              This will only take a few minutes.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <p className="text-sm text-gray-600">Set up profile</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                </div>
                <p className="text-sm text-gray-600">Add family</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🎯</span>
                </div>
                <p className="text-sm text-gray-600">Create plans</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Up Your Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  {...register('timezone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>
                      {tz.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Setup</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Would you like to create a new family or join an existing one?
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    watchedValues.familySetup === 'create'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}>
                    <input
                      {...register('familySetup')}
                      type="radio"
                      value="create"
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">👨‍👩‍👧‍👦</span>
                      <p className="font-medium">Create New Family</p>
                      <p className="text-sm text-gray-600">Start fresh with your family</p>
                    </div>
                  </label>

                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    watchedValues.familySetup === 'join'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}>
                    <input
                      {...register('familySetup')}
                      type="radio"
                      value="join"
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🤝</span>
                      <p className="font-medium">Join Existing Family</p>
                      <p className="text-sm text-gray-600">Use a family code</p>
                    </div>
                  </label>
                </div>
              </div>

              {watchedValues.familySetup === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Name
                  </label>
                  <input
                    {...register('familyName')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="The Smith Family"
                  />
                </div>
              )}

              {watchedValues.familySetup === 'join' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Code
                  </label>
                  <input
                    {...register('familyCode')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter 6-digit family code"
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your First Child</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name
                </label>
                <input
                  {...register('childName')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter child's name"
                />
                {errors.childName && (
                  <p className="mt-1 text-sm text-red-600">{errors.childName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  {...register('childDateOfBirth')}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.childDateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.childDateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender (Optional)
                </label>
                <select
                  {...register('childGender')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        watchedValues.childInterests?.includes(interest)
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('privacySettings.shareProgress')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Share progress with family members
                  </label>
                  <p className="text-sm text-gray-500">
                    Allow other family members to see your child's progress and milestones
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('privacySettings.allowAnalytics')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Help improve ParentWise
                  </label>
                  <p className="text-sm text-gray-500">
                    Share anonymous usage data to help us improve the platform
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('privacySettings.emailNotifications')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Email notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive helpful tips, milestone reminders, and activity suggestions
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('acceptTerms')}
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You're All Set!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Welcome to ParentWise! Your account is ready and we've created your first family profile.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Explore age-appropriate activities for your child</li>
                <li>• Create your first AI-powered parenting plan</li>
                <li>• Track developmental milestones</li>
                <li>• Connect with other family members</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEP_TITLES.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / STEP_TITLES.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEP_TITLES.length) * 100}%` }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900 mt-4">
            {STEP_TITLES[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep === STEP_TITLES.length - 1 ? (
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Setting up...' : 'Get Started'}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Onboarding() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}