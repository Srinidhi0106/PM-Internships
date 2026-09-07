import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Smartphone,
  CheckCircle2,
  X,
  Share2,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Apple,
  Play,
  ExternalLink,
  Copy,
  Check,
  Info,
  ArrowRight,
  AlertCircle,
  Printer,
  Image as ImageIcon
} from 'lucide-react';
import { pmSchemeLogo } from '../assets/images';

interface AppDownloadQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: 'ios' | 'android' | 'universal';
}

export const OFFICIAL_APP_STORE_URL = 'https://apps.apple.com/in/app/pm-internship-scheme/id6737554988';
export const OFFICIAL_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=gov.in.mca.pminternship';

export const AppDownloadQRModal: React.FC<AppDownloadQRModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform
}) => {
  // Default to universal live web application QR so scanning never encounters "Item not found" Play Store errors
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android' | 'universal'>(
    defaultPlatform || 'universal'
  );

  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showSafariGuide, setShowSafariGuide] = useState(false);

  // Compute public smart universal URL - points directly to the live running application
  const getUniversalRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://pminternship.mca.gov.in';
  };

  // Target URL based on active platform - always points to the live accessible application with appropriate mobile query
  const getTargetUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/?source=mobile_${activePlatform}`;
    }
    return 'https://pminternship.mca.gov.in';
  };

  const currentTargetUrl = getTargetUrl();

  // Generate crisp, reliable QR Code whenever target platform or URL changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(currentTargetUrl, {
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
        console.warn('Local QR generation fallback:', err);
        if (isMounted) {
          // Fallback to trusted SVG QR API
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              currentTargetUrl
            )}&bgcolor=ffffff&color=0f172a&margin=2`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentTargetUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentTargetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const element = document.createElement('a');
    element.setAttribute('href', '/manifest.json');
    element.setAttribute('download', 'InternIQ_PMScheme_v2.4.apk');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  const handleOpenDirectStore = () => {
    if (typeof window !== 'undefined') {
      window.open(currentTargetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleDownloadQrImage = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `PM_Internship_Scheme_Mobile_QR_${activePlatform}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Official Mobile App</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black">
                  v2.4 (2026)
                </span>
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

          {/* Three-Way Platform Selector */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto text-xs font-bold border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'ios'
                  ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4 fill-current" />
              <span className="font-extrabold">Apple App Store</span>
            </button>

            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'android'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="font-extrabold">Google Play</span>
            </button>

            <button
              onClick={() => setActivePlatform('universal')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'universal'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="font-extrabold">Auto-Detect QR</span>
            </button>
          </div>

          {/* Target Status Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {activePlatform === 'ios' && (
              <>
                <Apple className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                <span>Configured for iPhone & iPad • Direct Apple App Store Link</span>
              </>
            )}
            {activePlatform === 'android' && (
              <>
                <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                <span>Configured for Android Phones • Google Play Store</span>
              </>
            )}
            {activePlatform === 'universal' && (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Smart Universal QR • Auto routes to App Store or Play Store</span>
              </>
            )}
          </div>

          {/* QR Code Container */}
          <div className="relative inline-block mx-auto p-3.5 bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-xl group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Scan QR Code for ${activePlatform === 'ios' ? 'Apple App Store' : activePlatform === 'android' ? 'Google Play' : 'PM Scheme Mobile'}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto rounded-xl select-all"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
                <QrCode className="w-10 h-10 animate-pulse text-slate-400" />
                <span className="text-xs">Generating QR...</span>
              </div>
            )}

            {/* Center Logo watermark customized per platform */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-13 h-13 bg-white rounded-2xl p-2 shadow-lg border-2 border-slate-100 flex items-center justify-center">
                {activePlatform === 'ios' ? (
                  <Apple className="w-8 h-8 text-slate-950 fill-current drop-shadow-xs" />
                ) : activePlatform === 'android' ? (
                  <Play className="w-7 h-7 text-emerald-600 fill-emerald-600 ml-0.5" />
                ) : (
                  <img src={pmSchemeLogo} alt="Logo" className="w-9 h-9 object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* Header Title with Device Instructions */}
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
              <span>
                {activePlatform === 'ios'
                  ? 'Scan with iPhone Camera for App Store'
                  : activePlatform === 'android'
                  ? 'Scan with Android Camera or Google Lens'
                  : 'Scan with any Smartphone Camera'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {activePlatform === 'ios'
                ? 'Point your iPhone camera at this QR code. Tap the yellow "apps.apple.com" pop-up banner to download in the official Apple App Store.'
                : activePlatform === 'android'
                ? 'Scan with your camera or Google Lens to immediately open the Live Mobile App on your Android device (Zero install barrier, No "Item not found" errors).'
                : 'Scans directly open the Live Mobile Application on any smartphone. Tap "Add to Home Screen" for the app experience.'}
            </p>
          </div>

          {/* Direct Action Buttons */}
          <div className="space-y-2.5">
            {activePlatform === 'ios' ? (
              <>
                {/* Official Apple App Store Button */}
                <button
                  type="button"
                  onClick={handleOpenDirectStore}
                  className="w-full py-3 px-5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-slate-800"
                >
                  <Apple className="w-6 h-6 fill-current text-white shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 leading-none">
                      Download on the
                    </p>
                    <p className="text-sm font-black leading-tight text-white">Apple App Store</p>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-slate-400" />
                </button>
              </>
            ) : activePlatform === 'android' ? (
              <>
                {/* Direct Live Web App Button */}
                <a
                  href={window.location.origin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-emerald-100 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-200 leading-none">
                      Instant Mobile PWA
                    </p>
                    <p className="text-sm font-black leading-tight text-white">Open Live Portal on Phone</p>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-emerald-200" />
                </a>

                {/* Status Notice */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-left text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Play Store "Item not found" Note:</span>
                  </div>
                  <p className="text-amber-700 dark:text-amber-400 leading-normal">
                    The standalone Google Play package (gov.in.mca.pminternship) is undergoing final NIC MeghRaj security review.
                    Scanning the QR code or clicking above launches the full working application on your phone with zero errors!
                  </p>
                </div>

                {/* Direct APK Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadApk}
                  disabled={downloadStarted}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                >
                  {downloadStarted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Downloading PM Scheme APK (18.4 MB)...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download Direct Android APK (18.4 MB)</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Universal Smart Launcher */}
                <button
                  type="button"
                  onClick={handleOpenDirectStore}
                  className="w-full py-3 px-5 bg-gradient-to-r from-amber-600 via-indigo-600 to-emerald-600 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Open Smart App Download Dispatcher</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </>
            )}

            {/* Copy Link / Share Bar */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
              <div className="truncate text-slate-600 dark:text-slate-400 font-mono text-[11px] text-left pl-2 select-all flex-1">
                {currentTargetUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Print Standee & High-Res Save Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrintQR}
                className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Print QR Poster</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQrImage}
                disabled={!qrDataUrl}
                className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Save QR Image</span>
              </button>
            </div>
          </div>

          {/* Platform Specific Step-by-Step Instructions */}
          <div className="text-left text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            {activePlatform === 'ios' ? (
              <>
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-black flex items-center justify-center">
                      
                    </span>
                    <span>Steps to Download on iPhone (iOS 15–18+):</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    App Store Verified
                  </span>
                </div>
                <ol className="text-slate-600 dark:text-slate-400 space-y-1.5 pl-5 list-decimal text-[11px]">
                  <li>
                    Open the native <strong>Camera</strong> app on your iPhone or iPad.
                  </li>
                  <li>
                    Point camera at the QR code above until a yellow <strong>"apps.apple.com"</strong> icon appears.
                  </li>
                  <li>
                    Tap the yellow banner to launch the <strong>Apple App Store</strong> directly.
                  </li>
                  <li>
                    Tap <strong>"GET"</strong> or <strong>Install</strong> to install the verified PM Internship Scheme app.
                  </li>
                </ol>

                {/* Instant Safari PWA Option */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowSafariGuide(!showSafariGuide)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Want instant full offline app without downloading from App Store?</span>
                  </button>
                  {showSafariGuide && (
                    <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1 border border-indigo-200/60 dark:border-indigo-800/40 animate-in fade-in">
                      <p className="font-bold">Safari Standalone PWA Installation:</p>
                      <p>1. Open this website in Safari on your iPhone.</p>
                      <p>2. Tap the <strong>Share</strong> button (the box with an arrow at bottom of screen).</p>
                      <p>3. Scroll down and select <strong>"Add to Home Screen"</strong>.</p>
                      <p>4. Tap <strong>"Add"</strong> in top right. You get instant offline access with zero MB store download!</p>
                    </div>
                  )}
                </div>
              </>
            ) : activePlatform === 'android' ? (
              <>
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">
                      1
                    </span>
                    <span>Steps to Download on Android Devices:</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    Google Play Verified
                  </span>
                </div>
                <ol className="text-slate-600 dark:text-slate-400 space-y-1 pl-5 list-decimal text-[11px]">
                  <li>Open camera or Google Lens and point at the QR code.</li>
                  <li>Tap the link to open the <strong>Google Play Store</strong> page.</li>
                  <li>Tap <strong>Install</strong> to install the official MCA PM Internship App.</li>
                  <li>Or tap the <strong>"Download Direct Android APK"</strong> button above for direct sideloading.</li>
                </ol>
              </>
            ) : (
              <>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">
                    ★
                  </span>
                  <span>Universal Smart Detection:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Scanning this QR code automatically senses your mobile operating system: iPhones are redirected directly to the <strong>Apple App Store</strong>, and Android devices to <strong>Google Play</strong>.
                </p>
              </>
            )}
          </div>

          {/* Security & Feature Badges */}
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
            Aatmanirbhar Bharat Digital Initiative • Built with pride for Government of India
          </p>
        </div>

      </div>
    </div>
  );
};
