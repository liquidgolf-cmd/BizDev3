'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CoachingScreen from '@/components/coaching/CoachingScreen';
import CoachSelection from '@/components/coaching/CoachSelection';
import { useToast } from '@/components/ui/ToastContainer';
import { CoachType, CoachingStyle } from '@/types/coaching';

export default function NewCoachingPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCoachSelection, setShowCoachSelection] = useState(true);
  const router = useRouter();
  const toast = useToast();

  async function startSession(coachType: CoachType, coachingStyle: CoachingStyle) {
    try {
      setIsStarting(true);
      setError(null);
      const response = await fetch('/api/coaching/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachType, coachingStyle }),
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
      setShowCoachSelection(false);
      setIsStarting(false);
    } catch (error: any) {
      console.error('Error starting session:', error);
      setIsStarting(false);
      const errorMessage = error.message || 'Failed to start coaching session. Please try again.';
      setError(errorMessage);
      toast.showError(errorMessage);
    }
  }

  if (showCoachSelection) {
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
        <CoachSelection onSelect={startSession} isLoading={isStarting} />
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

