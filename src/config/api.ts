const RENDER_BACKEND_URL = 'https://pm-internships-kq5h.onrender.com';

function normalizeBaseUrl(url?: string): string {
  return (url || '').trim().replace(/\/+$/, '');
}

/**
 * Resolves the backend API base URL across environments:
 * 1. Uses VITE_API_URL when explicitly configured (unless mispointed at a Vercel static host).
 * 2. Automatically routes Vercel-hosted frontends (e.g. pm-internships-five.vercel.app)
 *    to the Render Express backend (https://pm-internships-kq5h.onrender.com).
 * 3. Uses same-origin ('') for local dev (localhost:3000), AI Studio, and direct Render hosting.
 */
export function getApiBaseUrl(): string {
  const configured = normalizeBaseUrl(import.meta.env.VITE_API_URL as string | undefined);
  if (configured && !configured.toLowerCase().includes('.vercel.app')) {
    return configured;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.endsWith('.vercel.app')) {
      return RENDER_BACKEND_URL;
    }
  }

  return '';
}

export const API_BASE_URL = getApiBaseUrl();

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
