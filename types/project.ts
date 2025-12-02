import { ProjectOutline, ProjectContext } from './coaching';

export type ProjectStatus = 'coaching' | 'outline_ready' | 'building' | 'ready' | 'editing';

export interface Project {
  id: string;
  userId: string;
  name: string;
  status: ProjectStatus;
  outline: ProjectOutline | null;
  context: ProjectContext | null;
  briefGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}


