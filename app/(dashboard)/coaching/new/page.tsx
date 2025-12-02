'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CoachingScreen from '@/components/coaching/CoachingScreen';

export default function NewCoachingPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    startSession();
  }, []);

  async function startSession() {
    try {
      const response = await fetch('/api/coaching/start', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setIsStarting(false);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start coaching session. Please try again.');
      router.push('/dashboard');
    }
  }

  if (isStarting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting coaching session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BizDev</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>
      <CoachingScreen
        sessionId={sessionId}
        onComplete={projectId => {
          router.push(`/projects/${projectId}`);
        }}
      />
    </div>
  );
}

