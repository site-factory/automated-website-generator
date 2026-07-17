import { NextResponse } from 'next/server';
import { generateAiBrief } from '@/lib/ai-brief';

const MAX_PROMPT_LENGTH = 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt || '').trim();

    if (prompt.length < 12) {
      return NextResponse.json(
        { success: false, error: 'Please describe the business in a little more detail.' },
        { status: 400 },
      );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less.` },
        { status: 400 },
      );
    }

    const result = await generateAiBrief(prompt);
    if (!result.brief) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI brief generation is unavailable right now. Please use the manual wizard.',
          failures: result.failures,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      provider: result.provider,
      brief: result.brief,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate AI brief' },
      { status: 500 },
    );
  }
}
