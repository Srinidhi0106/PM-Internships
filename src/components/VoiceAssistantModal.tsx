import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, Search, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, getSpeechLocaleByCode, LanguageCode } from '../translations';

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
  const { t, language, setLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showAllLangs, setShowAllLangs] = useState(false);

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [selectedLang, setSelectedLang] = useState<string>(getSpeechLocaleByCode(language));

  useEffect(() => {
    setSelectedLang(getSpeechLocaleByCode(language));
  }, [language]);

  if (!isOpen) return null;

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    setSelectedLang(getSpeechLocaleByCode(code));
    setShowAllLangs(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your search.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = true;

    setIsListening(true);
    setTranscript('Listening... Speak now in ' + currentLangInfo.name);

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
    if (transcript && transcript !== 'Listening...' && !transcript.startsWith('Listening...')) {
      if (onSearchQuery) onSearchQuery(transcript);
      if (onSearchNavigate) onSearchNavigate();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>AI Multilingual Voice Assistant</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Speak in Any Indian Language</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Search roles, skills, stipends, and locations across India in your preferred regional language.
          </p>
        </div>

        {/* Selected Language Indicator & Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>Speech Language ({SUPPORTED_LANGUAGES.length} Indian Languages)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAllLangs(!showAllLangs)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{showAllLangs ? 'Show top' : 'View all 23'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllLangs ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quick Select Chips */}
          {!showAllLangs ? (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {SUPPORTED_LANGUAGES.slice(0, 8).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                    language === item.code
                      ? 'bg-amber-500 text-slate-950 shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.nativeName}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition text-left flex items-center justify-between ${
                    language === item.code
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="truncate">{item.flag} {item.nativeName}</span>
                  {language === item.code && <Check className="w-3 h-3 text-slate-950 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Microphone Pulse Circle */}
        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-300 dark:ring-rose-950 animate-pulse scale-110'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:scale-105'
            }`}
            title="Tap to speak"
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8 stroke-[2.5]" />}
          </button>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
            {isListening ? `Listening in ${currentLangInfo.nativeName} (${currentLangInfo.name})...` : `Tap mic & speak in ${currentLangInfo.nativeName}`}
          </p>
        </div>

        {/* Live Transcript Display */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[70px] flex items-center justify-center text-center">
          {transcript ? (
            <p className="text-sm font-bold text-slate-900 dark:text-white">{transcript}</p>
          ) : (
            <p className="text-xs text-slate-400 italic">
              "Find AI internships in Bengaluru" / "బెంగళూరులో సాఫ్ట్‌వేర్ ఇంటర్న్‌షిప్‌లు" / "दिल्ली में डेटा साइंस इंटर्नशिप"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={applySearch}
            disabled={!transcript || transcript.startsWith('Listening...')}
            className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search Roles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
