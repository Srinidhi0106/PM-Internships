import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQuery?: (query: string) => void;
  onSearchNavigate?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSearchQuery,
  onSearchNavigate
}) => {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Map app language code to Web Speech API locale
  const getSpeechLocale = (langCode: string): string => {
    switch (langCode) {
      case 'HI': return 'hi-IN';
      case 'TE': return 'te-IN';
      case 'TA': return 'ta-IN';
      case 'KN': return 'kn-IN';
      case 'MR': return 'mr-IN';
      case 'BN': return 'bn-IN';
      case 'GU': return 'gu-IN';
      default: return 'en-IN';
    }
  };

  const [selectedLang, setSelectedLang] = useState<string>(getSpeechLocale(language));

  useEffect(() => {
    setSelectedLang(getSpeechLocale(language));
  }, [language]);

  if (!isOpen) return null;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = true;

    setIsListening(true);
    setTranscript('Listening...');

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const applySearch = () => {
    if (transcript && transcript !== 'Listening...') {
      if (onSearchQuery) onSearchQuery(transcript);
      if (onSearchNavigate) onSearchNavigate();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Voice Search Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Speak Your Internship Search</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search by skill (Python, React), location (Bengaluru, Delhi), domain (AI, Green Energy) or stipend.
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-1 text-center">
          <span className="text-slate-500 font-medium text-xs">Select Speech Language / भाषा चुनें:</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {[
              { code: 'en-IN', label: 'English' },
              { code: 'hi-IN', label: 'हिंदी' },
              { code: 'te-IN', label: 'తెలుగు' },
              { code: 'ta-IN', label: 'தமிழ்' },
              { code: 'kn-IN', label: 'ಕನ್ನಡ' },
              { code: 'mr-IN', label: 'मराठी' },
              { code: 'bn-IN', label: 'বাংলা' },
              { code: 'gu-IN', label: 'ગુજરાતી' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setSelectedLang(item.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  selectedLang === item.code
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Microphone Pulse Circle */}
        <div className="flex flex-col items-center justify-center py-4">
          <button
            onClick={startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-300 dark:ring-rose-900 animate-pulse'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-3">
            {isListening ? 'Listening now... Speak clearly' : 'Tap mic to start speaking'}
          </p>
        </div>

        {/* Live Transcript Display */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[80px] flex items-center justify-center text-center">
          {transcript ? (
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{transcript}</p>
          ) : (
            <p className="text-xs text-slate-400 italic">"Find machine learning internships in Bengaluru with 20k stipend"</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={applySearch}
            disabled={!transcript || transcript === 'Listening...'}
            className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Search Roles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
