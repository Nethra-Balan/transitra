import React, { useState } from 'react';
import { Mic, StopCircle, Volume2, X } from 'lucide-react';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export const VoiceAssistant = ({ onTranscript, isOpen, onClose }) => {
  const { transcript, isListening, error, startListening, stopListening, clearTranscript, isSupported } =
    useVoiceRecognition();
  const { speak, stop: stopSpeech } = useSpeechSynthesis();
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleStartListening = () => {
    if (!isSupported) {
      setFeedback('Voice recognition not supported on your browser');
      return;
    }
    startListening();
    setFeedback('Listening... say your destination');
  };

  const handleStopListening = () => {
    stopListening();
    if (transcript) {
      onTranscript(transcript);
      setFeedback(`Got it: "${transcript}"`);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleReadRoute = (routeInfo) => {
    const text = `Route ${routeInfo.routeNumber}. Duration ${routeInfo.totalDuration} minutes. Fare ${routeInfo.baseFare} rupees.`;
    speak(text);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl md:rounded-2xl w-full md:w-96 p-6 shadow-2xl animate-slideUp">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Voice Assistant</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg min-h-20">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isListening ? 'Listening...' : feedback || 'Press the microphone to start speaking'}
          </p>
          {transcript && (
            <p className="mt-2 text-slate-900 dark:text-white font-medium">{transcript}</p>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={!isSupported}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary text-white hover:bg-opacity-90'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <>
                <StopCircle size={20} />
                Stop Listening
              </>
            ) : (
              <>
                <Mic size={20} />
                Start Listening
              </>
            )}
          </button>

          <button
            onClick={clearTranscript}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Clear
          </button>
        </div>

        {!isSupported && (
          <p className="text-center text-sm text-amber-600 dark:text-amber-400">
            Voice recognition is not supported on your browser. Please use Chrome, Edge, or Safari.
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
