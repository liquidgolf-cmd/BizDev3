import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CoachingAgent } from '@/lib/agents/coaching-agent';
import { getSession, updateSession } from '@/lib/firebase/db';

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
    const { feedback } = await request.json();

    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Get session
    const dbSession = await getSession(sessionId);
    if (!dbSession || dbSession.userId !== session.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!dbSession.outline || !dbSession.extractedContext) {
      return NextResponse.json(
        { error: 'No outline to revise' },
        { status: 400 }
      );
    }

    // Create agent and restore state
    const agent = new CoachingAgent(sessionId);
    agent.messages = dbSession.messages;
    agent.outline = dbSession.outline;
    agent.context = dbSession.extractedContext;

    // Revise outline
    const response = await agent.reviseOutline(feedback);

    // Update session
    await updateSession(sessionId, {
      messages: agent.messages,
      outline: agent.outline,
      extractedContext: agent.context,
      status: 'outline_ready',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error revising outline:', error);
    return NextResponse.json(
      { error: 'Failed to revise outline' },
      { status: 500 }
    );
  }
}

