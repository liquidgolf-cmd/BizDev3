export interface QuickReply {
  label: string;
  value: string;
}

export interface CoachMessage {
  role: 'coach' | 'user';
  content: string;
  quickReplies?: QuickReply[];
  timestamp: Date;
}

export interface ProjectContext {
  projectType: string;
  businessName?: string;
  targetAudience: string;
  uniqueValue: string;
  primaryGoal: string;
  tone: string;
  additionalNotes?: string;
}

export interface ProjectSection {
  id: string;
  name: string;
  purpose: string;
  keyElements: string[];
  copyGuidance?: string;
  priority: 'must-have' | 'recommended' | 'optional';
}

export interface StyleRecommendations {
  tone: string;
  colorSuggestions: string[];
  layoutStyle: string;
}

export interface ProjectOutline {
  summary: string;
  sections: ProjectSection[];
  styleRecommendations: StyleRecommendations;
}

export interface CoachingSession {
  id: string;
  userId: string;
  messages: CoachMessage[];
  status: 'in_progress' | 'outline_ready' | 'approved';
  outline: ProjectOutline | null;
  extractedContext: ProjectContext | null;
  createdAt: Date;
  updatedAt: Date;
}

