'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SentenceSegment from '@/components/SentenceSegment';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NavMenu from '@/components/NavMenu';
import { segmentSentences } from '@/lib/text-segmentation';
import type { AnalyzeResponse } from '@/types';

// LRU Cache implementation for analysis results
class LRUCache {
  private cache: Map<string, AnalyzeResponse>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): AnalyzeResponse | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: AnalyzeResponse): void {
    if (this.cache.has(key)) {
      // Update existing entry and move to end
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first entry)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    // Add/update at end (most recently used)
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

function AnalyzePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState('');
  const [sentences, setSentences] = useState<string[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'openai' | 'groq'>('groq');
  
  // LRU Cache with max 100 entries - persists across re-renders
  const analysisCache = useRef<LRUCache>(new LRUCache(100));

  // Check for pre-filled text from URL params
  useEffect(() => {
    const textParam = searchParams.get('text');
    if (textParam) {
      const decodedText = decodeURIComponent(textParam);
      setInputText(decodedText);
      // Auto-analyze if text is provided via URL
      const segmented = segmentSentences(decodedText);
      setSentences(segmented);
      setError(null);
    }
  }, [searchParams]);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setError('Please enter some German text to analyze');
      return;
    }

    setError(null);
    // Clear cache when new analysis is done
    analysisCache.current.clear();
    const segmented = segmentSentences(inputText);
    setSentences(segmented);

    if (segmented.length === 0) {
      setError('No sentences found. Please check your input.');
    }
  };

  const handleSentenceClick = async (sentence: string) => {
    setSelectedSentence(sentence);
    setIsModalOpen(true);
    setAnalysis(null);
    setIsAnalyzing(true);
    setError(null);

    // Create cache key: sentence text + model
    const cacheKey = `${sentence.trim()}_${selectedModel}`;

    // Check if analysis is already cached (LRU will move to most recently used)
    const cachedAnalysis = analysisCache.current.get(cacheKey);
    
    if (cachedAnalysis) {
      // Use cached result - no API call needed
      // Small delay to maintain same opening animation behavior
      setTimeout(() => {
        setAnalysis(cachedAnalysis);
        setIsAnalyzing(false);
      }, 100);
      return;
    }

    // No cache found - make API call
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence: sentence,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Store result in LRU cache (will evict oldest if at capacity)
      analysisCache.current.set(cacheKey, data);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSentence(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <main className="min-h-screen py-16 overflow-hidden" style={{ padding: '2%'}}>
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
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-2">
            Analyse German Text
          </h1>
          <p className="text-blue-700 font-semibold text-lg">Get detailed grammar and vocabulary analysis</p>
        </div>

        <div className="space-y-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <Card className="bg-gradient-to-br from-blue-50/50 via-sky-50/50 to-cyan-50/50 border-blue-200" style={{ padding: '2%'}}>
            <label htmlFor="input-text" className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-3 h-3 max-w-[12px] max-h-[12px] text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Enter German text to analyze
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder="Type your German text here..."
              className="w-full min-h-[250px] p-5 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-y text-base transition-all duration-200 bg-white/80 shadow-inner font-medium"
              disabled={isAnalyzing}
              style={{ padding: '2%'}}
            />
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Model Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Model:</span>
                <div className="relative inline-flex items-center bg-blue-100 rounded-full p-1.5 border-2 border-blue-200">
                  <button
                    onClick={() => setSelectedModel('groq')}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedModel === 'groq'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                        : 'text-blue-700 hover:text-blue-900'
                    }`}
                    disabled={isAnalyzing}
                    style={{ padding: '5px'}}
                  >
                    Free (Groq)
                  </button>
                  {/* DEMO MODE: OpenAI disabled for public usage */}
                  {/* TODO: Uncomment when adding payment/database integration */}
                  <button
                    onClick={() => {
                      setError('This feature is not available in demo usage.');
                      // setSelectedModel('openai'); // Commented out for demo
                    }}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 opacity-60 cursor-not-allowed text-gray-500 bg-gray-200 relative group"
                    disabled={true}
                    title="This feature is not available in demo usage."
                    style={{ padding: '5px'}}
                  >
                    Premium (OpenAI)
                    <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">Demo</span>
                  </button>
                  {/* Original OpenAI button (commented for demo) */}
                  {/* <button
                    onClick={() => setSelectedModel('openai')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedModel === 'openai'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'text-blue-700 hover:text-blue-900'
                    }`}
                    disabled={isAnalyzing}
                  >
                    Premium (OpenAI)
                  </button> */}
                </div>
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputText.trim()} variant="gradient" className="min-w-[180px]">
                Start Analysis →
              </Button>
            </div>
          </Card>

          {error && !isModalOpen && (
            <Card className="border-2 border-red-300 bg-gradient-to-r from-red-50 to-rose-50 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-semibold text-sm flex-1">{error}</p>
              </div>
            </Card>
          )}

          {sentences.length > 0 && (
            <Card className="animate-fadeIn border-2 border-blue-300 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 shadow-2xl" style={{ padding: '5px'}}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2" style={{ padding: '5px'}}>
                    Sentences
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full text-sm font-bold whitespace-nowrap shadow-md" style={{ padding: '5px'}}>
                    <svg className="w-2.5 h-2.5 max-w-[10px] max-h-[10px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{sentences.length} {sentences.length === 1 ? 'sentence' : 'sentences'}</span>
                  </div>
                </div>
              </div>
              <p className="text-blue-700 mb-8 text-sm font-medium flex items-start gap-2" style={{ padding: '5px'}}>
                <svg className="w-3 h-3 max-w-[12px] max-h-[12px] text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">Click on any sentence to view its detailed grammatical analysis</span>
              </p>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" style={{ padding: '5px'}}>
                {sentences.map((sentence, index) => (
                  <SentenceSegment
                    key={index}
                    sentence={sentence}
                    index={index}
                    onClick={() => handleSentenceClick(sentence)}
                  />
                ))}
              </div>
            </Card>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            sentence={selectedSentence || ''}
            analysis={analysis}
            isLoading={isAnalyzing}
          />

          {error && isModalOpen && (
            <div className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 rounded-xl shadow-2xl max-w-md z-[60] animate-fadeIn border-2 border-white/20">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 max-w-[16px] max-h-[16px] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-sm flex-1">{error}</p>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.5);
          }
        `}</style>
      </div>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen py-16 overflow-hidden flex items-center justify-center">
        <NavMenu />
        <LoadingSpinner size="lg" />
      </main>
    }>
      <AnalyzePageContent />
    </Suspense>
  );
}

