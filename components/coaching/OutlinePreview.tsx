'use client';

import { useState } from 'react';
import { ProjectOutline } from '@/types/coaching';

interface OutlinePreviewProps {
  outline: ProjectOutline;
  onApprove: (projectName: string) => void;
  onRevise: (feedback: string) => void;
}

export default function OutlinePreview({ outline, onApprove, onRevise }: OutlinePreviewProps) {
  const [projectName, setProjectName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showRevise, setShowRevise] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Project Outline</h3>
      
      <div className="mb-4">
        <p className="text-gray-700">{outline.summary}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Sections:</h4>
        <div className="space-y-3">
          {outline.sections.map((section, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{section.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  section.priority === 'must-have' 
                    ? 'bg-red-100 text-red-800' 
                    : section.priority === 'recommended'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {section.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">{section.purpose}</p>
              <ul className="text-sm text-gray-500 mt-1 list-disc list-inside">
                {section.keyElements.map((element, i) => (
                  <li key={i}>{element}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Style Recommendations:</h4>
        <p className="text-sm text-gray-600">Tone: {outline.styleRecommendations.tone}</p>
        <p className="text-sm text-gray-600">Layout: {outline.styleRecommendations.layoutStyle}</p>
        <div className="text-sm text-gray-600 mt-1">
          Colors: {outline.styleRecommendations.colorSuggestions.join(', ')}
        </div>
      </div>

      {!showRevise ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onApprove(projectName || 'New Project')}
              disabled={!projectName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve & Create Project
            </button>
            <button
              onClick={() => setShowRevise(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Request Revision
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to change?
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Provide feedback on the outline..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                onRevise(feedback);
                setFeedback('');
                setShowRevise(false);
              }}
              disabled={!feedback.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Revision Request
            </button>
            <button
              onClick={() => {
                setShowRevise(false);
                setFeedback('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

