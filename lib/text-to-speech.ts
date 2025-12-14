/**
 * Text-to-Speech utility using Web Speech API (browser built-in, free)
 * Supports German language pronunciation
 */

export function speakGerman(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set German language
  utterance.lang = 'de-DE';
  
  // Set voice properties for better German pronunciation
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a German voice
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(
    (voice) => voice.lang.startsWith('de') && voice.localService
  ) || voices.find((voice) => voice.lang.startsWith('de'));

  if (germanVoice) {
    utterance.voice = germanVoice;
  }

  // Handle voice loading (voices may not be available immediately)
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      const updatedGermanVoice = updatedVoices.find(
        (voice) => voice.lang.startsWith('de') && voice.localService
      ) || updatedVoices.find((voice) => voice.lang.startsWith('de'));
      
      if (updatedGermanVoice) {
        utterance.voice = updatedGermanVoice;
      }
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

