'use client';

import { Project } from '@/types/project';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<Project['status'], string> = {
  coaching: 'bg-yellow-100 text-yellow-800',
  outline_ready: 'bg-blue-100 text-blue-800',
  building: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  editing: 'bg-gray-100 text-gray-800',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{project.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
              statusColors[project.status]
            }`}
          >
            {project.status.replace('_', ' ')}
          </span>
        </div>
        
        {project.context?.businessName && (
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {project.context.businessName}
          </p>
        )}
        
        {project.context?.projectType && (
          <p className="text-xs text-gray-500 mb-3">
            {project.context.projectType}
          </p>
        )}

        {project.outline && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 line-clamp-2">
              {project.outline.summary}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>Updated {formatDate(new Date(project.updatedAt))}</span>
          {project.outline && (
            <span className="text-blue-600">
              {project.outline.sections.length} sections
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

