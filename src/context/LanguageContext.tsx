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
    const cookieValue = googleTarget === 'en' ? '' : `/en/${googleTarget}`;

    document.cookie = `googtrans=${cookieValue}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;
    }

    const applyTranslation = () => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectEl) {
        if (selectEl.value !== googleTarget) {
          selectEl.value = googleTarget;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };

    applyTranslation();
    setTimeout(applyTranslation, 300);
    setTimeout(applyTranslation, 800);
    setTimeout(applyTranslation, 1600);
  } catch (err) {
    console.warn('Language script sync:', err);
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('language') as LanguageCode) || 'EN';
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
