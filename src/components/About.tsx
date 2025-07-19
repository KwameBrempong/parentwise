'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your child\'s development stage and family dynamics.',
  },
  {
    icon: '📱',
    title: 'Mobile-First Design',
    description: 'Access your parenting resources anytime, anywhere with our responsive mobile platform.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family-Centered',
    description: 'Solutions that consider your entire family structure and individual needs of each child.',
  },
  {
    icon: '🎯',
    title: 'Goal-Oriented',
    description: 'Track progress and celebrate milestones in your child\'s development journey.',
  },
];

export default function About() {
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(new Array(features.length).fill(false));
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              About ParentWise
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Transform Your Parenting Experience
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              ParentWise is an innovative AI-powered platform designed to support parents in raising 
              responsible, confident children. Our advanced technology creates personalized parenting 
              plans that adapt to your family's unique needs and dynamics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => { featureRefs.current[index] = el; }}
              className={`text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-500 transform ${
                visibleFeatures[index] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              } hover:-translate-y-2`}
            >
              <div className="text-4xl mb-4 animate-bounce">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}