import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CoachingAgent } from '@/lib/agents/coaching-agent';
import { getSession, updateSession } from '@/lib/firebase/db';
import { CoachType, CoachingStyle } from '@/types/coaching';

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
    const { coachType, coachingStyle } = await request.json();

    if (!coachType) {
      return NextResponse.json(
        { error: 'coachType is required' },
        { status: 400 }
      );
    }

    // Validate coachType
    const validCoachTypes: CoachType[] = ['strategy', 'brand', 'marketing', 'customer_experience'];
    if (!validCoachTypes.includes(coachType)) {
      return NextResponse.json(
        { error: 'Invalid coach type' },
        { status: 400 }
      );
    }

    // Validate coachingStyle if provided
    if (coachingStyle) {
      const validStyles: CoachingStyle[] = ['mentor', 'realist', 'strategist', 'accountability_partner'];
      if (!validStyles.includes(coachingStyle)) {
        return NextResponse.json(
          { error: 'Invalid coaching style' },
          { status: 400 }
        );
      }
    }

    // Get session
    const dbSession = await getSession(sessionId);
    if (!dbSession || dbSession.userId !== session.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update agent with new coach
    const agent = new CoachingAgent(
      sessionId,
      coachType,
      coachingStyle || dbSession.coachingStyle || 'mentor'
    );
    agent.messages = dbSession.messages || [];
    agent.outline = dbSession.outline;
    agent.context = dbSession.extractedContext;
    agent.businessProfile = dbSession.businessProfile || null;
    agent.plan = dbSession.plan || null;
    if (dbSession.stage) {
      (agent as any).stage = dbSession.stage;
    }

    // Update session with new coach info
    await updateSession(sessionId, {
      coachType,
      coachingStyle: coachingStyle || dbSession.coachingStyle,
    });

    return NextResponse.json({
      success: true,
      coachType,
      coachingStyle: coachingStyle || dbSession.coachingStyle,
      message: `Switched to ${coachType} coach`,
    });
  } catch (error: any) {
    console.error('Error switching coach:', error);
    return NextResponse.json(
      { 
        error: 'Failed to switch coach',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

