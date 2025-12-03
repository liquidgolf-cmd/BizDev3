'use client';

import { useState } from 'react';
import { CoachType, CoachingStyle } from '@/types/coaching';

interface CoachSelectionProps {
  onSelect: (coachType: CoachType, coachingStyle: CoachingStyle) => void;
  isLoading?: boolean;
}

interface CoachInfo {
  type: CoachType;
  name: string;
  tagline: string;
  description: string;
  helpsWith: string[];
  exampleOutcomes: string[];
  icon: string;
  color: string;
}

const coaches: CoachInfo[] = [
  {
    type: 'strategy',
    name: 'Strategy & Clarity',
    tagline: 'Get clear on your direction',
    description: 'Help you define your business model, identify your ideal customers, and create a clear path to growth.',
    helpsWith: [
      'Business model clarity',
      'Target audience definition',
      'Revenue optimization',
      'Growth bottlenecks'
    ],
    exampleOutcomes: [
      'Clear value proposition',
      'Defined target market',
      'Revenue growth strategy',
      'Actionable growth plan'
    ],
    icon: '🎯',
    color: 'blue',
  },
  {
    type: 'brand',
    name: 'Brand & Positioning',
    tagline: 'Stand out in your market',
    description: 'Develop a compelling brand identity, messaging, and positioning that resonates with your audience.',
    helpsWith: [
      'Brand identity',
      'Messaging strategy',
      'Market differentiation',
      'Brand consistency'
    ],
    exampleOutcomes: [
      'Clear brand positioning',
      'Compelling messaging',
      'Brand guidelines',
      'Consistent brand experience'
    ],
    icon: '✨',
    color: 'purple',
  },
  {
    type: 'marketing',
    name: 'Marketing & Sales',
    tagline: 'Grow your customer base',
    description: 'Build effective marketing systems, optimize your sales process, and convert more leads into customers.',
    helpsWith: [
      'Lead generation',
      'Content strategy',
      'Sales process',
      'Conversion optimization'
    ],
    exampleOutcomes: [
      'Marketing system',
      'Sales funnel',
      'Content calendar',
      'Conversion strategy'
    ],
    icon: '📈',
    color: 'green',
  },
  {
    type: 'leadership',
    name: 'Leadership & Vision',
    tagline: 'Lead with clarity and purpose',
    description: 'Clarify your vision, build effective teams, and make confident decisions as a leader.',
    helpsWith: [
      'Vision & values',
      'Team structure',
      'Decision-making',
      'Leadership development'
    ],
    exampleOutcomes: [
      'Clear vision statement',
      'Team structure plan',
      'Decision framework',
      'Leadership roadmap'
    ],
    icon: '👔',
    color: 'indigo',
  },
  {
    type: 'customer_experience',
    name: 'Customer Experience',
    tagline: 'Delight your customers',
    description: 'Design exceptional customer journeys, improve onboarding, and build systems for retention and referrals.',
    helpsWith: [
      'Customer journey',
      'Onboarding process',
      'Communication systems',
      'Retention & referrals'
    ],
    exampleOutcomes: [
      'Customer journey map',
      'Onboarding system',
      'Feedback process',
      'Retention strategy'
    ],
    icon: '💎',
    color: 'pink',
  },
];

const styles: { type: CoachingStyle; name: string; description: string; icon: string }[] = [
  {
    type: 'mentor',
    name: 'Mentor',
    description: 'Supportive, encouraging, and patient. Guides you through self-discovery with warm, empathetic language.',
    icon: '🤝',
  },
  {
    type: 'realist',
    name: 'Realist',
    description: 'Direct, honest, and no-nonsense. Cuts to the chase and focuses on what actually works.',
    icon: '💪',
  },
  {
    type: 'strategist',
    name: 'Strategist',
    description: 'Analytical, data-driven, and systematic. Breaks down complex problems with structured, logical thinking.',
    icon: '🧠',
  },
];

export default function CoachSelection({ onSelect, isLoading = false }: CoachSelectionProps) {
  const [selectedCoach, setSelectedCoach] = useState<CoachType | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CoachingStyle>('mentor');

  const handleStart = () => {
    if (selectedCoach) {
      onSelect(selectedCoach, selectedStyle);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Business Coach
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a coach that matches your needs, then choose a coaching style that fits your preference.
          </p>
        </div>

        {/* Coach Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Coach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <button
                key={coach.type}
                onClick={() => setSelectedCoach(coach.type)}
                className={`card text-left transition-all ${
                  selectedCoach === coach.type
                    ? 'ring-2 ring-blue-600 border-blue-600'
                    : 'hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{coach.icon}</span>
                  {selectedCoach === coach.type && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{coach.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{coach.tagline}</p>
                <p className="text-sm text-gray-600 mb-4">{coach.description}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Helps with:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {coach.helpsWith.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        {selectedCoach && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Coaching Style</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {styles.map((style) => (
                <button
                  key={style.type}
                  onClick={() => setSelectedStyle(style.type)}
                  className={`card text-left transition-all ${
                    selectedStyle === style.type
                      ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50'
                      : 'hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{style.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{style.name}</h3>
                    {selectedStyle === style.type && (
                      <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {selectedCoach && (
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Starting Session...
                </>
              ) : (
                <>
                  Start Coaching Session
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Helper Text */}
        {!selectedCoach && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Select a coach above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

