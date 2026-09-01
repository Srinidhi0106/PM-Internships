import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  ShieldCheck,
  MessageSquare,
  Mic,
  FileSearch,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Quote,
  FileCheck,
  Calculator,
  Award,
  ChevronRight,
  MapPin,
  Building2,
  Users,
  ChevronLeft,
  Star,
  Search,
  Zap,
  Film,
  Play,
  Wand2,
  FileText,
  FileCheck2
} from 'lucide-react';
import { LanguageCode, getTranslation } from '../translations';
import { useLanguage } from '../context/LanguageContext';
import { heroStudentsBg, pmModiHeadshot, airtelLogo, pmSchemeLogo } from '../assets/images';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  openVoiceSearch: () => void;
  language?: LanguageCode;
  openEligibilityModal?: () => void;
  openStipendModal?: () => void;
  openQuizModal?: () => void;
  openCertModal?: () => void;
  onReplayIntro?: () => void;
}

// Subcomponent for robust exact company logo rendering
const CompanyLogoItem = ({ company }: { company: { name: string; domain: string; renderLogo: () => React.ReactNode } }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 select-none">
      {company.renderLogo()}
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  openVoiceSearch,
  language: propLanguage,
  openEligibilityModal,
  openStipendModal,
  openQuizModal,
  openCertModal,
  onReplayIntro
}) => {
  const { t, language: contextLanguage } = useLanguage();
  const currentLang = contextLanguage || propLanguage || 'EN';

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Riya Sharma',
      role: t('testiRole1', 'Student, B.Tech CSE'),
      quote: t('testiQuote1', '"InternIQ helped me find an amazing AI internship in Bengaluru. The AI recommendations were spot on!"'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Arjun Verma',
      role: t('testiRole2', 'Student, BCA'),
      quote: t('testiQuote2', '"The mock interviews and skill insights improved my confidence and got me placed in top company."'),
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Neha Reddy',
      role: t('testiRole3', 'Student, B.Sc AI & ML'),
      quote: t('testiQuote3', '"This platform is a game changer for students looking for real opportunities across India."'),
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Sarthak Gupta',
      role: t('testiRole4', 'Student, B.Tech ECE'),
      quote: t('testiQuote4', '"The 8-week AI skill roadmap guided me step by step. I passed the TCS technical round effortlessly!"'),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Ananya Das',
      role: t('testiRole5', 'Student, B.Com Honors'),
      quote: t('testiQuote5', '"Fraud detection verified the employer offer letter before I accepted. 100% safe platform for students!"'),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Rahul Kulkarni',
      role: t('testiRole6', 'Student, B.Tech Mech'),
      quote: t('testiQuote6', '"Received my ₹5,000 monthly allowance and ₹6,000 grant clearance certificate smoothly online."'),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 5
    }
  ];

  // Auto-advance testimonials every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const companyScrollRef = useRef<HTMLDivElement>(null);

  // Continuous smooth auto-scroll that never pauses on hover/touch
  React.useEffect(() => {
    const el = companyScrollRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.7; // Smooth pixel speed per frame

    const step = () => {
      if (el) {
        el.scrollLeft += speed;
        // Seamless loop back when reaching halfway of duplicated items
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollCompanies = (direction: 'left' | 'right') => {
    if (companyScrollRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      companyScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const cityOpportunities = [
    {
      name: 'Hyderabad',
      tags: 'IT • AI/ML • Data Science',
      openings: '1,240+ Openings',
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: 'Bengaluru',
      tags: 'Software • AI • Startups',
      openings: '2,150+ Openings',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: 'Mumbai',
      tags: 'Finance • Tech • Business',
      openings: '980+ Openings',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: 'Delhi NCR',
      tags: 'Consulting • IT • Govt',
      openings: '1,100+ Openings',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: 'Chennai',
      tags: 'IT • Engineering • Analytics',
      openings: '760+ Openings',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=500'
    },
    {
      name: 'Pune',
      tags: 'Software • AI/ML • Engg.',
      openings: '680+ Openings',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=500'
    }
  ];

  // Exact company brand logos for the 11 user-specified top recruiter companies
  const leadingCompanies = [
    {
      name: 'Airtel',
      domain: 'airtel.in',
      renderLogo: () => (
        <div className="flex items-center justify-center py-1">
          <img
            src={airtelLogo}
            alt="Airtel"
            className="h-12 sm:h-14 w-auto object-contain transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/images/airtel_new.jpg';
            }}
          />
        </div>
      )
    },
    {
      name: 'Google',
      domain: 'google.com',
      renderLogo: () => (
        <div className="flex items-center justify-center p-1">
          <svg className="h-8 w-auto shrink-0" viewBox="0 0 272 92" fill="none">
            <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.33 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
            <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.33 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
            <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.02l8.48-3.53c1.51 3.61 5.21 7.89 11.17 7.89 7.31 0 11.84-4.53 11.84-13.02V60.2h-.34c-2.18 2.69-6.38 5.12-11.68 5.12-11.17 0-21.33-9.74-21.33-22.01 0-12.35 10.16-22.26 21.33-22.26 5.29 0 9.49 2.43 11.68 5.04h.34v-3.95h9.63zm-8.82 20.92c0-7.81-5.21-13.44-12.01-13.44-6.89 0-12.51 5.63-12.51 13.44 0 7.73 5.63 13.44 12.51 13.44 6.8 0 12.01-5.71 12.01-13.44z" fill="#4285F4"/>
            <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
            <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.99 14.11l1.01 2.52-27.72 11.42c2.1 4.12 5.38 6.22 10.08 6.22 4.7 0 7.81-2.27 9.65-4.78zm-18.15-7.73l18.57-7.64c-1.09-2.77-4.37-4.7-8.23-4.7-4.87 0-11.6 4.37-10.34 12.34z" fill="#EA4335"/>
            <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35 1 53.72 1 34.68 1 15.63 16.32 0 35.29 0c10.42 0 17.78 4.03 23.36 9.33l-6.55 6.55c-4.03-3.78-9.49-6.72-16.81-6.72-13.61 0-24.53 10.92-24.53 25.53 0 14.61 10.92 25.53 24.53 25.53 8.82 0 13.86-3.53 17.05-6.72 2.61-2.61 4.37-6.38 5.04-11.51H35.29z" fill="#4285F4"/>
          </svg>
        </div>
      )
    },
    {
      name: 'HDFC Bank',
      domain: 'hdfcbank.com',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="w-10 h-10 bg-white border-4 border-[#ED232A] flex items-center justify-center p-0.5 shadow-xs">
            <div className="w-full h-full bg-[#004B8D] flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-white"></div>
            </div>
          </div>
          <div className="bg-[#004B8D] px-2.5 py-0.5 rounded-2xs flex items-center gap-1">
            <div className="w-2 h-2 border border-[#ED232A] bg-white flex items-center justify-center">
              <div className="w-1 h-1 bg-[#004B8D]"></div>
            </div>
            <span className="font-black text-[11px] text-white tracking-wider font-sans">HDFC BANK</span>
          </div>
        </div>
      )
    },
    {
      name: 'Tech Mahindra',
      domain: 'techmahindra.com',
      renderLogo: () => (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl flex flex-col items-center justify-center shadow-xs">
          <div className="w-10 h-4 bg-[#E31837] transform -skew-x-12 rounded-2xs mb-1"></div>
          <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-200 leading-tight font-sans">Tech</span>
          <span className="font-black text-xs text-[#E31837] tracking-tight leading-tight uppercase font-sans">Mahindra</span>
        </div>
      )
    },
    {
      name: 'Reliance Jio',
      domain: 'jio.com',
      renderLogo: () => (
        <div className="bg-[#0092DF] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-[#1D2568] text-white font-black text-base italic flex items-center justify-center shadow-sm font-sans">
            Jio
          </div>
          <span className="font-black text-white text-base tracking-tight font-sans">Reliance Jio</span>
        </div>
      )
    },
    {
      name: 'Cognizant',
      domain: 'cognizant.com',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg className="h-10 w-10 shrink-0" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cogGradientTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0033A0" />
                <stop offset="100%" stopColor="#0072CE" />
              </linearGradient>
              <linearGradient id="cogGradientRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0072CE" />
                <stop offset="100%" stopColor="#00B5E2" />
              </linearGradient>
            </defs>
            <path d="M50 8 L86 29 L86 71 L50 92 L14 71 L14 29 Z" fill="url(#cogGradientTop)" />
            <path d="M50 8 L86 29 L50 50 Z" fill="url(#cogGradientRight)" />
            <path d="M86 29 L86 71 L50 50 Z" fill="#0055A5" />
            <path d="M86 71 L50 92 L50 50 Z" fill="#00205B" />
            <path d="M50 92 L14 71 L50 50 Z" fill="#001845" />
            <path d="M14 71 L14 29 L50 50 Z" fill="#0033A0" />
            <polygon points="50,28 68,50 50,72 32,50" fill="#FFFFFF" />
          </svg>
          <span className="font-extrabold text-base text-[#000033] dark:text-blue-300 tracking-tight font-sans">cognizant</span>
        </div>
      )
    },
    {
      name: 'Capgemini',
      domain: 'capgemini.com',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl text-[#0070AD] tracking-tight italic font-serif">Capgemini</span>
          <svg className="h-8 w-8 shrink-0" viewBox="0 0 100 100">
            <path d="M50 10 C30 30, 10 50, 10 70 C10 85, 25 95, 50 95 C75 95, 90 85, 90 70 C90 50, 70 30, 50 10 Z" fill="#0070AD" />
            <path d="M50 35 C65 45, 80 58, 80 72 C80 82, 70 88, 50 88 C35 88, 25 80, 25 72 C25 60, 38 48, 50 35 Z" fill="#00A3E0" />
            <path d="M50 50 C58 58, 68 66, 68 75 C68 80, 60 84, 50 84 C42 84, 38 78, 38 75 C38 68, 44 60, 50 50 Z" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    {
      name: 'IBM',
      domain: 'ibm.com',
      renderLogo: () => (
        <div className="flex items-center justify-center">
          <svg className="h-9 w-auto" viewBox="0 0 120 45" fill="#006699">
            <rect x="0" y="0" width="20" height="4" /><rect x="0" y="6" width="20" height="4" /><rect x="0" y="12" width="20" height="4" /><rect x="0" y="18" width="20" height="4" /><rect x="0" y="24" width="20" height="4" /><rect x="0" y="30" width="20" height="4" /><rect x="0" y="36" width="20" height="4" /><rect x="0" y="42" width="20" height="4" />
            <rect x="30" y="0" width="25" height="4" /><rect x="30" y="6" width="8" height="4" /><rect x="47" y="6" width="8" height="4" /><rect x="30" y="12" width="8" height="4" /><rect x="47" y="12" width="8" height="4" /><rect x="30" y="18" width="25" height="4" /><rect x="30" y="24" width="8" height="4" /><rect x="47" y="24" width="8" height="4" /><rect x="30" y="30" width="8" height="4" /><rect x="47" y="30" width="8" height="4" /><rect x="30" y="36" width="8" height="4" /><rect x="47" y="36" width="8" height="4" /><rect x="30" y="42" width="25" height="4" />
            <rect x="65" y="0" width="8" height="4" /><rect x="107" y="0" width="8" height="4" /><rect x="65" y="6" width="14" height="4" /><rect x="101" y="6" width="14" height="4" /><rect x="65" y="12" width="8" height="4" /><rect x="80" y="12" width="20" height="4" /><rect x="107" y="12" width="8" height="4" /><rect x="65" y="18" width="8" height="4" /><rect x="83" y="18" width="14" height="4" /><rect x="107" y="18" width="8" height="4" /><rect x="65" y="24" width="8" height="4" /><rect x="107" y="24" width="8" height="4" /><rect x="65" y="30" width="8" height="4" /><rect x="107" y="30" width="8" height="4" /><rect x="65" y="36" width="8" height="4" /><rect x="107" y="36" width="8" height="4" /><rect x="65" y="42" width="8" height="4" /><rect x="107" y="42" width="8" height="4" />
          </svg>
        </div>
      )
    },
    {
      name: 'Wipro',
      domain: 'wipro.com',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl text-[#250E62] tracking-tight font-sans">wipro</span>
          <svg className="h-10 w-10 shrink-0" viewBox="0 0 100 100">
            <circle cx="50" cy="15" r="5" fill="#00A896" />
            <circle cx="70" cy="22" r="5" fill="#028090" />
            <circle cx="85" cy="38" r="5" fill="#05668D" />
            <circle cx="88" cy="60" r="5" fill="#2E4057" />
            <circle cx="78" cy="78" r="5" fill="#6B2D5C" />
            <circle cx="58" cy="88" r="5" fill="#B02E0C" />
            <circle cx="38" cy="85" r="5" fill="#EB6424" />
            <circle cx="22" cy="72" r="5" fill="#FA9F42" />
            <circle cx="15" cy="52" r="5" fill="#E8C547" />
            <circle cx="22" cy="32" r="5" fill="#A4C235" fillOpacity="0.9" />
            <circle cx="35" cy="18" r="4.5" fill="#00A896" />
            <circle cx="52" cy="28" r="4" fill="#028090" />
            <circle cx="68" cy="35" r="4" fill="#05668D" />
            <circle cx="72" cy="52" r="4" fill="#2E4057" />
            <circle cx="65" cy="68" r="4" fill="#6B2D5C" />
            <circle cx="50" cy="72" r="4" fill="#B02E0C" />
            <circle cx="38" cy="65" r="4" fill="#EB6424" />
            <circle cx="32" cy="50" r="3.5" fill="#FA9F42" />
          </svg>
        </div>
      )
    },
    {
      name: 'TATA',
      domain: 'tata.com',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg className="h-11 w-20 shrink-0" viewBox="0 0 160 100">
            <ellipse cx="80" cy="50" rx="75" ry="45" fill="#00529C" />
            <path d="M25 28 C50 20 110 20 135 28 L135 38 C110 30 88 30 88 30 L88 78 L72 78 L72 30 C72 30 50 30 25 38 Z" fill="#FFFFFF" />
          </svg>
          <span className="font-extrabold text-base tracking-[0.2em] text-[#00529C] dark:text-sky-400 font-sans">TATA</span>
        </div>
      )
    },
    {
      name: 'Infosys',
      domain: 'infosys.com',
      renderLogo: () => (
        <div className="flex items-center justify-center">
          <span className="font-extrabold text-3xl text-[#007CC3] tracking-tight font-sans">Infosys</span>
          <span className="text-xs font-bold text-[#007CC3] -mt-3 ml-0.5 font-sans">®</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-16 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-8 pb-14 px-4 overflow-hidden border-b border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Background image overlay matching reference image */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat opacity-55 dark:opacity-20 pointer-events-none filter contrast-100"
          style={{ 
            backgroundImage: `url(${heroStudentsBg})`,
            backgroundPosition: 'right 18% center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-slate-950/95 dark:via-slate-950/85 dark:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#f8fafc] dark:from-slate-950/40 dark:via-transparent dark:to-slate-950 pointer-events-none" />

        {/* Tri-Color Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 z-20" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Main Text */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top PM Scheme Badge matching screenshot */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/50 dark:border-amber-700/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900 dark:text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{t('heroTag', 'PM INTERNSHIP SCHEME • MINISTRY OF CORPORATE AFFAIRS • GOVT OF INDIA')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              <span className="block">{t('youthPower', 'YOUTH POWER.')}</span>
              <span className="block">{t('unlockingProgress', 'UNLOCKING PROGRESS.')}</span>
              <span className="block mt-1 bg-gradient-to-r from-orange-500 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {t('heroSubHeading', 'InternIQ Career Intelligence')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              {t('heroSubtitle', 'AI-powered smart internship recommendation engine. Explore top opportunities, practice mock interviews with real-time feedback.')}
            </p>

            {/* Hero Main Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('ai-recommendation')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t('exploreBtn', 'Explore AI Matches')}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('internships')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-amber-300" />
                <span>{t('browseBtn', 'Browse Internships')}</span>
              </button>

              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="px-5 py-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 hover:bg-amber-500/25 border-2 border-amber-400 text-slate-900 dark:text-amber-300 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer transform active:scale-95"
                  title="Experience Grand Curtain Opening Ceremony & Voice Speech"
                >
                  <Film className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>🎬 Replay Curtain Intro</span>
                </button>
              )}

              <button
                type="button"
                onClick={openVoiceSearch}
                className="px-5 py-3.5 bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-orange-500" />
                <span>{t('voiceBtn', 'Voice Search')}</span>
              </button>
            </div>

            {/* Login / Register Link matching screenshot */}
            <div className="pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>{t('userRolePrompt', 'Are you a student candidate or company partner?')} </span>
              <button
                type="button"
                onClick={() => setActiveTab('auth')}
                className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
              >
                {t('signInRegisterHere', 'Sign In / Register Here →')}
              </button>
            </div>

            {/* AI Module Direct Shortcut Buttons Grid */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                ⚡ {t('platformCapabilitiesSubtitle', 'Quick Launch Direct AI Tools & Portals')}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-resume-tailor')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Launch AI ATS Resume Tailor & Live Optimizer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t('aiResumeTailorNav', 'AI ATS Resume Tailor')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-interview')}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Mic className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('interviewAiTitle', 'AI Mock Interview')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-portfolio')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileSearch className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t('portfolioAiTitle', 'AI Portfolio & ATS')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-skill-gap')}
                  className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t('aiSkillGapNav', 'Skill Gap Roadmap')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-fraud')}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>{t('fraudAiTitle', 'AI Fraud Detector')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('resume-parser')}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('step1Title', 'Resume Parser')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t('studentPortal', 'Student Portal')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('contest-showcase')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm ring-2 ring-amber-500/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>Contest Deliverables & SRS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Shri Narendra Modi Quote Card & 4 Stats Cards matching screenshot */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 shadow-xl relative overflow-hidden text-center flex flex-col items-center justify-center space-y-3 group">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-2xl shadow-2xs">
                {t('nationalVision', 'NATIONAL VISION')}
              </div>

              {/* Centered Modi Ji Portrait */}
              <div className="relative mt-1">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400 dark:border-amber-500 shadow-xl mx-auto ring-4 ring-amber-400/20 group-hover:scale-105 transition duration-300 bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={pmModiHeadshot}
                    alt="Hon'ble Prime Minister Shri Narendra Modi Ji"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/pm_modi_new.jpg';
                    }}
                    className="w-full h-full object-cover object-center scale-105"
                  />
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 px-3 py-0.5 rounded-full text-[9px] font-black uppercase border border-amber-400 shadow-xs whitespace-nowrap">
                  {t('pmTitle', "HON'BLE PRIME MINISTER")}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">{t('pmName', 'Shri Narendra Modi')}</h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider">{t('govIndia', 'GOVERNMENT OF INDIA')}</p>
              </div>

              <div className="max-w-md mx-auto pt-2 border-t border-amber-200/80 dark:border-slate-800">
                <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 mb-1">{t('nationalMessage', '❝ National Message ❞')}</p>
                <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed font-semibold px-2">
                  {t('pmQuote', '"The PM Internship Scheme is a transformative step to empower 1 Crore youth with practical experience in top corporate leaders."')}
                </p>
              </div>
            </div>

            {/* Quick 4 Stats Grid (2x2) matching screenshot */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs text-left">
                <div className="text-2xl font-black text-orange-500">12,480+</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('registeredStudents', 'Registered Students')}</div>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs text-left">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">520+</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('topCompanies', 'Top 500 Companies')}</div>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs text-left">
                <div className="text-2xl font-black text-slate-900 dark:text-white">1,850+</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('activeRoles', 'Active Roles')}</div>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs text-left">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹5,000/mo</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('monthlyStipend', 'Monthly Stipend')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NATIONWIDE OPPORTUNITIES MAP SECTION (MATCHING SCREENSHOT) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Map Canvas */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {t('nationwideOpportunities', 'NATIONWIDE OPPORTUNITIES')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
                {t('opportunitiesAcrossIndia', 'Internship Opportunities Across India')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md pt-2 font-medium">
                {t('opportunitiesAcrossIndiaSub', "Discover internships from top companies and organizations across India's major technology and business hubs.")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('internships')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('viewAllOpportunities', 'View All Opportunities')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Interactive India Map Vector Graphic with Location Pulse Pins */}
            <div className="relative w-full h-56 sm:h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full text-slate-300 dark:text-slate-700" viewBox="0 0 400 300" fill="currentColor">
                {/* Simplified India Map Silhouette Path */}
                <path d="M 180 30 Q 210 20 230 40 Q 250 60 220 80 Q 260 90 280 120 Q 300 130 270 160 Q 240 180 230 220 Q 210 270 190 280 Q 180 240 160 200 Q 140 180 120 160 Q 100 120 130 90 Q 150 70 180 30 Z" opacity="0.4" />
              </svg>

              {/* Pinned Locations Overlay */}
              <div className="absolute top-[28%] left-[42%] flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>Delhi NCR</span>
              </div>

              <div className="absolute top-[52%] left-[32%] flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Mumbai</span>
              </div>

              <div className="absolute top-[62%] left-[48%] flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold text-indigo-600">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Hyderabad</span>
              </div>

              <div className="absolute top-[75%] left-[44%] flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Bengaluru</span>
              </div>

              <div className="absolute top-[78%] left-[54%] flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold text-purple-600">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Chennai</span>
              </div>
            </div>
          </div>

          {/* Right Location Pin List Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            {[
              { city: 'Hyderabad', tags: 'IT • AI/ML • Data Science', color: 'text-blue-600' },
              { city: 'Bengaluru', tags: 'Software • AI • Startups', color: 'text-emerald-600' },
              { city: 'Mumbai', tags: 'Finance • Technology • Business', color: 'text-amber-600' },
              { city: 'Delhi NCR', tags: 'Consulting • IT • Government', color: 'text-indigo-600' },
              { city: 'Chennai', tags: 'IT • Engineering • Analytics', color: 'text-purple-600' },
              { city: 'Pune', tags: 'Software • AI/ML • Engineering', color: 'text-rose-600' }
            ].map((item) => (
              <div
                key={item.city}
                onClick={() => setActiveTab('internships')}
                className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${item.color}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{item.city}</h4>
                    <p className="text-[10px] text-slate-500">{item.tags}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
            
            <p className="text-[11px] text-center text-slate-500 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
              {t('moreCities', 'And 100+ more cities across India')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI-POWERED INTERNSHIP RECOMMENDATIONS FEATURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Student Image with Organic Green Shape */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-xl bg-emerald-50 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                alt="Students collaborating on laptop"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
            </div>
            {/* Soft Green Decorative Backdrop Wave */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Right Text & Feature Pills */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {t('aiPoweredBadge', 'AI-POWERED')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-2">
                {t('aiPoweredRecommendationsTitle', 'AI-Powered Internship Recommendations')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg pt-2 leading-relaxed font-medium">
                {t('aiPoweredRecommendationsSub', 'Our advanced AI analyzes your skills, education, interests and career goals to find the perfect internships for you.')}
              </p>
            </div>

            {/* 4 Feature Pills matching screenshot */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('smartMatching', 'Smart Matching')}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('skillAnalysis', 'Skill Analysis')}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('careerInsights', 'Career Insights')}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('personalizedFeed', 'Personalized Feed')}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('ai-recommendation')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>{t('getAiRecommendations', 'Get AI Recommendations')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai-resume-tailor')}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                title="Open AI ATS Resume Tailor & Live Optimizer"
              >
                <Wand2 className="w-4 h-4" />
                <span>{t('aiResumeTailorNav', 'AI ATS Resume Tailor')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai-interview')}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>{t('startAiInterview', 'Start AI Interview')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. ALL AI SUITE & PORTAL LAUNCHPAD CARDS (WHITE CARDS WITH TOP PILL BARS) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-1 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {t('platformCapabilitiesTitle', 'COMPLETE CAREER INTELLIGENCE SUITE')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
            {t('platformCapabilitiesSubtitle', 'All AI Engines & Portal Desks')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 0: AI ATS Resume Tailor */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-indigo-600 flex items-center px-3.5 text-white shadow-xs">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('aiResumeTailorTitle', 'AI ATS Resume Tailor')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('aiResumeTailorDesc', 'Job-tailored resume optimizer, keyword matching engine, live ATS preview, multi-template PDF exporter & AI bullet rewriter.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-resume-tailor')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('aiResumeTailorNav', 'AI ATS Resume Tailor')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 1: Interview AI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-teal-600 flex items-center px-3.5 text-white shadow-xs">
                <Mic className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('interviewAiTitle', 'Interview AI')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('interviewAiDesc', 'HR, Technical, Coding & Mixed mocks with scoring and PDF reports.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-interview')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-teal-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('interviewAiTitle', 'Interview AI')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Portfolio AI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-amber-600 flex items-center px-3.5 text-white shadow-xs">
                <FileSearch className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('portfolioAiTitle', 'Portfolio AI')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('portfolioAiDesc', 'GitHub, LinkedIn, portfolio site and resume ATS scoring.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-portfolio')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-amber-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('portfolioAiTitle', 'Portfolio AI')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: AI Fraud Detection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-rose-600 flex items-center px-3.5 text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('fraudAiTitle', 'AI Fraud Detection')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('fraudAiDesc', 'Trust score on every internship post with admin review.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-fraud')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('fraudDesk', 'Fraud Desk')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Resume Parser */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-blue-600 flex items-center px-3.5 text-white shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('step1Title', 'Resume Parser')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('resumeParserDesc', 'Auto-extract skills and fill your profile.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('resume-parser')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('parseResume', 'Parse Resume')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Explainable Insights & Skill Gap */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-emerald-600 flex items-center px-3.5 text-white shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('insightsTitle', 'Skill Gap & Roadmap')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('insightsDesc', 'Contribution breakdown, missing skills, roadmap & selection chances.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-skill-gap')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-emerald-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('aiSkillGapNav', 'Skill Gap Roadmap')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: AI Smart Recommendations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-indigo-600 flex items-center px-3.5 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('aiRecommendation', 'Top 20 AI Recommendation Match')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('aiRecCardDesc', 'Gemini AI match score based on college branch, skills & preferences.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ai-recommendation')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('tryAiRecommendation', 'Try AI Recommendation')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 7: Student Portal & Gamification */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-sky-600 flex items-center px-3.5 text-white shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('studentPortal', 'Student Portal')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('studentPortalCardDesc', 'Track active applications, streak days, XP level & download certificates.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('studentPortal', 'Student Portal')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 8: Employer & Recruiter Portal */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-slate-800 flex items-center px-3.5 text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('recruiterPortalNav', 'Employer & Recruiter Portal')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('recruiterPortalDesc', 'Post openings, review applicants & manage candidate shortlists.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('company-dashboard')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('employerAccess', 'Employer Access')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 9: Browse All Internships */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-cyan-600 flex items-center px-3.5 text-white shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('exploreAllInternships', 'Explore All Internships')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('browseAllDesc', 'Search across 1,850+ active positions by location, domain & stipend.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('internships')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-cyan-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('browseOpportunities', 'Browse Opportunities')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 10: Messaging & Reviews */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-purple-600 flex items-center px-3.5 text-white shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('messagingReviewsTitle', 'Messaging & Reviews')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('messagingReviewsDesc', 'Chat with companies and leave verified employer ratings.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-purple-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('messages', 'Messages')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 11: Platform Analytics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-violet-600 flex items-center px-3.5 text-white shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('platformAnalyticsTitle', 'Platform Analytics')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('platformAnalyticsDesc', 'State-wise application statistics, domain demand & scheme metrics.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-violet-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('viewAnalytics', 'View Analytics')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 12: Ministry Admin Desk */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-full h-11 rounded-2xl bg-slate-950 flex items-center px-3.5 text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('ministryAdminDeskTitle', 'Ministry Admin Desk')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('ministryAdminDeskDesc', 'MCA official oversight, employer verification & quota allocations.')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="text-xs font-bold text-indigo-950 dark:text-indigo-400 hover:text-amber-600 transition flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>{t('adminDesk', 'Admin Desk')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. OUR TOP RECRUITERS (AUTO-SCROLLING CONTINUOUS CAROUSEL - MATCHING IMAGE 1) */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6">
        
        {/* Banner Title with horizontal line and dots matching Image 1 exactly */}
        <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto py-3">
          {/* Horizontal line with end dots */}
          <div className="absolute inset-0 flex items-center px-1 sm:px-4">
            <div className="w-full border-t-[1.5px] border-[#081845] dark:border-blue-400 relative flex items-center justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-[#081845] dark:bg-blue-400 -ml-1 shadow-xs"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#081845] dark:bg-blue-400 -mr-1 shadow-xs"></div>
            </div>
          </div>

          {/* Center Dark Blue Ribbon Badge */}
          <div className="relative z-10 bg-[#081845] dark:bg-blue-950 text-white font-extrabold text-sm sm:text-lg tracking-widest uppercase px-6 sm:px-12 py-2 rounded-md shadow-md flex items-center justify-center">
            {t('leadingCompanies', "INDIA'S LEADING COMPANIES")}
          </div>
        </div>

        {/* Outer Scroll Container with Chevron Controls */}
        <div className="relative max-w-6xl mx-auto py-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCompanies('left')}
            aria-label="Scroll left"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Continuous Auto-Scrolling Marquee Track */}
          <div className="w-full overflow-hidden py-3 rounded-2xl px-2">
            <div
              ref={companyScrollRef}
              className="flex items-center gap-4 overflow-x-auto scroll-smooth py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[...leadingCompanies, ...leadingCompanies, ...leadingCompanies, ...leadingCompanies].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  onClick={() => setActiveTab('internships')}
                  className="w-[165px] sm:w-[175px] h-[115px] sm:h-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-center shrink-0 shadow-2xs hover:shadow-md hover:border-blue-400 hover:scale-105 transition-all duration-200 cursor-pointer group overflow-hidden"
                >
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition duration-200">
                    <CompanyLogoItem company={company} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCompanies('right')}
            aria-label="Scroll right"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 5. EXPLORE OPPORTUNITIES ACROSS INDIA (CITY CARDS GRID & MAP - MATCHING IMAGE 2 EXACTLY) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('exploreAcrossIndia', 'Explore Opportunities Across India')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('exploreAcrossIndiaSub', 'Discover top internship hubs across key industrial and tech corridors')}
          </p>
        </div>

        {/* India Map Card matching Image 2 exactly */}
        <div className="bg-[#F0F4FA] dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xs relative overflow-hidden flex flex-col items-center justify-center my-6">
          <div className="relative w-full max-w-lg h-[280px] sm:h-[340px] flex items-center justify-center">
            {/* India Map Silhouette */}
            <svg viewBox="0 0 400 480" className="w-full h-full text-[#D4E0F0] dark:text-slate-800/90 fill-current drop-shadow-2xs">
              <path d="M 200 15 C 195 25, 205 35, 197 45 C 185 50, 180 40, 170 50 C 175 65, 185 70, 180 80 C 170 85, 160 80, 150 90 C 140 100, 130 110, 125 125 C 120 140, 130 155, 115 165 C 105 170, 85 170, 80 180 C 85 190, 105 195, 115 195 C 125 195, 130 185, 140 190 C 145 200, 135 210, 130 220 C 135 230, 145 235, 150 245 C 155 255, 160 270, 170 285 C 180 300, 190 315, 195 330 C 200 345, 203 365, 207 375 C 211 365, 215 345, 220 330 C 230 315, 240 295, 245 280 C 250 265, 255 250, 245 240 C 235 230, 240 220, 250 215 C 260 210, 275 215, 285 205 C 295 195, 305 185, 310 175 C 300 170, 290 175, 280 165 C 270 155, 260 145, 250 155 C 240 160, 230 165, 220 155 C 210 145, 215 130, 205 120 C 200 110, 205 90, 195 80 C 192 65, 192 60, 190 55 Z" />
            </svg>

            {/* Delhi NCR Badge */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="absolute top-[20%] left-[41%] bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg transition z-10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></div>
              <span className="font-extrabold text-xs sm:text-sm text-[#2563EB] dark:text-blue-400">Delhi NCR</span>
            </div>

            {/* Mumbai Badge */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="absolute top-[46%] left-[28%] bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg transition z-10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
              <span className="font-extrabold text-xs sm:text-sm text-[#D97706] dark:text-amber-400">Mumbai</span>
            </div>

            {/* Hyderabad Badge */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="absolute top-[54%] left-[48%] bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg transition z-10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></div>
              <span className="font-extrabold text-xs sm:text-sm text-[#4F46E5] dark:text-indigo-400">Hyderabad</span>
            </div>

            {/* Bengaluru Badge */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="absolute top-[68%] left-[43%] bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg transition z-10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
              <span className="font-extrabold text-xs sm:text-sm text-[#059669] dark:text-emerald-400">Bengaluru</span>
            </div>

            {/* Chennai Badge */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="absolute top-[73%] left-[53%] bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg transition z-10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]"></div>
              <span className="font-extrabold text-xs sm:text-sm text-[#9333EA] dark:text-purple-400">Chennai</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityOpportunities.map((city) => (
            <div
              key={city.name}
              onClick={() => setActiveTab('internships')}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition duration-200 cursor-pointer"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={city.image}
                  alt={city.name}
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/50">
                  {city.openings}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition">
                  {city.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{city.tags}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('internships')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('viewAllLocations', 'View All Locations')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. WHAT STUDENTS SAY (INTERACTIVE TESTIMONIALS CAROUSEL WITH PREV/NEXT BUTTONS) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('whatStudentsSay', 'What Students Say')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('whatStudentsSaySub', 'Real stories from PM Scheme interns placed in top Indian companies')}
          </p>
        </div>

        {/* Carousel Container with Side Controls */}
        <div className="relative">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevTestimonial}
            aria-label="Previous Testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-amber-400 hover:border-amber-400 hover:text-slate-950 shadow-xl flex items-center justify-center transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextTestimonial}
            aria-label="Next Testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-amber-400 hover:border-amber-400 hover:text-slate-950 shadow-xl flex items-center justify-center transition cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 sm:px-4">
            {[
              testimonials[activeTestimonial],
              testimonials[(activeTestimonial + 1) % testimonials.length],
              testimonials[(activeTestimonial + 2) % testimonials.length]
            ].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={`p-6 bg-white dark:bg-slate-900 border rounded-3xl shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between ${
                  index === 0
                    ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02] shadow-xl'
                    : 'border-slate-200 dark:border-slate-800 opacity-90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Quote className="w-8 h-8 text-amber-400/60" />
                    <div className="flex items-center text-amber-400 text-xs">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed font-medium">
                    {item.quote}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    loading="eager"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{item.name}</h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTestimonial(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeTestimonial === idx ? 'bg-amber-500 w-8' : 'bg-slate-300 dark:bg-slate-700 w-2.5 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE CITIZEN SERVICES & ACTION TOOLS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-700 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {t('citizenServicesBadge', 'Interactive Citizen Services')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                {t('officialToolsHubTitle', 'Official PM Scheme Tools & Verification Hub')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-medium">
              {t('officialToolsHubSub', 'Check 100% eligibility clearance, calculate monthly stipends & grants, test skill readiness, and download digital certificates.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tool 1 */}
            <button
              type="button"
              onClick={openEligibilityModal}
              className="p-4 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-300 rounded-2xl text-left transition space-y-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 transition">
                  {t('eligibilityCheckerTitle', 'Scheme Eligibility Checker')}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight pt-1">
                  {t('eligibilityCheckerDesc', 'Instant 5-point MCA eligibility test & clearance pass.')}
                </p>
              </div>
            </button>

            {/* Tool 2 */}
            <button
              type="button"
              onClick={openStipendModal}
              className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 border border-indigo-300 rounded-2xl text-left transition space-y-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 transition">
                  {t('stipendCalculatorTitle', 'Stipend & Budget Calculator')}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight pt-1">
                  {t('stipendCalculatorDesc', 'Compute ₹5,000/mo allowance + ₹6,000 grant.')}
                </p>
              </div>
            </button>

            {/* Tool 3 */}
            <button
              type="button"
              onClick={openQuizModal}
              className="p-4 bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100 border border-teal-300 rounded-2xl text-left transition space-y-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 transition">
                  {t('skillQuizTitle', 'Skill Readiness Quiz')}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight pt-1">
                  {t('skillQuizDesc', 'Test AI & tech skills and earn +250 XP.')}
                </p>
              </div>
            </button>

            {/* Tool 4 */}
            <button
              type="button"
              onClick={openCertModal}
              className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 rounded-2xl text-left transition space-y-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition">
                  {t('pmCertificateTitle', 'Official PM Certificate')}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight pt-1">
                  {t('pmCertificateDesc', 'Generate & download digital registration pass.')}
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
