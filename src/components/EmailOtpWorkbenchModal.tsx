import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Send,
  Code2,
  Key,
  Server,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { sendEmailOtp, verifyEmailOtp, resendEmailOtp } from '../services/otpService';

export interface EmailOtpWorkbenchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const EmailOtpWorkbenchModal: React.FC<EmailOtpWorkbenchModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const [activeTab, setActiveTab] = useState<'PLAYGROUND' | 'AI_STUDIO_GUIDE' | 'BACKEND_CODE' | 'FRONTEND_CODE'>('PLAYGROUND');
  
  // Playground state
  const [email, setEmail] = useState<string>(initialEmail || 'candidate.test@gmail.com');
  const [purpose, setPurpose] = useState<'REGISTRATION' | 'LOGIN' | 'STIPEND_APPROVAL' | 'AADHAAR_VERIFY'>('REGISTRATION');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [expiresSeconds, setExpiresSeconds] = useState<number>(300);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update email if initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Timers
  useEffect(() => {
    if (!isOpen || !otpSent || isVerified) return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiresSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, otpSent, isVerified]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setIsError(true);
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    setStatusMessage(null);
    setIsError(false);
    setIsVerified(false);
    setOtpDigits(['', '', '', '', '', '']);

    try {
      const res = await sendEmailOtp(
        email.trim(),
        purpose.toLowerCase(),
        'Applicant',
        'STUDENT'
      );

      setIsSending(false);
      if (!res.success) {
        setIsError(true);
        setStatusMessage(res.message || 'Unable to dispatch verification passcode.');
        if (res.remainingSeconds) {
          setCooldownSeconds(res.remainingSeconds);
        }
        return;
      }

      setOtpSent(true);
      setCooldownSeconds(res.resendAvailableInSeconds || 60);
      setExpiresSeconds(res.expiresInSeconds || 300);
      setStatusMessage(res.message || `Passcode dispatched exclusively to ${email.trim()}. Check your inbox.`);

      // Auto-focus first digit
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setIsSending(false);
      setIsError(true);
      setStatusMessage(err.message || 'Failed to dispatch email passcode.');
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    // Single or pasted digit
    const next = [...otpDigits];
    next[index] = cleaned[cleaned.length - 1];
    setOtpDigits(next);

    // Auto focus next
    if (index < 5 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setOtpDigits(next);

    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setIsError(true);
      setStatusMessage('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const res = await verifyEmailOtp(
        email.trim(),
        code,
        purpose.toLowerCase()
      );

      setIsVerifying(false);
      if (res.success) {
        setIsVerified(true);
        setStatusMessage('✓ Verification successful! Email identity securely authenticated.');
      } else {
        setIsError(true);
        setStatusMessage(res.message || 'Incorrect OTP code. Please try again.');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setIsError(true);
      setStatusMessage(err.message || 'Verification error.');
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner shrink-0">
              <Mail className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  Mail ID OTP Integration Guide & Live Workbench
                </h3>
                <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full uppercase">
                  Google Studio Ready
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                How to add live email OTP verification to apps built in Google AI Studio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 pt-2 gap-2 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('PLAYGROUND')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'PLAYGROUND'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Live Tester</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI_STUDIO_GUIDE')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'AI_STUDIO_GUIDE'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Step-by-Step Setup Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BACKEND_CODE')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'BACKEND_CODE'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            <span>Backend Server Code (server.ts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FRONTEND_CODE')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'FRONTEND_CODE'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-500" />
            <span>React Frontend UI Component</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* ======================================================== */}
          {/* TAB 1: INTERACTIVE LIVE TESTER PLAYGROUND                */}
          {/* ======================================================== */}
          {activeTab === 'PLAYGROUND' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold block">Live In-App Mail OTP Engine</span>
                  <p className="leading-relaxed">
                    Test the strict Email Passcode flow: passcodes are generated cryptographically on the backend, stored only as HMAC-SHA256 hashes, never displayed in the UI, and sent directly to the target Mail ID via SMTP so only the inbox owner can authenticate.
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recipient Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Purpose / Flow
                  </label>
                  <select
                    value={purpose}
                    onChange={(e: any) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="REGISTRATION">Registration</option>
                    <option value="LOGIN">Login Sign-In</option>
                    <option value="STIPEND_APPROVAL">Stipend Auth</option>
                    <option value="AADHAAR_VERIFY">Aadhaar Link</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isSending || cooldownSeconds > 0}
                  onClick={handleSendOtp}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {cooldownSeconds > 0
                      ? `Resend available in ${cooldownSeconds}s`
                      : otpSent
                      ? 'Resend OTP to Mail ID'
                      : 'Generate & Send Mail OTP'}
                  </span>
                </button>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                    isError
                      ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 border border-rose-200'
                      : isVerified
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200 border border-indigo-200'
                  }`}
                >
                  {isError ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : isVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* 6-Digit OTP Boxes */}
              {otpSent && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Enter 6-Digit Verification Code
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid: {Math.floor(expiresSeconds / 60)}:{(expiresSeconds % 60).toString().padStart(2, '0')}</span>
                    </span>
                  </div>

                  <div className="flex justify-center items-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                        disabled={isVerified}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-black rounded-xl border-2 transition-all outline-none ${
                          isVerified
                            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700'
                            : digit
                            ? 'border-amber-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        } focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Tip: You can copy and paste the entire 6-digit code at once
                    </span>
                    <button
                      type="button"
                      disabled={isVerifying || isVerified || otpDigits.join('').length < 6}
                      onClick={() => handleVerifyOtp()}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>{isVerified ? 'Verified' : 'Verify Code'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STEP BY STEP SETUP GUIDE                          */}
          {/* ======================================================== */}
          {activeTab === 'AI_STUDIO_GUIDE' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                <h4 className="font-black text-sm mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>How to Connect Real Gmail SMTP in Google AI Studio</span>
                </h4>
                <p className="leading-relaxed">
                  In Google AI Studio, regular Google account passwords cannot be used directly for SMTP due to Google's strict OAuth2 / 2FA security policies. You must generate a free, dedicated <strong>16-digit Google App Password</strong>.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '1',
                    title: 'Enable 2-Step Verification on your Google Account',
                    desc: 'Visit myaccount.google.com > Security > 2-Step Verification and turn it ON.'
                  },
                  {
                    step: '2',
                    title: 'Generate a 16-Character App Password',
                    desc: 'In Security, search for "App passwords". Select App name "AI Studio Portal" and click Generate. Google will show a 16-character code like "abcd efgh ijkl mnop".'
                  },
                  {
                    step: '3',
                    title: 'Add Variables to your Environment (.env)',
                    desc: 'Set EMAIL_USER=yourname@gmail.com and EMAIL_APP_PASSWORD=abcdefghijklmnop in your .env configuration.'
                  },
                  {
                    step: '4',
                    title: 'Strict Hashed & Confidential Verification',
                    desc: 'OTPs are stored exclusively as HMAC-SHA256 hashes with a 5-minute TTL and 5-attempt lockout, and are never returned in API responses or displayed in the browser UI.'
                  }
                ].map((item) => (
                  <div key={item.step} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold text-xs">{item.title}</strong>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample .env snippet */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Environment Variables (.env snippet):</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        `# Google AI Studio Gmail SMTP Configuration\nEMAIL_USER=your_email@gmail.com\nEMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nJWT_SECRET=pm-scheme-government-otp-secret-key-2025`,
                        'env'
                      )
                    }
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSnippet === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'env' ? 'Copied!' : 'Copy .env'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
{`EMAIL_USER=your_official_email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
JWT_SECRET=pm-scheme-government-otp-secret-key-2025`}
                </pre>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: BACKEND SERVER CODE (server.ts)                   */}
          {/* ======================================================== */}
          {activeTab === 'BACKEND_CODE' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Express + Nodemailer + HMAC Hashed OTP Storage:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `// 1. POST /api/auth/send-email-otp
app.post('/api/auth/send-email-otp', async (req, res) => {
  const { email, purpose = 'registration' } = req.body;
  const generatedOtp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(generatedOtp).digest('hex');
  
  otpStore.set(email.toLowerCase(), {
    otpHash,
    expiresAt: Date.now() + 5 * 60 * 1000,
    resendAvailableAt: Date.now() + 60 * 1000
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD }
  });

  await transporter.sendMail({
    from: '"PM Internship Scheme" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: 'Your 6-Digit Verification Code',
    text: 'Your OTP is ' + generatedOtp
  });

  res.json({ success: true, message: 'OTP sent successfully!' });
});`,
                      'backend'
                    )
                  }
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'backend' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'backend' ? 'Copied Code!' : 'Copy Backend Snippet'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
{`import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-Memory Secure Hashed OTP Store
interface OtpRecord {
  otpHash: string;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
}
const otpStore = new Map<string, OtpRecord>();

// 1. Send OTP Endpoint
app.post('/api/auth/send-email-otp', async (req, res) => {
  const { email, purpose = 'registration' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }

  const generatedOtp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret')
    .update(generatedOtp).digest('hex');

  otpStore.set(email.toLowerCase(), {
    otpHash,
    expiresAt: Date.now() + 5 * 60 * 1000,
    resendAvailableAt: Date.now() + 60 * 1000,
    attempts: 0
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD }
  });

  try {
    await transporter.sendMail({
      from: '"PM Internship Scheme" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: \`Your Verification OTP: \${generatedOtp}\`,
      html: \`<h3>Your Verification Code is \${generatedOtp}</h3><p>Valid for 5 minutes.</p>\`
    });
    return res.json({ success: true, message: 'OTP sent to ' + email });
  } catch (err) {
    return res.status(502).json({ success: false, delivered: false, message: 'SMTP delivery failed' });
  }
});`}
              </pre>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: FRONTEND REACT UI CODE                            */}
          {/* ======================================================== */}
          {activeTab === 'FRONTEND_CODE' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  React 6-Digit Auto-Advancing Input Component:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `// React 6-digit Auto-Advancing OTP Input Component
const [otp, setOtp] = useState(['', '', '', '', '', '']);
const refs = useRef([]);

const handleChange = (idx, val) => {
  const next = [...otp];
  next[idx] = val.slice(-1);
  setOtp(next);
  if (idx < 5 && val) refs.current[idx + 1]?.focus();
};`,
                      'frontend'
                    )
                  }
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'frontend' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'frontend' ? 'Copied!' : 'Copy React Component'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
{`import React, { useState, useRef } from 'react';

export const OtpInputBox = ({ onComplete }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleDigitChange = (index, val) => {
    const clean = val.replace(/\\D/g, '');
    const next = [...digits];
    next[index] = clean ? clean[clean.length - 1] : '';
    setDigits(next);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every(d => d !== '')) {
      onComplete(next.join(''));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setDigits(next);
    if (pasted.length === 6) onComplete(pasted);
  };

  return (
    <div className="flex gap-2">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(idx, e.target.value)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center text-lg font-bold border rounded-xl"
        />
      ))}
    </div>
  );
};`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HMAC-SHA256 Encrypted OTP Verification Engine</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
