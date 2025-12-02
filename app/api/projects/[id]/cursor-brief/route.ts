import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project-service';
import { CursorBriefGenerator } from '@/lib/services/cursor-brief-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const projectService = new ProjectService();

    // Verify ownership
    const isOwner = await projectService.verifyOwnership(id, session.user.email);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const project = await projectService.getProject(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.outline || !project.context) {
      return NextResponse.json(
        { error: 'Project outline not available' },
        { status: 400 }
      );
    }

    // Generate brief
    const generator = new CursorBriefGenerator();
    const brief = generator.generateMarkdownBrief(
      project.outline,
      project.context,
      project.name
    );

    // Mark brief as generated
    await projectService.updateProject(id, { briefGenerated: true });

    // Return as downloadable file
    return new NextResponse(brief, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${project.name}_CURSOR_BRIEF.md"`,
      },
    });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    );
  }
}

