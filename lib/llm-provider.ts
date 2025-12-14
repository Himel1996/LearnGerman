import type { AnalyzeResponse } from '@/types';
// DEMO MODE: OpenAI import commented out for public/demo usage
// TODO: Uncomment when adding payment/database integration
// import { analyzeGermanSentence as analyzeWithOpenAI } from './openai';
import { analyzeGermanSentence as analyzeWithGroq } from './groq';
// @ts-ignore - OpenAI import commented for demo mode

export type LLMProvider = 'openai' | 'groq';

export async function analyzeGermanSentence(
  model: LLMProvider,
  sentence: string
): Promise<AnalyzeResponse> {
  switch (model) {
    // DEMO MODE: OpenAI case disabled
    // TODO: Uncomment when adding payment/database integration
    // case 'openai':
    //   return analyzeWithOpenAI(sentence);
    case 'groq':
      return analyzeWithGroq(sentence);
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

