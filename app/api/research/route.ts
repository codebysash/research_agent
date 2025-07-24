import { NextRequest, NextResponse } from 'next/server';
import { ResearchManager } from '../../../manager';
import { ReportData } from '../../../agents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body as { query: string };

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a valid research question' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create research manager and conduct research
    const manager = new ResearchManager();
    const report = await manager.conductResearchForAPI(query.trim());

    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Research API error:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred during research',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}