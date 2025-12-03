import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CoachingAgent } from '@/lib/agents/coaching-agent';
import { createSession } from '@/lib/firebase/db';
import { v4 as uuidv4 } from 'uuid';
import { CoachType, CoachingStyle } from '@/types/coaching';

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

    // Get coachType and coachingStyle from request body
    const body = await request.json().catch(() => ({}));
    const coachType: CoachType = body.coachType || 'strategy';
    const coachingStyle: CoachingStyle = body.coachingStyle || 'mentor';

    // Validate coachType
    const validCoachTypes: CoachType[] = ['strategy', 'brand', 'marketing', 'customer_experience'];
    if (!validCoachTypes.includes(coachType)) {
      return NextResponse.json(
        { error: 'Invalid coach type' },
        { status: 400 }
      );
    }

    // Validate coachingStyle
    const validStyles: CoachingStyle[] = ['mentor', 'realist', 'strategist', 'accountability_partner'];
    if (!validStyles.includes(coachingStyle)) {
      return NextResponse.json(
        { error: 'Invalid coaching style' },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    const agent = new CoachingAgent(sessionId, coachType, coachingStyle);
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
        coachType,
        coachingStyle,
        stage: 'discovery',
        businessProfile: undefined,
        plan: null,
      }, sessionId);
    } catch (dbError: any) {
      console.error('Error saving session to database:', dbError);
      console.error('Database error details:', {
        message: dbError?.message,
        stack: dbError?.stack,
        code: dbError?.code,
        name: dbError?.name,
        sessionData: {
          userId: session.user.email,
          coachType,
          coachingStyle,
          messageCount: 1,
        },
      });
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

