import { useEffect, useState } from 'react';

export interface MobileAppConfig {
  published: boolean;
  androidPlayStoreUrl: string | null;
}

const KNOWN_PLACEHOLDER_PATTERNS = [
  'gov.in.mca.pminternship',
  'your_package',
  'example.com',
  'placeholder',
  'coming-soon'
];

export function sanitizePlayStoreUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'play.google.com' &&
      parsed.pathname.startsWith('/store/apps/details') &&
      Boolean(parsed.searchParams.get('id'))
    ) {
      const lower = trimmed.toLowerCase();
      if (KNOWN_PLACEHOLDER_PATTERNS.some((pattern) => lower.includes(pattern))) {
        return null;
      }
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function getStaticMobileAppConfig(): MobileAppConfig {
  const envUrl = sanitizePlayStoreUrl(import.meta.env.VITE_ANDROID_PLAY_STORE_URL as string | undefined);
  return {
    published: Boolean(envUrl),
    androidPlayStoreUrl: envUrl
  };
}

export function useMobileAppConfig(): MobileAppConfig {
  const [config, setConfig] = useState<MobileAppConfig>(() => getStaticMobileAppConfig());

  useEffect(() => {
    let active = true;
    fetch('/api/mobile-app/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const validUrl = sanitizePlayStoreUrl(data.androidPlayStoreUrl);
        if (validUrl) {
          setConfig({ published: true, androidPlayStoreUrl: validUrl });
        } else if (!config.androidPlayStoreUrl) {
          setConfig({ published: false, androidPlayStoreUrl: null });
        }
      })
      .catch(() => {
        // Keep static env-based config
      });
    return () => {
      active = false;
    };
  }, []);

  return config;
}
