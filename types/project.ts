import { ProjectOutline, ProjectContext, BusinessPlan } from './coaching';

export type ProjectStatus = 'coaching' | 'outline_ready' | 'building' | 'ready' | 'editing';

export interface Project {
  id: string;
  userId: string;
  name: string;
  status: ProjectStatus;
  // Legacy field for web project coaching
  outline: ProjectOutline | null;
  // New field for business strategy coaching
  plan: BusinessPlan | null;
  context: ProjectContext | null;
  briefGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}


