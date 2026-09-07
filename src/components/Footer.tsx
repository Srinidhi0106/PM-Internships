import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, QrCode, Download, Smartphone, X, Check, Apple, Play, Copy, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pmSchemeLogo } from '../assets/images';
import { AppDownloadQRModal } from './AppDownloadQRModal';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    let appUrl = 'https://apps.apple.com/in/app/pm-internship-scheme/id6737554988';
    if (typeof window !== 'undefined') {
      appUrl = `${window.location.origin}`;
    }
    QRCode.toDataURL(appUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate real QR code:', err));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative">
      {/* Tricolor Top Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600 w-full" />

      {/* Brand & Social Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
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

        {/* Social Icons Bar with Real Brand SVGs & Tooltips */}
        <div className="flex items-center space-x-2.5">
          {/* Facebook */}
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

          {/* Twitter / X */}
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

          {/* LinkedIn */}
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

          {/* Instagram */}
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

          {/* YouTube */}
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

        {/* Download App QR Code Box - Interactive Trigger */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/80 rounded-2xl p-3 flex items-center gap-3 shrink-0 cursor-pointer transition group text-left shadow-lg"
        >
          <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-sm overflow-hidden">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan to Open PM Internship Mobile Portal"
                className="w-full h-full object-contain"
              />
            ) : (
              <QrCode className="w-full h-full text-slate-950" />
            )}
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider flex items-center gap-1">
              <span>Scan or Click to Download</span>
              <Download className="w-3 h-3 group-hover:translate-y-0.5 transition" />
            </span>
            <p className="text-xs font-bold text-white leading-tight group-hover:text-amber-300 transition">PM Internship Mobile App</p>
            <p className="text-[10px] text-slate-400">Available for Android & iOS</p>
          </div>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-amber-400">Quick Links</h4>
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
          <h4 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-amber-400">GovTech & Resources</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><button onClick={() => setActiveTab('support-grievance')} className="text-emerald-400 font-bold hover:underline transition cursor-pointer">🛡️ Support & Grievance Portal</button></li>
            <li><button onClick={() => setActiveTab('govtech-benchmark')} className="text-amber-400 font-bold hover:underline transition cursor-pointer">🏛️ GovTech Benchmark & Upgrades</button></li>
            <li><button onClick={() => setActiveTab('user-manual-budget')} className="text-sky-400 font-bold hover:underline transition cursor-pointer">📖 User Manual & Affordable Budget</button></li>
            <li><button onClick={() => setActiveTab('resume-builder')} className="hover:text-amber-400 transition cursor-pointer">Resume Builder & Isolated Print</button></li>
            <li><button onClick={() => setActiveTab('ai-skill-gap')} className="hover:text-amber-400 transition cursor-pointer">Skill Gap & Roadmap Engine</button></li>
            <li><button onClick={() => setActiveTab('ai-interview')} className="hover:text-amber-400 transition cursor-pointer">Mock Interview AI</button></li>
            <li><button onClick={() => setActiveTab('resume-parser')} className="hover:text-amber-400 transition cursor-pointer">Resume Parser & ATS Audit</button></li>
          </ul>
        </div>

        {/* Other Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-amber-400">Other Links</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Privacy Policy</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Terms & Conditions</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">FAQs</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition cursor-pointer">Contact Us</button></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-amber-400">Contact Us</h4>
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


