import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, ChevronRight, Crown, Languages, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../translations';

interface CreativeIntroExperienceProps {
  onComplete: () => void;
}

export const INTRO_VOICE_SCRIPTS: Record<LanguageCode, {
  greeting: string;
  speechLang: string;
  langKeywords: string[];
  nativeLabel: string;
  englishLabel: string;
  flag: string;
}> = {
  EN: {
    greeting: "Welcome to Prime Minister's Internship Scheme.",
    speechLang: 'en-IN',
    langKeywords: ['en-in', 'en_in', 'india', 'indian', 'en-gb', 'en-us', 'english'],
    nativeLabel: 'English',
    englishLabel: 'English',
    flag: '🇮🇳'
  },
  HI: {
    greeting: "प्रधानमंत्री इंटर्नशिप योजना में आपका स्वागत है।",
    speechLang: 'hi-IN',
    langKeywords: ['hi-in', 'hi_in', 'hi', 'hindi', 'kalpana', 'swara', 'madhur', 'lekh', 'hemant'],
    nativeLabel: 'हिन्दी',
    englishLabel: 'Hindi',
    flag: '🇮🇳'
  },
  TE: {
    greeting: "ప్రధానమంత్రి ఇంటర్న్‌షిప్ పథకానికి స్వాగతం.",
    speechLang: 'te-IN',
    langKeywords: ['te-in', 'te_in', 'te', 'telugu', 'geeta', 'mohan', 'chitra', 'shruti'],
    nativeLabel: 'తెలుగు',
    englishLabel: 'Telugu',
    flag: '🇮🇳'
  },
  TA: {
    greeting: "பிரதம மந்திரி இன்டர்ன்ஷிப் திட்டத்திற்கு உங்களை வரவேற்கிறோம்.",
    speechLang: 'ta-IN',
    langKeywords: ['ta-in', 'ta_in', 'ta', 'tamil', 'valluvar', 'vani', 'latha', 'kumar'],
    nativeLabel: 'தமிழ்',
    englishLabel: 'Tamil',
    flag: '🇮🇳'
  },
  KN: {
    greeting: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಇಂಟರ್ನ್‌ಶಿಪ್ ಯೋಜನೆಗೆ ಸುಸ್ವಾಗತ.",
    speechLang: 'kn-IN',
    langKeywords: ['kn-in', 'kn_in', 'kn', 'kannada', 'sapna', 'gagan', 'kavya'],
    nativeLabel: 'ಕನ್ನಡ',
    englishLabel: 'Kannada',
    flag: '🇮🇳'
  },
  MR: {
    greeting: "प्रधानमंत्री इंटर्नशिप योजनेमध्ये आपले स्वागत आहे.",
    speechLang: 'mr-IN',
    langKeywords: ['mr-in', 'mr_in', 'mr', 'marathi', 'ananya', 'aarohi', 'manohar'],
    nativeLabel: 'मराठी',
    englishLabel: 'Marathi',
    flag: '🇮🇳'
  },
  BN: {
    greeting: "প্রধানমন্ত্রী ইন্টার্নশিপ যোজনায় আপনাকে স্বাগতম।",
    speechLang: 'bn-IN',
    langKeywords: ['bn-in', 'bn_in', 'bn', 'bengali', 'bangla', 'tanisha', 'bashkar'],
    nativeLabel: 'বাংলা',
    englishLabel: 'Bengali',
    flag: '🇮🇳'
  },
  GU: {
    greeting: "પ્રધાનમંત્રી ઇન્ટર્નશિપ યોજનામાં આપનું સ્વાગત છે.",
    speechLang: 'gu-IN',
    langKeywords: ['gu-in', 'gu_in', 'gu', 'gujarati', 'dhwani', 'nirav'],
    nativeLabel: 'ગુજરાતી',
    englishLabel: 'Gujarati',
    flag: '🇮🇳'
  }
};

