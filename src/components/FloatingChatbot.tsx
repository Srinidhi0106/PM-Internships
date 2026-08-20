import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Mic, Volume2, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { pmSchemeLogo, pmModiHeadshot, indianFlagBadge } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const FloatingChatbot: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: t('chatbotGreeting', 'Namaste! I am your PM Internship AI Assistant. Ask me anything about eligibility, stipend, or interview prep!'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update bot greeting if language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{
          sender: 'bot',
          text: t('chatbotGreeting', 'Namaste! I am your PM Internship AI Assistant. Ask me anything about eligibility, stipend, or interview prep!'),
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

  // Map app language code to speech locale
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
    recognition.lang = getSpeechLocale(language);
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
      utterance.lang = getSpeechLocale(language);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-slate-950 text-white p-2 pr-5 rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {/* Circular PM Emblem */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shadow-sm flex items-center justify-center bg-slate-900">
              <img
                src={pmSchemeLogo}
                alt="PM Scheme AI Career Assistant"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-amber-400 tracking-wide">AI Career Assistant</span>
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-[10px] text-amber-200/90 font-medium">Tap to chat / voice search</p>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400/80 dark:border-amber-500/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Chatbot Header */}
          <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 relative">
            <div className="flex items-center space-x-3">
              {/* Dual Emblem + Chatbot Avatar */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full overflow-hidden shadow-xs flex items-center justify-center">
                  <img
                    src={pmSchemeLogo}
                    alt="PM Scheme Official Emblem AI Assistant Logo Icon"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-amber-300 border border-amber-400 flex items-center justify-center shadow-xs">
                  <Bot className="w-2.5 h-2.5" />
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  PM Scheme AI Assistant
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">Online</span>
                </h3>
                <p className="text-[10px] text-slate-400">Govt of India • MCA PM Internship Portal</p>
              </div>
            </div>

            {/* Indian Flag Badge directly beside X symbol */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0 shadow-xs flex items-center justify-center p-0.5" title="National Flag of India">
                <img
                  src={indianFlagBadge}
                  alt="National Flag of India"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prime Minister's Vision Banner inside Chatbot */}
          <div className="bg-amber-500/10 dark:bg-amber-950/40 px-3 py-1.5 border-b border-amber-300/30 dark:border-amber-800/40 flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
              <span className="text-amber-500">🇮🇳</span>
              <span>PM Modi's Vision: 1 Crore Youth Empowered</span>
            </div>
            <span className="text-[9.5px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full">PMIS 2026</span>
          </div>

          {/* Prompt Chips */}
          <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend(t('stipendQueryPrompt', 'What is the PM Internship stipend?'))}
              className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition cursor-pointer"
            >
              💰 {t('stipendChip', 'Stipend Info')}
            </button>
            <button
              onClick={() => handleSend(t('aiRecQueryPrompt', 'How does top 20 AI recommendation work?'))}
              className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition cursor-pointer"
            >
              🤖 {t('aiRecChip', 'AI Recommendation')}
            </button>
            <button
              onClick={() => handleSend(t('mockIntQueryPrompt', 'How to practice mock interview with AI?'))}
              className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition cursor-pointer"
            >
              🎯 {t('mockIntChip', 'Mock Interview')}
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-100/50 dark:bg-slate-900/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[9px] text-slate-400">{msg.time}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-slate-400 hover:text-indigo-500 p-0.5"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI Assistant thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <button
              onClick={startVoiceInput}
              className={`p-2 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening...' : 'Type your query...'}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
