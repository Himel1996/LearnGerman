import type { AnalyzeResponse, VocabularyItem } from '@/types';

export async function analyzeGermanSentence(sentence: string): Promise<AnalyzeResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const prompt = `Analyze the following German sentence and provide:
1. English translation
2. Detailed grammatical analysis (cases, tenses, word order, sentence structure)
3. Vocabulary breakdown with German words and their English meanings

German sentence: "${sentence}"

Please format your response as JSON with the following structure:
{
  "translation": "English translation here",
  "grammar": "Detailed grammatical analysis here",
  "vocabulary": [
    {"german": "word1", "english": "meaning1"},
    {"german": "word2", "english": "meaning2"}
  ]
}

Return only valid JSON, no additional text.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Groq free model - fast and efficient
        messages: [
          {
            role: 'system',
            content: 'You are a German language tutor. Provide grammatical analysis and translations in JSON format only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response content from Groq API');
    }

    // Extract JSON from response (may be wrapped in markdown code blocks)
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const analysis = JSON.parse(jsonContent) as {
      translation: string;
      grammar: string | object;
      vocabulary: VocabularyItem[];
    };

    // Convert grammar to string if it's an object
    let grammarText = '';
    if (typeof analysis.grammar === 'string') {
      grammarText = analysis.grammar;
    } else if (typeof analysis.grammar === 'object' && analysis.grammar !== null) {
      // Format object as readable text
      const entries = Object.entries(analysis.grammar);
      grammarText = entries.map(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const formattedValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        return `${formattedKey}:\n${formattedValue}`;
      }).join('\n\n');
    }

    return {
      translation: analysis.translation || '',
      grammar: grammarText,
      vocabulary: analysis.vocabulary || [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during analysis');
  }
}