export function CreativeIntroExperience({ onComplete }: CreativeIntroExperienceProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState<number>(0); // 0: Curtains closed, 1: Chakra ignite, 2: Royal Title, 3: Full Glory
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0); // 0 to 100%
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || 'EN');

  const soundEnabledRef = useRef(true);
  const isSpeakingRef = useRef(false);
  const speechExecutedRef = useRef(false);
  const speechCompletedRef = useRef(false);
  const isExitingRef = useRef(false);
  const selectedLangRef = useRef<LanguageCode>(language || 'EN');
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Web Audio Context reference for harmonic tanpura / temple bell chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voicesListRef = useRef<SpeechSynthesisVoice[]>([]);
  const activeAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playbackSessionIdRef = useRef<number>(0);
  const lastUserTriggerTimeRef = useRef<number>(0);

  // Keep ref synchronized
  useEffect(() => {
    selectedLangRef.current = selectedLang;
  }, [selectedLang]);

  // Stop and cancel all running speech, audio, and interval timers
  const stopAllVoiceAndAudio = useCallback(() => {
    playbackSessionIdRef.current += 1;
    if (watchdogRef.current) {
      clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (activeAudioPlayerRef.current) {
      try {
        activeAudioPlayerRef.current.pause();
        activeAudioPlayerRef.current.src = '';
        activeAudioPlayerRef.current = null;
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, []);

  // Cleanup active audio elements on unmount
  useEffect(() => {
    return () => {
      stopAllVoiceAndAudio();
    };
  }, [stopAllVoiceAndAudio]);

  // Detect mobile viewport on mount & pre-load voices for Vercel/Production
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            voicesListRef.current = v;
          }
        } catch {}
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [soundEnabled]);

  // Safe Web Audio Context initializer
  const getOrCreateAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Serene Indian Classical Tanpura & Temple Chime chord (Sa, Ga, Pa, High Sa)
  const playHarmonicChime = useCallback((freq = 440, length = 2.4, force = false) => {
    if (!soundEnabledRef.current && !force) return;
    try {
      const ctx = getOrCreateAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const frequencies = [freq, freq * 1.25, freq * 1.5, freq * 2, freq * 2.5]; // Sa, Ga, Pa, High Sa, Re
      frequencies.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : idx === 2 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const volume = idx === 0 ? 0.22 : 0.08 / (idx + 0.5);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.09);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + length);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + length);
      });
    } catch {
      // Audio fallback
    }
  }, [getOrCreateAudioContext]);

  // Part the majestic velvet curtains and unveil Home Screen promptly after speech finishes
  const triggerCurtainUnveil = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);

    stopAllVoiceAndAudio();
    playHarmonicChime(554, 1.2);
    
    // Smooth, graceful curtain parting animation (0.75s) to reveal home page immediately
    setTimeout(() => {
      onComplete();
    }, 750);
  }, [onComplete, playHarmonicChime, stopAllVoiceAndAudio]);

  // Select the highest-quality natural voice for the requested language
  const selectBestVoiceForLang = useCallback((langCode: LanguageCode, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    const list = voices && voices.length > 0 ? voices : voicesListRef.current;
    if (!list || list.length === 0) return null;

    const target = INTRO_VOICE_SCRIPTS[langCode] || INTRO_VOICE_SCRIPTS.EN;
    const langPrefix = target.speechLang.slice(0, 2).toLowerCase(); // 'en', 'hi', 'te', 'ta', 'kn', 'mr', 'bn', 'gu'

    // 1. Exact match (e.g., 'te-IN', 'hi-IN', 'ta-IN')
    const exact = list.find(v => v.lang.toLowerCase().replace('_', '-') === target.speechLang.toLowerCase());
    if (exact) return exact;

    // 2. Language code prefix match (e.g. starts with 'te', 'ta', 'hi', 'kn')
    const prefixMatch = list.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    // 3. Keyword in name or lang
    for (const kw of target.langKeywords) {
      const found = list.find(v => 
        v.name.toLowerCase().includes(kw) || v.lang.toLowerCase().includes(kw)
      );
      if (found) return found;
    }

    // 4. Indian English natural voice fallback
    const indianVoice = list.find(v => 
      (v.lang === 'en-IN' || v.lang.includes('en_IN') || v.name.toLowerCase().includes('india')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
    ) || list.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'));
    
    if (indianVoice) return indianVoice;

    // 5. Any English / default voice
    const naturalVoice = list.find(v => 
      v.lang.startsWith('en') && 
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('siri') || v.name.toLowerCase().includes('female'))
    );
    if (naturalVoice) return naturalVoice;

    return list[0] || null;
  }, []);

  // Multi-tier Fallback Audio Stream Player for Vercel / Safari / Android
  const playAudioStreamFallback = useCallback((text: string, langCode: LanguageCode, onFinished: () => void) => {
    const ttsLangMap: Record<LanguageCode, string> = {
      EN: 'en-IN',
      HI: 'hi',
      TE: 'te',
      TA: 'ta',
      KN: 'kn',
      MR: 'mr',
      BN: 'bn',
      GU: 'gu'
    };
    const ttsLang = ttsLangMap[langCode] || 'en-IN';
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    try {
      if (activeAudioPlayerRef.current) {
        try {
          activeAudioPlayerRef.current.pause();
          activeAudioPlayerRef.current.src = '';
        } catch {}
      }

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = audioUrl;
      activeAudioPlayerRef.current = audio;

      let handled = false;
      const finish = () => {
        if (handled) return;
        handled = true;
        onFinished();
      };

      audio.onended = () => finish();
      audio.onerror = () => {
        // Fallback completion after typical sentence duration
        setTimeout(finish, 3600);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsSpeaking(true);
            isSpeakingRef.current = true;
            setAutoplayBlocked(false);
          })
          .catch(() => {
            // Autoplay blocked by browser policy
            setAutoplayBlocked(true);
          });
      }
    } catch {
      setTimeout(onFinished, 3600);
    }
  }, []);

  // Strict Single-Voice Player (Guarantees NO doubling, keeps curtains closed until telling finishes, and supports Vercel)
  const speakWelcomeNarration = useCallback((force = false, isUserGesture = false, overrideLang?: LanguageCode) => {
    if (!soundEnabledRef.current && !force) return;
    if (isExitingRef.current) return;

    const targetLang = overrideLang || selectedLangRef.current || 'EN';
    const script = INTRO_VOICE_SCRIPTS[targetLang] || INTRO_VOICE_SCRIPTS.EN;

    // Invalidate previous session and silence any lingering speech/audio
    stopAllVoiceAndAudio();
    const currentSessionId = playbackSessionIdRef.current;

    speechExecutedRef.current = true;

    // Start progress timer to keep user visually engaged while voice speaks
    const startMs = Date.now();
    const estimatedDurationMs = targetLang === 'EN' ? 3800 : 3600;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      if (playbackSessionIdRef.current !== currentSessionId) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        return;
      }
      const elapsed = Date.now() - startMs;
      const p = Math.min(96, Math.round((elapsed / estimatedDurationMs) * 100));
      setSpeechProgress(p);
    }, 100);

    const onSpeechComplete = () => {
      if (playbackSessionIdRef.current !== currentSessionId) return;
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      speechCompletedRef.current = true;
      setSpeechProgress(100);
      (window as any).__pmschemeVoiceUtterance = null;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      // Keep curtains closed until voice narration finishes, then smoothly part curtains and open home page
      setTimeout(() => {
        if (playbackSessionIdRef.current === currentSessionId && !isExitingRef.current) {
          triggerCurtainUnveil();
        }
      }, 450);
    };

    // Check Web Speech API availability
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      playAudioStreamFallback(script.greeting, targetLang, onSpeechComplete);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(script.greeting);
      utterance.lang = script.speechLang;
      utterance.rate = targetLang === 'EN' ? 0.92 : 0.88;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      let voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) {
        voices = voicesListRef.current;
      }
      const preferredVoice = selectBestVoiceForLang(targetLang, voices);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      (window as any).__pmschemeVoiceUtterance = utterance;

      utterance.onstart = () => {
        if (playbackSessionIdRef.current !== currentSessionId) return;
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        setAutoplayBlocked(false);
      };

      utterance.onend = () => {
        onSpeechComplete();
      };

      utterance.onerror = (e) => {
        if (playbackSessionIdRef.current !== currentSessionId) return;
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          // If Web Speech API fails, try stream audio fallback
          playAudioStreamFallback(script.greeting, targetLang, onSpeechComplete);
        }
      };

      window.speechSynthesis.speak(utterance);

      // Autoplay blocker check: if neither started nor speaking within 1200ms
      if (!isUserGesture) {
        setTimeout(() => {
          if (
            playbackSessionIdRef.current === currentSessionId &&
            !isSpeakingRef.current &&
            !speechCompletedRef.current &&
            !isExitingRef.current
          ) {
            setAutoplayBlocked(true);
          }
        }, 1200);
      } else {
        setAutoplayBlocked(false);
      }

      // Safe watchdog to keep Chrome / Android speech synthesis active
      if (watchdogRef.current) clearInterval(watchdogRef.current);
      watchdogRef.current = setInterval(() => {
        if (playbackSessionIdRef.current !== currentSessionId || !isSpeakingRef.current) {
          if (watchdogRef.current) clearInterval(watchdogRef.current);
          return;
        }
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 300);

    } catch (err) {
      console.warn('SpeechSynthesis fallback triggering audio stream:', err);
      playAudioStreamFallback(script.greeting, targetLang, onSpeechComplete);
    }
  }, [playAudioStreamFallback, selectBestVoiceForLang, stopAllVoiceAndAudio, triggerCurtainUnveil]);

  // Master handler for changing language directly from intro screen
  const handleSelectLanguage = useCallback((langCode: LanguageCode) => {
    setSelectedLang(langCode);
    selectedLangRef.current = langCode;
    setLanguage(langCode);
    setAutoplayBlocked(false);

    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    playHarmonicChime(490, 1.2, true);
    // Cancel any prior voice and immediately speak ONLY in the newly selected language
    speakWelcomeNarration(true, true, langCode);
  }, [getOrCreateAudioContext, playHarmonicChime, setLanguage, speakWelcomeNarration]);

  // Master handler for user interaction on any device (Debounced to prevent double triggers on mobile)
  const handleUserTrigger = useCallback((e?: React.SyntheticEvent | Event) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastUserTriggerTimeRef.current < 400) {
      return; // Debounce rapid multi-touch / touch+click
    }
    lastUserTriggerTimeRef.current = now;

    setAutoplayBlocked(false);

    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play single voice in currently selected language
    speakWelcomeNarration(true, true, selectedLangRef.current);
  }, [getOrCreateAudioContext, speakWelcomeNarration]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  // Canvas background rendering: Royal Decorative Mandala, Golden Lotus Petals, Radiant Stardust & Ashoka Chakra
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Decorative golden stardust particles
    const particleCount = 55;
    const particles = Array.from({ length: particleCount }, (_, i) => {
      let color = '#FFD700'; // Gold
      if (i % 4 === 1) color = '#FF9933'; // Saffron
      else if (i % 4 === 2) color = '#FFFFFF'; // Pure pearl white
      else if (i % 4 === 3) color = '#4ADE80'; // Emerald shimmer

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.1,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.25,
        color,
        pulseSpeed: Math.random() * 0.03 + 0.02,
        angle: Math.random() * Math.PI * 2
      };
    });

    let chakraRotation = 0;
    let mandalaRotation = 0;
    let chakraBuildProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Plain White Pristine Backdrop
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Subtle Auspicious Saffron Top Glow & Emerald Base Glow on White
      const saffronAura = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, 0, height * 0.65);
      saffronAura.addColorStop(0, 'rgba(255, 153, 51, 0.08)');
      saffronAura.addColorStop(0.5, 'rgba(245, 158, 11, 0.03)');
      saffronAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = saffronAura;
      ctx.fillRect(0, 0, width, height);

      const emeraldAura = ctx.createRadialGradient(width * 0.5, height, 10, width * 0.5, height, height * 0.65);
      emeraldAura.addColorStop(0, 'rgba(19, 136, 8, 0.08)');
      emeraldAura.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
      emeraldAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = emeraldAura;
      ctx.fillRect(0, 0, width, height);

      // 2. Central Sacred Ashoka Chakra & Multi-tier Lotus Mandala
      const cx = width / 2;
      const cy = height * (isMobileDevice ? 0.28 : 0.31);
      const radius = Math.min(width, height) * (isMobileDevice ? 0.16 : 0.13);

      chakraRotation += 0.002;
      mandalaRotation -= 0.0012;
      chakraBuildProgress = Math.min(1, chakraBuildProgress + 0.02);

      ctx.save();
      ctx.translate(cx, cy);

      // Tier A: Outer Golden Mandala Floral Petals Halo (24 Petals)
      const outerHaloRadius = radius * 1.55;
      const petalCount = 24;
      for (let p = 0; p < petalCount; p++) {
        const petalAngle = (p * (Math.PI * 2) / petalCount) + mandalaRotation;
        const px = Math.cos(petalAngle) * outerHaloRadius;
        const py = Math.sin(petalAngle) * outerHaloRadius;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(petalAngle + Math.PI / 2);

        // Golden Petal Arc
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(8, -12, 0, -22);
        ctx.quadraticCurveTo(-8, -12, 0, 0);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)'; // Amber/Gold on White
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tip pearl bead
        ctx.beginPath();
        ctx.arc(0, -22, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        ctx.restore();
      }

      // Tier B: Golden Radiance Ring with Diamond Lattice
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.28, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tier C: Sacred Ashoka Chakra Navy & Gold Ring
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.9)'; // Deep Navy Blue
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Tier D: 24 Spokes with luminous nodes
      const totalSpokes = 24;
      for (let i = 0; i < totalSpokes; i++) {
        const spokeAngle = (i * (Math.PI * 2) / totalSpokes) + chakraRotation;
        const currentLen = radius * 0.88 * chakraBuildProgress;

        const x2 = Math.cos(spokeAngle) * currentLen;
        const y2 = Math.sin(spokeAngle) * currentLen;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.8)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        if (chakraBuildProgress > 0.7) {
          const archAngle = spokeAngle + (Math.PI / totalSpokes);
          const ax = Math.cos(archAngle) * (radius * 0.94);
          const ay = Math.sin(archAngle) * (radius * 0.94);

          ctx.beginPath();
          ctx.arc(ax, ay, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#d97706';
          ctx.fill();
        }
      }

      // Tier E: Central Navy & Gold Hub
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#1e3a8a';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hub golden center pin
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();

      ctx.restore();

      // 3. Floating Golden & Tricolor Sparkle Particles on White
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.5 + Math.sin(p.angle) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, currentAlpha * 0.85);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mousePos, isMobileDevice]);

  // Timed Sequence Progression
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 180);

    const t2 = setTimeout(() => {
      setPhase(2);
      if (soundEnabledRef.current && !speechExecutedRef.current) {
        playHarmonicChime(440, 2.0, true);
        speakWelcomeNarration(false, false, selectedLangRef.current);
      }
    }, 480);

    const t3 = setTimeout(() => setPhase(3), 1200);

    // Fallback safety to never trap the user on slower devices (8.5s)
    const tFallback = setTimeout(() => {
      if (!isExitingRef.current && (!isSpeakingRef.current || !soundEnabledRef.current)) {
        triggerCurtainUnveil();
      }
    }, 8500);

    const globalAudioUnlocker = () => {
      if (!isExitingRef.current) {
        const ctx = getOrCreateAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        setAutoplayBlocked(false);
        // Only trigger initial speech if not yet started or spoken
        if (soundEnabledRef.current && !speechExecutedRef.current && !isSpeakingRef.current && !speechCompletedRef.current) {
          playHarmonicChime(440, 1.5, true);
          speakWelcomeNarration(true, true, selectedLangRef.current);
        }
      }
    };

    window.addEventListener('touchstart', globalAudioUnlocker, { passive: true });
    window.addEventListener('pointerdown', globalAudioUnlocker, { passive: true });
    window.addEventListener('click', globalAudioUnlocker);
    window.addEventListener('keydown', globalAudioUnlocker);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesLoaded = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            voicesListRef.current = v;
          }
        } catch {}
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesLoaded);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFallback);
      if (watchdogRef.current) clearInterval(watchdogRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener('touchstart', globalAudioUnlocker);
      window.removeEventListener('pointerdown', globalAudioUnlocker);
      window.removeEventListener('click', globalAudioUnlocker);
      window.removeEventListener('keydown', globalAudioUnlocker);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, [getOrCreateAudioContext, playHarmonicChime, speakWelcomeNarration, triggerCurtainUnveil]);

  const currentScript = INTRO_VOICE_SCRIPTS[selectedLang] || INTRO_VOICE_SCRIPTS.EN;

  return (
    <AnimatePresence>
      <div
        id="creative-intro-viewport"
        onMouseMove={handleMouseMove}
        className="fixed inset-0 z-99999 flex flex-col items-center justify-between overflow-hidden cursor-default select-none py-4 sm:py-6 px-3 sm:px-4"
      >
        {/* ========================================================================= */}
        {/* GRAND ROYAL HERITAGE SILK CURTAINS IN PLAIN WHITE WITH GOLDEN ZARI ACCENTS */}
        {/* ========================================================================= */}

        {/* Top Decorative Pelmet / Toran Valance (Indian Palace Festoon) */}
        <motion.div
          animate={{
            y: isExiting ? -120 : 0,
            opacity: isExiting ? 0 : 1
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 inset-x-0 h-14 sm:h-20 z-20 pointer-events-none overflow-hidden"
        >
          {/* Pure White Silk Valance with Golden Scallops */}
          <div className="w-full h-full bg-gradient-to-b from-white via-white to-white/90 border-b border-amber-400/40 relative shadow-md">
            {/* Scallop gold fringe pattern */}
            <div className="absolute bottom-0 inset-x-0 h-3 flex justify-between px-2 overflow-hidden opacity-90">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-6 h-3 rounded-b-full border-b-2 border-amber-400 bg-amber-400/20 shrink-0 shadow-xs" />
              ))}
            </div>
            {/* Central Golden Kalash / Crown Crest */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-amber-400/80 shadow-md">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">
                Viksit Bharat • MCA
              </span>
            </div>
          </div>
        </motion.div>

        {/* LEFT ROYAL CURTAIN - Plain White Silk with Subtle Folds & Gold Zari Border */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isExiting ? '-100%' : '0%' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 z-10 shadow-2xl overflow-hidden pointer-events-none bg-white"
          style={{
            background: `
              radial-gradient(ellipse at 80% 30%, #ffffff 0%, #fbfbfb 60%, #f3f4f6 100%),
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.04) 0px,
                rgba(0, 0, 0, 0.01) 20px,
                rgba(217, 119, 6, 0.02) 40px,
                rgba(255, 255, 255, 0.9) 55px,
                rgba(0, 0, 0, 0.02) 70px,
                rgba(0, 0, 0, 0.05) 90px
              )
            `,
            backgroundBlendMode: 'multiply, normal'
          }}
        >
          {/* Subtle Royal Damask / Mandala Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.3) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Left Tie-back Medallion (Golden Brocade Sash) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-xl border border-amber-300 flex items-center justify-center opacity-90">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            {/* Hanging Silk Tassel cord */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 sm:h-16 bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-amber-500 rounded-b-md shadow-xs" />
            </div>
          </div>

          {/* Left Edge Ornamental Golden Zari (Zardozi) Border */}
          <div className="absolute inset-y-0 right-0 w-4 sm:w-6 bg-gradient-to-r from-amber-500/80 via-amber-400 to-amber-200 border-l border-amber-300 shadow-md flex flex-col justify-around py-4 items-center">
            {Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rotate-45 bg-white border border-amber-600 shadow-xs" />
            ))}
            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#FF9933] via-amber-400 to-[#FF9933] opacity-95 shadow-xs" />
          </div>
        </motion.div>

        {/* RIGHT ROYAL CURTAIN - Plain White Silk with Subtle Folds & Emerald Zari Border */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isExiting ? '100%' : '0%' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 z-10 shadow-2xl overflow-hidden pointer-events-none bg-white"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, #ffffff 0%, #fbfbfb 60%, #f3f4f6 100%),
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.05) 0px,
                rgba(0, 0, 0, 0.02) 20px,
                rgba(255, 255, 255, 0.9) 35px,
                rgba(217, 119, 6, 0.02) 50px,
                rgba(0, 0, 0, 0.01) 70px,
                rgba(0, 0, 0, 0.04) 90px
              )
            `,
            backgroundBlendMode: 'multiply, normal'
          }}
        >
          {/* Subtle Royal Damask / Mandala Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.3) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Right Tie-back Medallion (Golden Brocade Sash) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-bl from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-xl border border-amber-300 flex items-center justify-center opacity-90">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            {/* Hanging Silk Tassel cord */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 sm:h-16 bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-amber-500 rounded-b-md shadow-xs" />
            </div>
          </div>

          {/* Right Edge Ornamental Golden Zari (Zardozi) Border */}
          <div className="absolute inset-y-0 left-0 w-4 sm:w-6 bg-gradient-to-l from-amber-500/80 via-amber-400 to-amber-200 border-r border-amber-300 shadow-md flex flex-col justify-around py-4 items-center">
            {Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rotate-45 bg-white border border-amber-600 shadow-xs" />
            ))}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#138808] via-emerald-500 to-[#138808] opacity-95 shadow-xs" />
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* DYNAMIC CANVAS BACKGROUND (SACRED MANDALA, ASHOKA CHAKRA & GOLDEN STARDUST)*/}
        {/* ========================================================================= */}
        <motion.div
          animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>

        {/* ========================================================================= */}
        {/* TOP GOVERNMENT HEADER BAR & VOICE / PORTAL CONTROLS                       */}
        {/* ========================================================================= */}
        <motion.header
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -30 : 0,
            scale: isExiting ? 0.95 : 1
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-30 w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-auto px-2"
        >
          {/* Authentic National Flag Ribbon Emblem */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-md backdrop-blur-sm"
          >
            <div className="flex flex-col gap-0.5 w-1.5 h-4.5 rounded-xs overflow-hidden shadow-xs">
              <span className="h-1/3 bg-[#FF9933] w-full" />
              <span className="h-1/3 bg-slate-200 w-full" />
              <span className="h-1/3 bg-[#138808] w-full" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-wider uppercase ml-1">
              भारत सरकार • Govt of India
            </span>
          </motion.div>

          {/* Audio Controls & Skip Button */}
          <div className="flex items-center gap-2">
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                soundEnabledRef.current = nextState;
                if (nextState) {
                  speechExecutedRef.current = false;
                  playHarmonicChime(440, 2.2, true);
                  speakWelcomeNarration(true, true, selectedLangRef.current);
                } else {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch {}
                  }
                  setIsSpeaking(false);
                }
              }}
              className={`px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 text-xs backdrop-blur-md cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-md'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle Audio & Voice Narration"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="text-[10px] tracking-wider uppercase font-extrabold text-amber-900">
                    Voice Active
                  </span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="w-0.5 h-2 bg-amber-600 animate-bounce rounded-full" />
                    <span className="w-0.5 h-3.5 bg-amber-500 animate-bounce delay-75 rounded-full" />
                    <span className="w-0.5 h-2 bg-amber-600 animate-bounce delay-150 rounded-full" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-600">
                    Voice Off
                  </span>
                </>
              )}
            </motion.button>

            {/* Direct Skip to Home Screen */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  try { window.speechSynthesis.cancel(); } catch {}
                }
                triggerCurtainUnveil();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-indigo-600 text-[10px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer backdrop-blur-md shadow-md"
            >
              <span>Enter Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
            </motion.button>
          </div>
        </motion.header>

        {/* ========================================================================= */}
        {/* CENTRAL DECORATIVE ARCH, SCHEME HEADINGS & LIVE VOICE RECITATION BOX       */}
        {/* ========================================================================= */}
        <motion.main
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.92 : 1,
            filter: isExiting ? 'blur(8px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-30 max-w-3xl w-full flex flex-col items-center text-center pointer-events-auto my-auto"
        >
          {/* Decorative Gold Palace Mehraab (Archway) Top Flourish */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-amber-600" />
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-500 border border-amber-300 shadow-xs" />
            <span className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent via-amber-500 to-amber-600" />
          </div>

          {/* National Motto: Satyameva Jayate */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              letterSpacing: isMobileDevice ? '0.15em' : '0.25em'
            }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-2"
          >
            <span className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#FF9933]" />
            <span className="text-slate-900 font-serif tracking-wider font-extrabold">सत्यमेव जयते</span>
            <span className="text-amber-500">•</span>
            <span className="text-slate-800 font-extrabold tracking-widest">TRUTH ALONE TRIUMPHS</span>
            <span className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#138808]" />
          </motion.div>

          {/* Majestic Scheme Heading with High Contrast on Plain White */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 25
            }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative px-2"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif drop-shadow-xs">
              प्रधानमंत्री इंटर्नशिप योजना
              <span className="block mt-1.5 text-xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#047857] bg-clip-text text-transparent drop-shadow-xs font-sans">
                PRIME MINISTER’S INTERNSHIP SCHEME
              </span>
            </h1>
          </motion.div>

          {/* Tricolor & Gold Ornamented Accent Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 2 ? (isMobileDevice ? '150px' : '200px') : '0px',
              opacity: phase >= 2 ? 1 : 0
            }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#138808] my-2.5 sm:my-3 shadow-sm"
          />

          {/* MULTILINGUAL LANGUAGE VOICE SELECTOR (Choose any Indian language) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-xl px-2 my-2"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[11px] font-bold text-slate-700">
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>Select Voice Language / भाषा चुनें:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1.5 bg-white/90 border border-amber-300 rounded-2xl shadow-md backdrop-blur-md">
              {(Object.keys(INTRO_VOICE_SCRIPTS) as LanguageCode[]).map((code) => {
                const item = INTRO_VOICE_SCRIPTS[code];
                const isSelected = selectedLang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelectLanguage(code)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-md scale-105'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200'
                    }`}
                  >
                    <span>{item.nativeLabel}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Vision Statement */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: phase >= 3 ? 1 : 0,
              y: phase >= 3 ? 0 : 15
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-medium max-w-lg leading-relaxed px-3"
          >
            Empowering <span className="font-bold text-amber-700">1 Crore Indian Youth</span> with top 500 enterprise internships, certified industry skills, and <span className="font-bold text-emerald-700">₹5,000 monthly DBT</span>.
          </motion.p>

          {/* Spoken Voice Subtitle & Live Recitation Visualizer */}
          <div className="mt-3 pointer-events-auto w-full max-w-lg mx-auto flex flex-col items-center">
            {autoplayBlocked && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={handleUserTrigger}
                className="mb-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs shadow-xl flex items-center gap-2 border border-amber-300 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Tap here to hear welcome voice in {currentScript.nativeLabel} (ఆడియో వినండి / आवाज़ सुनें)</span>
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-white/95 border border-amber-400 text-slate-800 text-xs shadow-xl backdrop-blur-md"
            >
              {/* Language Tag Badge & Active Utterance */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[10px] uppercase">
                    {currentScript.flag} {currentScript.nativeLabel} ({currentScript.englishLabel})
                  </span>
                  <Volume2 className={`w-4 h-4 text-amber-600 ${isSpeaking ? 'animate-pulse' : ''} shrink-0`} />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUserTrigger}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-[10px] shadow-xs transition cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isSpeaking ? 'Replay Voice' : 'Play Voice'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={triggerCurtainUnveil}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[10px] shadow-xs transition cursor-pointer"
                  >
                    <span>Enter Portal</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Spoken Subtitle in selected Indian script */}
              <span className="font-bold text-xs sm:text-sm text-slate-900 italic text-center px-1">
                &ldquo;{currentScript.greeting}&rdquo;
              </span>
              
              {/* Active Voice Waveform & Duration Meter */}
              <div className="w-full flex items-center justify-between gap-3 pt-1.5 border-t border-slate-200 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-emerald-600'}`} />
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">
                    {isSpeaking
                      ? `Speaking in ${currentScript.nativeLabel}...`
                      : 'Voice Ready — Opening Portal...'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSpeaking ? (
                    <div className="flex items-center gap-1">
                      <span className="w-0.5 h-2 bg-amber-500 animate-bounce rounded-full" />
                      <span className="w-0.5 h-3.5 bg-amber-600 animate-bounce delay-75 rounded-full" />
                      <span className="w-0.5 h-2 bg-amber-500 animate-bounce delay-150 rounded-full" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUserTrigger}
                      className="text-amber-700 hover:text-amber-900 font-bold underline text-[10px] cursor-pointer"
                    >
                      Replay
                    </button>
                  )}
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5 border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500"
                  style={{ width: `${speechProgress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* ========================================================================= */}
        {/* BOTTOM NATIONAL HERITAGE FOOTER                                          */}
        {/* ========================================================================= */}
        <motion.footer
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? 20 : 0
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-30 text-center text-[9px] sm:text-[10px] tracking-wider text-slate-600 font-medium flex items-center justify-center gap-2 pb-1 pointer-events-none"
        >
          <span>Ministry of Corporate Affairs</span>
          <span className="text-amber-500">•</span>
          <span className="text-[#FF9933] font-bold">Empowering Bharat</span>
          <span className="text-amber-500">•</span>
          <span>Aligned with Viksit Bharat 2047</span>
        </motion.footer>
      </div>
    </AnimatePresence>
  );
}
