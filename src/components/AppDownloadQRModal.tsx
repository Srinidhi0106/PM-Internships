import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  X,
  ShieldCheck,
  Zap,
  Globe,
  Play,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Printer,
  Image as ImageIcon
} from 'lucide-react';
import { useMobileAppConfig } from '../utils/mobileAppConfig';

interface AppDownloadQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadQRModal: React.FC<AppDownloadQRModalProps> = ({
  isOpen,
  onClose
}) => {
  const { published, androidPlayStoreUrl } = useMobileAppConfig();
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !published || !androidPlayStoreUrl) {
      setQrDataUrl('');
      return;
    }

    let isMounted = true;
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
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('QR generation error:', err);
        if (isMounted) setQrDataUrl('');
      });

    return () => {
      isMounted = false;
    };
  }, [androidPlayStoreUrl, published, isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!published || !androidPlayStoreUrl) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(androidPlayStoreUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleDownloadQrImage = () => {
    if (!published || !qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'InternIQ_Google_Play_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Download InternIQ Mobile App</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">PM Internship Scheme • Ministry of Corporate Affairs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-center">
          {published && androidPlayStoreUrl ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                <Play className="w-3 h-3 fill-current" />
                <span>Verified Google Play Store Release</span>
              </div>

              <div className="relative inline-block mx-auto p-3.5 bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan QR Code for InternIQ on Google Play"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto rounded-xl select-all"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <QrCode className="w-10 h-10 animate-pulse text-slate-400" />
                    <span className="text-xs">Generating QR...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <a
                  href={androidPlayStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-200 leading-none">
                      Get it on
                    </p>
                    <p className="text-sm font-black leading-tight text-white">Download on Google Play</p>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-emerald-200" />
                </a>

                <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  <div className="truncate text-slate-600 dark:text-slate-400 font-mono text-[11px] text-left pl-2 select-all flex-1">
                    {androidPlayStoreUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Download Link'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePrintQR}
                    className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Print QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQrImage}
                    disabled={!qrDataUrl}
                    className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Download QR (PNG)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-dashed border-amber-400 dark:border-amber-700 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Coming Soon</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Android App Coming Soon on Google Play
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The InternIQ native Android app has not been published to Google Play yet. To prevent broken scans, no placeholder Play Store QR code is generated until the official Play Store URL is configured.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MCA & UIDAI Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> 100% Free Government App
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Available in 22 Languages
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Aatmanirbhar Bharat Digital Initiative • Government of India
          </p>
        </div>
      </div>
    </div>
  );
};
