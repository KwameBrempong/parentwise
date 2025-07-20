'use client'

function DashboardContent() {
  const user = { name: 'Demo User', email: 'demo@example.com', role: 'PARENT', subscriptionTier: 'FREE' }
  const isLoading = false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ParentWise Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{user?.name}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to ParentWise, {user?.name}! 👋
              </h2>
              <p className="text-gray-600 mb-8">
                Your dashboard is ready. Here's what we've set up for you:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-semibold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-600">Role: {user?.role}</p>
                  <p className="text-sm text-gray-600">Plan: {user?.subscriptionTier}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                  <h3 className="font-semibold text-gray-900">Family</h3>
                  <p className="text-sm text-gray-600">Setup your family</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-gray-900">Plans</h3>
                  <p className="text-sm text-gray-600">Create parenting plans</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 What's Next?</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Add your children's profiles</li>
                  <li>• Explore age-appropriate activities</li>
                  <li>• Create your first AI-powered parenting plan</li>
                  <li>• Track developmental milestones</li>
                  <li>• Connect with family members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}