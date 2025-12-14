import { NextRequest, NextResponse } from 'next/server';
import { analyzeGermanSentence } from '@/lib/llm-provider';
import type { AnalyzeRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    
    if (!body.sentence || typeof body.sentence !== 'string') {
      return NextResponse.json(
        { error: 'Sentence is required and must be a string' },
        { status: 400 }
      );
    }

    if (body.sentence.trim().length === 0) {
      return NextResponse.json(
        { error: 'Sentence cannot be empty' },
        { status: 400 }
      );
    }

    // Default to 'groq' (free) if model is not specified
    const model = body.model || 'groq';
    
    // DEMO MODE: OpenAI is disabled for public/demo usage
    // TODO: Uncomment when adding payment/database integration
    if (model === 'openai') {
      return NextResponse.json(
        { error: 'This feature is not available in demo usage.' },
        { status: 403 }
      );
    }
    
    // const analysis = await analyzeGermanSentence(model, body.sentence);
    // return NextResponse.json(analysis);
    
    // For now, only allow Groq (free model)
    const analysis = await analyzeGermanSentence(model, body.sentence);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Analysis failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred during analysis' },
      { status: 500 }
    );
  }
}

