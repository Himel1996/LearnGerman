import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/deepl';
import type { TranslateRequest, TranslateResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (body.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    const translation = await translateText(body.text, body.targetLang || 'de');
    
    const response: TranslateResponse = {
      translation,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Translation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Translation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred during translation' },
      { status: 500 }
    );
  }
}

