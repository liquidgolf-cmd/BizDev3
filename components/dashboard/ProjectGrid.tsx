'use client';

import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import Link from 'next/link';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
}

export default function ProjectGrid({ projects, isLoading }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-700 mb-6">Start by creating your first project with our AI coaching assistant</p>
          <Link
            href="/coaching/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Start New Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

