import {
  createProject,
  getProject,
  getUserProjects,
  updateProject,
  deleteProject,
} from '@/lib/firebase/db';
import { Project } from '@/types/project';

export class ProjectService {
  async createProject(userId: string, name: string): Promise<Project> {
    return await createProject({
      userId,
      name,
      status: 'coaching',
      outline: null,
      context: null,
      briefGenerated: false,
    });
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await getUserProjects(userId);
  }

  async getProject(projectId: string): Promise<Project | null> {
    return await getProject(projectId);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    return await updateProject(projectId, updates);
  }

  async deleteProject(projectId: string): Promise<void> {
    return await deleteProject(projectId);
  }

  async verifyOwnership(projectId: string, userId: string): Promise<boolean> {
    const project = await getProject(projectId);
    return project?.userId === userId;
  }
}

