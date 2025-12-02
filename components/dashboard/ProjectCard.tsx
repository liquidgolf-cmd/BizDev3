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
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[project.status]
            }`}
          >
            {project.status.replace('_', ' ')}
          </span>
        </div>
        
        {project.context?.businessName && (
          <p className="text-sm text-gray-600 mb-2">
            {project.context.businessName}
          </p>
        )}
        
        {project.context?.projectType && (
          <p className="text-xs text-gray-700 mb-4">
            {project.context.projectType}
          </p>
        )}

        <div className="text-xs text-gray-600">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

