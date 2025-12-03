'use client';

import { useState } from 'react';
import { BusinessPlan } from '@/types/coaching';
import { useToast } from '@/components/ui/ToastContainer';

interface BusinessPlanPreviewProps {
  plan: BusinessPlan;
  onApprove: (projectName: string) => void;
  onRevise: (feedback: string) => void;
  isLoading?: boolean;
}

export default function BusinessPlanPreview({ plan, onApprove, onRevise, isLoading = false }: BusinessPlanPreviewProps) {
  const [projectName, setProjectName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showRevise, setShowRevise] = useState(false);
  const toast = useToast();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-neutral-200">
      <h3 className="text-2xl font-semibold mb-6 text-neutral-900">Strategic Business Plan</h3>
      
      {/* Strategy Overview */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-neutral-900">Strategy Overview</h4>
        <p className="text-neutral-700 leading-relaxed">{plan.strategyOverview}</p>
      </div>

      {/* Objectives */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-neutral-900">Objectives</h4>
        <div className="space-y-3">
          {plan.objectives.map((objective, index) => (
            <div key={objective.id || index} className="border-l-4 border-primary-500 pl-4 py-2 bg-primary-50 rounded-r">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  disabled
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{objective.description}</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    <span className="font-medium">Measurable:</span> {objective.measurable}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-neutral-900">Implementation Phases</h4>
        <div className="space-y-4">
          {plan.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-neutral-900">{phase.name}</h5>
                <span className="text-sm text-neutral-600 bg-white px-3 py-1 rounded-full border border-neutral-200">
                  {phase.timeframe}
                </span>
              </div>
              <div className="space-y-2">
                {phase.actions.map((action, actionIndex) => (
                  <div key={action.id || actionIndex} className="flex items-start gap-2 pl-4 border-l-2 border-neutral-300">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      action.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : action.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {action.priority}
                    </span>
                    <p className="text-sm text-neutral-700 flex-1">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-neutral-900">Key Metrics</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-semibold text-neutral-900">Metric</th>
                <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-semibold text-neutral-900">Target</th>
                <th className="border border-neutral-300 px-4 py-2 text-left text-sm font-semibold text-neutral-900">Checkpoint</th>
              </tr>
            </thead>
            <tbody>
              {plan.metrics.map((metric, index) => (
                <tr key={index} className="hover:bg-neutral-50">
                  <td className="border border-neutral-300 px-4 py-2 text-sm text-neutral-700">{metric.metric}</td>
                  <td className="border border-neutral-300 px-4 py-2 text-sm text-neutral-700 font-medium">{metric.target}</td>
                  <td className="border border-neutral-300 px-4 py-2 text-sm text-neutral-600">{metric.checkpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risks */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-neutral-900">Risks & Mitigation</h4>
        <div className="space-y-3">
          {plan.risks.map((risk, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-amber-50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center">
                  <span className="text-amber-800 text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 mb-1">
                    <span className="text-amber-800">Risk:</span> {risk.risk}
                  </p>
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium text-green-700">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval/Revision Actions */}
      {!showRevise ? (
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => {
                const value = e.target.value;
                if (value.length <= 100) {
                  setProjectName(value);
                }
              }}
              placeholder="Enter project name (required)"
              maxLength={100}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-neutral-900"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              {projectName.length}/100 characters
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (!projectName.trim()) {
                  toast.showWarning('Please enter a project name');
                  return;
                }
                onApprove(projectName.trim());
              }}
              disabled={!projectName.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Approve & Create Project'
              )}
            </button>
            <button
              onClick={() => setShowRevise(true)}
              disabled={isLoading}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Revision
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              What would you like to change?
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Provide feedback on the plan..."
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-neutral-900"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                onRevise(feedback);
                setFeedback('');
                setShowRevise(false);
              }}
              disabled={!feedback.trim() || isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Revising...
                </>
              ) : (
                'Submit Revision Request'
              )}
            </button>
            <button
              onClick={() => {
                setShowRevise(false);
                setFeedback('');
              }}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

