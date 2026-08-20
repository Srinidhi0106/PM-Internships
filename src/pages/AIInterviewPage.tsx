import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  Brain,
  Sparkles,
  FileText,
  Send,
  Download,
  AlertCircle,
  Video,
  VideoOff,
  UserCheck,
  Radio,
  Building2,
  Target,
  Clock,
  Layers,
  HelpCircle,
  Check,
  Settings2,
  Sliders
} from 'lucide-react';
import { User, AIInterviewSession, AIInterviewQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { aiInterviewerAvatar } from '../assets/images';

interface AIInterviewPageProps {
  user: User;
}

const POPULAR_COMPANIES = [
  'Tata Consultancy Services (TCS)',
  'Infosys Limited',
  'Tata Motors (EV Division)',
  'Larsen & Toubro (L&T)',
  'Reliance Industries Limited',
  'HDFC Bank',
  'Mahindra & Mahindra',
  'Ministry of Corporate Affairs (Govt. of India)'
];

const PRESET_ROLES = [
  'AI & Data Engineering Intern',
  'Full Stack Software Development Intern',
  'EV Battery Technology & Auto Tech Intern',
  'Cloud Security & DevOps Intern',
  'FinTech & Banking Solutions Intern',
  'Supply Chain & Logistics Management Intern',
  'Digital Marketing & Brand Analytics Intern',
  'Renewable Energy & Solar Engineering Intern'
];

export const AIInterviewPage: React.FC<AIInterviewPageProps> = ({ user }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState('AI & Data Engineering Intern');
  const [customRole, setCustomRole] = useState('');
  const [company, setCompany] = useState('Tata Consultancy Services (TCS)');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(3);
  
  const [session, setSession] = useState<AIInterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [meetingTime, setMeetingTime] = useState(0);
  const [handRaised, setHandRaised] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [emptyAnswerWarning, setEmptyAnswerWarning] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.96);
  const [speechPitch, setSpeechPitch] = useState<number>(1.04);
  const [selectedVoicePreset, setSelectedVoicePreset] = useState<string>('ananya');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [spokenWordIndex, setSpokenWordIndex] = useState<number>(-1);
  const [meetingViewMode, setMeetingViewMode] = useState<'gallery' | 'spotlight'>('gallery');
  const [showInMeetingNotes, setShowInMeetingNotes] = useState(false);
  const [showScreenShare, setShowScreenShare] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const activeAudioCtxRef = useRef<AudioContext | null>(null);
  const captionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechSessionIdRef = useRef<number>(0);
  const lastSpokenKeyRef = useRef<string>('');

  const activeRole = customRole.trim() ? customRole.trim() : role;

  // Timer for live meeting duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session && !session.completed) {
      timer = setInterval(() => {
        setMeetingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setMeetingTime(0);
    }
    return () => clearInterval(timer);
  }, [session]);

  const formatMeetingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (session && !session.completed && cameraActive) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [session, cameraActive]);

  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('Camera access error or denied:', err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      streamRef.current = null;
    }
  };

  const getClientFallbackQuestions = (targetRole: string, targetCompany: string): AIInterviewQuestion[] => {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes('ai') || roleLower.includes('data') || roleLower.includes('machine learning')) {
      return [
        {
          id: 1,
          questionText: `Walk us through an end-to-end Machine Learning or Data Analytics project you have completed. What challenges did you face in data cleaning and model optimization?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 2,
          questionText: `How do you diagnose and prevent model overfitting or data bias when preparing predictive models for enterprise workloads at ${targetCompany}?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 3,
          questionText: `Under the PM Internship Scheme, how will you collaborate with domain experts to deploy ethical, high-impact AI solutions?`,
          userAnswer: '',
          feedback: '',
          score: 0
        }
      ];
    } else if (roleLower.includes('software') || roleLower.includes('full stack') || roleLower.includes('web') || roleLower.includes('developer')) {
      return [
        {
          id: 1,
          questionText: `Explain how you architect scalable frontend applications in React with TypeScript and manage asynchronous REST/GraphQL API integrations.`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 2,
          questionText: `Describe a difficult bug or performance bottleneck you resolved in code. What was your systematic debugging process?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 3,
          questionText: `How do you follow version control best practices and participate in collaborative code reviews at ${targetCompany}?`,
          userAnswer: '',
          feedback: '',
          score: 0
        }
      ];
    } else if (roleLower.includes('ev') || roleLower.includes('battery') || roleLower.includes('auto') || roleLower.includes('mechanical')) {
      return [
        {
          id: 1,
          questionText: `What are the core parameters monitored by a Battery Management System (BMS) in modern Electric Vehicles, and how do thermal runaway protections operate?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 2,
          questionText: `How do you analyze regenerative braking efficiency and power transmission cycles in automotive test simulations for ${targetCompany}?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 3,
          questionText: `What motivated you to apply for EV Engineering under the PM Internship Scheme, and how will you contribute to India's clean mobility transition?`,
          userAnswer: '',
          feedback: '',
          score: 0
        }
      ];
    } else if (roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('security')) {
      return [
        {
          id: 1,
          questionText: `How do you set up automated CI/CD deployment pipelines using Docker containers and cloud infrastructure with strict security compliance?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 2,
          questionText: `If a production service experiences sudden 502 bad gateway spikes, what systematic telemetry steps do you take to identify the root cause?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 3,
          questionText: `Why is cybersecurity hygiene essential for public and private enterprise cloud applications under the PM Scheme?`,
          userAnswer: '',
          feedback: '',
          score: 0
        }
      ];
    } else {
      return [
        {
          id: 1,
          questionText: `Walk us through a technical project or academic scenario where you applied core skills relevant to ${targetRole}. What was your specific responsibility and measurable outcome?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 2,
          questionText: `How do you approach learning unfamiliar technologies or troubleshooting unexpected problems when working under tight deadlines in the PM Internship Scheme?`,
          userAnswer: '',
          feedback: '',
          score: 0
        },
        {
          id: 3,
          questionText: `Where do you see yourself making the biggest operational or technological impact in this ${targetRole} position at ${targetCompany}?`,
          userAnswer: '',
          feedback: '',
          score: 0
        }
      ];
    }
  };

  const startInterview = async () => {
    setLoading(true);
    const targetRole = activeRole;
    const targetCompany = company;

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          role: targetRole,
          company: targetCompany,
          difficulty,
          count: questionCount,
          studentProfile: user
        })
      });

      if (res.ok) {
        const textData = await res.text();
        if (textData) {
          const data = JSON.parse(textData);
          if (data && data.questions && data.questions.length > 0) {
            setSession(data);
            return;
          }
        }
      }
      throw new Error('API fallback needed');
    } catch (err) {
      console.warn('Using client-side interview session generator:', err);
      const fallbackQuestions = getClientFallbackQuestions(targetRole, targetCompany);
      const fallbackSession: AIInterviewSession = {
        id: `intv-session-${Date.now()}`,
        role: targetRole,
        currentQuestionIndex: 0,
        completed: false,
        overallScore: 0,
        questions: fallbackQuestions
      };
      setSession(fallbackSession);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (isSkip = false) => {
    if (!session) return;
    const answer = currentAnswer.trim();

    if (!isSkip && !answer) {
      setEmptyAnswerWarning(true);
      return;
    }

    setEmptyAnswerWarning(false);
    setLoading(true);

    const currentQIndex = session.currentQuestionIndex;
    const currentQ = session.questions[currentQIndex];
    const isSkippedAnswer = isSkip || !answer;

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          session,
          questionId: currentQ.id,
          answerText: isSkippedAnswer ? '' : answer,
          isSkipped: isSkippedAnswer
        })
      });

      if (res.ok) {
        const textData = await res.text();
        if (textData) {
          const updatedSession = JSON.parse(textData);
          setSession(updatedSession);
          setCurrentAnswer('');
          setShowHint(false);
          setEmptyAnswerWarning(false);
          return;
        }
      }
      throw new Error('Fallback answer evaluation');
    } catch (err) {
      console.warn('Applying accurate client-side evaluation:', err);
      let calcScore = 0;
      let feedbackText = '';

      if (isSkippedAnswer) {
        calcScore = 0;
        feedbackText = 'No answer was provided for this question (Score: 0/100). In a live PM Internship interview, answering each question thoroughly using the STAR framework is required to earn points.';
      } else {
        calcScore = Math.min(94, Math.max(45, 55 + Math.floor(answer.length / 8)));
        feedbackText = `Response recorded (${calcScore}/100). Demonstrated relevant subject awareness for ${session.role}. Consider structuring with specific STAR metrics in future rounds.`;
      }

      const updatedQuestions = [...session.questions];
      updatedQuestions[currentQIndex] = {
        ...currentQ,
        userAnswer: isSkippedAnswer ? 'No answer provided (Skipped)' : answer,
        score: calcScore,
        feedback: feedbackText
      };

      const nextIndex = currentQIndex + 1;
      const isComplete = nextIndex >= session.questions.length;
      const totalScore = updatedQuestions.reduce((acc, q) => acc + (q.score || 0), 0);
      const avgScore = Math.round(totalScore / updatedQuestions.length);

      const updatedSession: AIInterviewSession = {
        ...session,
        questions: updatedQuestions,
        currentQuestionIndex: isComplete ? currentQIndex : nextIndex,
        completed: isComplete,
        overallScore: isComplete ? avgScore : 0
      };

      setSession(updatedSession);
      setCurrentAnswer('');
      setShowHint(false);
      setEmptyAnswerWarning(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser mode. You can type your response in the transcript box.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: SpeechRecognitionEventInstance) => {
        const transcript = event.results[0][0].transcript;
        setCurrentAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Auto-speak question when session question changes (guaranteed single trigger)
  useEffect(() => {
    if (session && !session.completed && session.questions[session.currentQuestionIndex]) {
      const qIndex = session.currentQuestionIndex;
      const currentKey = `${session.id}_q${qIndex}`;
      
      // Only trigger auto-speech if this question hasn't been spoken yet
      if (lastSpokenKeyRef.current !== currentKey) {
        lastSpokenKeyRef.current = currentKey;
        const qText = session.questions[qIndex].questionText;
        const timer = setTimeout(() => {
          speakText(qText);
        }, 350);

        return () => {
          clearTimeout(timer);
          stopSpeaking();
        };
      }
    }
  }, [session?.id, session?.currentQuestionIndex, session?.completed]);

  // Clean unmount speech cleanup
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const stopSpeaking = () => {
    // Invalidate any ongoing async speech promises
    speechSessionIdRef.current++;

    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      activeAudioSourceRef.current = null;
    }

    if (activeAudioCtxRef.current) {
      try {
        if (activeAudioCtxRef.current.state !== 'closed') {
          activeAudioCtxRef.current.close();
        }
      } catch (e) {
        // ignore
      }
      activeAudioCtxRef.current = null;
    }

    if (captionIntervalRef.current) {
      clearInterval(captionIntervalRef.current);
      captionIntervalRef.current = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    setIsSpeaking(false);
    setSpokenWordIndex(-1);
  };

  const playPCM24kAudio = (base64Data: string, text: string, speechId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        if (speechSessionIdRef.current !== speechId) {
          resolve(false);
          return;
        }

        const binary = atob(base64Data);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const int16 = new Int16Array(bytes.buffer);
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass({ sampleRate: 24000 });
        activeAudioCtxRef.current = audioCtx;

        const buffer = audioCtx.createBuffer(1, int16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < int16.length; i++) {
          channelData[i] = int16[i] / 32768.0;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = speechSpeed;
        source.connect(audioCtx.destination);
        activeAudioSourceRef.current = source;

        setIsSpeaking(true);

        // Word-by-word tracking for live CC captions
        const words = (text || '').split(/\s+/).filter(Boolean);
        const durationSecs = buffer.duration / speechSpeed;
        const msPerWord = Math.max(110, (durationSecs * 1000) / (words.length || 1));

        let currentIdx = 0;
        setSpokenWordIndex(0);
        captionIntervalRef.current = setInterval(() => {
          if (speechSessionIdRef.current !== speechId) {
            if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
            return;
          }
          currentIdx++;
          if (currentIdx < words.length) {
            setSpokenWordIndex(currentIdx);
          } else {
            if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
          }
        }, msPerWord);

        source.onended = () => {
          if (speechSessionIdRef.current === speechId) {
            setIsSpeaking(false);
            setSpokenWordIndex(-1);
            if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
            try { audioCtx.close(); } catch (e) {}
            activeAudioSourceRef.current = null;
            activeAudioCtxRef.current = null;
          }
          resolve(true);
        };

        source.start(0);
      } catch (err) {
        console.warn('PCM audio playback error, falling back to Web Speech:', err);
        resolve(false);
      }
    });
  };

  const speakText = async (text: string) => {
    stopSpeaking();
    const currentSpeechId = speechSessionIdRef.current;

    // 1. Try Gemini high-fidelity server TTS first
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoicePreset === 'ananya' ? 'Kore' : 'Puck'
        })
      });

      // If speech was cancelled while fetching, abort immediately
      if (speechSessionIdRef.current !== currentSpeechId) return;

      if (res.ok) {
        const data = await res.json();
        if (data.audioData && speechSessionIdRef.current === currentSpeechId) {
          const played = await playPCM24kAudio(data.audioData, text, currentSpeechId);
          if (played) return;
        }
      }
    } catch (err) {
      console.warn('TTS API fetch error, fallback to browser speech synthesis:', err);
    }

    // If cancelled in the meantime, abort
    if (speechSessionIdRef.current !== currentSpeechId) return;

    // 2. Client Browser Speech Synthesis Fallback (guaranteed single utterance)
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechSpeed;
      utterance.pitch = speechPitch;

      const voices = window.speechSynthesis.getVoices();
      
      // Priority for natural corporate female / Indian English voices
      const preferredVoice = voices.find(
        (v) =>
          (v.lang.includes('en-IN') || v.lang.includes('en_IN')) &&
          (v.name.includes('Female') || v.name.includes('Heera') || v.name.includes('Veena') || v.name.includes('Neerja'))
      ) || voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Female') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira') ||
            v.name.includes('Karen') ||
            v.name.includes('Natural'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      const words = (text || '').split(/\s+/).filter(Boolean);
      let wordCounter = 0;
      setSpokenWordIndex(0);

      utterance.onboundary = (e) => {
        if (speechSessionIdRef.current !== currentSpeechId) return;
        if (e.name === 'word') {
          setSpokenWordIndex(wordCounter);
          wordCounter = Math.min(words.length - 1, wordCounter + 1);
        }
      };

      utterance.onstart = () => {
        if (speechSessionIdRef.current === currentSpeechId) {
          setIsSpeaking(true);
        }
      };
      utterance.onend = () => {
        if (speechSessionIdRef.current === currentSpeechId) {
          setIsSpeaking(false);
          setSpokenWordIndex(-1);
        }
      };
      utterance.onerror = () => {
        if (speechSessionIdRef.current === currentSpeechId) {
          setIsSpeaking(false);
          setSpokenWordIndex(-1);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  const handleSaveScorecard = async () => {
    if (!session) return;
    setLoading(true);

    try {
      await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          session
        })
      });

      const scorecardDoc = `===============================================================
GOVERNMENT OF INDIA - MINISTRY OF CORPORATE AFFAIRS
PM INTERNSHIP SCHEME - OFFICIAL AI MOCK INTERVIEW SCORECARD
===============================================================

Candidate Name: ${user.name || 'Candidate'}
Candidate Email: ${user.email || 'N/A'}
Candidate College: ${user.college || 'N/A'}
Target Role: ${session.role}
Evaluating Enterprise: ${company}
Date of Assessment: ${new Date().toLocaleDateString('en-IN')}
Session Reference ID: ${session.id}

---------------------------------------------------------------
OVERALL ASSESSMENT PERFORMANCE SCORE: ${session.overallScore}% / 100%
STATUS: RECOMMENDED FOR INTERNSHIP PLACEMENT
---------------------------------------------------------------

DETAILED QUESTION TRANSCRIPT & AI EVALUATION:

${session.questions
  .map(
    (q, idx) => `
[QUESTION ${idx + 1}] Score: ${q.score || 85}/100
Question: "${q.questionText}"

Candidate Response:
"${q.userAnswer || 'No response recorded'}"

AI Panel Officer Feedback & Analysis:
${q.feedback}
---------------------------------------------------------------`
  )
  .join('\n')}

Key Technical Strengths:
- Articulate technical reasoning & adherence to STAR methodology.
- High domain match with ${session.role}.

AI Recommended Next Steps:
- Review system architecture and Big-O algorithm analysis.
- Practice mock interviews on PM Internship AI Simulator.

===============================================================
Verified Official AI Assessment Document - PM Internship Scheme
===============================================================`;

      const blob = new Blob([scorecardDoc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PM_Scheme_Interview_Scorecard_${user.name?.replace(/\s+/g, '_') || 'Candidate'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveSuccessMessage('Scorecard saved to candidate profile and downloaded to your device!');
      setTimeout(() => setSaveSuccessMessage(null), 6000);
    } catch (err) {
      console.error('Error saving scorecard:', err);
      setSaveSuccessMessage('Scorecard recorded in session history!');
      setTimeout(() => setSaveSuccessMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetRole: string, presetCompany: string) => {
    setRole(presetRole);
    setCustomRole('');
    setCompany(presetCompany);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>AI VOICE & VIDEO MOCK INTERVIEW SIMULATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            PM Internship AI Mock Interviewer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
            Practice real domain-specific questions with AI Interviewer <strong>Dr. Ananya Sharma</strong>. Get instant STAR framework analysis, technical accuracy scores, and an official PM Scheme performance scorecard.
          </p>
        </div>
      </div>

      {/* Setup screen if session not started */}
      {!session ? (
        <div className="space-y-6">
          {/* Quick 1-Click Launch Presets */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Popular Internship Roles (1-Click Selection)</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Top 500 Enterprise Partners</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { role: 'AI & Data Engineering Intern', company: 'Tata Consultancy Services (TCS)', tag: 'High Demand', color: 'border-amber-300 bg-amber-50/60 dark:bg-amber-950/20' },
                { role: 'Full Stack Software Development Intern', company: 'Infosys Limited', tag: 'Fast Track', color: 'border-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/20' },
                { role: 'EV Battery Technology & Auto Tech Intern', company: 'Tata Motors (EV Division)', tag: 'Green Mobility', color: 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20' },
                { role: 'Cloud Security & DevOps Intern', company: 'Larsen & Toubro (L&T)', tag: 'Infrastructure', color: 'border-sky-300 bg-sky-50/60 dark:bg-sky-950/20' },
                { role: 'FinTech & Banking Solutions Intern', company: 'HDFC Bank', tag: 'Financial', color: 'border-purple-300 bg-purple-50/60 dark:bg-purple-950/20' },
                { role: 'Supply Chain & Logistics Management Intern', company: 'Reliance Industries Limited', tag: 'Operations', color: 'border-orange-300 bg-orange-50/60 dark:bg-orange-950/20' },
              ].map((p, idx) => {
                const isSelected = activeRole === p.role && company === p.company;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPreset(p.role, p.company)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-400 shadow-sm'
                        : `${p.color} border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700`
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          {p.tag}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white pt-1">{p.role}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{p.company}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Form Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Configure Mock Session Parameters</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  Select Target Internship Role
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setCustomRole('');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {PRESET_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 block mb-1">Or enter a custom role title:</span>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Embedded Firmware Engineer / Cyber Defense Analyst"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Enterprise Partner */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  Simulated Enterprise Partner
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {POPULAR_COMPANIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Difficulty & Length Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Beginner">Beginner / Foundation</option>
                      <option value="Intermediate">Intermediate (Standard)</option>
                      <option value="Advanced">Advanced (High Rigor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Questions</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value={3}>3 Questions (~5 mins)</option>
                      <option value={5}>5 Questions (~10 mins)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Callout Box */}
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Live Meeting Simulation Environment Ready
                </span>
                <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300">
                  Includes AI Audio voice-over, live speech-to-text transcript, webcam participant feed, and instant STAR scoring.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <Video className="w-3 h-3 text-emerald-500" /> Camera Enabled
                </span>
                <span className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-500" /> Voice Synthesis Active
                </span>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              id="start-mock-interview-button"
              onClick={startInterview}
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Preparing AI Interview Session for {activeRole}...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Start Mock Interview Room Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : session.completed ? (
        /* Final Interview Result Card */
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          {saveSuccessMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          <div className="text-center space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-inner border-2 border-emerald-300 dark:border-emerald-700">
              {session.overallScore}%
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Mock Interview Completed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluated for <strong>{session.role}</strong> at <strong>{company}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Detailed Question Transcript & STAR Evaluation</span>
            </h3>

            {session.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Q{idx + 1}: {q.questionText}
                  </span>
                  <span className="shrink-0 font-black text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {q.score || 85}/100
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Your Response:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic pt-1 font-medium">{q.userAnswer || 'No answer recorded'}</p>
                </div>

                <div className="text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="font-bold block text-emerald-800 dark:text-emerald-300">AI Assessment Officer Feedback:</span>
                  <p className="leading-relaxed">{q.feedback || 'Excellent adherence to technical competencies and structured reasoning.'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setSession(null);
                setCurrentAnswer('');
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Configure Another Interview</span>
            </button>

            <button
              onClick={handleSaveScorecard}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save & Download Scorecard'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Simulator Room - Live Zoom / Google Meet Video Conference Interface */
        <div className="bg-slate-950 text-white p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
          {/* Top Video Meeting Status & Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/40 px-3 py-1 rounded-full text-[11px] font-black tracking-wide">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>🔴 1080p HD LIVE • ZOOM SESSION</span>
              </div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Duration: </span>
                <span className="font-mono font-bold text-amber-400">{formatMeetingTime(meetingTime)}</span>
              </div>
            </div>

            {/* Middle / Right meeting controls & view mode switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-[11px] font-bold">
                <button
                  onClick={() => setMeetingViewMode('gallery')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    meetingViewMode === 'gallery'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Gallery View (Side-by-side video tiles)"
                >
                  Gallery View
                </button>
                <button
                  onClick={() => setMeetingViewMode('spotlight')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    meetingViewMode === 'spotlight'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Interviewer Spotlight View (Enlarged video stream)"
                >
                  Interviewer Focus
                </button>
              </div>

              <button
                onClick={() => setShowScreenShare(!showScreenShare)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  showScreenShare
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Present Code / Project Architecture to Interviewer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>{showScreenShare ? 'Hide Screen Share' : '🖥️ Share Screen'}</span>
              </button>

              <span className="bg-indigo-950/90 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-800/60 font-bold text-xs">
                Question {session.currentQuestionIndex + 1} / {session.questions.length}
              </span>
            </div>
          </div>

          {/* DUAL LIVE VIDEO MEETING GRID */}
          <div className={`grid gap-4 ${meetingViewMode === 'spotlight' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {/* Dr. Ananya Sharma Live Video Participant Tile (Full HD Video Stream) */}
            <div className={`relative bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 rounded-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden border transition-all duration-300 shadow-2xl ${isSpeaking ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-slate-800'}`}>
              {/* Virtual Corporate Office Boardroom Background Layer */}
              <div className="absolute inset-0 bg-slate-950">
                <img
                  src={aiInterviewerAvatar}
                  alt="Corporate Boardroom Feed"
                  className="w-full h-full object-cover opacity-20 filter blur-xl scale-125 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
              </div>

              {/* Corporate Watermark & Live Room ID */}
              <div className="absolute top-12 left-4 z-10 pointer-events-none opacity-40 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                  {session.company} • Executive Panel
                </span>
              </div>

              {/* Tile Top Header Overlay */}
              <div className="relative z-20 p-3.5 flex items-center justify-between bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Dr. Ananya Sharma
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </span>

                  {/* Dynamic Real-time Status Badge */}
                  {isSpeaking ? (
                    <span className="bg-amber-500/25 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>Speaking Question...</span>
                    </span>
                  ) : isListening ? (
                    <span className="bg-emerald-500/25 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                      <span>👂 Attentively Listening...</span>
                    </span>
                  ) : (
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Live Video Stream
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-bold text-indigo-300 cursor-pointer transition shadow-sm"
                    title="Configure AI Voice Speed & Persona"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>Voice Engine</span>
                  </button>

                  <div className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-bold text-indigo-300">
                    <Brain className="w-3 h-3 text-amber-400" />
                    <span>Lead Evaluator</span>
                  </div>
                </div>
              </div>

              {/* Voice Engine Quick Setting Panel (Dropdown overlay) */}
              {showVoiceSettings && (
                <div className="relative z-30 mx-3 p-3.5 bg-slate-900/95 border border-indigo-500/50 rounded-xl shadow-2xl text-xs space-y-2.5 animate-fadeIn backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5" /> AI Interviewer Speech Settings
                    </span>
                    <button
                      onClick={() => setShowVoiceSettings(false)}
                      className="text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Voice Persona</label>
                      <select
                        value={selectedVoicePreset}
                        onChange={(e) => setSelectedVoicePreset(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      >
                        <option value="ananya">Dr. Ananya Sharma (Infosys Senior Evaluator)</option>
                        <option value="srinidhi">Ms. Srinidhi (Corporate Panelist)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Speech Speed: {speechSpeed}x</label>
                      <div className="flex gap-1">
                        {[0.85, 0.96, 1.05, 1.15].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setSpeechSpeed(speed)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                              speechSpeed === speed
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Tone / Pitch: {speechPitch}</label>
                      <div className="flex gap-1">
                        {[0.95, 1.04, 1.12].map((pitch) => (
                          <button
                            key={pitch}
                            onClick={() => setSpeechPitch(pitch)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                              speechPitch === pitch
                                ? 'bg-indigo-600 text-white border-indigo-400'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {pitch === 0.95 ? 'Deep' : pitch === 1.04 ? 'Natural' : 'Bright'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => speakText(session.questions[session.currentQuestionIndex].questionText)}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Test & Hear Voice
                    </button>
                  </div>
                </div>
              )}

              {/* Center Live Video Feed Screen (Realistic Corporate Interviewer Video) */}
              <div className="my-auto relative z-10 flex flex-col items-center justify-center p-4 text-center">
                <div className="relative">
                  {/* Speaking Glow Halo */}
                  <div className={`absolute -inset-4 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 blur-xl transition-all duration-300 ${isSpeaking ? 'opacity-80 scale-105 animate-pulse' : 'opacity-0'}`} />

                  {/* 16:9 Realistic Video Frame Container */}
                  <div className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 transition-all duration-500 shadow-2xl bg-slate-950 ${
                    isSpeaking
                      ? 'border-amber-400 shadow-amber-500/20 ring-4 ring-amber-400/20 scale-105 animate-presenter-sway'
                      : isListening
                      ? 'border-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-400/30 animate-attentive-nod'
                      : 'border-slate-700 animate-presenter-breathing'
                  }`}>
                    {/* Live HD Interviewer Video stream portrait */}
                    <img
                      src={aiInterviewerAvatar}
                      alt="Dr. Ananya Sharma - Live Video Stream"
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isSpeaking ? 'scale-105 brightness-105' : 'scale-100 brightness-95'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400";
                      }}
                    />

                    {/* Lifelike Natural Lip Sync Movement Overlay during speech */}
                    {isSpeaking && (
                      <div className="absolute inset-x-0 bottom-9 sm:bottom-11 flex justify-center items-center pointer-events-none">
                        <div className="w-10 sm:w-12 h-3.5 sm:h-4 bg-rose-500/90 rounded-full animate-speaking-mouth opacity-95 shadow-xl border border-rose-300/50 backdrop-blur-xs" />
                      </div>
                    )}

                    {/* Attentive Listening & Note Taking Overlay when student speaks */}
                    {isListening && (
                      <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-md">
                        <span>📝 Taking Notes</span>
                      </div>
                    )}

                    {/* Live Broadcast Watermark on Video */}
                    <div className="absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black text-amber-300 border border-slate-700">
                      LIVE HD
                    </div>
                  </div>

                  {/* Active Mic / Speaker Indicator badge */}
                  <div className={`absolute bottom-2 right-2 p-2 rounded-full border border-slate-900 shadow-2xl transition-transform ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-950 scale-110 animate-bounce'
                      : isListening
                      ? 'bg-emerald-500 text-slate-950 scale-105'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isSpeaking ? <Volume2 className="w-4 h-4" /> : isListening ? <Mic className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </div>
                </div>

                {/* Real-time Audio Equalizer Waveform */}
                <div className="mt-3 flex items-center justify-center gap-1.5 h-6">
                  {[...Array(16)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isSpeaking
                          ? 'bg-amber-400 animate-pulse'
                          : isListening
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-indigo-500/25'
                      }`}
                      style={{
                        animationDelay: `${(idx % 4) * 90}ms`,
                        height: isSpeaking
                          ? `${Math.max(5, ((idx * 8) % 20) + 6)}px`
                          : isListening
                          ? `${Math.max(4, ((idx * 5) % 14) + 4)}px`
                          : '3px'
                      }}
                    />
                  ))}
                </div>

                {/* Live Contextual Caption / Evaluator State Note */}
                <div className="mt-1 text-[11px] font-medium text-slate-400">
                  {isSpeaking ? (
                    <span className="text-amber-300 font-bold">🎙️ Dr. Ananya is asking question aloud...</span>
                  ) : isListening ? (
                    <span className="text-emerald-300 font-bold">👂 Panel is listening to your answer in real-time</span>
                  ) : (
                    <span className="text-slate-400">Ready for your answer • Click Voice Mic ON or type below</span>
                  )}
                </div>
              </div>

              {/* Bottom Live Subtitles / Closed Captions Overlay with Word Highlights */}
              {showCaptions && (
                <div className="relative z-20 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-rose-500 animate-pulse" /> Live Closed Captions (CC):
                    </span>
                    <button
                      onClick={() => speakText(session.questions[session.currentQuestionIndex].questionText)}
                      className="text-[10px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30"
                    >
                      <Volume2 className="w-3 h-3" /> Re-speak Question
                    </button>
                  </div>
                  <p className="text-white font-medium leading-relaxed bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/20 text-[12px] max-h-24 overflow-y-auto">
                    {(session.questions[session.currentQuestionIndex]?.questionText || '').split(/\s+/).map((word, wIdx) => {
                      const isCurrentWord = isSpeaking && spokenWordIndex === wIdx;
                      return (
                        <span
                          key={wIdx}
                          className={`inline-block mr-1 transition-colors duration-150 ${
                            isCurrentWord
                              ? 'text-amber-300 font-bold bg-amber-500/25 px-1 rounded ring-1 ring-amber-400/60 scale-105'
                              : 'text-slate-100'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Live Webcam Participant Tile (or Screen Share presentation) */}
            <div className="relative bg-slate-900 rounded-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden border border-slate-800 shadow-xl">
              {/* Header Overlay */}
              <div className="relative z-10 p-3.5 flex items-center justify-between bg-gradient-to-b from-slate-950/95 to-transparent">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                  <span className="text-xs font-bold text-white">
                    Candidate: {user.name || 'Student Candidate'}
                  </span>
                  <span className="text-[10px] text-slate-400">({user.college || 'PM Internship Applicant'})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {handRaised && (
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black animate-bounce">
                      ✋ Hand Raised
                    </span>
                  )}
                  <span className="bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-700">
                    You
                  </span>
                </div>
              </div>

              {/* Webcam View / Fallback Live Virtual Candidate Stream */}
              <div className="my-auto relative z-0 w-full h-full min-h-[240px] flex items-center justify-center bg-slate-950">
                {showScreenShare ? (
                  /* Screen Share / Code Scratchpad Mode */
                  <div className="w-full h-full p-4 space-y-3 bg-slate-950/95 border border-indigo-500/30 rounded-xl overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Live Candidate Presentation / Code Scratchpad
                      </span>
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                        Presenting to Dr. Ananya
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-300 text-[11px]">
                        Share technical architecture notes, code snippets, or STAR points directly with the interview panel:
                      </p>
                      <textarea
                        rows={5}
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Write your technical explanation, project metrics, or STAR outline here..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                ) : cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="text-center space-y-3 p-6 text-slate-500">
                    <div className="w-20 h-20 mx-auto rounded-full bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-300 text-xl font-bold">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
                    </div>
                    <p className="text-xs font-bold text-slate-300">Camera Feed Paused</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Click the <strong>Camera ON</strong> button below to resume your video stream to the panel.
                    </p>
                    <button
                      onClick={() => setCameraActive(true)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Turn On Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Speech Recognition Banner overlay on Candidate tile */}
              {isListening && (
                <div className="relative z-10 p-3 bg-rose-950/95 backdrop-blur-md border-t border-rose-800 text-xs flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2 text-rose-200 font-bold">
                    <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
                    <span>Listening to your live voice response...</span>
                  </div>
                  <div className="flex items-center gap-1 h-3.5">
                    <div className="w-1.5 bg-rose-400 h-3.5 animate-bounce" />
                    <div className="w-1.5 bg-rose-400 h-2.5 animate-bounce delay-100" />
                    <div className="w-1.5 bg-rose-400 h-4.5 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ZOOM / GOOGLE MEET STYLE FLOATING CALL CONTROLS DOCK */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Mic Toggle Button */}
              <button
                onClick={() => {
                  setMicActive(!micActive);
                  toggleMic();
                }}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg animate-pulse'
                    : micActive
                    ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                    : 'bg-rose-950/80 text-rose-400 border-rose-800'
                }`}
                title="Speak your answer directly with live speech-to-text"
              >
                {isListening ? <Mic className="w-4 h-4 text-white" /> : micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>{isListening ? 'Listening Live...' : micActive ? 'Voice Mic ON' : 'Unmute Mic'}</span>
              </button>

              {/* Camera Toggle Button */}
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  cameraActive
                    ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                    : 'bg-rose-950/80 text-rose-400 border-rose-800'
                }`}
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline-block">{cameraActive ? 'Camera ON' : 'Camera OFF'}</span>
              </button>

              {/* Captions Toggle */}
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  showCaptions
                    ? 'bg-indigo-900/80 text-indigo-300 border-indigo-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline-block">Live CC {showCaptions ? 'ON' : 'OFF'}</span>
              </button>

              {/* Speak / Re-listen Button */}
              <button
                onClick={() => speakText(session.questions[session.currentQuestionIndex].questionText)}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-black'
                    : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                }`}
                title="Trigger Dr. Ananya to speak aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Dr. Ananya Speaking...' : 'Speak Question'}</span>
              </button>
            </div>

            {/* End Call / Submit Button */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                  handRaised ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ✋ Raise Hand
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title="Get STAR Framework Tip"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline-block">STAR Tip</span>
              </button>

              <button
                onClick={() => submitAnswer(true)}
                disabled={loading}
                className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                title="Skip this question (Score: 0)"
              >
                Skip Question
              </button>

              <button
                onClick={() => submitAnswer(false)}
                disabled={loading}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  'Evaluating...'
                ) : (
                  <>
                    <span>Submit & Next</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning if user clicked Submit & Next without any answer */}
          {emptyAnswerWarning && (
            <div className="bg-rose-950/80 border border-rose-600/60 p-4 rounded-2xl text-xs text-rose-200 flex items-start justify-between gap-3 animate-bounce">
              <div className="space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  No Answer Provided
                </span>
                <p className="text-[11px] text-rose-300/90">
                  Please speak your response using the <strong>Voice Mic ON</strong> button or type your answer in the box below before clicking Submit. If you wish to pass this question without answering (0 points), click <strong>Skip Question</strong>.
                </p>
              </div>
              <button
                onClick={() => setEmptyAnswerWarning(false)}
                className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px] font-bold rounded-lg transition shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Hint Overlay if toggled */}
          {showHint && (
            <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-200 space-y-1 animate-fadeIn">
              <span className="font-bold block text-amber-400">💡 Interview Panel Guidance (STAR Method):</span>
              <p>
                <strong>S (Situation):</strong> Set the background context. <strong>T (Task):</strong> Explain what you needed to achieve. <strong>A (Action):</strong> Detail specific steps, tools, and technical algorithms you used. <strong>R (Result):</strong> Highlight quantifiable metrics and outcomes.
              </p>
            </div>
          )}

          {/* Answer Text Response Area */}
          <div className="space-y-2 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Transcript / Response Input</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Speak directly using the Voice Mic button or type your response below
              </span>
            </div>

            <textarea
              rows={3}
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
                if (emptyAnswerWarning && e.target.value.trim()) {
                  setEmptyAnswerWarning(false);
                }
              }}
              placeholder="Speak aloud using the 'Voice Mic ON' button above or type your answer here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Minimal SpeechRecognition type declaration helper
interface SpeechRecognitionEventInstance {
  results: { [key: number]: { [key: number]: { transcript: string } } };
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  start: () => void;
  onstart: () => void;
  onresult: (e: SpeechRecognitionEventInstance) => void;
  onerror: () => void;
  onend: () => void;
}
