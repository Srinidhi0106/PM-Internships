import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Crown, Languages, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../translations';

interface CreativeIntroExperienceProps {
  onComplete: () => void;
}

export const SUPPORTED_INTRO_LANGUAGES: {
  code: LanguageCode;
  nativeLabel: string;
  englishLabel: string;
}[] = [
  { code: 'EN', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'HI', nativeLabel: 'हिन्दी', englishLabel: 'Hindi' },
  { code: 'TE', nativeLabel: 'తెలుగు', englishLabel: 'Telugu' },
  { code: 'TA', nativeLabel: 'தமிழ்', englishLabel: 'Tamil' },
  { code: 'KN', nativeLabel: 'ಕನ್ನಡ', englishLabel: 'Kannada' },
  { code: 'MR', nativeLabel: 'मराठी', englishLabel: 'Marathi' },
  { code: 'BN', nativeLabel: 'বাংলা', englishLabel: 'Bengali' },
  { code: 'GU', nativeLabel: 'ગુજરાતી', englishLabel: 'Gujarati' }
];

// Web Audio API synthesizer for the realistic buzz whoosh & crisp crystal "ting" chime
function playCurtainTingSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // 1. Subtle warm buzz / curtain whoosh harmonic base
    const oscBuzz = ctx.createOscillator();
    const gainBuzz = ctx.createGain();
    oscBuzz.type = 'triangle';
    oscBuzz.frequency.setValueAtTime(140, now);
    oscBuzz.frequency.exponentialRampToValueAtTime(320, now + 0.22);
    gainBuzz.gain.setValueAtTime(0.09, now);
    gainBuzz.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    oscBuzz.connect(gainBuzz);
    gainBuzz.connect(ctx.destination);
    oscBuzz.start(now);
    oscBuzz.stop(now + 0.38);

    // 2. Crystal "Ting" chime (Fundamental 1046.5Hz C6 and shimmer 2093Hz C7)
    const oscTing1 = ctx.createOscillator();
    const gainTing1 = ctx.createGain();
    oscTing1.type = 'sine';
    oscTing1.frequency.setValueAtTime(1046.5, now + 0.04);
    gainTing1.gain.setValueAtTime(0.28, now + 0.04);
    gainTing1.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
    oscTing1.connect(gainTing1);
    gainTing1.connect(ctx.destination);
    oscTing1.start(now + 0.04);
    oscTing1.stop(now + 0.9);

    const oscTing2 = ctx.createOscillator();
    const gainTing2 = ctx.createGain();
    oscTing2.type = 'sine';
    oscTing2.frequency.setValueAtTime(1567.98, now + 0.08); // High G
    gainTing2.gain.setValueAtTime(0.22, now + 0.08);
    gainTing2.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    oscTing2.connect(gainTing2);
    gainTing2.connect(ctx.destination);
    oscTing2.start(now + 0.08);
    oscTing2.stop(now + 1.0);

    const oscTing3 = ctx.createOscillator();
    const gainTing3 = ctx.createGain();
    oscTing3.type = 'triangle';
    oscTing3.frequency.setValueAtTime(2093, now + 0.12); // Bell chime ting
    gainTing3.gain.setValueAtTime(0.18, now + 0.12);
    gainTing3.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    oscTing3.connect(gainTing3);
    gainTing3.connect(ctx.destination);
    oscTing3.start(now + 0.12);
    oscTing3.stop(now + 1.2);
  } catch {
    // Graceful failover on browser audio policies
  }
}

