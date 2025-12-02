'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownloadBrief() {
    try {
      const response = await fetch(`/api/projects/${projectId}/cursor-brief`);
      if (!response.ok) {
        throw new Error('Failed to download brief');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}_CURSOR_BRIEF.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading brief:', error);
      alert('Failed to download brief. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
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
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                BizDev
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                project.status === 'ready'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'outline_ready'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {project.context && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Business Context</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Project Type:</span>{' '}
                  {project.context.projectType}
                </div>
                {project.context.businessName && (
                  <div>
                    <span className="font-medium">Business:</span>{' '}
                    {project.context.businessName}
                  </div>
                )}
                <div>
                  <span className="font-medium">Target Audience:</span>{' '}
                  {project.context.targetAudience}
                </div>
                <div>
                  <span className="font-medium">Tone:</span> {project.context.tone}
                </div>
              </div>
            </div>
          )}

          {project.outline && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Project Outline</h2>
              <p className="text-gray-700 mb-4">{project.outline.summary}</p>
              <div className="space-y-3">
                {project.outline.sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{section.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          section.priority === 'must-have'
                            ? 'bg-red-100 text-red-800'
                            : section.priority === 'recommended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{section.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {project.outline && (
              <button
                onClick={handleDownloadBrief}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Cursor Brief
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

