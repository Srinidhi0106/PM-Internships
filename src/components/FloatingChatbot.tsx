import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Mic, Volume2, Sparkles, RefreshCw, Globe, AlertCircle, Play, Pause, Square, Loader2 } from 'lucide-react';
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

interface HighlightRange {
  start: number;
  end: number;
}

interface SpeechChunk {
  id: number;
  start: number;
  end: number;
  speakText: string;
  toRawOffset: number[];
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;
const MAX_TTS_CHUNK_CHARS = 175;

const detectSpeechLocale = (text: string, fallbackLangCode: string): string => {
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[\u0900-\u097F]/.test(text)) return fallbackLangCode === 'mr' ? 'mr-IN' : 'hi-IN';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or-IN';
  return getSpeechLocaleByCode(fallbackLangCode);
};

const findBestVoice = (voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | null => {
  if (!voices.length) return null;
  const target = locale.toLowerCase();
  const base = target.split('-')[0];

  const exact = voices.filter(v => v.lang.toLowerCase() === target);
  if (exact.length > 0) {
    return exact.find(v => v.localService) || exact[0];
  }

  const prefix = voices.filter(v => {
    const vl = v.lang.toLowerCase();
    return vl === base || vl.startsWith(`${base}-`);
  });
  if (prefix.length > 0) {
    return prefix.find(v => v.localService) || prefix[0];
  }

  return null;
};

const sanitizeSliceWithMap = (rawText: string, sliceStart: number, sliceEnd: number) => {
  const slice = rawText.slice(sliceStart, sliceEnd);
  const chars: string[] = [];
  const toRawOffset: number[] = [];

  const pushChar = (ch: string, rawIdx: number) => {
    if (ch === ' ' && (chars.length === 0 || chars[chars.length - 1] === ' ')) {
      return;
    }
    chars.push(ch);
    toRawOffset.push(rawIdx);
  };

  let i = 0;
  while (i < slice.length) {
    // Markdown link [label](https://...)
    const remaining = slice.slice(i);
    const mdMatch = remaining.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/);
    if (mdMatch) {
      const label = mdMatch[1];
      for (let j = 0; j < label.length; j++) {
        pushChar(label[j], sliceStart + i + 1 + j);
      }
      i += mdMatch[0].length;
      continue;
    }

    // Bare https:// URL -> speak clean domain instead of raw query path
    const urlMatch = remaining.match(/^https:\/\/([^\s/<>\])]+)(\/[^\s<>()\]]*)?/);
    if (urlMatch) {
      const host = urlMatch[1];
      for (let j = 0; j < host.length; j++) {
        pushChar(host[j], sliceStart + i + 8 + j);
      }
      i += urlMatch[0].length;
      continue;
    }

    // Markdown bold markers **
    if (slice[i] === '*' && slice[i + 1] === '*') {
      i += 2;
      continue;
    }

    // Bullet markers or markdown headings at start of line
    if ((i === 0 || slice[i - 1] === '\n') && (slice[i] === '#' || slice[i] === '•' || slice[i] === '-' || slice[i] === '*')) {
      i += 1;
      continue;
    }

    const ch = slice[i];
    if (ch === '\n' || ch === '\r' || ch === '\t') {
      pushChar(' ', sliceStart + i);
    } else {
      pushChar(ch, sliceStart + i);
    }
    i += 1;
  }

  while (chars.length > 0 && chars[chars.length - 1] === ' ') {
    chars.pop();
    toRawOffset.pop();
  }

  return {
    speakText: chars.join(''),
    toRawOffset
  };
};

