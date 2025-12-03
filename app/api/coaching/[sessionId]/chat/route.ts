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

    // Check if Anthropic API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Get session from database
    const dbSession = await getSession(sessionId);
    if (!dbSession || dbSession.userId !== session.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Create agent and restore state
    const agent = new CoachingAgent(
      sessionId,
      dbSession.coachType || 'strategy',
      dbSession.coachingStyle || 'mentor'
    );
    agent.messages = dbSession.messages || [];
    agent.outline = dbSession.outline;
    agent.context = dbSession.extractedContext;
    agent.businessProfile = dbSession.businessProfile || null;
    agent.plan = dbSession.plan || null;
    // Restore stage if available (using private property access via type assertion)
    if (dbSession.stage) {
      (agent as any).stage = dbSession.stage;
    }

    // Process message
    let response;
    try {
      response = await agent.chat(message);
    } catch (agentError: any) {
      console.error('[Chat Route] Error in agent.chat:', agentError);
      console.error('[Chat Route] Agent error details:', {
        message: agentError?.message,
        stack: agentError?.stack,
        name: agentError?.name,
        cause: agentError?.cause,
      });
      throw agentError; // Re-throw to be caught by outer try-catch
    }

    // Update session status based on stage and plan/outline generation
    let newStatus = dbSession.status;
    const currentStage = (agent as any).stage || dbSession.stage || 'discovery';
    
    // Update status based on what was generated
    if (response.plan) {
      newStatus = 'outline_ready'; // Business plan ready
    } else if (response.outline && response.context) {
      newStatus = 'outline_ready'; // Legacy web project outline ready
    }

    // Update session in database with all state
    await updateSession(sessionId, {
      messages: agent.messages,
      outline: agent.outline,
      extractedContext: agent.context,
      businessProfile: agent.businessProfile || undefined,
      plan: agent.plan,
      stage: currentStage,
      status: newStatus,
    });

    // Include stage in response if it changed
    const responseWithStage = {
      ...response,
      stage: currentStage,
    };

    return NextResponse.json(responseWithStage);
  } catch (error: any) {
    // Log comprehensive error information
    const errorDetails = {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      status: error?.status,
      statusCode: error?.statusCode,
      name: error?.name,
      type: error?.type,
      cause: error?.cause,
      fullError: String(error),
    };
    
    console.error('[Chat Route] Error in coaching chat:', errorDetails);
    console.error('[Chat Route] Full error object:', error);
    
    // Extract more specific error message
    let errorMessage = 'Failed to process message';
    if (error?.message) {
      errorMessage = error.message;
      // If it's a model error, provide more context
      if (error.message.includes('model') || error.message.includes('404')) {
        errorMessage = 'AI model unavailable. Please try again in a moment.';
      } else if (error.message.includes('ANTHROPIC_API_KEY')) {
        errorMessage = 'AI service configuration error. Please contact support.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

