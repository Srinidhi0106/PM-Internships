import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  UserCheck,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Bot,
  Brain,
  ShieldAlert,
  FileText,
  Briefcase,
  BarChart3,
  LogOut,
  User as UserIcon,
  Search,
  CheckCircle2,
  ChevronDown,
  Bell,
  Clock,
  Film,
  Play
} from 'lucide-react';
import { User, UserRole } from '../types';
import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation } from '../translations';
import { LanguageDropdown } from './LanguageDropdown';
import { pmSchemeLogo, pmModiHeadshot } from '../assets/images';
import { useTimezone, SUPPORTED_TIMEZONES } from '../context/TimezoneContext';

interface HeaderNavbarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onRoleSwitch: (role: UserRole) => void;
  openVoiceSearch: () => void;
  openNotifications?: () => void;
  onLogout?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onRoleSwitch,
  openVoiceSearch,
  openNotifications,
  onLogout
}) => {
  const { timeFormat, setTimeFormat, timezone, setTimezone, selectedZone, currentTime } = useTimezone();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutToast, setLogoutToast] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
    setActiveTab('home');
    setLogoutToast(true);
    setTimeout(() => {
      setLogoutToast(false);
    }, 4000);
  };

  const navLinks = [
    { id: 'home', label: getTranslation(language, 'home') },
    { id: 'about', label: getTranslation(language, 'about') },
    { id: 'internships', label: getTranslation(language, 'internships') },
    { id: 'ai-recommendation', label: getTranslation(language, 'aiRecommendation') },
    { id: 'ai-resume-tailor', label: getTranslation(language, 'aiResumeTailorNav') || 'AI ATS Tailor (Video)' },
    { id: 'ai-interview', label: getTranslation(language, 'aiInterviewNav') },
    { id: 'ai-portfolio', label: getTranslation(language, 'aiPortfolioNav') },
    { id: 'ai-skill-gap', label: getTranslation(language, 'aiSkillGapNav') },
    { id: 'ai-fraud', label: getTranslation(language, 'aiFraudNav') },
    { id: 'resume-parser', label: getTranslation(language, 'resumeParserNav') },
    { id: 'messages', label: getTranslation(language, 'messagesNav') || 'Messages & Reviews' },
    { id: 'dashboard', label: getTranslation(language, 'studentPortal') },
    { id: 'company-dashboard', label: getTranslation(language, 'recruiterPortalNav') },
    { id: 'admin-dashboard', label: getTranslation(language, 'ministryDeskNav') },
    { id: 'analytics', label: getTranslation(language, 'analytics') },
    { id: 'contact', label: getTranslation(language, 'contact') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Government Strip */}
      <div className="bg-gradient-to-r from-amber-600 via-white to-emerald-600 h-1 w-full" />
      <div className="bg-slate-100 dark:bg-slate-950 px-4 py-1 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
            <span className="text-amber-600">🇮🇳</span> {getTranslation(language, 'govIndia')}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline font-medium">{getTranslation(language, 'mca')}</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-emerald-600 dark:text-emerald-400 font-semibold">{getTranslation(language, 'pmScheme')}</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live World Clock & Timezone Switcher */}
          <div className="relative">
            <button
              onClick={() => setTimezoneDropdownOpen(!timezoneDropdownOpen)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer"
              title="Change Time Format (12h/24h) & Multi-Country Timezones"
            >
              <Clock className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="font-mono text-slate-900 dark:text-white font-bold">{currentTime}</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">({selectedZone.id})</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {timezoneDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2.5 z-50 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Time & Zone Config</span>
                  </span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-md p-0.5">
                    <button
                      onClick={() => setTimeFormat('12h')}
                      className={`px-1.5 py-0.5 text-[10px] font-black rounded ${timeFormat === '12h' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-500'}`}
                    >
                      12H
                    </button>
                    <button
                      onClick={() => setTimeFormat('24h')}
                      className={`px-1.5 py-0.5 text-[10px] font-black rounded ${timeFormat === '24h' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-500'}`}
                    >
                      24H
                    </button>
                  </div>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 block px-1">Interviewer & Local Zones:</span>
                  {SUPPORTED_TIMEZONES.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setTimezone(zone.id);
                        setTimezoneDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${
                        timezone === zone.id ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold">{zone.id}</span>{' '}
                        <span className="text-[11px] text-slate-400">({zone.offset})</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{zone.city}</p>
                      </div>
                      {timezone === zone.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('contest-showcase')}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-300 hover:text-amber-950 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 transition cursor-pointer shadow-2xs"
            title="View Real Time Project Contest Deliverables & SRS Documentation"
          >
            <CheckCircle2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Contest Showcase & SRS</span>
          </button>

          <button
            onClick={openVoiceSearch}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800"
          >
            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
            <span>{getTranslation(language, 'voiceAssistant')}</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-slate-50"
            >
              <UserCheck className="w-3 h-3 text-amber-500" />
              <span className="capitalize">
                {user.role === 'student' ? getTranslation(language, 'studentView') : user.role === 'company' ? getTranslation(language, 'companyView') : getTranslation(language, 'adminView')}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                <button
                  onClick={() => { onRoleSwitch('student'); setRoleDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${user.role === 'student' ? 'font-bold text-indigo-600' : ''}`}
                >
                  <span>{getTranslation(language, 'studentView')}</span>
                  {user.role === 'student' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                </button>
                <button
                  onClick={() => { onRoleSwitch('company'); setRoleDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${user.role === 'company' ? 'font-bold text-emerald-600' : ''}`}
                >
                  <span>{getTranslation(language, 'companyView')}</span>
                  {user.role === 'company' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </button>
                <button
                  onClick={() => { onRoleSwitch('admin'); setRoleDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${user.role === 'admin' ? 'font-bold text-amber-600' : ''}`}
                >
                  <span>{getTranslation(language, 'adminView')}</span>
                  {user.role === 'admin' && <CheckCircle2 className="w-3 h-3 text-amber-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo and Emblem */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* PM Circular Badge Emblem Logo */}
          <div className="w-11 h-11 rounded-full shadow-md flex items-center justify-center relative overflow-hidden shrink-0">
            <img
              src={pmSchemeLogo}
              alt="PM Internship Scheme Official Emblem Logo"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                {getTranslation(language, 'govIndia')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {getTranslation(language, 'mca')} • <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{getTranslation(language, 'pmScheme')}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons & PM Modi Photo */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('company-register')}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {getTranslation(language, 'partnerWithUs')}
          </button>
          
          <button
            onClick={() => setActiveTab('internships')}
            className="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition"
          >
            {getTranslation(language, 'applyNow')}
          </button>

          {/* PM Modi Photo Frame */}
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs shrink-0 bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
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
            <div className="text-[10px] leading-tight text-slate-600 dark:text-slate-400 hidden xl:block">
              <p className="uppercase text-[9px] text-amber-600 dark:text-amber-400 font-bold">{getTranslation(language, 'pmTitle')}</p>
              <p className="font-extrabold text-slate-900 dark:text-slate-200">{getTranslation(language, 'pmName')}</p>
            </div>
          </div>

          {/* Multi-Language Dropdown Switcher */}
          <LanguageDropdown variant="desktop" />

          {/* Notification Hub Trigger */}
          {openNotifications && (
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Multi-Channel Notifications (Email, SMS, Push)"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Separate Login and Register Buttons / User Profile */}
          <div className="flex items-center gap-1.5">
            {user && user.id !== 'guest' ? (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs rounded-lg transition shadow-2xs cursor-pointer border border-indigo-700"
                title={`Authenticated Email: ${user.email || 'Verified'}`}
              >
                <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight text-[11px]">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 leading-none">
                    <span>✓</span> {user.email ? user.email.split('@')[0] : 'Verified'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('auth-login')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs rounded-lg transition shadow-2xs cursor-pointer"
                title="Sign in to your portal account"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-200" />
                <span>{getTranslation(language, 'login')}</span>
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('auth-register')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-2xs cursor-pointer"
              title="Register a new student, recruiter, or officer account"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-100" />
              <span>{getTranslation(language, 'register')}</span>
            </button>
          </div>

          {/* Desktop Red Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-xs transition cursor-pointer"
            title="Sign out of PM Internship Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'logout')}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden gap-2">
          {openNotifications && (
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Multi-Channel Notifications"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="hidden lg:block bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center space-x-1 py-1 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <li key={link.id} className="shrink-0">
                <button
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === link.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden xl:flex items-center space-x-2 text-xs font-medium text-slate-500 shrink-0 ml-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{getTranslation(language, 'livePortalText')}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setActiveTab('internships'); setMobileMenuOpen(false); }}
              className="px-2 py-2 bg-amber-500 text-slate-950 font-extrabold text-[11px] rounded-lg text-center shadow-2xs cursor-pointer"
            >
              {getTranslation(language, 'applyNow')}
            </button>
            <button
              onClick={() => { setActiveTab('auth-login'); setMobileMenuOpen(false); }}
              className="px-2 py-2 bg-indigo-900 text-white font-extrabold text-[11px] rounded-lg text-center shadow-2xs cursor-pointer"
            >
              {getTranslation(language, 'login')}
            </button>
            <button
              onClick={() => { setActiveTab('auth-register'); setMobileMenuOpen(false); }}
              className="px-2 py-2 bg-emerald-600 text-white font-extrabold text-[11px] rounded-lg text-center shadow-2xs cursor-pointer"
            >
              {getTranslation(language, 'register')}
            </button>
          </div>

          <button
            onClick={() => { setActiveTab('contest-showcase'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Contest Showcase, Benchmarks & SRS</span>
          </button>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider mb-1 px-2">Core Navigation</p>
              <ul className="space-y-1">
                {navLinks.filter(l => ['home', 'about', 'internships', 'messages', 'analytics', 'contact'].includes(l.id)).map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                        activeTab === link.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider mb-1 px-2">AI Career Tools</p>
              <ul className="space-y-1">
                {navLinks.filter(l => ['ai-recommendation', 'ai-resume-tailor', 'ai-interview', 'ai-portfolio', 'ai-fraud', 'resume-parser'].includes(l.id)).map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                        activeTab === link.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-black">AI</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider mb-1 px-2">Role Portals</p>
              <ul className="space-y-1">
                {navLinks.filter(l => ['dashboard', 'company-dashboard', 'admin-dashboard'].includes(l.id)).map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                        activeTab === link.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>Select Language:</span>
            </span>
            <LanguageDropdown variant="fullWidth" />
          </div>

          {/* Last Red Logout Button in Menu Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{getTranslation(language, 'logout')} ({user && user.name ? user.name.split(' ')[0] : 'User'})</span>
            </button>
          </div>
        </div>
      )}

      {/* USER-FRIENDLY LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/80 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-200 dark:border-red-800">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{getTranslation(language, 'signOutModalTitle')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {getTranslation(language, 'signOutConfirmDesc')} <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name}</span> ({user?.role})?
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-left space-y-1 text-xs border border-slate-200 dark:border-slate-700/60">
              <p className="text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300">{getTranslation(language, 'emailLabel')}:</span> {user?.email}</p>
              <p className="text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300">{getTranslation(language, 'statusLabel')}:</span> {getTranslation(language, 'verifiedOfficialAccount')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {getTranslation(language, 'cancelBtn')}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'yesLogOut')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT TOAST BANNER */}
      {logoutToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            ✓
          </div>
          <div>
            <p className="text-white font-extrabold">Logged Out Successfully</p>
            <p className="text-slate-400 text-[11px] font-normal">You can log back in anytime with Google or your credentials.</p>
          </div>
        </div>
      )}
    </header>
  );
};
