'use client';

import { Project } from '@/types/project';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ActivityFeedProps {
  projects: Project[];
  limit?: number;
}

export default function ActivityFeed({ projects, limit = 5 }: ActivityFeedProps) {
  // Sort projects by most recently updated
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  if (recentProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-sm text-gray-500">No activity yet. Create your first project to get started!</p>
      </div>
    );
  }

  const getActivityMessage = (project: Project): string => {
    switch (project.status) {
      case 'coaching':
        return 'Started coaching session';
      case 'outline_ready':
        return 'Outline generated';
      case 'building':
        return 'Building project';
      case 'ready':
        return 'Project completed';
      case 'editing':
        return 'Project updated';
      default:
        return 'Project updated';
    }
  };

  const getStatusIcon = (status: Project['status']): string => {
    switch (status) {
      case 'coaching':
        return '💬';
      case 'outline_ready':
        return '📋';
      case 'building':
        return '🔨';
      case 'ready':
        return '✅';
      case 'editing':
        return '✏️';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-blue-500"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getStatusIcon(project.status)}</span>
                  <span className="font-medium text-gray-900">{project.name}</span>
                </div>
                <p className="text-sm text-gray-600">{getActivityMessage(project)}</p>
                {project.context?.businessName && (
                  <p className="text-xs text-gray-500 mt-1">{project.context.businessName}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {projects.length > limit && (
        <Link
          href="/dashboard"
          className="block mt-4 text-sm text-blue-600 hover:text-blue-700 text-center"
        >
          View all projects →
        </Link>
      )}
    </div>
  );
}


