import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode,
  Download,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Globe,
  Play,
  ExternalLink,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { pmSchemeLogo } from '../assets/images';
import { useMobileAppConfig } from '../utils/mobileAppConfig';

interface DownloadAppPageProps {
  onNavigate?: (tab: string) => void;
}

export const DownloadAppPage: React.FC<DownloadAppPageProps> = ({ onNavigate }) => {
  const { published, androidPlayStoreUrl } = useMobileAppConfig();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!published || !androidPlayStoreUrl) {
      setQrDataUrl('');
      return;
    }

    let active = true;
    QRCode.toDataURL(androidPlayStoreUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });

    return () => {
      active = false;
    };
  }, [published, androidPlayStoreUrl]);

  const handleCopyLink = () => {
    if (!published || !androidPlayStoreUrl) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(androidPlayStoreUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadQrPng = () => {
    if (!published || !qrDataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download = 'InternIQ_Google_Play_QR.png';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Tricolor Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Branding & App Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs font-black text-amber-800 dark:text-amber-300">
              <span>🇮🇳 Aatmanirbhar Bharat Mobile Initiative</span>
              <span className="text-slate-400">•</span>
              <span>InternIQ Official Android App</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-white">
                <img src={pmSchemeLogo} alt="InternIQ Official Emblem" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Download InternIQ Mobile App
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  PM Internship Scheme • Ministry of Corporate Affairs, Government of India
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Access verified PM Internship Scheme opportunities, AI Resume & Interview coaching, real-time application tracking, and PhonePe / DBT stipend records directly on your Android smartphone with strict email passcode security.
            </p>

            {/* Key Mobile Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  icon: Sparkles,
                  title: 'Gemini AI Match & Interview',
                  desc: 'Personalized AI internship recommendations, ATS tailoring & mock interviews.'
                },
                {
                  icon: ShieldCheck,
                  title: 'Mail Passcode SSO Isolation',
                  desc: 'Dedicated Student, Company & Admin role sessions secured with 6-digit email passcodes.'
                },
                {
                  icon: Smartphone,
                  title: 'PhonePe & DBT Stipend Tracker',
                  desc: 'Instant stipend status tracking and downloadable official PDF payment receipts.'
                },
                {
                  icon: Globe,
                  title: '22 Indian Languages',
                  desc: 'Multilingual interface and voice guidance across national & regional languages.'
                }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-1.5 hover:border-amber-400 transition"
                >
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
                    <feature.icon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{feature.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {onNavigate && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('internships')}
                  className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>Continue using InternIQ Web Portal in browser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic QR Code & Google Play Actions */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl space-y-5 text-center">
              {published && androidPlayStoreUrl ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                    <Play className="w-3 h-3 fill-emerald-300" />
                    <span>Live on Google Play</span>
                  </div>

                  {/* Dynamically Generated QR Code */}
                  <div className="mx-auto inline-block p-4 bg-white rounded-3xl shadow-xl border-4 border-amber-400/40">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Scan QR code to download InternIQ on Google Play"
                        className="w-52 h-52 object-contain mx-auto"
                      />
                    ) : (
                      <div className="w-52 h-52 flex flex-col items-center justify-center text-slate-500 gap-2">
                        <QrCode className="w-10 h-10 animate-pulse" />
                        <span className="text-xs font-semibold">Generating QR Code...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">
                    Scan with your Android camera or Google Lens to open the verified Google Play listing.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2.5">
                    <a
                      href={androidPlayStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-slate-950 shrink-0" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] uppercase tracking-wider block opacity-80">Get it on</span>
                        <span>Download on Google Play</span>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Download Link'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadQrPng}
                        disabled={!qrDataUrl}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>Download QR (PNG)</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Coming Soon</span>
                  </div>

                  <div className="mx-auto w-52 h-52 rounded-3xl bg-slate-800/70 border-2 border-dashed border-amber-400/50 flex flex-col items-center justify-center p-5 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                      <Smartphone className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white">Coming Soon</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Android app is awaiting Google Play release. Official QR & download link will appear automatically once published.
                      </p>
                    </div>
                  </div>

                  {/* Clear Disabled Google Play / Copy / QR PNG Controls until real Play Store URL exists */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 px-5 bg-slate-800 border border-slate-700 text-slate-400 font-black text-sm rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed opacity-75"
                    >
                      <Play className="w-5 h-5 text-slate-500 shrink-0" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] uppercase tracking-wider block text-amber-400">Coming Soon</span>
                        <span>Download on Google Play</span>
                      </div>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        disabled
                        className="py-2.5 px-3 bg-slate-800/60 border border-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Download Link</span>
                      </button>

                      <button
                        type="button"
                        disabled
                        className="py-2.5 px-3 bg-slate-800/60 border border-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download QR (PNG)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
