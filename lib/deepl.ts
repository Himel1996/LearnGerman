import type { TranslateRequest, TranslateResponse } from '@/types';

// DeepL API supports both free and paid accounts
// Free: api-free.deepl.com, Paid: api.deepl.com
const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate';

export async function translateText(
  text: string,
  targetLang: 'de' = 'de'
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPL_API_KEY is not configured');
  }

  try {
    // Auto-detect source language instead of forcing EN
    // This allows translating from any language to German
    const params = new URLSearchParams({
      text: text,
      target_lang: targetLang.toUpperCase(),
    });

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (data.translations && data.translations.length > 0) {
      return data.translations[0].text;
    }
    
    throw new Error('No translation received from DeepL API');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during translation');
  }
}

