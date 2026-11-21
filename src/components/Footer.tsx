import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Mail,
  Phone,
  MapPin,
  QrCode,
  Download,
  Smartphone,
  Check,
  Play,
  Copy,
  Clock,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pmSchemeLogo } from '../assets/images';
import { AppDownloadQRModal } from './AppDownloadQRModal';
import { useMobileAppConfig } from '../utils/mobileAppConfig';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { published, androidPlayStoreUrl } = useMobileAppConfig();
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!published || !androidPlayStoreUrl) {
      setQrDataUrl('');
      return;
    }

    let active = true;
    QRCode.toDataURL(androidPlayStoreUrl, {
      width: 420,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => console.error('Failed to generate Play Store QR code:', err));

    return () => {
      active = false;
    };
  }, [published, androidPlayStoreUrl]);

  const handleCopyPlayLink = () => {
    if (!published || !androidPlayStoreUrl) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(androidPlayStoreUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadQrPng = () => {
    if (!published || !qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'InternIQ_Google_Play_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative">
      {/* Tricolor Top Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] w-full" />

      {/* Brand & Social Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
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
            <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-2">
              <span>{t('heroSubHeading', 'InternIQ Career Intelligence')}</span>
            </h3>
            <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <span>Empowering India's Next Generation of Talent</span>
              <span>🇮🇳</span>
            </p>
          </div>
        </div>

        {/* Social Icons Bar */}
        <div className="flex items-center space-x-2.5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Official Facebook Page"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition shadow-xs group"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Official Twitter / X Profile"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition shadow-xs group"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Official LinkedIn Page"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition shadow-xs group"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Official Instagram Handle"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-rose-400 transition shadow-xs group"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Official YouTube Channel"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition shadow-xs group"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Prominent "Download InternIQ Mobile App" Section inside Footer */}
      <div className="max-w-7xl mx-auto px-4 py-7 border-b border-slate-800/80">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {published && androidPlayStoreUrl ? (
              <div className="w-24 h-24 bg-white p-1.5 rounded-2xl flex items-center justify-center shrink-0 shadow-md overflow-hidden border-2 border-amber-400/50">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="InternIQ Android App Google Play QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-12 h-12 text-slate-900" />
                )}
              </div>
            ) : (
              <div className="w-24 h-24 bg-slate-950 border-2 border-dashed border-amber-500/50 rounded-2xl flex flex-col items-center justify-center shrink-0 p-2 text-center">
                <Clock className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[10px] font-black text-amber-300 uppercase leading-tight">Coming Soon</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-sm sm:text-base font-black text-white">Download InternIQ Mobile App</span>
                {published && androidPlayStoreUrl ? (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Google Play Live
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                {published && androidPlayStoreUrl
                  ? 'Scan the QR code or use the actions to install the official InternIQ Android app from Google Play.'
                  : 'Native InternIQ Android application for Google Play is coming soon. No placeholder store link is generated until publication.'}
              </p>
            </div>
          </div>

          {/* Responsive Footer App Download Action Controls */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 shrink-0">
            {published && androidPlayStoreUrl ? (
              <>
                <a
                  href={androidPlayStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Download on Google Play</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyPlayLink}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Download Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  disabled={!qrDataUrl}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download QR (PNG)</span>
                </button>
              </>
            ) : (
              <span className="px-3.5 py-2 bg-slate-800/80 border border-slate-700 text-amber-300 text-xs font-black rounded-xl inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Google Play • Coming Soon</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('download-app')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App Page</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wide uppercase text-amber-400">Quick Links</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><button onClick={() => setActiveTab('contest-showcase')} className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">★ Contest Deliverables & SRS</button></li>
            <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition cursor-pointer">{t('home', 'Home')}</button></li>
            <li><button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition cursor-pointer">{t('about', 'About Scheme')}</button></li>
            <li><button onClick={() => setActiveTab('internships')} className="hover:text-amber-400 transition cursor-pointer">{t('internships', 'Explore Internships')}</button></li>
            <li><button onClick={() => setActiveTab('ai-recommendation')} className="hover:text-amber-400 transition cursor-pointer">{t('aiRecommendation', 'AI Recommendations')}</button></li>
            <li><button onClick={() => setActiveTab('ai-portfolio')} className="hover:text-amber-400 transition cursor-pointer">Portfolio & ATS</button></li>
            <li><button onClick={() => setActiveTab('ai-skill-gap')} className="hover:text-amber-400 transition cursor-pointer">Skill Gap & Roadmap</button></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wide uppercase text-amber-400">GovTech & Resources</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><button onClick={() => setActiveTab('download-app')} className="text-amber-400 font-bold hover:underline transition cursor-pointer">Download InternIQ Mobile App</button></li>
            <li><button onClick={() => setActiveTab('support-grievance')} className="text-emerald-400 font-bold hover:underline transition cursor-pointer">Support & Grievance Portal</button></li>
            <li><button onClick={() => setActiveTab('govtech-benchmark')} className="text-amber-400 font-bold hover:underline transition cursor-pointer">GovTech Benchmark & Upgrades</button></li>
            <li><button onClick={() => setActiveTab('user-manual-budget')} className="text-sky-400 font-bold hover:underline transition cursor-pointer">User Manual & Affordable Budget</button></li>
            <li><button onClick={() => setActiveTab('resume-builder')} className="hover:text-amber-400 transition cursor-pointer">Resume Builder & Isolated Print</button></li>
            <li><button onClick={() => setActiveTab('ai-interview')} className="hover:text-amber-400 transition cursor-pointer">Mock Interview AI</button></li>
            <li><button onClick={() => setActiveTab('resume-parser')} className="hover:text-amber-400 transition cursor-pointer">Resume Parser & ATS Audit</button></li>
          </ul>
        </div>

        {/* Other Links */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wide uppercase text-amber-400">Other Links</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Privacy Policy</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Terms & Conditions</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">FAQs</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Contact Us</button></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wide uppercase text-amber-400">Contact Us</h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>support@interniq.gov.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>1800-11-2025 (Toll Free Helpline)</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Ministry of Corporate Affairs, Government of India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>© 2026 PM Internship Scheme. All rights reserved.</p>
        <p className="flex items-center gap-1 text-slate-400">
          <span>Official AI Career Intelligence Portal.</span>
          <span>🇮🇳</span>
        </p>
      </div>

      {/* Official PM Scheme Mobile App QR Download Modal */}
      <AppDownloadQRModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </footer>
  );
};
