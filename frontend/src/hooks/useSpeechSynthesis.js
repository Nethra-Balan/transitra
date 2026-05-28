/**
 * Text-to-Speech Hook
 * Handles speech synthesis for reading route information
 */

import { useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const speak = useCallback((text, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const isSpeaking = () => {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  };

  return { speak, stop, isSpeaking };
};
