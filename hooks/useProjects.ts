'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';

export function useProjects(userId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchProjects() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [userId]);

  return { projects, isLoading, error, refetch: () => {
    if (userId) {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => setError(err.message));
    }
  } };
}

