import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../translations';
import { useLanguage } from '../context/LanguageContext';

interface LanguageDropdownProps {
  variant?: 'desktop' | 'mobile' | 'fullWidth';
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ variant = 'desktop', className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${variant === 'fullWidth' ? 'w-full' : ''} ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition cursor-pointer shadow-2xs ${
          variant === 'fullWidth' ? 'w-full ring-1 ring-slate-300 dark:ring-slate-700' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-1.5 truncate">
          <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">{currentLang.flag} {currentLang.nativeName}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">({currentLang.code})</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
      </button>

      {/* Custom Dropdown Menu List */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            variant === 'fullWidth' ? 'left-0 right-0 w-full' : 'right-0'
          }`}
        >
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-500" />
              Select Application Language
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="text-xs">{lang.nativeName}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                      ({lang.name})
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
