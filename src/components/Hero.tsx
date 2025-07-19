'use client';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Empower Your Parenting Journey
              </span>
              <br />
              <span className="text-gray-800">with AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Personalized parenting plans, child development strategies, and family activities 
              powered by artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="/auth/signup"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Get Started Free
              </a>
              <a 
                href="/auth/signin"
                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 text-center"
              >
                Sign In
              </a>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="mt-12 lg:mt-0 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center text-white text-6xl shadow-2xl animate-pulse-slow">
                🏠
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-3xl"></div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-lg font-medium text-gray-700">Happy Family</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}