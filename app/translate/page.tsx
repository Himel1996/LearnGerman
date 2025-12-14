'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NavMenu from '@/components/NavMenu';
import { speakGerman, stopSpeech, isSpeechSupported } from '@/lib/text-to-speech';

export default function TranslatePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when component unmounts or translation changes
  useEffect(() => {
    return () => {
      stopSpeech();
      setIsSpeaking(false);
    };
  }, [translation]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslation('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          targetLang: 'de',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      setTranslation(data.translation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during translation');
      setTranslation('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-16 py-16 overflow-hidden">
      <NavMenu />
      <div className="max-w-6xl mx-auto px-2 w-full" style={{ padding: '2%', margin: 'auto'}}>
        <div className="mb-10 animate-fadeIn">
          <button
            onClick={() => router.push('/')}
            className="text-blue-900 hover:text-blue-950 hover:bg-blue-100 font-semibold flex items-center gap-1.5 mb-8 group transition-all duration-200 text-sm md:text-base whitespace-nowrap px-3 py-2 rounded-lg bg-blue-50/80 border border-blue-200" 
            style={{ padding: '5px'}}
          >
            <svg
              className="w-3 h-3 max-w-[12px] max-h-[12px] transform group-hover:-translate-x-1 transition-transform flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2" style={{ padding: '2%', margin: 'auto'}}>
            Translate to German
          </h1>
          <p className="text-blue-700 font-semibold text-lg" style={{ padding: '2%'}}>Convert your English text into perfect German</p>
        </div>

        <div className="space-y-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <Card className="bg-gradient-to-br from-blue-50/50 via-sky-50/50 to-cyan-50/50 border-blue-200" style={{ padding: '2%', margin: 'auto'}}>
            <label htmlFor="input-text" className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-3 h-3 max-w-[12px] max-h-[12px] text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Enter English text to translate
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder="Type your English text here..."
              className="w-full min-h-[250px] p-5 border-2 border-blue-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none resize-y text-base transition-all duration-200 bg-white/80 shadow-inner font-medium"
              disabled={isLoading}
              style={{ padding: '2%'}}
            />
            <div className="mt-8 flex justify-end">
              <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="min-w-[140px]">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Translating...
                  </span>
                ) : (
                  'Translate →'
                )}
              </Button>
            </div>
          </Card>

          {error && (
            <Card className="border-2 border-red-300 bg-gradient-to-r from-red-50 to-rose-50 animate-fadeIn">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 max-w-[16px] max-h-[16px] text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </Card>
          )}

          {translation && (
            <Card className="animate-fadeIn border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
                <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">Translation</h2>
              </div>
              <div className="mb-4 flex justify-end">
                <Button
                  onClick={() => {
                    const analyzeUrl = `/analyze?text=${encodeURIComponent(translation)}`;
                    window.open(analyzeUrl, '_blank');
                  }}
                  variant="gradient"
                  className="min-w-[160px]"
                >
                  Analyse Text →
                </Button>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-xl border-2 border-blue-200/50 shadow-inner relative" style={{ padding: '5px'}}>
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeech();
                      setIsSpeaking(false);
                    } else {
                      speakGerman(translation);
                      setIsSpeaking(true);
                      
                      // Reset speaking state when speech ends
                      setTimeout(() => {
                        setIsSpeaking(false);
                      }, translation.length * 100); // Approximate duration
                    }
                  }}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${
                    isSpeaking
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-500/80 hover:bg-blue-600 text-white'
                  } ${!isSpeechSupported() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isSpeechSupported()}
                  title={isSpeechSupported() ? (isSpeaking ? 'Stop pronunciation' : 'Listen to German pronunciation') : 'Speech not supported in this browser'}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isSpeaking ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    )}
                  </svg>
                </button>
                <p className="text-xl text-gray-900 whitespace-pre-wrap leading-relaxed font-semibold pr-12">
                  {translation}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

