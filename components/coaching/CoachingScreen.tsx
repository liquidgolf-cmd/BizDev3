'use client';

import { useState, useEffect, useRef } from 'react';
import { CoachMessage, ProjectOutline, BusinessPlan, CoachType, CoachingStyle, CoachingStage } from '@/types/coaching';
import QuickReplyButtons from './QuickReplyButtons';
import OutlinePreview from './OutlinePreview';
import BusinessPlanPreview from './BusinessPlanPreview';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContainer';

interface CoachingScreenProps {
  sessionId: string | null;
  onComplete?: (projectId: string) => void;
}

const coachNames: Record<CoachType, string> = {
  strategy: 'Strategy & Clarity',
  brand: 'Brand & Positioning',
  marketing: 'Marketing & Sales',
  leadership: 'Leadership & Vision',
  customer_experience: 'Customer Experience',
};

const styleNames: Record<CoachingStyle, string> = {
  mentor: 'Mentor',
  realist: 'Realist',
  strategist: 'Strategist',
};

const stageNames: Record<CoachingStage, string> = {
  discovery: 'Discovery',
  plan_generation: 'Plan Generation',
  support: 'Support Mode',
};

export default function CoachingScreen({ sessionId, onComplete }: CoachingScreenProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [coachType, setCoachType] = useState<CoachType | null>(null);
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle | null>(null);
  const [stage, setStage] = useState<CoachingStage | null>(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchSession() {
    if (!sessionId) return;
    try {
      const response = await fetch(`/api/coaching/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setOutline(data.outline || null);
        setPlan(data.plan || null);
        if (data.coachType) setCoachType(data.coachType);
        if (data.coachingStyle) setCoachingStyle(data.coachingStyle);
        if (data.stage) setStage(data.stage);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  }

  async function switchCoach(newCoachType: CoachType, newStyle?: CoachingStyle) {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/coaching/${sessionId}/switch-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          coachType: newCoachType,
          coachingStyle: newStyle || coachingStyle 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to switch coach');
      }

      const data = await response.json();
      setCoachType(data.coachType);
      setCoachingStyle(data.coachingStyle);
      setShowSwitchModal(false);
      toast.showSuccess(`Switched to ${coachNames[newCoachType]} coach`);
      
      // Refresh session to get updated messages
      await fetchSession();
    } catch (error: any) {
      console.error('Error switching coach:', error);
      toast.showError(error.message || 'Failed to switch coach. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(content: string) {
    if (!sessionId || !content.trim() || isLoading) return;

    const userMessage: CoachMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/coaching/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `Server error (${response.status})` };
        }
        
        console.error('[CoachingScreen] API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        
        throw new Error(errorData.error || errorData.details || `Failed to send message (${response.status})`);
      }

      const data = await response.json();
      console.log('[CoachingScreen] Received response:', { 
        hasContent: !!data.content,
        hasQuickReplies: !!data.quickReplies,
        hasOutline: !!data.outline,
        hasPlan: !!data.plan,
        stage: data.stage,
      });
      const coachMessage: CoachMessage = {
        role: 'coach',
        content: data.content || 'No response received',
        quickReplies: data.quickReplies,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, coachMessage]);

      // Update outline (legacy) or plan (new)
      if (data.outline) {
        setOutline(data.outline);
      }
      if (data.plan) {
        setPlan(data.plan);
      }
      
      // Update stage if provided
      if (data.stage) {
        setStage(data.stage);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Remove the user message that failed
      setMessages(prev => prev.slice(0, -1));
      toast.showError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(projectName: string) {
    if (!sessionId || !projectName.trim()) {
      toast.showWarning('Please enter a project name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/coaching/${sessionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: projectName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to approve outline');
      }

      const data = await response.json();
      if (!data.projectId) {
        throw new Error('Invalid response from server');
      }

      if (onComplete) {
        onComplete(data.projectId);
      } else {
        router.push(`/projects/${data.projectId}`);
      }
    } catch (error: any) {
      console.error('Error approving outline:', error);
      toast.showError(error.message || 'Failed to approve outline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRevise(feedback: string) {
    if (!sessionId || !feedback.trim()) {
      toast.showWarning('Please provide feedback for revision');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/coaching/${sessionId}/revise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedback.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to revise outline');
      }

      const data = await response.json();
      
      if (data.outline) {
        setOutline(data.outline);
      }

      const coachMessage: CoachMessage = {
        role: 'coach',
        content: data.content || 'I\'ve revised the outline based on your feedback.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, coachMessage]);
    } catch (error: any) {
      console.error('Error revising outline:', error);
      toast.showError(error.message || 'Failed to revise outline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuickReply(value: string) {
    sendMessage(value);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Coach Info */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {coachType && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {coachNames[coachType]}
                  </p>
                  {coachingStyle && (
                    <p className="text-xs text-gray-500">
                      {styleNames[coachingStyle]} Style
                    </p>
                  )}
                </div>
                {stage && (
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {stageNames[stage]}
                  </div>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setShowSwitchModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            disabled={isLoading}
          >
            Switch Coach
          </button>
        </div>
      </div>

      {/* Switch Coach Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Switch Coach</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose a different coach to continue your session. Your conversation history will be preserved.
            </p>
            <div className="space-y-2 mb-4">
              {(['strategy', 'brand', 'marketing', 'leadership', 'customer_experience'] as CoachType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => switchCoach(type)}
                  disabled={isLoading || coachType === type}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
                    coachType === type
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium">{coachNames[type]}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.quickReplies && message.role === 'coach' && (
                  <QuickReplyButtons
                    replies={message.quickReplies}
                    onSelect={handleQuickReply}
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          {/* Show BusinessPlan if available (new format), otherwise show Outline (legacy) */}
          {plan && (
            <BusinessPlanPreview
              plan={plan}
              onApprove={handleApprove}
              onRevise={handleRevise}
              isLoading={isLoading}
            />
          )}
          {!plan && outline && (
            <OutlinePreview
              outline={outline}
              onApprove={handleApprove}
              onRevise={handleRevise}
              isLoading={isLoading}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