const splitRangeIntoChunks = (rawText: string, start: number, end: number, out: Array<{ start: number; end: number }>) => {
  let cursor = start;
  while (cursor < end) {
    while (cursor < end && /\s/.test(rawText[cursor])) cursor++;
    if (cursor >= end) break;

    if (end - cursor <= MAX_TTS_CHUNK_CHARS) {
      let trimmedEnd = end;
      while (trimmedEnd > cursor && /\s/.test(rawText[trimmedEnd - 1])) trimmedEnd--;
      if (trimmedEnd > cursor) out.push({ start: cursor, end: trimmedEnd });
      break;
    }

    let cut = cursor + MAX_TTS_CHUNK_CHARS;
    let chosen = -1;
    // Prefer natural pause punctuation near the limit
    for (let k = cut; k > cursor + 40; k--) {
      const c = rawText[k];
      if (c === ',' || c === ';' || c === ':') {
        chosen = k + 1;
        break;
      }
    }
    if (chosen === -1) {
      for (let k = cut; k > cursor + 25; k--) {
        if (/\s/.test(rawText[k])) {
          chosen = k;
          break;
        }
      }
    }
    if (chosen === -1) chosen = cut;

    let trimmedEnd = chosen;
    while (trimmedEnd > cursor && /\s/.test(rawText[trimmedEnd - 1])) trimmedEnd--;
    if (trimmedEnd > cursor) out.push({ start: cursor, end: trimmedEnd });
    cursor = chosen;
  }
};

const buildSpeechChunks = (rawText: string): SpeechChunk[] => {
  const sentences: Array<{ start: number; end: number }> = [];
  let segStart = 0;

  for (let i = 0; i < rawText.length; i++) {
    const ch = rawText[i];
    const next = rawText[i + 1] || '';

    const isLineBreak = ch === '\n';
    const isDanda = ch === '।';
    const isSentenceEnd = (ch === '!' || ch === '?') || (ch === '.' && (next === ' ' || next === '\n' || next === ''));

    // Avoid splitting inside URLs on dots
    if (ch === '.') {
      const lookbehind = rawText.slice(Math.max(0, i - 60), i);
      if (/https:\/\/\S*$/.test(lookbehind)) {
        continue;
      }
    }

    if (isLineBreak || isDanda || isSentenceEnd) {
      const segEnd = i + 1;
      splitRangeIntoChunks(rawText, segStart, segEnd, sentences);
      segStart = segEnd;
    }
  }

  if (segStart < rawText.length) {
    splitRangeIntoChunks(rawText, segStart, rawText.length, sentences);
  }

  const chunks: SpeechChunk[] = [];
  sentences.forEach((seg) => {
    const { speakText, toRawOffset } = sanitizeSliceWithMap(rawText, seg.start, seg.end);
    if (speakText && /[A-Za-z0-9\u0900-\u0D7F]/.test(speakText)) {
      chunks.push({
        id: chunks.length,
        start: seg.start,
        end: seg.end,
        speakText,
        toRawOffset
      });
    }
  });

  return chunks;
};

const renderTextWithHighlight = (
  segmentText: string,
  segmentStart: number,
  highlightRange: HighlightRange | null
): React.ReactNode => {
  if (!highlightRange) return segmentText;
  const segmentEnd = segmentStart + segmentText.length;
  if (highlightRange.end <= segmentStart || highlightRange.start >= segmentEnd) {
    return segmentText;
  }

  const localStart = Math.max(0, highlightRange.start - segmentStart);
  const localEnd = Math.min(segmentText.length, highlightRange.end - segmentStart);
  if (localStart >= localEnd) return segmentText;

  return (
    <>
      {segmentText.slice(0, localStart)}
      <mark className="bg-amber-200/95 dark:bg-amber-500/45 text-slate-950 dark:text-white rounded px-0.5 transition-colors">
        {segmentText.slice(localStart, localEnd)}
      </mark>
      {segmentText.slice(localEnd)}
    </>
  );
};

