import React, { useState, useEffect, useRef } from 'react';
import { Mail, Clock, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { otpService, VerifyOtpResult } from '../services/otpService';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  purpose: 'registration' | 'forgot-password' | 'sensitive-profile-change' | 'offer-acceptance' | 'bank-account-verification' | 'certificate-access' | string;
  title?: string;
  description?: string;
  name?: string;
  role?: string;
  userDetails?: any;
  onSuccess: (result: VerifyOtpResult) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  purpose,
  title,
  description,
  name,
  role = 'STUDENT',
  userDetails,
  onSuccess
}) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Expiry: 5 minutes (300 seconds)
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  
  // Resend cooldown: 60 seconds
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(5);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Purpose title mapping
  const purposeDisplayNames: Record<string, string> = {
    'registration': 'Candidate Account Registration',
    'forgot-password': 'Password Reset Authentication',
    'sensitive-profile-change': 'Security Verification for Profile Changes',
    'offer-acceptance': 'Internship Offer Acceptance Authorization',
    'bank-account-verification': 'Bank Account & DBT Direct Benefit Setup',
    'certificate-access': 'Official Completion Certificate Verification'
  };

  const displayTitle = title || purposeDisplayNames[purpose] || 'Secure Email OTP Verification';

  // Initialize or reset timer on modal open
  useEffect(() => {
    if (isOpen) {
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setSuccessMessage('');
      setTimeRemaining(300);
      setIsExpired(false);
      setResendCooldown(60);
      setAttemptsRemaining(5);

      // Auto focus first box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, email, purpose]);

  // 5-Minute Countdown Timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // 60-Second Resend Cooldown Timer
  useEffect(() => {
    if (!isOpen) return;
    const resendTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(resendTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept single numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Advance focus if digit was entered
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasteData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        if (pasteData[i]) {
          newDigits[i] = pasteData[i];
        }
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasteData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isExpired) {
      setErrorMessage('Verification OTP has expired (5-minute limit exceeded). Please request a new OTP.');
      return;
    }

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const result = await otpService.verifyEmailOtp(
        email,
        fullOtp,
        purpose,
        role,
        userDetails
      );

      if (result.success) {
        setSuccessMessage('✓ Email verified successfully!');
        setTimeout(() => {
          onSuccess(result);
          onClose();
        }, 800);
      } else {
        if (result.remainingAttempts !== undefined) {
          setAttemptsRemaining(result.remainingAttempts);
        }
        if (result.expired) {
          setIsExpired(true);
        }
        setErrorMessage(result.message || 'Invalid verification code.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await otpService.resendEmailOtp(email, purpose);
      if (result.success) {
        setSuccessMessage('✓ A new 6-digit OTP has been dispatched to your email.');
        setTimeRemaining(300); // reset 5 minutes
        setIsExpired(false);
        setResendCooldown(60); // reset 60 seconds
        setAttemptsRemaining(5);
        setOtpDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Government of India Security
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {displayTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email target info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Code sent to: <strong className="text-slate-900 dark:text-white font-bold">{email}</strong></span>
          </div>
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
              {description}
            </p>
          )}
        </div>

        {/* Timer & Expiry Display */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Valid for 5 minutes:</span>
          </div>
          <span
            className={`font-mono text-sm font-black px-2.5 py-0.5 rounded-md border ${
              isExpired
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:border-rose-900'
                : timeRemaining <= 60
                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:border-amber-900 animate-pulse'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900'
            }`}
          >
            {formatTimer(timeRemaining)}
          </span>
        </div>

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={loading || isExpired}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition disabled:opacity-50"
              />
            ))}
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={loading || isExpired || otpDigits.join('').length !== 6}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Verify OTP & Proceed</span>
              )}
            </button>

            {/* Resend OTP */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <span className="text-slate-400">
                {attemptsRemaining < 5 ? `${attemptsRemaining} attempts left` : '5 attempts permitted'}
              </span>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </span>
              </button>
            </div>
          </div>
        </form>

        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
          Never share your OTP with anyone. Portal administrators will never ask for your verification code.
        </p>
      </div>
    </div>
  );
};
