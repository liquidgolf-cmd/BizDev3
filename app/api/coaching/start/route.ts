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

    // Check if Firebase is initialized
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.error('Firebase client not configured - missing NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      return NextResponse.json(
        { error: 'Server configuration error: Firebase not configured' },
        { status: 500 }
      );
    }

    const sessionId = uuidv4();
    const agent = new CoachingAgent(sessionId);
    const opening = await agent.startSession();

    // Create session in database
    try {
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
    } catch (dbError: any) {
      console.error('Error saving session to database:', dbError);
      return NextResponse.json(
        { 
          error: 'Failed to save session',
          details: process.env.NODE_ENV === 'development' ? dbError?.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId,
      message: {
        role: 'coach',
        content: opening.content,
        quickReplies: opening.quickReplies,
      },
    });
  } catch (error: any) {
    console.error('Error starting coaching session:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    });
    return NextResponse.json(
      { 
        error: 'Failed to start coaching session',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

