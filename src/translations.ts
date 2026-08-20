import { en } from './translations/en';
import { te } from './translations/te';
import { hi } from './translations/hi';
import { ta } from './translations/ta';
import { kn } from './translations/kn';
import { mr } from './translations/mr';
import { bn } from './translations/bn';
import { gu } from './translations/gu';

export type LanguageCode = 'EN' | 'HI' | 'TE' | 'TA' | 'KN' | 'MR' | 'BN' | 'GU';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag?: string;
}

export type Language = LanguageInfo;

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'TE', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'TA', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'KN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'MR', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'GU', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
];

export const LANGUAGES = SUPPORTED_LANGUAGES;

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: en,
  HI: hi,
  TE: te,
  TA: ta,
  KN: kn,
  MR: mr,
  BN: bn,
  GU: gu,
};

export type TranslationKey = keyof typeof en;

export function getTranslation(lang: string, key: TranslationKey | string): string {
  const code = (lang as LanguageCode) || 'EN';
  const dict = TRANSLATIONS[code] || TRANSLATIONS.EN;
  return dict[key] || TRANSLATIONS.EN[key] || key;
}
