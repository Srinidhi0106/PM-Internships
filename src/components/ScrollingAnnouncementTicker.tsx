import React, { useState } from 'react';
import {
  Megaphone,
  Pause,
  Play,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  tag: string;
  tagBg: string;
  tagText: string;
  title: string;
  text: string;
  targetTab?: string;
  isNew?: boolean;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    tag: 'LATEST',
    tagBg: 'bg-amber-500 text-slate-950',
    tagText: 'text-amber-500',
    title: 'PM Internship Scheme 2026 Phase-2',
    text: 'Phase-2 online registrations are now LIVE across all 28 States and 8 Union Territories in India.',
    targetTab: 'internships',
    isNew: true
  },
  {
    id: 'ann-2',
    tag: '1.25 LAKH+ JOBS',
    tagBg: 'bg-emerald-600 text-white',
    tagText: 'text-emerald-500',
    title: '500 Top Companies Partnered',
    text: 'Over 1,25,000 opportunities in Tata, Reliance, Infosys, Mahindra, L&T, HDFC, Airtel, and leading PSUs.',
    targetTab: 'internships',
    isNew: true
  },
  {
    id: 'ann-3',
    tag: 'STIPEND',
    tagBg: 'bg-indigo-600 text-white',
    tagText: 'text-indigo-400',
    title: '₹5,000/Month DBT + ₹6,000 Grant',
    text: '₹4,500 Govt DBT + ₹500 Company CSR credited directly to Aadhaar-linked bank accounts monthly.',
    targetTab: 'about',
    isNew: false
  },
  {
    id: 'ann-4',
    tag: 'ELIGIBILITY',
    tagBg: 'bg-purple-600 text-white',
    tagText: 'text-purple-400',
    title: 'Age 21-24 Years',
    text: '10th pass, 12th pass, ITI, Polytechnic Diploma, BA, B.Sc, B.Com, B.Tech, and BCA graduates can apply.',
    targetTab: 'about',
    isNew: false
  },
  {
    id: 'ann-5',
    tag: 'AI ENGINE',
    tagBg: 'bg-teal-600 text-white',
    tagText: 'text-teal-400',
    title: 'Smart Matching & ATS Scoring',
    text: 'Experience instant AI skill-gap roadmaps, multilingual speech assistant, and automated ATS resume tailoring.',
    targetTab: 'ai-recommendation',
    isNew: true
  },
  {
    id: 'ann-6',
    tag: 'DEADLINE',
    tagBg: 'bg-rose-600 text-white',
    tagText: 'text-rose-400',
    title: 'Cycle Closes 30th Sept 2026',
    text: 'Submit and lock your preferences before the national deadline to ensure merit-list consideration.',
    targetTab: 'internships',
    isNew: true
  },
  {
    id: 'ann-7',
    tag: 'ZERO FEE',
    tagBg: 'bg-slate-700 text-white',
    tagText: 'text-slate-400',
    title: '100% Free Government Portal',
    text: 'Ministry of Corporate Affairs charges ZERO fees. Beware of fake recruitment agents and scam links.',
    targetTab: 'ai-fraud',
    isNew: false
  },
  {
    id: 'ann-8',
    tag: 'HELPLINE',
    tagBg: 'bg-blue-600 text-white',
    tagText: 'text-blue-400',
    title: 'National Toll-Free Support',
    text: 'Call 1800-11-2026 (Mon-Sat 9:00 AM - 6:00 PM IST) for grievance redressal and candidate assistance.',
    targetTab: 'contact',
    isNew: false
  }
];

interface ScrollingAnnouncementTickerProps {
  onNavigate?: (tab: string) => void;
  variant?: 'navbar' | 'section';
  className?: string;
}

export const ScrollingAnnouncementTicker: React.FC<ScrollingAnnouncementTickerProps> = ({
  onNavigate,
  variant = 'navbar',
  className = ''
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const handleItemClick = (targetTab?: string) => {
    if (targetTab && onNavigate) {
      onNavigate(targetTab);
    }
  };

  const isNavbar = variant === 'navbar';

  return (
    <div
      className={`relative w-full overflow-hidden select-none border-b z-20 ${
        isNavbar
          ? 'bg-amber-500/10 dark:bg-slate-900/95 border-amber-300/60 dark:border-amber-900/40 text-slate-800 dark:text-slate-200 py-1.5'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm py-2 px-3 my-4'
      } ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
        {/* Left Badge / Pill Indicator */}
        <div className="shrink-0 flex items-center gap-2 pr-3 border-r border-amber-300 dark:border-slate-700 z-10 bg-amber-500/10 dark:bg-slate-900/95">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-xs">
            <Megaphone className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="hidden xs:inline">Updates &amp; Announcements</span>
            <span className="xs:hidden">Updates</span>
          </span>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>

          {/* Pause / Play Control Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-500" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* Continuous Scrolling Text Marquee Track */}
        <div className="relative flex-1 overflow-hidden ml-3">
          <div
            className="flex items-center whitespace-nowrap animate-marquee"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: '42s'
            }}
          >
            {/* Primary Items Group */}
            <div className="flex items-center space-x-6 sm:space-x-8 shrink-0 pr-6 sm:pr-8">
              {ANNOUNCEMENTS.map((item) => (
                <div
                  key={`orig-${item.id}`}
                  onClick={() => handleItemClick(item.targetTab)}
                  className={`inline-flex items-center gap-2 text-xs font-semibold group cursor-pointer transition py-0.5 px-2 rounded-lg hover:bg-amber-100/70 dark:hover:bg-slate-800/80`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.tagBg} shrink-0`}
                  >
                    {item.tag}
                  </span>

                  {item.isNew && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white animate-pulse">
                      NEW
                    </span>
                  )}

                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {item.title}:
                  </span>

                  <span className="text-slate-600 dark:text-slate-300 font-normal">
                    {item.text}
                  </span>

                  {item.targetTab && (
                    <span className="inline-flex items-center text-[10px] text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition">
                      <ArrowRight className="w-3 h-3 inline ml-0.5" />
                    </span>
                  )}

                  <span className="text-slate-300 dark:text-slate-700 ml-3">•</span>
                </div>
              ))}
            </div>

            {/* Seamless Duplicated Items Group for Infinite Smooth Loop */}
            <div className="flex items-center space-x-6 sm:space-x-8 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
              {ANNOUNCEMENTS.map((item) => (
                <div
                  key={`dup-${item.id}`}
                  onClick={() => handleItemClick(item.targetTab)}
                  className={`inline-flex items-center gap-2 text-xs font-semibold group cursor-pointer transition py-0.5 px-2 rounded-lg hover:bg-amber-100/70 dark:hover:bg-slate-800/80`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.tagBg} shrink-0`}
                  >
                    {item.tag}
                  </span>

                  {item.isNew && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white animate-pulse">
                      NEW
                    </span>
                  )}

                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {item.title}:
                  </span>

                  <span className="text-slate-600 dark:text-slate-300 font-normal">
                    {item.text}
                  </span>

                  {item.targetTab && (
                    <span className="inline-flex items-center text-[10px] text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition">
                      <ArrowRight className="w-3 h-3 inline ml-0.5" />
                    </span>
                  )}

                  <span className="text-slate-300 dark:text-slate-700 ml-3">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
