import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageInfo } from '../translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const GOOGLE_TRANSLATE_LANG_MAP: Record<LanguageCode, string> = {
  EN: 'en',
  HI: 'hi',
  TE: 'te',
  TA: 'ta',
  KN: 'kn',
  ML: 'ml',
  MR: 'mr',
  BN: 'bn',
  GU: 'gu',
  OR: 'or',
  PA: 'pa',
  AS: 'as',
  UR: 'ur',
  SA: 'sa',
  NE: 'ne',
  MAI: 'mai',
  KOK: 'gom',
  KS: 'ks',
  SD: 'sd',
  DOI: 'hi',
  MNI: 'bn',
  BRX: 'hi',
  SAT: 'hi',
};

export const syncGoogleTranslate = (langCode: LanguageCode) => {
  const googleTarget = GOOGLE_TRANSLATE_LANG_MAP[langCode] || 'en';

  try {
    const hostname = window.location.hostname;
    
    if (googleTarget === 'en') {
      // Strictly clear googtrans cookie when English is default/selected so Google Translate will NOT auto-translate
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=;';
      if (hostname) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      }
    } else {
      const cookieValue = `/en/${googleTarget}`;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      if (hostname && hostname !== 'localhost') {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;
      }
    }

    const applyTranslation = () => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectEl) {
        const targetVal = googleTarget === 'en' ? '' : googleTarget;
        if (selectEl.value !== targetVal) {
          selectEl.value = targetVal;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };

    applyTranslation();
    setTimeout(applyTranslation, 300);
    setTimeout(applyTranslation, 800);
  } catch (err) {
    console.warn('Language script sync:', err);
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // STRICT RULE: Default language is ALWAYS English ('EN')
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem('language');
      if (stored && ['EN', 'HI', 'TE', 'TA', 'KN', 'ML', 'MR', 'BN', 'GU', 'OR', 'PA', 'AS', 'UR', 'SA', 'NE', 'MAI', 'KOK', 'KS', 'SD', 'DOI', 'MNI', 'BRX', 'SAT'].includes(stored)) {
        return stored as LanguageCode;
      }
    } catch {}
    return 'EN';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = (GOOGLE_TRANSLATE_LANG_MAP[language] || language).toLowerCase();
    syncGoogleTranslate(language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    syncGoogleTranslate(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.EN;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = TRANSLATIONS.EN;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'EN',
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
