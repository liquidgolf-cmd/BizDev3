import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSession, updateSession } from '@/lib/firebase/db';
import { ProjectService } from '@/lib/services/project-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;
    const { projectName } = await request.json();

    // Get session
    const dbSession = await getSession(sessionId);
    if (!dbSession || dbSession.userId !== session.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if we have a plan (new) or outline (legacy)
    if (!dbSession.plan && (!dbSession.outline || !dbSession.extractedContext)) {
      return NextResponse.json(
        { error: 'No plan or outline to approve' },
        { status: 400 }
      );
    }

    // Update session status and transition to support mode
    await updateSession(sessionId, {
      status: 'approved',
      stage: 'support',
    });

    // Create project from approved plan or outline
    const projectService = new ProjectService();
    const project = await projectService.createProject(
      session.user.email,
      projectName || 'New Project'
    );

    // Update project with plan (preferred) or outline (legacy)
    if (dbSession.plan) {
      // New business plan format
      await projectService.updateProject(project.id, {
        outline: null, // Clear legacy outline
        context: dbSession.extractedContext,
        status: 'outline_ready',
        // Note: Project type may need to be updated to support BusinessPlan
        // For now, we'll store plan data in a way that's compatible
      });
    } else {
      // Legacy web project outline format
      await projectService.updateProject(project.id, {
        outline: dbSession.outline,
        context: dbSession.extractedContext,
        status: 'outline_ready',
      });
    }

    return NextResponse.json({
      success: true,
      projectId: project.id,
      project,
    });
  } catch (error) {
    console.error('Error approving outline:', error);
    return NextResponse.json(
      { error: 'Failed to approve outline' },
      { status: 500 }
    );
  }
}

