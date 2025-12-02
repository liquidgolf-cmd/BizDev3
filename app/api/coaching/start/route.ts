import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CoachingAgent } from '@/lib/agents/coaching-agent';
import { createSession } from '@/lib/firebase/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = uuidv4();
    const agent = new CoachingAgent(sessionId);
    const opening = await agent.startSession();

    // Create session in database
    await createSession({
      userId: session.user.email,
      messages: [
        {
          role: 'coach',
          content: opening.content,
          quickReplies: opening.quickReplies,
          timestamp: new Date(),
        },
      ],
      status: 'in_progress',
      outline: null,
      extractedContext: null,
    }, sessionId);

    return NextResponse.json({
      sessionId,
      message: {
        role: 'coach',
        content: opening.content,
        quickReplies: opening.quickReplies,
      },
    });
  } catch (error) {
    console.error('Error starting coaching session:', error);
    return NextResponse.json(
      { error: 'Failed to start coaching session' },
      { status: 500 }
    );
  }
}

