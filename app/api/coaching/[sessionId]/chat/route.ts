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
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get session from database
    const dbSession = await getSession(sessionId);
    if (!dbSession || dbSession.userId !== session.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Create agent and restore state
    const agent = new CoachingAgent(sessionId);
    agent.messages = dbSession.messages;
    agent.outline = dbSession.outline;
    agent.context = dbSession.extractedContext;

    // Process message
    const response = await agent.chat(message);

    // Update session status if outline was generated
    let newStatus = dbSession.status;
    if (response.outline && response.context) {
      newStatus = 'outline_ready';
    }

    // Update session in database
    await updateSession(sessionId, {
      messages: agent.messages,
      outline: agent.outline,
      extractedContext: agent.context,
      status: newStatus,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in coaching chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

