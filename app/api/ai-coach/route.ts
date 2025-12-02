import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createMessageWithFallback } from '@/lib/anthropic/model-fallback';

/**
 * Primary AI Coach Route
 * Tries models in order with fallback mechanism
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, system, tools, max_tokens = 2048 } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Use PRIMARY_COACH model priority (tries newest first, falls back)
    const { response, model } = await createMessageWithFallback(
      {
        messages: messages as any,
        system: system || undefined,
        tools: tools || undefined,
        max_tokens,
      },
      'PRIMARY_COACH'
    );

    return NextResponse.json({
      response: response.content,
      model,
      usage: response.usage,
    });
  } catch (error: any) {
    console.error('Error in AI coach route:', error);
    return NextResponse.json(
      {
        error: 'Failed to process AI coach request',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

