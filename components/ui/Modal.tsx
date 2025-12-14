'use client';

import React, { useEffect, useState } from 'react';
import type { AnalyzeResponse } from '@/types';
import { speakGerman, stopSpeech, isSpeechSupported } from '@/lib/text-to-speech';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentence: string;
  analysis: AnalyzeResponse | null;
  isLoading?: boolean;
}

// Helper function to format grammar (handles both string and object)
function formatGrammar(grammar: string | object): string {
  if (typeof grammar === 'string') {
    return grammar;
  }
  
  if (typeof grammar === 'object' && grammar !== null) {
    // Convert object to formatted string
    const entries = Object.entries(grammar);
    return entries.map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${formattedKey}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`;
    }).join('\n\n');
  }
  
  return String(grammar);
}

export default function Modal({ isOpen, onClose, sentence, analysis, isLoading = false }: ModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Stop speech when modal closes
      stopSpeech();
      setIsSpeaking(false);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      stopSpeech();
      setIsSpeaking(false);
    };
  }, [isOpen]);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      speakGerman(text);
      setIsSpeaking(true);
      
      // Reset speaking state when speech ends
      setTimeout(() => {
        setIsSpeaking(false);
      }, text.length * 100); // Approximate duration
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] my-8 flex flex-col animate-slideIn"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex-shrink-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-6 py-5 flex justify-between items-center rounded-t-2xl border-b border-white/20 z-10 shadow-lg" style={{ padding: '5px' }}>
          <h2 className="text-2xl font-bold" style={{ padding: '5px' }}>Sentence Analysis</h2>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Close"
            style={{ padding: '5px' }}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-16 md:p-20 custom-scrollbar" style={{ minHeight: 0, maxHeight: 'calc(90vh - 100px)' }}>
          <div className="mb-20" style={{ padding: '5px' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full mb-12 uppercase tracking-wider shadow-lg" style={{ padding: '5px' }}>
                  <svg className="w-3 h-3 max-w-[12px] max-h-[12px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Original Sentence
            </div>
            <div className="bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 rounded-2xl p-8 border-2 border-orange-300/50 shadow-inner relative" style={{ padding: '5px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(sentence);
                }}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${
                  isSpeaking
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-blue-500/80 hover:bg-blue-600 text-white'
                } ${!isSpeechSupported() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isSpeechSupported()}
                title={isSpeechSupported() ? (isSpeaking ? 'Stop pronunciation' : 'Listen to German pronunciation') : 'Speech not supported in this browser'}
                style={{ padding: '5px' }}
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
              <p className="text-xl text-orange-900 font-bold leading-relaxed pr-12" style={{ padding: '5px' }}>{sentence}</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12" style={{ padding: '5px' }}>
              <div className="relative" style={{ padding: '5px' }}>
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" style={{ padding: '5px' }}></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s', padding: '5px' }}></div>
              </div>
              <p className="mt-4 text-purple-700 font-semibold" style={{ padding: '5px' }}>Analyzing sentence...</p>
            </div>
          )}

          {analysis && !isLoading && (
            <div className="space-y-20 animate-fadeIn" style={{ padding: '5px' }}>
              <div style={{ padding: '5px' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full mb-12 uppercase tracking-wider shadow-lg" style={{ padding: '5px' }}>
                  <svg className="w-3 h-3 max-w-[12px] max-h-[12px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  English Translation
                </div>
                <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 rounded-2xl p-8 border-2 border-blue-300/50 shadow-inner" style={{ padding: '5px' }}>
                  <p className="text-xl text-blue-900 leading-relaxed font-semibold" style={{ padding: '5px' }}>{analysis.translation}</p>
                </div>
              </div>

              <div style={{ padding: '5px' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full mb-12 uppercase tracking-wider shadow-lg" style={{ padding: '5px' }}>
                  <svg className="w-3 h-3 max-w-[12px] max-h-[12px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Grammatical Analysis
                </div>
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-green-300/50 shadow-inner" style={{ padding: '5px' }}>
                  <div className="text-green-900 whitespace-pre-wrap leading-relaxed font-medium text-base" style={{ padding: '5px' }}>
                    {formatGrammar(analysis.grammar)}
                  </div>
                </div>
              </div>

              {analysis.vocabulary && analysis.vocabulary.length > 0 && (
                <div style={{ padding: '5px' }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xs font-bold rounded-full mb-12 uppercase tracking-wider shadow-lg" style={{ padding: '5px' }}>
                    <svg className="w-3 h-3 max-w-[12px] max-h-[12px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Vocabulary Flash Cards
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ padding: '5px' }}>
                    {analysis.vocabulary.map((item, index) => {
                      const colors = [
                        'from-blue-500 to-cyan-400',
                        'from-purple-500 to-pink-400',
                        'from-indigo-500 to-purple-400',
                        'from-rose-500 to-pink-400',
                        'from-yellow-400 to-orange-400',
                        'from-green-500 to-emerald-400',
                      ];
                      const colorClass = colors[index % colors.length];
                      return (
                        <div
                          key={index}
                          className={`bg-gradient-to-br ${colorClass} rounded-2xl p-5 border-2 border-white/30 hover:border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group`}
                          style={{ 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
                            padding: '5px'
                          }}
                        >
                          <div className="flex flex-col gap-3" style={{ padding: '5px' }}>
                            <div className="text-white/90 text-xs font-semibold uppercase tracking-wider" style={{ padding: '5px' }}>German</div>
                            <div className="text-white text-2xl font-bold leading-tight group-hover:scale-105 transition-transform duration-200" style={{ padding: '5px' }}>
                              {item.german}
                            </div>
                            <div className="h-px bg-white/30 my-1" style={{ padding: '5px' }}></div>
                            <div className="text-white/80 text-xs font-semibold uppercase tracking-wider" style={{ padding: '5px' }}>English</div>
                            <div className="text-white text-lg font-semibold leading-relaxed" style={{ padding: '5px' }}>
                              {item.english}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
}

