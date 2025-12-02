'use client';

import { useState, useEffect } from 'react';
import { CoachingSession } from '@/types/coaching';

export function useCoachingSession(sessionId: string | null) {
  const [session, setSession] = useState<CoachingSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchSession() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/coaching/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  return { session, isLoading, error };
}


