import Link from 'next/link'

export default function HomePage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
        padding: '2rem'
      }}
    >
      <div 
        className="text-center max-w-4xl mx-auto px-4"
        style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}
      >
        <h1 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}
        >
          ParentWise
        </h1>
        <p 
          className="text-xl md:text-2xl text-gray-600 mb-8"
          style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}
        >
          AI-Powered Parenting Platform
        </p>
        <p 
          className="text-lg text-gray-500 mb-12"
          style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem' }}
        >
          Welcome to your parenting journey with personalized plans, milestone tracking, and expert guidance.
        </p>
        
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}
        >
          <Link 
            href="/auth/signup"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              minWidth: '200px',
              transition: 'all 0.3s ease'
            }}
          >
            Get Started Free
          </Link>
          
          <Link 
            href="/auth/signin"
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 min-w-[200px]"
            style={{
              border: '2px solid #2563eb',
              color: '#2563eb',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              minWidth: '200px',
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </Link>
        </div>

        {/* AI Features Preview */}
        <div 
          className="mt-8"
          style={{ marginTop: '2rem' }}
        >
          <Link 
            href="/ai"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>🤖</span>
            Try AI Features (Beta)
          </Link>
        </div>

        <div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ marginTop: '4rem', display: 'grid', gap: '2rem' }}
        >
          <div 
            className="text-center p-6"
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div 
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👨‍👩‍👧‍👦</span>
            </div>
            <h3 
              className="text-lg font-semibold text-gray-900 mb-2"
              style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}
            >
              Family Management
            </h3>
            <p 
              className="text-gray-600"
              style={{ color: '#4b5563' }}
            >
              Create profiles, track progress, and connect with family members
            </p>
          </div>

          <div 
            className="text-center p-6"
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
            </div>
            <h3 
              className="text-lg font-semibold text-gray-900 mb-2"
              style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}
            >
              AI-Powered Plans
            </h3>
            <p 
              className="text-gray-600"
              style={{ color: '#4b5563' }}
            >
              Personalized parenting strategies based on your child's needs
            </p>
          </div>

          <div 
            className="text-center p-6"
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <div 
              className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f3e8ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📊</span>
            </div>
            <h3 
              className="text-lg font-semibold text-gray-900 mb-2"
              style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}
            >
              Progress Tracking
            </h3>
            <p 
              className="text-gray-600"
              style={{ color: '#4b5563' }}
            >
              Monitor milestones and celebrate your child's achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}