import { NextResponse } from 'next/server';
import { prompts } from '@/app/data/prompts';

// GET /api/prompts - Get all prompts
export async function GET() {
  return NextResponse.json({
    prompts,
    count: prompts.length
  });
}

// POST /api/prompts - Get specific prompt by days since start
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { daysSinceStart } = body;

    if (daysSinceStart === undefined || daysSinceStart === null) {
      return NextResponse.json(
        { error: 'daysSinceStart is required' },
        { status: 400 }
      );
    }

    const promptIndex = Math.abs(daysSinceStart) % prompts.length;
    const prompt = prompts[promptIndex];

    return NextResponse.json({
      prompt,
      index: promptIndex,
      totalPrompts: prompts.length
    });
  } catch (error) {
    console.error('Error in prompts API:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
