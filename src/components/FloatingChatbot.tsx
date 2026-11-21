import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Mic, Volume2, Sparkles, RefreshCw, Globe, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, getSpeechLocaleByCode } from '../translations';
import { User } from '../types';

interface FloatingChatbotProps {
  user?: User;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isError?: boolean;
  errorCode?: string;
  failedQuery?: string;
}

const REQUEST_TIMEOUT_MS = 35000;

// Small Robot Icon Component
const SmallRobotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 26, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Antenna */}
    <path d="M18 7V3" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="3" r="2" fill="#F59E0B" />
    {/* Ears */}
    <rect x="3" y="13" width="3" height="8" rx="1.5" fill="#6366F1" />
    <rect x="30" y="13" width="3" height="8" rx="1.5" fill="#6366F1" />
    {/* Head Shell */}
    <rect x="6" y="7" width="24" height="21" rx="6" fill="#4F46E5" stroke="#312E81" strokeWidth="1.5" />
    {/* Screen / Visor */}
    <rect x="9" y="10" width="18" height="15" rx="4" fill="#0F172A" />
    {/* Glowing Robot Eyes */}
    <circle cx="14" cy="16" r="2.5" fill="#38BDF8" />
    <circle cx="14.8" cy="15.2" r="0.8" fill="#FFFFFF" />
    <circle cx="22" cy="16" r="2.5" fill="#38BDF8" />
    <circle cx="22.8" cy="15.2" r="0.8" fill="#FFFFFF" />
    {/* Robot Smile */}
    <path d="M15 21C16 22.5 20 22.5 21 21" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    {/* Neck */}
    <rect x="15" y="28" width="6" height="3" rx="1" fill="#818CF8" />
  </svg>
);

const createMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const renderFormattedText = (text: string): React.ReactNode => {
  const tokenRegex = /(\[[^\]]+\]\(https:\/\/[^\s)]+\)|https:\/\/[^\s<>()\]]+|\*\*[^*]+\*\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
    if (mdLinkMatch) {
      const label = mdLinkMatch[1];
      const cleanUrl = mdLinkMatch[2].replace(/[.,;:!?]+$/, '');
      return (
        <a
          key={index}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 break-all"
        >
          {label}
        </a>
      );
    }

    if (part.startsWith('https://')) {
      const cleanUrl = part.replace(/[.,;:!?]+$/, '');
      const trailing = part.slice(cleanUrl.length);
      return (
        <React.Fragment key={index}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 break-all"
          >
            {cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const FloatingChatbot: React.FC<FloatingChatbotProps> = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-greeting',
      sender: 'bot',
      text: t('chatbotGreeting', 'Namaste! I am your AI Assistant. How can I Help you?'),
      time: formatTime()
    }
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update bot greeting if language changes before conversation starts
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot' && !prev[0].isError) {
        return [{
          id: 'initial-greeting',
          sender: 'bot',
          text: t('chatbotGreeting', 'Namaste! I am your AI Assistant. How can I Help you?'),
          time: formatTime()
        }];
      }
      return prev;
    });
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendToGeminiBackend = async (query: string, historyForRequest: Message[]) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          language,
          history: historyForRequest
            .filter(m => !m.isError)
            .map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const rawText = await res.text();
      let data: any = null;
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        const serverCode = data?.code || `HTTP_${res.status}`;
        let errorMessage = data?.error || `Request failed with status ${res.status}.`;

        if (res.status === 503 || serverCode === 'MISSING_API_KEY') {
          errorMessage =
            data?.error ||
            'Gemini AI key is not configured on the server. Please check GEMINI_API_KEY in Settings > Secrets.';
        } else if (res.status === 401 || res.status === 403 || serverCode === 'INVALID_API_KEY') {
          errorMessage =
            data?.error ||
            'Gemini API authentication failed. Please verify GEMINI_API_KEY in Settings > Secrets.';
        } else if (res.status === 429 || serverCode === 'QUOTA_EXCEEDED') {
          errorMessage =
            data?.error ||
            'Gemini AI quota or rate limit exceeded. Please wait a moment and tap Retry.';
        } else if (res.status === 504 || serverCode === 'TIMEOUT') {
          errorMessage =
            data?.error ||
            'Gemini AI timed out while generating a response. Please tap Retry.';
        }

        const err: any = new Error(errorMessage);
        err.code = serverCode;
        throw err;
      }

      const replyText = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (!replyText) {
        const emptyErr: any = new Error('Gemini returned an empty response. Please tap Retry.');
        emptyErr.code = 'EMPTY_RESPONSE';
        throw emptyErr;
      }

      const botMsg: Message = {
        id: createMessageId(),
        sender: 'bot',
        text: replyText,
        time: formatTime()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      let friendlyMessage = 'Unable to generate an AI response right now. Please tap Retry.';
      let errorCode = err?.code || 'UNKNOWN_ERROR';

      if (timedOut || err?.name === 'AbortError') {
        errorCode = 'TIMEOUT';
        friendlyMessage = 'Request timed out after 30 seconds while waiting for Gemini AI. Please check your connection and tap Retry.';
      } else if (err instanceof TypeError || String(err?.message || '').toLowerCase().includes('failed to fetch')) {
        errorCode = 'NETWORK_ERROR';
        friendlyMessage = 'Network error reaching the InternIQ AI server. Please check your internet connection and tap Retry.';
      } else if (err?.message) {
        friendlyMessage = err.message;
      }

      const errorBotMsg: Message = {
        id: createMessageId(),
        sender: 'bot',
        text: friendlyMessage,
        time: formatTime(),
        isError: true,
        errorCode,
        failedQuery: query
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      window.clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: createMessageId(),
      sender: 'user',
      text: query,
      time: formatTime()
    };

    const historyBeforeSend = [...messages];
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) {
      setInput('');
    }
    setLoading(true);

    await sendToGeminiBackend(query, historyBeforeSend);
  };

  const handleRetry = async (failedQuery: string, errorMessageId: string) => {
    if (loading || !failedQuery.trim()) return;

    const cleanHistory = messages.filter(m => m.id !== errorMessageId && !m.isError);
    setMessages(prev => prev.filter(m => m.id !== errorMessageId));
    setLoading(true);

    await sendToGeminiBackend(failedQuery, cleanHistory);
  };

  // Web Speech API Voice Recognition
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLocaleByCode(language);
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.lang = getSpeechLocaleByCode(language);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-2.5 pr-5 rounded-full shadow-2xl border-2 border-indigo-400/90 hover:border-indigo-300 hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {/* Small Robot Avatar Badge */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-300 dark:border-indigo-500 shadow-sm flex items-center justify-center bg-indigo-950/80 p-1">
              <SmallRobotIcon size={28} />
            </div>
            {/* Pulsing online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 tracking-wide">InternIQ AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-indigo-200/90 font-medium">Chat & Voice • {currentLang.nativeName}</p>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-[94vw] sm:w-[420px] h-[585px] bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-400/70 dark:border-indigo-600/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Chatbot Header */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-indigo-900/60 relative">
            <div className="flex items-center space-x-2.5">
              {/* Small Robot Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-indigo-900/90 border border-indigo-400/70 shadow-xs flex items-center justify-center p-1">
                  <SmallRobotIcon size={26} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  InternIQ AI Assistant
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">Online</span>
                </h3>
                <p className="text-[10px] text-indigo-200/80">Smart Career & Scheme Guidance</p>
              </div>
            </div>

            {/* Language Selector & Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 bg-indigo-900/70 hover:bg-indigo-800 text-amber-300 px-2.5 py-1 rounded-lg text-[10.5px] font-bold border border-indigo-700/80 transition cursor-pointer"
                  title="Change chat language"
                >
                  <Globe className="w-3 h-3 text-amber-300" />
                  <span>{currentLang.code}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-1 w-48 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 divide-y divide-slate-800">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between cursor-pointer ${
                          language === l.code ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <span>{l.flag} {l.nativeName}</span>
                        <span className="text-[9px] opacity-70">({l.code})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Vision Banner inside Chatbot */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/40 px-3.5 py-1.5 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-semibold">
              <span className="text-amber-500">✨</span>
              <span>InternIQ Career Intelligence • 22 Languages</span>
            </div>
            <span className="text-[9.5px] font-bold bg-indigo-600 text-white px-2 py-0.2 rounded-full">AI 2.0</span>
          </div>

          {/* Prompt Chips */}
          <div className="bg-white/80 dark:bg-slate-900 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              disabled={loading}
              onClick={() => handleSend(t('stipendQueryPrompt', 'What is the PM Internship stipend?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer font-semibold"
            >
              💰 {t('stipendChip', 'Stipend Info')}
            </button>
            <button
              disabled={loading}
              onClick={() => handleSend(t('aiRecQueryPrompt', 'How does top 20 AI recommendation work?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer font-semibold"
            >
              ✨ {t('aiMatchChip', 'AI Match')}
            </button>
            <button
              disabled={loading}
              onClick={() => handleSend(t('eligibilityQueryPrompt', 'Who is eligible for PM Internship Scheme?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer font-semibold"
            >
              🎓 {t('eligibilityChip', 'Eligibility')}
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-100/60 dark:bg-slate-950/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Small Robot Icon next to Bot Message */}
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-900 border border-indigo-400/50 shrink-0 flex items-center justify-center p-0.5 mt-0.5 shadow-2xs">
                    <SmallRobotIcon size={18} />
                  </div>
                )}

                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-tr-none'
                        : m.isError
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 rounded-tl-none border border-rose-300 dark:border-rose-700'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    {m.isError ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-1.5 font-semibold text-rose-700 dark:text-rose-300">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                        </div>
                        {m.failedQuery && (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleRetry(m.failedQuery!, m.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-[11px] transition cursor-pointer shadow-2xs"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-line leading-relaxed">
                          {m.sender === 'bot' ? renderFormattedText(m.text) : m.text}
                        </p>

                        {/* TTS button on bot message */}
                        {m.sender === 'bot' && (
                          <button
                            onClick={() => speakText(m.text)}
                            className="mt-1.5 flex items-center gap-1 text-[10.5px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                            title="Read aloud in native language"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t('listenAudio', 'Listen audio')}</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <span className={`text-[9.5px] text-slate-400 mt-1 px-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 px-3.5 py-2.5 rounded-2xl w-32 shadow-xs">
                <SmallRobotIcon size={18} className="animate-bounce" />
                <span className="text-xs font-bold">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chatbot Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                disabled={loading}
                onClick={startVoiceInput}
                className={`p-2.5 rounded-full text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-600 animate-pulse ring-4 ring-rose-300'
                    : 'bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700'
                }`}
                title={`Speak in ${currentLang.nativeName}`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder={`Ask in ${currentLang.nativeName} / type query...`}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
