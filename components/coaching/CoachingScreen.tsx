'use client';

import { useState, useEffect, useRef } from 'react';
import { CoachMessage, ProjectOutline } from '@/types/coaching';
import QuickReplyButtons from './QuickReplyButtons';
import OutlinePreview from './OutlinePreview';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContainer';

interface CoachingScreenProps {
  sessionId: string | null;
  onComplete?: (projectId: string) => void;
}

export default function CoachingScreen({ sessionId, onComplete }: CoachingScreenProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<ProjectOutline | null>(null);
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
        setOutline(data.outline);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      const coachMessage: CoachMessage = {
        role: 'coach',
        content: data.content || 'No response received',
        quickReplies: data.quickReplies,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, coachMessage]);

      if (data.outline) {
        setOutline(data.outline);
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
      alert('Please enter a project name');
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
      alert('Please provide feedback for revision');
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
                    ? 'bg-blue-600 text-white'
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
          {outline && (
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

