import { en } from './translations/en';
import { te } from './translations/te';
import { hi } from './translations/hi';
import { ta } from './translations/ta';
import { kn } from './translations/kn';
import { mr } from './translations/mr';
import { bn } from './translations/bn';
import { gu } from './translations/gu';
import { ml } from './translations/ml';
import { or } from './translations/or';
import { pa } from './translations/pa';
import { as } from './translations/as';
import { ur } from './translations/ur';
import { sa } from './translations/sa';
import { ne } from './translations/ne';
import { mai } from './translations/mai';
import { kok } from './translations/kok';
import { ks } from './translations/ks';
import { sd } from './translations/sd';
import { doi } from './translations/doi';
import { mni } from './translations/mni';
import { brx } from './translations/brx';
import { sat } from './translations/sat';

export type LanguageCode =
  | 'EN'
  | 'HI'
  | 'TE'
  | 'TA'
  | 'KN'
  | 'ML'
  | 'MR'
  | 'BN'
  | 'GU'
  | 'OR'
  | 'PA'
  | 'AS'
  | 'UR'
  | 'SA'
  | 'NE'
  | 'MAI'
  | 'KOK'
  | 'KS'
  | 'SD'
  | 'DOI'
  | 'MNI'
  | 'BRX'
  | 'SAT';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag?: string;
  speechLocale: string;
  region?: string;
}

export type Language = LanguageInfo;

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧', speechLocale: 'en-IN', region: 'National / Global' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'North / Central India' },
  { code: 'TE', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechLocale: 'te-IN', region: 'Andhra Pradesh & Telangana' },
  { code: 'TA', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechLocale: 'ta-IN', region: 'Tamil Nadu & Puducherry' },
  { code: 'KN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechLocale: 'kn-IN', region: 'Karnataka' },
  { code: 'ML', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechLocale: 'ml-IN', region: 'Kerala & Lakshadweep' },
  { code: 'MR', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechLocale: 'mr-IN', region: 'Maharashtra & Goa' },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechLocale: 'bn-IN', region: 'West Bengal & Tripura' },
  { code: 'GU', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechLocale: 'gu-IN', region: 'Gujarat' },
  { code: 'OR', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', speechLocale: 'or-IN', region: 'Odisha' },
  { code: 'PA', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechLocale: 'pa-IN', region: 'Punjab & Chandigarh' },
  { code: 'AS', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', speechLocale: 'as-IN', region: 'Assam' },
  { code: 'UR', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', speechLocale: 'ur-IN', region: 'National' },
  { code: 'SA', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'Classical / Pan-India' },
  { code: 'NE', name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳', speechLocale: 'ne-NP', region: 'Sikkim & West Bengal' },
  { code: 'MAI', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'Bihar & Jharkhand' },
  { code: 'KOK', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', speechLocale: 'mr-IN', region: 'Goa & Coastal Karnataka' },
  { code: 'KS', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', flag: '🇮🇳', speechLocale: 'ur-IN', region: 'Jammu & Kashmir' },
  { code: 'SD', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'Western India' },
  { code: 'DOI', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'Jammu & Kashmir' },
  { code: 'MNI', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', speechLocale: 'bn-IN', region: 'Manipur' },
  { code: 'BRX', name: 'Bodo', nativeName: 'बड़ो', flag: '🇮🇳', speechLocale: 'as-IN', region: 'Assam & Northeast' },
  { code: 'SAT', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'Jharkhand & Odisha' },
];

export const LANGUAGES = SUPPORTED_LANGUAGES;

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: en,
  HI: hi,
  TE: te,
  TA: ta,
  KN: kn,
  ML: ml,
  MR: mr,
  BN: bn,
  GU: gu,
  OR: or,
  PA: pa,
  AS: as,
  UR: ur,
  SA: sa,
  NE: ne,
  MAI: mai,
  KOK: kok,
  KS: ks,
  SD: sd,
  DOI: doi,
  MNI: mni,
  BRX: brx,
  SAT: sat,
};

export type TranslationKey = keyof typeof en;

export function getTranslation(lang: string, key: TranslationKey | string): string {
  const code = (lang as LanguageCode) || 'EN';
  const dict = TRANSLATIONS[code] || TRANSLATIONS.EN;
  return dict[key] || TRANSLATIONS.EN[key] || key;
}

export function getSpeechLocaleByCode(code: string): string {
  const target = SUPPORTED_LANGUAGES.find(l => l.code === code.toUpperCase());
  return target?.speechLocale || 'en-IN';
}
