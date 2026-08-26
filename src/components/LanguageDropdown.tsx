import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X, CheckCircle2 } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, LanguageInfo } from '../translations';
import { useLanguage } from '../context/LanguageContext';

interface LanguageDropdownProps {
  variant?: 'desktop' | 'mobile' | 'fullWidth' | 'footer' | 'compact';
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ variant = 'desktop', className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query) ||
      (lang.region && lang.region.toLowerCase().includes(query))
    );
  });

  return (
    <div
      className={`relative inline-block text-left ${variant === 'fullWidth' ? 'w-full' : ''} ${className}`}
      ref={dropdownRef}
      id="language-selector-root"
    >
      {/* Trigger Button */}
      <button
        id="language-dropdown-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition cursor-pointer shadow-xs ${
          isOpen ? 'ring-2 ring-amber-500 border-amber-500' : ''
        } ${variant === 'fullWidth' ? 'w-full' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / भाषा बदलें (All 22 Indian Regional Languages + English)"
      >
        <span className="flex items-center gap-1.5 truncate">
          <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-sm shrink-0">{currentLang.flag}</span>
          <span className="truncate font-bold">{currentLang.nativeName}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
            ({currentLang.code})
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          className={`absolute z-[100] mt-1.5 w-80 max-w-[90vw] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            variant === 'fullWidth' ? 'left-0 right-0 w-full' : 'right-0'
          }`}
          style={{ maxHeight: '420px' }}
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-500/10 dark:from-slate-800 dark:to-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Select Language / भाषा चुनें
                </h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">All 22 Official Indian Languages + English</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
              {SUPPORTED_LANGUAGES.length} Languages
            </span>
          </div>

          {/* Search bar inside dropdown */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / भाषा खोजें (e.g. Hindi, Telugu, தமிழ்)..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-slate-200 dark:border-slate-700 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Language Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang: LanguageInfo) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    id={`lang-opt-${lang.code.toLowerCase()}`}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base shrink-0">{lang.flag}</span>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs ${isSelected ? 'font-black text-slate-950' : 'font-bold text-slate-900 dark:text-white'}`}>
                            {lang.nativeName}
                          </span>
                          <span
                            className={`text-[10px] ${
                              isSelected ? 'text-slate-950/80 font-bold' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            ({lang.name})
                          </span>
                        </div>
                        {lang.region && (
                          <p
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-slate-950/80 font-medium' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {lang.region}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {lang.code}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <p>No language found matching "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-amber-600 dark:text-amber-400 font-bold text-xs underline cursor-pointer"
                >
                  View all 23 languages
                </button>
              </div>
            )}
          </div>

          {/* Quick Footer hint */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Translates UI, Voice AI & Chatbot simultaneously
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