export function CreativeIntroExperience({ onComplete }: CreativeIntroExperienceProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState<number>(0); // 0: Curtains initial, 1: Chakra glow, 2: Royal Title, 3: Full Glory
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || 'EN');

  const isExitingRef = useRef(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Part the majestic velvet curtains and unveil Home Screen smoothly with buzz-ting sound
  const triggerCurtainUnveil = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);

    // Play realistic buzz-ting sound effect as curtains part
    playCurtainTingSound();

    // Smooth, graceful curtain parting animation (0.75s) to reveal home page immediately
    setTimeout(() => {
      onComplete();
    }, 750);
  }, [onComplete]);

  // Detect mobile viewport on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Visual phase progression and automatic curtain opening before home page
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 120);
    const t2 = setTimeout(() => setPhase(2), 350);
    const t3 = setTimeout(() => setPhase(3), 650);
    // Automatically trigger the buzz-ting curtain opening transition
    const autoOpenTimer = setTimeout(() => {
      triggerCurtainUnveil();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(autoOpenTimer);
    };
  }, [triggerCurtainUnveil]);

  // Master handler for changing language directly from intro screen
  const handleSelectLanguage = (langCode: LanguageCode) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  // Canvas background rendering: Sacred Ashoka Chakra, Golden Lotus Mandala & Radiant Stardust
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
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }, (_, i) => {
      let color = '#FFD700'; // Gold
      if (i % 4 === 1) color = '#FF9933'; // Saffron
      else if (i % 4 === 2) color = '#FFFFFF'; // Pure pearl white
      else if (i % 4 === 3) color = '#10B981'; // Emerald shimmer

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

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-9, -15, -12, -28, 0, -36);
        ctx.bezierCurveTo(12, -28, 9, -15, 0, 0);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // Tier B: Golden Radiance Rings
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.08, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tier C: Ashoka Chakra Outer Ring (Navy Blue #000080)
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#000080';
      ctx.lineWidth = Math.max(2.5, radius * 0.05);
      ctx.stroke();

      // Tier D: 24 Sacred Spokes of Ashoka Chakra
      ctx.save();
      ctx.rotate(chakraRotation);
      for (let i = 0; i < 24; i++) {
        const spokeAngle = (i * Math.PI) / 12;
        ctx.save();
        ctx.rotate(spokeAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-radius * 0.03, radius * 0.3);
        ctx.lineTo(0, radius * 0.96 * chakraBuildProgress);
        ctx.lineTo(radius * 0.03, radius * 0.3);
        ctx.closePath();
        ctx.fillStyle = '#000080';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, radius * 0.92, radius * 0.024, 0, Math.PI * 2);
        ctx.fillStyle = '#FF9933';
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // Tier E: Central Chakra Hub & Golden Core
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = '#000080';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();

      ctx.restore();

      // 3. Render Floating Stardust Particles
      particles.forEach((p) => {
        p.x += p.vx + (mousePos.x - 0.5) * 0.4;
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

  return (
    <AnimatePresence>
      <div
        id="creative-intro-viewport"
        onMouseMove={handleMouseMove}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden cursor-default select-none py-4 sm:py-6 px-3 sm:px-4"
      >
        {/* ========================================================================= */}
        {/* GRAND ROYAL HERITAGE SILK CURTAINS IN PLAIN WHITE WITH GOLDEN ZARI ACCENTS */}
        {/* ========================================================================= */}

        {/* Top Decorative Pelmet / Toran Valance */}
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
            {/* Central Golden Crest */}
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
          {/* Subtle Mandala Texture Overlay */}
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

          {/* Left Edge Ornamental Golden Zari Border */}
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
          {/* Subtle Mandala Texture Overlay */}
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

          {/* Right Edge Ornamental Golden Zari Border */}
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
        {/* TOP GOVERNMENT HEADER BAR                                                 */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* TOP GOVERNMENT RIBBON & FAST SKIP HEADER                                  */}
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

          {/* Quick Unveil / Skip Intro Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerCurtainUnveil();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white font-bold text-xs shadow-md border border-slate-700 transition cursor-pointer"
            title="Skip Intro and Open Scheme Portal"
          >
            <span>Skip to Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.header>

        {/* ========================================================================= */}
        {/* CENTRAL SCHEME HEADINGS & CURTAIN PRESENTATION                            */}
        {/* ========================================================================= */}
        <motion.main
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.92 : 1,
            filter: isExiting ? 'blur(8px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-30 max-w-3xl w-full flex flex-col items-center text-center pointer-events-auto my-auto cursor-pointer"
          onClick={triggerCurtainUnveil}
        >
          {/* Decorative Gold Palace Mehraab Top Flourish */}
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

          {/* Tricolor & Gold Accent Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 2 ? (isMobileDevice ? '150px' : '200px') : '0px',
              opacity: phase >= 2 ? 1 : 0
            }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#138808] my-2.5 sm:my-3 shadow-sm"
          />

          {/* Vision Statement */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: phase >= 3 ? 1 : 0,
              y: phase >= 3 ? 0 : 15
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-medium max-w-lg leading-relaxed px-3 mb-4"
          >
            Empowering <span className="font-bold text-amber-700">1 Crore Indian Youth</span> with top 500 enterprise internships, certified industry skills, and <span className="font-bold text-emerald-700">₹5,000 monthly DBT</span>.
          </motion.p>

          {/* MULTILINGUAL LANGUAGE SELECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-xl px-2 mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1.5 text-[11px] font-bold text-slate-700">
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>Select Preferred Language / भाषा चुनें:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1.5 bg-white/90 border border-amber-300 rounded-2xl shadow-md backdrop-blur-md">
              {SUPPORTED_INTRO_LANGUAGES.map((item) => {
                const isSelected = selectedLang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectLanguage(item.code)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
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

            {/* Prominent Action Button: Part Curtains & Enter Portal */}
            <div className="mt-3.5 flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCurtainUnveil();
                }}
                className="group relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-amber-400/30"
              >
                <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Part Curtains & Enter Scheme Portal</span>
                <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
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