const renderFormattedText = (text: string, highlightRange: HighlightRange | null = null): React.ReactNode => {
  const tokenRegex = /(\[[^\]]+\]\(https:\/\/[^\s)]+\)|https:\/\/[^\s<>()\]]+|\*\*[^*]+\*\*)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      nodes.push(
        <React.Fragment key={`t-${keyCounter++}`}>
          {renderTextWithHighlight(plain, lastIndex, highlightRange)}
        </React.Fragment>
      );
    }

    const token = match[0];
    const tokenStart = match.index;

    const mdLinkMatch = token.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
    if (mdLinkMatch) {
      const label = mdLinkMatch[1];
      const cleanUrl = mdLinkMatch[2].replace(/[.,;:!?]+$/, '');
      nodes.push(
        <a
          key={`l-${keyCounter++}`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 break-all"
        >
          {renderTextWithHighlight(label, tokenStart + 1, highlightRange)}
        </a>
      );
    } else if (token.startsWith('https://')) {
      const cleanUrl = token.replace(/[.,;:!?]+$/, '');
      const trailing = token.slice(cleanUrl.length);
      nodes.push(
        <React.Fragment key={`u-${keyCounter++}`}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 break-all"
          >
            {renderTextWithHighlight(cleanUrl, tokenStart, highlightRange)}
          </a>
          {trailing && renderTextWithHighlight(trailing, tokenStart + cleanUrl.length, highlightRange)}
        </React.Fragment>
      );
    } else if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      const inner = token.slice(2, -2);
      nodes.push(
        <strong key={`b-${keyCounter++}`} className="font-bold">
          {renderTextWithHighlight(inner, tokenStart + 2, highlightRange)}
        </strong>
      );
    } else {
      nodes.push(
        <React.Fragment key={`r-${keyCounter++}`}>
          {renderTextWithHighlight(token, tokenStart, highlightRange)}
        </React.Fragment>
      );
    }

    lastIndex = tokenStart + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <React.Fragment key={`t-${keyCounter++}`}>
        {renderTextWithHighlight(text.slice(lastIndex), lastIndex, highlightRange)}
      </React.Fragment>
    );
  }

  return nodes;
};

