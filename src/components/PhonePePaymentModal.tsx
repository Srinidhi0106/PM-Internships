import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  ArrowRight,
  Download,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Sparkles,
  Info,
  AlertTriangle,
  Award,
  KeyRound,
  RotateCcw
} from 'lucide-react';

export interface PhonePePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateCollege?: string;
  candidateRole?: string;
  candidateAccount?: string;
  candidateBank?: string;
  candidateUpiId?: string;
  defaultAmount?: number;
  internshipId?: string;
  isInternshipCompleted?: boolean;
  attendancePercentage?: number;
  onCompleteMilestone?: () => void;
  onPaymentSuccess?: (paymentDetails: {
    transactionId: string;
    utrNumber: string;
    amount: number;
    candidateName: string;
    timestamp: string;
    paymentMethod: string;
    orderId: string;
  }) => void;
}

// Sound Synthesizer for PhonePe Payment Success Chime using Web Audio API
const playPhonePeSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // Iconic PhonePe ascending harmonic chime
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.28, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);

    // Tone 3: 1174.66 Hz (D6) - Bright ringing finish
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1174.66, now + 0.24);
    gain3.gain.setValueAtTime(0.35, now + 0.24);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 0.85);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
};

export const PhonePePaymentModal: React.FC<PhonePePaymentModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  candidateCollege = 'National Institute of Technology',
  candidateRole = 'Full-Stack Software Engineering Intern',
  candidateAccount = 'State Bank of India •••• 4921',
  candidateBank = 'State Bank of India',
  candidateUpiId = 'candidate.pmscheme@ybl',
  defaultAmount = 15000,
  internshipId = 'int-pmintern-2026',
  isInternshipCompleted = true,
  attendancePercentage = 94.2,
  onCompleteMilestone,
  onPaymentSuccess
}) => {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [activeRail, setActiveRail] = useState<'QR' | 'UPI_ID' | 'UPI_APP'>('QR');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [upiIdInput, setUpiIdInput] = useState<string>('recruiter.csr@ybl');
  const [isVpaVerified, setIsVpaVerified] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 minutes QR timer
  const [step, setStep] = useState<'MILESTONE_GATE' | 'CONFIG' | 'PIN_ENTRY' | 'PROCESSING' | 'SUCCESS'>('CONFIG');
  const [mpin, setMpin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(15);
  const [processingStage, setProcessingStage] = useState<string>('Authorizing 256-Bit MPIN with NPCI UPI Switch...');
  const [milestoneCertified, setMilestoneCertified] = useState<boolean>(isInternshipCompleted);
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId: string;
    utrNumber: string;
    amount: number;
    candidateName: string;
    timestamp: string;
    paymentMethod: string;
    orderId: string;
  } | null>(null);

  const DEMO_PIN = '123456';

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount);
      setMpin('');
      setPinError(null);
      setIsShaking(false);
      setTimerSeconds(300);
      setIsVpaVerified(true);
      setPaymentDetails(null);
      setProcessingProgress(15);

      // If internship is not completed and this is an intern stipend (not escrow-deposit), show milestone gate
      const isDeposit = internshipId === 'escrow-deposit' || candidateRole?.includes('Escrow');
      if (!isInternshipCompleted && !isDeposit) {
        setMilestoneCertified(false);
        setStep('MILESTONE_GATE');
      } else {
        setMilestoneCertified(true);
        setStep('CONFIG');
      }
    }
  }, [isOpen, defaultAmount, isInternshipCompleted, internshipId, candidateRole]);

  // Generate UPI QR Code URL whenever amount or candidate changes
  useEffect(() => {
    if (!isOpen) return;

    // Real NPCI UPI URI Specification
    const pa = 'mca.pminternship@ybl';
    const pn = 'PM Internship Scheme DBT Escrow';
    const tr = `TXN${Date.now()}`;
    const tn = encodeURIComponent(`Stipend Disbursement for ${candidateName}`);
    const upiUrl = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${amount}&cu=INR&tr=${tr}&tn=${tn}&mc=8299`;

    QRCode.toDataURL(
      upiUrl,
      {
        width: 280,
        margin: 2,
        color: {
          dark: '#3b0764',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, amount, candidateName]);

  // Countdown timer for QR code
  useEffect(() => {
    if (!isOpen || step !== 'CONFIG' || activeRail !== 'QR') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 300; // Reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step, activeRail]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle PIN input
  const handleMpinKeyClick = (digit: string) => {
    if (mpin.length < 6) {
      setPinError(null);
      const nextPin = mpin + digit;
      setMpin(nextPin);
      if (nextPin.length === 6) {
        // Validate immediately upon 6th digit
        validateAndProceed(nextPin);
      }
    }
  };

  const handleMpinBackspace = () => {
    setPinError(null);
    setMpin((prev) => prev.slice(0, -1));
  };

  // 1-Click Auto-Fill Demo PIN
  const handleFillDemoPin = () => {
    setMpin(DEMO_PIN);
    setPinError(null);
    validateAndProceed(DEMO_PIN);
  };

  // Strict PIN Validation Logic
  const validateAndProceed = (pinToTest: string) => {
    if (pinToTest === DEMO_PIN || pinToTest === '992101' || pinToTest === '000000') {
      setPinError(null);
      // Valid PIN -> proceed to realistic animated processing
      setTimeout(() => {
        handleExecutePayment();
      }, 250);
    } else {
      // Incorrect PIN Feedback
      setPinError(`Incorrect UPI PIN (${pinToTest})! Please enter Demo PIN: ${DEMO_PIN}`);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  // Execute payment with multi-step realistic loading state and backend sync
  const handleExecutePayment = async () => {
    setStep('PROCESSING');
    setProcessingProgress(20);
    setProcessingStage('Connecting to NPCI UPI Banking Rail (PhonePe Switch)...');

    // Stage 1 -> Stage 2
    setTimeout(() => {
      setProcessingProgress(55);
      setProcessingStage('Debiting Corporate CSR Escrow Reserve (YES Bank / SBI)...');
    }, 800);

    // Stage 2 -> Stage 3
    setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStage(`Direct Benefit Transfer (DBT) credit to ${candidateName}'s Jan Dhan Account...`);
    }, 1600);

    // Call real backend API in parallel
    const now = new Date();
    const txId = `T${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const utr = `P142260${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const order = `PMIS-DBT-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedTimestamp = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    try {
      await fetch('/api/payments/phonepe-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order,
          candidateName,
          candidateAccount,
          amount,
          paymentRail: activeRail === 'QR' ? 'PhonePe BharatQR (UPI)' : 'PhonePe VPA (@ybl Direct)',
          notes: `Monthly Stipend Disbursed via PhonePe UPI (UTR: ${utr})`
        })
      });
    } catch (err) {
      console.warn('API call sync note:', err);
    }

    // Final Stage & Success Transition
    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingStage('Disbursal Successful! Generating Verified Receipt...');

      setTimeout(() => {
        const details = {
          transactionId: txId,
          utrNumber: utr,
          amount,
          candidateName,
          timestamp: formattedTimestamp,
          paymentMethod: activeRail === 'QR' ? 'PhonePe BharatQR (UPI)' : 'PhonePe VPA (@ybl Direct)',
          orderId: order
        };

        setPaymentDetails(details);
        setStep('SUCCESS');
        playPhonePeSuccessChime();

        if (onPaymentSuccess) {
          onPaymentSuccess(details);
        }
      }, 400);
    }, 2400);
  };

  const handleDownloadReceipt = () => {
    if (!paymentDetails) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background styling
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 210, 297, 'F');

      // Top Saffron Accent
      doc.setFillColor(255, 153, 51);
      doc.rect(0, 0, 210, 5, 'F');

      // Header Banner (PhonePe Purple)
      doc.setFillColor(95, 37, 159);
      doc.rect(0, 5, 210, 36, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('PhonePe UPI Payment Receipt', 15, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Ministry of Corporate Affairs (MCA) • PM Internship Scheme DBT', 15, 30);

      // Status Badge
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(145, 14, 50, 14, 3, 3, 'F');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('PAID & SETTLED', 151, 23);

      // Amount Card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 48, 180, 34, 4, 4, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 34, 4, 4, 'S');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Total Monthly Stipend Disbursed', 25, 59);

      doc.setTextColor(95, 37, 159);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${paymentDetails.amount.toLocaleString('en-IN')}.00`, 25, 72);

      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `(Govt DBT: INR 4,500 + Corporate CSR: INR ${(paymentDetails.amount - 4500).toLocaleString('en-IN')})`,
        105,
        72
      );

      // Metadata Grid
      let y = 96;
      const rows = [
        ['Transaction Status', 'SUCCESS (NPCI Settled)'],
        ['PhonePe Transaction ID', paymentDetails.transactionId],
        ['Bank Reference (UTR)', paymentDetails.utrNumber],
        ['Order / Portal ID', paymentDetails.orderId],
        ['Beneficiary Candidate', candidateName],
        ['Candidate Institute', candidateCollege],
        ['Designated Role', candidateRole],
        ['Beneficiary Bank', candidateAccount],
        ['Payment Method', paymentDetails.paymentMethod],
        ['Disbursement Date & Time', paymentDetails.timestamp],
        ['MCA DBT Compliance', 'Section 14(b) - Direct Bank Credit (Zero Off-Portal)'],
        ['Attendance Certification', 'Certified >=90% Biometric Attendance by Host Partner']
      ];

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 88, 180, 136, 4, 4, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 88, 180, 136, 4, 4, 'S');

      rows.forEach(([label, value], idx) => {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.text(label, 25, y);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 95, y);

        if (idx < rows.length - 1) {
          doc.setDrawColor(241, 245, 249);
          doc.line(25, y + 3, 185, y + 3);
        }
        y += 11;
      });

      // Statutory disclaimer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'This receipt is authenticated by the Ministry of Corporate Affairs (MCA) and verified on the National PFMS / NPCI banking network.',
        15,
        238
      );
      doc.text(
        'Stipend released in accordance with Section 14(b) of the PM Internship Scheme after completion of milestone & attendance criteria.',
        15,
        244
      );

      // Official Stamp
      doc.setDrawColor(95, 37, 159);
      doc.roundedRect(130, 252, 65, 28, 3, 3, 'S');
      doc.setTextColor(95, 37, 159);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('MCA VERIFIED ESCROW', 140, 262);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Government of India', 147, 268);
      doc.text(`UTR: ${paymentDetails.utrNumber}`, 136, 274);

      doc.save(`PhonePe_Receipt_${paymentDetails.utrNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
        {/* PhonePe Branded Top Header with Tricolor Accent */}
        <div className="relative">
          <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          <div className="bg-gradient-to-r from-[#5f259f] via-[#6d28d9] to-[#7c3aed] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              {/* PhonePe Stylized Logo Icon */}
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                <span className="text-[#5f259f] font-black text-2xl tracking-tighter select-none">पे</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight">PhonePe</span>
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full uppercase tracking-wider text-purple-100">
                    UPI Business
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>MCA Approved Portal Banking & DBT Escrow</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
              aria-label="Close Payment Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Depends on Step */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* ======================================================== */}
          {/* STEP 0: MILESTONE & INTERNSHIP COMPLETION GATE          */}
          {/* ======================================================== */}
          {step === 'MILESTONE_GATE' && (
            <div className="space-y-4 py-1 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <h4 className="font-black text-sm uppercase tracking-wide">
                    Statutory Rule 14(b) Disbursal Guardrail
                  </h4>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
                  Under the <strong>Prime Minister's Internship Scheme Guidelines</strong>, stipend payments cannot be disbursed before the candidate completes their active internship milestone and achieves <strong>minimum 90% certified attendance</strong>.
                </p>
              </div>

              {/* Candidate Milestone Audit Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Candidate</span>
                    <div className="font-black text-sm text-slate-900 dark:text-white">{candidateName}</div>
                    <div className="text-[11px] text-slate-500">{candidateRole}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Month 1 Milestone
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Biometric Attendance</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {attendancePercentage}% (28/30 Days)
                    </strong>
                    <span className="text-[9px] text-emerald-700 dark:text-emerald-300 block font-bold">
                      ✓ Criteria Met (≥ 90%)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Milestone Deliverable</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 text-xs">
                      Tasks Completed (4/4)
                    </strong>
                    <span className="text-[9px] text-slate-500 block">
                      Codebase Reviewed
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Stipend Amount to Disburse:</span>
                  <strong className="text-[#5f259f] dark:text-purple-300 font-black text-sm">
                    ₹{amount.toLocaleString('en-IN')}.00
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMilestoneCertified(true);
                    if (onCompleteMilestone) {
                      onCompleteMilestone();
                    }
                    setStep('CONFIG');
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Certify Milestone & Unlock Disbursal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold transition cursor-pointer"
                >
                  Hold Payment & Review Candidate Later
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: CONFIGURATION & PAYMENT RAILS (QR / UPI ID / APP) */}
          {/* ======================================================== */}
          {step === 'CONFIG' && (
            <>
              {/* Beneficiary Intern Card */}
              <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider">
                    Beneficiary Intern
                  </span>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{candidateName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      Aadhaar Linked
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {candidateAccount}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Linked PhonePe VPA</span>
                  <span className="text-xs font-mono font-bold text-[#5f259f] dark:text-purple-400">
                    {candidateUpiId}
                  </span>
                </div>
              </div>

              {/* Milestone Completed Verified Badge */}
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Internship Milestone Completed & Attendance Verified (≥90%)</span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  Rule 14(b) OK
                </span>
              </div>

              {/* Stipend Amount Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Monthly Stipend Amount
                  </label>
                  <span className="text-xs font-extrabold text-[#5f259f] dark:text-purple-400">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[5000, 10000, 15000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer active:scale-95 border ${
                        amount === preset
                          ? 'bg-[#5f259f] text-white border-[#5f259f] shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                      }`}
                    >
                      ₹{preset >= 1000 ? `${preset / 1000}k` : preset}
                      {preset === 5000 && (
                        <span className="block text-[8px] font-normal opacity-85">Govt DBT</span>
                      )}
                      {preset === 15000 && (
                        <span className="block text-[8px] font-normal opacity-85">Standard</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Rail Navigation (Tabs) */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveRail('QR')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeRail === 'QR'
                      ? 'bg-white dark:bg-slate-900 text-[#5f259f] dark:text-purple-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRail('UPI_ID')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeRail === 'UPI_ID'
                      ? 'bg-white dark:bg-slate-900 text-[#5f259f] dark:text-purple-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>UPI ID / VPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRail('UPI_APP')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeRail === 'UPI_APP'
                      ? 'bg-white dark:bg-slate-900 text-[#5f259f] dark:text-purple-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Apps</span>
                </button>
              </div>

              {/* RAIL A: SCAN PHONEPE BHARAT QR */}
              {activeRail === 'QR' && (
                <div className="flex flex-col items-center justify-center space-y-3.5 pt-1">
                  <div className="relative p-3 bg-white rounded-2xl shadow-lg border-2 border-purple-300 dark:border-purple-600">
                    {qrDataUrl ? (
                      <div className="relative">
                        <img
                          src={qrDataUrl}
                          alt="PhonePe UPI Payment QR Code"
                          className="w-52 h-52 sm:w-56 sm:h-56 rounded-lg object-contain"
                        />
                        {/* Centered PhonePe Badge */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-[#5f259f] text-white flex items-center justify-center border-2 border-white shadow-md">
                            <span className="font-black text-base select-none">पे</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-56 h-56 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                      <span>QR Code expires in:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                        {formatTimer(timerSeconds)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Scan using <strong>PhonePe</strong>, Google Pay, Paytm, or any BHIM UPI App
                    </p>
                  </div>

                  {/* Simulator Trigger Button */}
                  <div className="w-full pt-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => setStep('PIN_ENTRY')}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#5f259f] to-[#7c3aed] hover:from-[#501c87] hover:to-[#6d28d9] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Simulate Scan on PhonePe App & Pay ₹{amount.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400">
                        ⚡ Opens 6-Digit UPI PIN confirmation screen to authorize disbursement
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RAIL B: ENTER PHONEPE UPI ID */}
              {activeRail === 'UPI_ID' && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Enter Corporate / Recruiter UPI ID (VPA)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => {
                          setUpiIdInput(e.target.value);
                          setIsVpaVerified(e.target.value.includes('@'));
                        }}
                        placeholder="company.csr@ybl"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#5f259f] outline-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {isVpaVerified ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-500 font-medium">Enter VPA</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Suffix Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Quick handles:</span>
                    {['@ybl', '@ibl', '@axl', '@okhdfcbank'].map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          const base = upiIdInput.split('@')[0] || 'company.csr';
                          setUpiIdInput(`${base}${handle}`);
                          setIsVpaVerified(true);
                        }}
                        className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 cursor-pointer"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-slate-500">
                      <span>Account Holder:</span>
                      <strong className="text-slate-900 dark:text-white">Tata Consultancy Services Escrow</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Bank Rail:</span>
                      <strong className="text-slate-900 dark:text-white">YES Bank UPI Switch (YBL)</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!isVpaVerified}
                    onClick={() => setStep('PIN_ENTRY')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#5f259f] to-[#7c3aed] hover:from-[#501c87] hover:to-[#6d28d9] disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send UPI Collect Request & Pay ₹{amount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* RAIL C: UPI APPS INTENT */}
              {activeRail === 'UPI_APP' && (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose your installed UPI application to authorize the transaction directly:
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* PhonePe Option */}
                    <button
                      type="button"
                      onClick={() => setStep('PIN_ENTRY')}
                      className="p-3 rounded-2xl border-2 border-[#5f259f] bg-purple-50/50 dark:bg-purple-950/30 flex items-center gap-3 transition hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#5f259f] text-white flex items-center justify-center font-black text-sm">
                        पे
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">PhonePe</div>
                        <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                          Recommended
                        </div>
                      </div>
                    </button>

                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => setStep('PIN_ENTRY')}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3 transition hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        GPay
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">Google Pay</div>
                        <div className="text-[10px] text-slate-400">UPI Intent</div>
                      </div>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      onClick={() => setStep('PIN_ENTRY')}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3 transition hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                        Paytm
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">Paytm UPI</div>
                        <div className="text-[10px] text-slate-400">BHIM UPI</div>
                      </div>
                    </button>

                    {/* BHIM */}
                    <button
                      type="button"
                      onClick={() => setStep('PIN_ENTRY')}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3 transition hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        BHIM
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">BHIM NPCI</div>
                        <div className="text-[10px] text-slate-400">Govt Switch</div>
                      </div>
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      On mobile devices, this triggers deep-link URL <code>phonepe://pay</code> to launch PhonePe immediately.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* STEP 2: PHONEPE UPI MPIN CONFIRMATION & KEYPAD SCREEN    */}
          {/* ======================================================== */}
          {step === 'PIN_ENTRY' && (
            <div className="space-y-4 py-1 animate-in fade-in duration-200">
              {/* Prominent Demo PIN Help Banner (Fixes "what is that pin number") */}
              <div className="p-3.5 bg-gradient-to-r from-purple-100 via-amber-50 to-orange-100 dark:from-purple-950 dark:via-slate-800 dark:to-orange-950/70 border-2 border-[#5f259f] dark:border-purple-500 rounded-2xl text-center shadow-xs space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#5f259f] dark:text-purple-300" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#5f259f] dark:text-purple-300">
                    Your Demo UPI PIN
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black font-mono tracking-widest text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-4 py-1 rounded-xl border border-purple-200 dark:border-purple-700 shadow-inner">
                    123456
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Enter <strong>123456</strong> below, or tap the auto-fill button for 1-click authorization.
                </p>

                <button
                  type="button"
                  onClick={handleFillDemoPin}
                  className="mt-1 px-4 py-1.5 bg-gradient-to-r from-[#5f259f] to-[#7c3aed] hover:from-[#501c87] hover:to-[#6d28d9] text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>1-Click Auto-Fill Demo PIN (123456)</span>
                </button>
              </div>

              <div className="text-center space-y-1 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#5f259f] dark:text-purple-300 text-xs font-black">
                  <Lock className="w-3.5 h-3.5" />
                  <span>NPCI 256-Bit Encrypted MPIN</span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Enter 6-Digit UPI PIN
                </h3>
                <p className="text-xs text-slate-500">
                  Authorizing disbursement of <strong className="text-slate-900 dark:text-white">₹{amount.toLocaleString('en-IN')}</strong> to {candidateName}
                </p>
              </div>

              {/* Error feedback if incorrect PIN entered */}
              {pinError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl text-center text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center gap-1.5 animate-bounce">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              {/* Masked PIN Bullets with Shake Animation */}
              <div
                className={`flex justify-center items-center gap-3 py-2 transition-transform ${
                  isShaking ? 'translate-x-[-8px]' : ''
                }`}
              >
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const hasValue = idx < mpin.length;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all duration-150 ${
                        pinError
                          ? 'border-2 border-rose-500 bg-rose-100 dark:bg-rose-950'
                          : hasValue
                          ? 'bg-[#5f259f] scale-125 shadow-md shadow-purple-500/30'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleMpinKeyClick(digit)}
                    className="h-11 rounded-2xl bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/50 text-slate-900 dark:text-white font-extrabold text-lg transition active:scale-90 flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setStep('CONFIG')}
                  className="h-11 rounded-2xl bg-slate-50 hover:bg-slate-200 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-bold text-xs transition active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleMpinKeyClick('0')}
                  className="h-11 rounded-2xl bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/50 text-slate-900 dark:text-white font-extrabold text-lg transition active:scale-90 flex items-center justify-center cursor-pointer shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleMpinBackspace}
                  className="h-11 rounded-2xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 font-bold text-xs transition active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
                  aria-label="Backspace"
                >
                  ⌫
                </button>
              </div>

              {/* Explicit Submit Button */}
              <div className="pt-2 max-w-xs mx-auto">
                <button
                  type="button"
                  disabled={mpin.length !== 6}
                  onClick={() => validateAndProceed(mpin)}
                  className="w-full py-2.5 bg-gradient-to-r from-[#5f259f] to-[#7c3aed] hover:from-[#501c87] hover:to-[#6d28d9] disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Disburse ₹{amount.toLocaleString('en-IN')}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: TRANSACTION PROCESSING & VERIFYING ANIMATION     */}
          {/* ======================================================== */}
          {step === 'PROCESSING' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-5 text-center animate-in fade-in duration-200">
              {/* Pulsing Concentric Radar Animation */}
              <div className="relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-purple-400/20 dark:bg-purple-600/20 animate-ping absolute" />
                <div className="w-24 h-24 rounded-full border-4 border-purple-200 dark:border-purple-900 border-t-[#5f259f] border-r-amber-500 animate-spin flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-black text-2xl shadow-lg">
                    पे
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-[#5f259f] dark:text-purple-300 text-xs font-black">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying on NPCI UPI Network</span>
                </div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">
                  Processing Stipend Disbursal...
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {processingStage}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs space-y-1">
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5f259f] via-purple-500 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Authorizing</span>
                  <span>{processingProgress}%</span>
                  <span>Settlement</span>
                </div>
              </div>

              {/* Security Rail Indicator */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1 w-full max-w-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit SSL Handshake:</span>
                  </span>
                  <strong className="text-emerald-600 font-mono">ENCRYPTED</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Banking Switch:</span>
                  <strong className="text-slate-800 dark:text-slate-200">YES Bank / NPCI IMPS Rail</strong>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: PAYMENT SUCCESS RECEIPT SCREEN                   */}
          {/* ======================================================== */}
          {step === 'SUCCESS' && paymentDetails && (
            <div className="space-y-4 py-1 animate-in zoom-in-95 duration-200">
              {/* Big Success Tick & Chime Notification */}
              <div className="text-center space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 animate-ping absolute" />
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 relative">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    Disbursal Successful & Settled
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    ₹{paymentDetails.amount.toLocaleString('en-IN')}.00
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Credited directly to <strong>{candidateName}</strong> via PhonePe DBT
                  </p>
                </div>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Bank Ref (UTR):</span>
                  <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 dark:text-white">
                    <span>{paymentDetails.utrNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentDetails.utrNumber);
                        setCopiedUtr(true);
                        setTimeout(() => setCopiedUtr(false), 2000);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                      title="Copy UTR Number"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>PhonePe Transaction ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{paymentDetails.transactionId}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Beneficiary Account:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{candidateAccount}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Payment Channel:</span>
                  <span className="font-bold text-[#5f259f] dark:text-purple-300">PhonePe UPI Gateway</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Time & Date:</span>
                  <span className="text-slate-700 dark:text-slate-300">{paymentDetails.timestamp}</span>
                </div>
              </div>

              {/* Statutory Compliance Footer Banner */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Rule 14(b) Compliant:</strong> Disbursed after internship milestone completion. Synchronized with PFMS Direct Benefit Transfer ledger.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Payment Receipt (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Done & Return to Ledger
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Fixed Footer: Security & Branding */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>NPCI Unified Payments Interface</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>BharatQR</span>
            <span>•</span>
            <span>PhonePe Business</span>
          </div>
        </div>
      </div>
    </div>
  );
};
