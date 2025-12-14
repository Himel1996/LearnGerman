'use client';

import React, { useState } from 'react';
import { speakGerman, stopSpeech, isSpeechSupported } from '@/lib/text-to-speech';

interface SentenceSegmentProps {
  sentence: string;
  index: number;
  onClick: () => void;
}

export default function SentenceSegment({ sentence, index, onClick }: SentenceSegmentProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const colors = [
    'from-blue-400 to-cyan-400',
    'from-purple-400 to-pink-400',
    'from-indigo-400 to-purple-400',
    'from-rose-400 to-pink-400',
    'from-yellow-300 to-orange-300',
  ];
  const colorClass = colors[index % colors.length];

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the sentence click
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      speakGerman(sentence);
      setIsSpeaking(true);
      
      // Reset speaking state when speech ends
      setTimeout(() => {
        setIsSpeaking(false);
      }, sentence.length * 100); // Approximate duration
    }
  };
  
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-5 mb-4 bg-gradient-to-r from-white via-white to-purple-50/40 rounded-xl border-2 border-purple-100/60 hover:border-purple-400 hover:from-purple-50 hover:via-indigo-50 hover:to-blue-50 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] group relative overflow-hidden mx-0"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10 flex items-start gap-3">
        <span className={`flex-shrink-0 w-7 h-7 mt-0.5 bg-gradient-to-br ${colorClass} text-white rounded-lg text-xs font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {index + 1}
        </span>
        <span className="text-purple-900 text-base leading-relaxed font-semibold group-hover:text-indigo-900 transition-colors duration-300 flex-1 text-left pr-2 break-words">
          {sentence}
        </span>
        <button
          onClick={handleSpeak}
          className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
            isSpeaking
              ? 'bg-blue-600 text-white animate-pulse'
              : 'bg-blue-500/80 hover:bg-blue-600 text-white opacity-70 group-hover:opacity-100'
          } ${!isSpeechSupported() ? 'opacity-30 cursor-not-allowed' : ''}`}
          disabled={!isSpeechSupported()}
          title={isSpeechSupported() ? (isSpeaking ? 'Stop pronunciation' : 'Listen to German pronunciation') : 'Speech not supported'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSpeaking ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
        </button>
        <svg className="flex-shrink-0 w-3 h-3 max-w-[12px] max-h-[12px] mt-1 text-purple-500 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

