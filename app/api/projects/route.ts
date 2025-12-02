import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectService = new ProjectService();
    const projects = await projectService.getUserProjects(session.user.email);

    // Apply search filter if provided
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let filteredProjects = projects;

    if (search) {
      filteredProjects = filteredProjects.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.context?.businessName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status);
    }

    return NextResponse.json(filteredProjects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const projectService = new ProjectService();
    const project = await projectService.createProject(
      session.user.email,
      name
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

