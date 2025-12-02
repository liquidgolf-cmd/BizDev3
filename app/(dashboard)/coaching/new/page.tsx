'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CoachingScreen from '@/components/coaching/CoachingScreen';

export default function NewCoachingPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    startSession();
  }, []);

  async function startSession() {
    try {
      setIsStarting(true);
      setError(null);
      const response = await fetch('/api/coaching/start', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to start session');
      }

      const data = await response.json();
      if (!data.sessionId) {
        throw new Error('Invalid response from server');
      }
      
      setSessionId(data.sessionId);
      setIsStarting(false);
    } catch (error: any) {
      console.error('Error starting session:', error);
      setIsStarting(false);
      setError(error.message || 'Failed to start coaching session. Please try again.');
    }
  }

  if (isStarting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting coaching session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Failed to Start Session</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
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