export const FloatingChatbot: React.FC<FloatingChatbotProps> = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Audio playback & highlighting state
  const [activeAudioMsgId, setActiveAudioMsgId] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [highlightRange, setHighlightRange] = useState<HighlightRange | null>(null);
  const [audioError, setAudioError] = useState<{ msgId: string; text: string } | null>(null);
  const [audioProviderLabel, setAudioProviderLabel] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

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

  // Playback engine refs (session counter invalidates stale async callbacks immediately)
  const playbackSessionRef = useRef<number>(0);
  const activeAudioMsgIdRef = useRef<string | null>(null);
  const chunksRef = useRef<SpeechChunk[]>([]);
  const currentChunkIdxRef = useRef<number>(0);
  const activeRawTextRef = useRef<string>('');
  const activeLocaleRef = useRef<string>('en-IN');
  const speechRateRef = useRef<number>(1);
  const playbackModeRef = useRef<'webspeech' | 'server-tts'>('webspeech');
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pcmSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const pauseWatchdogRef = useRef<number | null>(null);

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

  // Load browser SpeechSynthesis voices (including delayed async voice population on Chrome/Android)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const syncVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        setAvailableVoices(list);
      }
    };
    syncVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', syncVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', syncVoices);
    };
  }, []);

  const cleanupAudioHardware = () => {
    if (pauseWatchdogRef.current !== null) {
      window.clearTimeout(pauseWatchdogRef.current);
      pauseWatchdogRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser-specific speechSynthesis cancel errors
      }
    }
    if (audioElRef.current) {
      try {
        audioElRef.current.onended = null;
        audioElRef.current.onerror = null;
        audioElRef.current.pause();
        audioElRef.current.removeAttribute('src');
        audioElRef.current.load();
      } catch {
        // Ignore cleanup errors
      }
    }
    if (pcmSourceRef.current) {
      try {
        pcmSourceRef.current.onended = null;
        pcmSourceRef.current.stop();
        pcmSourceRef.current.disconnect();
      } catch {
        // Ignore already-stopped source errors
      }
      pcmSourceRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      playbackSessionRef.current += 1;
      abortControllerRef.current?.abort();
      cleanupAudioHardware();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
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

  // Text-to-Speech Playback Engine (Web Speech + /api/ai/tts Fallback)
  const stopAudioPlayback = (clearError = true) => {
    playbackSessionRef.current += 1;
    cleanupAudioHardware();
    chunksRef.current = [];
    currentChunkIdxRef.current = 0;
    activeAudioMsgIdRef.current = null;
    setActiveAudioMsgId(null);
    setAudioState('idle');
    setHighlightRange(null);
    setAudioProviderLabel(null);
    if (clearError) setAudioError(null);
  };

  const playChunkViaServerTts = async (sessionId: number, chunkIdx: number, chunk: SpeechChunk, chunkLocale: string) => {
    if (sessionId !== playbackSessionRef.current) return;

    setAudioState('loading');
    setAudioProviderLabel('Cloud Voice');
    setHighlightRange({ start: chunk.start, end: chunk.end });

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: chunk.speakText,
          langCode: chunkLocale
        })
      });

      if (sessionId !== playbackSessionRef.current) return;

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!res.ok || !data?.success) {
        throw new Error('Speech playback is unavailable on this browser or device.');
      }

      if (data.audioUrl) {
        if (!audioElRef.current) {
          audioElRef.current = new Audio();
        }
        const audio = audioElRef.current;
        audio.src = data.audioUrl;
        audio.playbackRate = speechRateRef.current;
        audio.onended = () => {
          if (sessionId !== playbackSessionRef.current) return;
          playChunk(sessionId, chunkIdx + 1);
        };
        audio.onerror = () => {
          if (sessionId !== playbackSessionRef.current) return;
          setAudioError({ msgId: activeAudioMsgIdRef.current || '', text: 'Unable to play audio on this device.' });
          stopAudioPlayback(false);
        };

        setAudioState('playing');
        await audio.play();
        return;
      }

      if (data.audioData) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) {
          throw new Error('Web Audio API is not supported in this browser.');
        }
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const binary = window.atob(data.audioData);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const sampleCount = Math.floor(bytes.length / 2);
        const buffer = ctx.createBuffer(1, sampleCount, data.sampleRate || 24000);
        const channel = buffer.getChannelData(0);
        const view = new DataView(bytes.buffer);
        for (let i = 0; i < sampleCount; i++) {
          channel[i] = view.getInt16(i * 2, true) / 32768;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = speechRateRef.current;
        source.connect(ctx.destination);
        pcmSourceRef.current = source;

        source.onended = () => {
          if (sessionId !== playbackSessionRef.current) return;
          if (pcmSourceRef.current === source) pcmSourceRef.current = null;
          playChunk(sessionId, chunkIdx + 1);
        };

        setAudioState('playing');
        source.start(0);
        return;
      }

      throw new Error('Speech synthesis is unavailable on this browser.');
    } catch (err: any) {
      if (sessionId !== playbackSessionRef.current) return;
      setAudioError({
        msgId: activeAudioMsgIdRef.current || '',
        text: err?.message || 'Unable to play audio response.'
      });
      stopAudioPlayback(false);
    }
  };

  const playChunk = (sessionId: number, chunkIdx: number) => {
    if (sessionId !== playbackSessionRef.current) return;
    if (pauseWatchdogRef.current !== null) {
      window.clearTimeout(pauseWatchdogRef.current);
      pauseWatchdogRef.current = null;
    }

    const chunks = chunksRef.current;
    if (chunkIdx >= chunks.length) {
      stopAudioPlayback();
      return;
    }

    const chunk = chunks[chunkIdx];
    currentChunkIdxRef.current = chunkIdx;
    setHighlightRange({ start: chunk.start, end: chunk.end });

    const chunkLocale = detectSpeechLocale(chunk.speakText, language);
    const hasWebSpeech =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';

    const voices = hasWebSpeech
      ? (availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices())
      : [];
    const matchedVoice = hasWebSpeech ? findBestVoice(voices, chunkLocale) : null;

    // If browser has loaded voices and lacks the requested Indian regional voice, use server TTS for accurate native speech
    const missingRegionalVoice =
      hasWebSpeech &&
      voices.length > 0 &&
      !matchedVoice &&
      !chunkLocale.toLowerCase().startsWith('en');

    if (playbackModeRef.current === 'server-tts' || !hasWebSpeech || missingRegionalVoice) {
      playbackModeRef.current = 'server-tts';
      void playChunkViaServerTts(sessionId, chunkIdx, chunk, chunkLocale);
      return;
    }

    try {
      playbackModeRef.current = 'webspeech';
      setAudioProviderLabel('Voice');
      setAudioState('playing');

      const utterance = new SpeechSynthesisUtterance(chunk.speakText);
      utterance.lang = chunkLocale;
      utterance.rate = speechRateRef.current;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (sessionId !== playbackSessionRef.current) return;
        const idx = typeof event.charIndex === 'number' ? event.charIndex : -1;
        if (idx < 0 || idx >= chunk.toRawOffset.length) return;

        const rawPos = chunk.toRawOffset[idx];
        const rawText = activeRawTextRef.current;

        let wordStart = rawPos;
        while (wordStart > chunk.start && !/\s/.test(rawText[wordStart - 1])) {
          wordStart--;
        }

        let wordEnd = rawPos;
        if (typeof (event as any).charLength === 'number' && (event as any).charLength > 0) {
          const endIdx = Math.min(chunk.toRawOffset.length - 1, idx + (event as any).charLength - 1);
          wordEnd = chunk.toRawOffset[endIdx] + 1;
        }
        while (wordEnd < chunk.end && !/\s/.test(rawText[wordEnd])) {
          wordEnd++;
        }

        if (wordEnd > wordStart) {
          setHighlightRange({ start: wordStart, end: wordEnd });
        }
      };

      utterance.onend = () => {
        if (sessionId !== playbackSessionRef.current) return;
        playChunk(sessionId, chunkIdx + 1);
      };

      utterance.onerror = (ev: SpeechSynthesisErrorEvent) => {
        if (sessionId !== playbackSessionRef.current) return;
        if (ev?.error === 'interrupted' || ev?.error === 'canceled') return;

        // Fall back seamlessly to server TTS if Web Speech fails on device/browser
        playbackModeRef.current = 'server-tts';
        void playChunkViaServerTts(sessionId, chunkIdx, chunk, chunkLocale);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      playbackModeRef.current = 'server-tts';
      void playChunkViaServerTts(sessionId, chunkIdx, chunk, chunkLocale);
    }
  };

  const handlePlayMessageAudio = (msg: Message) => {
    const chunks = buildSpeechChunks(msg.text);
    if (chunks.length === 0) {
      setAudioError({ msgId: msg.id, text: 'No readable text found in this response.' });
      return;
    }

    // Always stop previous playback before starting another response
    stopAudioPlayback(true);

    const newSessionId = playbackSessionRef.current + 1;
    playbackSessionRef.current = newSessionId;

    chunksRef.current = chunks;
    currentChunkIdxRef.current = 0;
    activeRawTextRef.current = msg.text;
    activeLocaleRef.current = detectSpeechLocale(msg.text, language);
    playbackModeRef.current =
      typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined'
        ? 'webspeech'
        : 'server-tts';

    activeAudioMsgIdRef.current = msg.id;
    setActiveAudioMsgId(msg.id);
    setAudioError(null);
    playChunk(newSessionId, 0);
  };

  const handlePauseAudio = () => {
    if (audioState !== 'playing') return;
    if (pauseWatchdogRef.current !== null) {
      window.clearTimeout(pauseWatchdogRef.current);
      pauseWatchdogRef.current = null;
    }
    setAudioState('paused');

    if (playbackModeRef.current === 'server-tts') {
      if (audioElRef.current && !audioElRef.current.paused) {
        audioElRef.current.pause();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend().catch(() => {});
      }
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Mobile Safari/Android may not pause natively; resume handler recovers cleanly
      }
    }
  };

  const handleResumeAudio = () => {
    if (audioState !== 'paused' || !activeAudioMsgId) return;
    setAudioState('playing');

    if (playbackModeRef.current === 'server-tts') {
      if (audioElRef.current && audioElRef.current.src) {
        audioElRef.current.playbackRate = speechRateRef.current;
        audioElRef.current.play().catch(() => {
          const newSessionId = ++playbackSessionRef.current;
          playChunk(newSessionId, currentChunkIdxRef.current);
        });
        return;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
        return;
      }
      const newSessionId = ++playbackSessionRef.current;
      playChunk(newSessionId, currentChunkIdxRef.current);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          // Mobile browsers sometimes fail native resume(); fallback to restarting active chunk if still silent
          if (pauseWatchdogRef.current !== null) {
            window.clearTimeout(pauseWatchdogRef.current);
          }
          pauseWatchdogRef.current = window.setTimeout(() => {
            if (playbackModeRef.current === 'webspeech' && !window.speechSynthesis.speaking) {
              const newSessionId = ++playbackSessionRef.current;
              window.speechSynthesis.cancel();
              playChunk(newSessionId, currentChunkIdxRef.current);
            }
          }, 220);
          return;
        }
      } catch {
        // Fallback below
      }
      const newSessionId = ++playbackSessionRef.current;
      window.speechSynthesis.cancel();
      playChunk(newSessionId, currentChunkIdxRef.current);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setSpeechRate(newRate);
    speechRateRef.current = newRate;

    if (!activeAudioMsgId) return;

    if (playbackModeRef.current === 'server-tts') {
      if (audioElRef.current) {
        audioElRef.current.playbackRate = newRate;
      }
      if (pcmSourceRef.current) {
        pcmSourceRef.current.playbackRate.value = newRate;
      }
      return;
    }

    if (audioState === 'playing') {
      const newSessionId = ++playbackSessionRef.current;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      playChunk(newSessionId, currentChunkIdxRef.current);
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
                          {m.sender === 'bot'
                            ? renderFormattedText(m.text, activeAudioMsgId === m.id ? highlightRange : null)
                            : m.text}
                        </p>

                        {/* Listen Audio controls on every AI response */}
                        {m.sender === 'bot' && (
                          <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                            {activeAudioMsgId === m.id ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {audioState === 'loading' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Loading audio...</span>
                                  </span>
                                ) : audioState === 'playing' ? (
                                  <button
                                    type="button"
                                    onClick={handlePauseAudio}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-[10.5px] font-bold transition cursor-pointer"
                                    title="Pause audio"
                                  >
                                    <Pause className="w-3 h-3" />
                                    <span>Pause</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleResumeAudio}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 text-[10.5px] font-bold transition cursor-pointer"
                                    title="Resume audio"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>Resume</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => stopAudioPlayback(true)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/50 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-200 text-[10.5px] font-bold transition cursor-pointer"
                                  title="Stop audio"
                                >
                                  <Square className="w-3 h-3 fill-current" />
                                  <span>Stop</span>
                                </button>

                                <label className="inline-flex items-center gap-1 ml-auto text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                  <span>Speed</span>
                                  <select
                                    value={speechRate}
                                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                                    aria-label="Speech speed"
                                    className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  >
                                    {SPEED_OPTIONS.map((rate) => (
                                      <option key={rate} value={rate}>
                                        {rate}x
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                {audioProviderLabel && (
                                  <span className="text-[9.5px] font-semibold text-indigo-600 dark:text-indigo-300">
                                    • {audioProviderLabel}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePlayMessageAudio(m)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-bold transition cursor-pointer"
                                  title="Listen to complete response aloud"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>{t('listenAudio', 'Listen Audio')}</span>
                                </button>

                                <select
                                  value={speechRate}
                                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                                  aria-label="Speech speed"
                                  title="Playback speed"
                                  className="bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  {SPEED_OPTIONS.map((rate) => (
                                    <option key={rate} value={rate}>
                                      {rate}x
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {audioError && activeAudioMsgId === null && audioError.msgId === m.id && (
                              <p className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                                {audioError.text}
                              </p>
                            )}
                          </div>
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
