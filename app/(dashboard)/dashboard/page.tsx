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
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <Link
            href="/coaching/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Project
          </Link>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={statusFilter || ''}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="coaching">Coaching</option>
            <option value="outline_ready">Outline Ready</option>
            <option value="building">Building</option>
            <option value="ready">Ready</option>
            <option value="editing">Editing</option>
          </select>
        </div>

        <ProjectGrid projects={filteredProjects} isLoading={isLoading} />
      </main>
    </div>
  );
}

