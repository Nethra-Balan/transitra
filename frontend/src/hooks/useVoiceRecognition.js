/**
 * Voice Recognition Hook using Web Speech API
 * Handles speech-to-text conversion for voice commands
 */

import { useState, useRef, useEffect } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition not supported on this browser');
      return;
    }

    const recognition = new SpeechRecognition();

    // Configuration
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptSegment + ' ');
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      // Update UI with interim results
      if (interimTranscript) {
        setTranscript((prev) => {
          const arr = prev.split('|');
          arr[1] = interimTranscript;
          return arr.join('|');
        });
      }
    };

    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return {
    transcript: transcript.split('|')[0],
    isListening,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported: !!recognitionRef.current,
  };
};

export default useVoiceRecognition;
