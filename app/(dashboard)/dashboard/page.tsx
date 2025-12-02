'use client';

import { useSession } from 'next-auth/react';
import { useProjects } from '@/hooks/useProjects';
import { useDashboard } from '@/hooks/useDashboard';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { projects, isLoading } = useProjects(session?.user?.email || undefined);
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredProjects } =
    useDashboard(projects);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BizDev</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{session?.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-sm text-gray-600 mt-1">
              {projects.length === 0 
                ? 'Get started by creating your first project'
                : `${projects.length} project${projects.length !== 1 ? 's' : ''} total`
              }
            </p>
          </div>
          <Link
            href="/coaching/new"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span>
            <span>Start New Project</span>
          </Link>
        </div>

        {projects.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Search projects by name or business..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              />
              <select
                value={statusFilter || ''}
                onChange={e => setStatusFilter(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                title="Filter projects by status"
              >
                <option value="">All Statuses</option>
                <option value="coaching">Coaching</option>
                <option value="outline_ready">Outline Ready</option>
                <option value="building">Building</option>
                <option value="ready">Ready</option>
                <option value="editing">Editing</option>
              </select>
            </div>
            {statusFilter && (
              <p className="text-sm text-gray-600">
                Showing {filteredProjects.length} of {projects.length} projects
                {statusFilter && ` (filtered by: ${statusFilter.replace('_', ' ')})`}
              </p>
            )}
          </div>
        )}

        <ProjectGrid projects={filteredProjects} isLoading={isLoading} />
      </main>
    </div>
  );
}

