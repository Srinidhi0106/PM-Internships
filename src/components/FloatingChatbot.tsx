import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Mic, Volume2, Sparkles, RefreshCw, MessageSquare, Globe } from 'lucide-react';
import { pmSchemeLogo, pmModiHeadshot, indianFlagBadge } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, getSpeechLocaleByCode, LanguageCode } from '../translations';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

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

export const FloatingChatbot: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: t('chatbotGreeting', 'Namaste! I am your AI Assistant. How can I Help you?'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update bot greeting if language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{
          sender: 'bot',
          text: t('chatbotGreeting', 'Namaste! I am your AI Assistant. How can I Help you?'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return prev;
    });
  }, [language]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language, history: messages })
      });
      let replyText = '';
      if (res.ok) {
        const textData = await res.text();
        if (textData) {
          const data = JSON.parse(textData);
          replyText = data.reply;
        }
      }
      const botMsg: Message = {
        sender: 'bot',
        text: replyText || t('chatbotFallback', 'Under the PM Internship Scheme, eligible candidates receive ₹5,000 stipend/month and ₹6,000 incidental grant.'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: t('chatbotFallback', 'Under the PM Internship Scheme, eligible candidates receive ₹5,000 stipend/month and ₹6,000 incidental grant.'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
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
              onClick={() => handleSend(t('stipendQueryPrompt', 'What is the PM Internship stipend?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 transition cursor-pointer font-semibold"
            >
              💰 {t('stipendChip', 'Stipend Info')}
            </button>
            <button
              onClick={() => handleSend(t('aiRecQueryPrompt', 'How does top 20 AI recommendation work?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 transition cursor-pointer font-semibold"
            >
              ✨ {t('aiMatchChip', 'AI Match')}
            </button>
            <button
              onClick={() => handleSend(t('eligibilityQueryPrompt', 'Who is eligible for PM Internship Scheme?'))}
              className="shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 transition cursor-pointer font-semibold"
            >
              🎓 {t('eligibilityChip', 'Eligibility')}
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-100/60 dark:bg-slate-950/70">
            {messages.map((m, idx) => (
              <div
                key={idx}
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
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                    
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
                onClick={startVoiceInput}
                className={`p-2.5 rounded-full text-white transition-all cursor-pointer shadow-xs ${
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
                placeholder={`Ask in ${currentLang.nativeName} / type query...`}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
