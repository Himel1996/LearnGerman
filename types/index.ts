export interface TranslateRequest {
  text: string;
  targetLang: 'de';
}

export interface TranslateResponse {
  translation: string;
}

export interface AnalyzeRequest {
  sentence: string;
  model?: 'openai' | 'groq'; // optional, defaults to 'groq'
}

export interface VocabularyItem {
  german: string;
  english: string;
}

export interface AnalyzeResponse {
  translation: string;
  grammar: string;
  vocabulary: VocabularyItem[];
}

