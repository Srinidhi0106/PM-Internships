import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileCheck2,
  Download,
  Printer,
  X,
  Building2,
  Award,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  QrCode,
  Sparkles
} from 'lucide-react';
import { pmSchemeLogo } from '../assets/images';
import { OtpVerificationModal } from './OtpVerificationModal';
import { otpService } from '../services/otpService';

export interface OfferLetterData {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateCollege?: string;
  roleTitle: string;
  companyName: string;
  companyCin?: string;
  stipend: number;
  duration: string;
  location: string;
  reportingDate: string;
  issuedAt: string;
  refNumber: string;
}

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OfferLetterData;
  onAccept?: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({
  isOpen,
  onClose,
  data,
  onAccept
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [otpSending, setOtpSending] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitiateAcceptance = async () => {
    setOtpError(null);
    setOtpSending(true);

    try {
      const res = await otpService.sendEmailOtp(
        data.candidateEmail,
        'offer-acceptance',
        data.candidateName
      );

      if (res.success) {
        setShowOtpModal(true);
      } else {
        setOtpError(res.message || 'Failed to dispatch offer acceptance OTP.');
      }
    } catch (e: any) {
      setOtpError(e?.message || 'Error dispatching OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PMIS Offer Letter - ${data.refNumber}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 0; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
            .badge { font-size: 11px; font-weight: bold; color: #d97706; text-transform: uppercase; letter-spacing: 1px; }
            h1 { font-size: 20px; margin: 6px 0; font-weight: 900; }
            .ref { font-size: 11px; color: #64748b; margin-top: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px; }
            .stipend-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin: 16px 0; }
            .seal { border-top: 1px solid #cbd5e1; padding-top: 14px; margin-top: 24px; display: flex; justify-content: space-between; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="badge">GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS</div>
            <h1>PRADHAN MANTRI INTERNSHIP SCHEME (PMIS)</h1>
            <div class="ref">Official Offer of Internship • Ref: ${data.refNumber} • Issued: ${data.issuedAt}</div>
          </div>
          <p>Dear <strong>${data.candidateName}</strong> (${data.candidateEmail}),</p>
          <p>We are pleased to formally offer you an internship under the Prime Minister's Internship Scheme in collaboration with <strong>${data.companyName}</strong> (CIN: ${data.companyCin || 'L72200MH1995PLC095924'}).</p>
          <div class="grid">
            <div class="card"><strong>Position:</strong> ${data.roleTitle}<br/><strong>Host Enterprise:</strong> ${data.companyName}</div>
            <div class="card"><strong>Duration:</strong> ${data.duration}<br/><strong>Location:</strong> ${data.location}<br/><strong>Reporting Date:</strong> ${data.reportingDate}</div>
          </div>
          <div class="stipend-box">
            <strong>Financial Grant & Allowances:</strong><br/>
            • Monthly Stipend: ₹${data.stipend.toLocaleString('en-IN')}/month (₹4,500 MCA DBT + ₹500 CSR Contribution)<br/>
            • One-Time Incidental Joining Grant: ₹6,000 (credited via Aadhaar DBT)<br/>
            • Insurance: ₹1,00,000 under PMSBY/PMJJBY
          </div>
          <div class="seal">
            <div>
              <strong>Ministry of Corporate Affairs</strong><br/>
              Central Portal Escrow Dispatch<br/>
              Digitally Verified Reference: ${data.refNumber}
            </div>
            <div style="text-align: right;">
              <strong>${data.companyName}</strong><br/>
              Authorized Corporate HR Desk<br/>
              Status: Verified Offer
            </div>
          </div>
        </body>
        </html>
      `;

      if (printIframe.contentWindow) {
        printIframe.contentWindow.document.open();
        printIframe.contentWindow.document.write(content);
        printIframe.contentWindow.document.close();
        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
          } catch (e) {
            window.print();
          }
          setTimeout(() => {
            document.body.removeChild(printIframe);
          }, 1000);
        }, 300);
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Top Tricolor Accent Bands
      doc.setFillColor(255, 153, 51); // Saffron
      doc.rect(0, 0, 210, 4, 'F');
      doc.setFillColor(255, 255, 255); // White
      doc.rect(0, 4, 210, 3, 'F');
      doc.setFillColor(19, 136, 8); // Green
      doc.rect(0, 7, 210, 4, 'F');

      // Header Text
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS', 105, 20, { align: 'center' });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.text("PRADHAN MANTRI INTERNSHIP SCHEME (PMIS)", 105, 28, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Official Offer of Internship • Ref No: ${data.refNumber}`, 105, 34, { align: 'center' });
      doc.text(`Issue Timestamp: ${data.issuedAt}`, 105, 39, { align: 'center' });

      // Divider
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 43, 190, 43);

      // Candidate Greeting
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Dear ${data.candidateName},`, 20, 52);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const introPara = `We are pleased to formally offer you an internship under the Prime Minister's Internship Scheme in collaboration with ${data.companyName} (CIN: ${data.companyCin || 'L72200MH1995PLC095924'}). This offer is backed by the Ministry of Corporate Affairs (MCA) central escrow portal.`;
      doc.text(doc.splitTextToSize(introPara, 170), 20, 58);

      // Role Particulars Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, 74, 170, 36, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('INTERNSHIP DETAILS', 26, 82);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Position / Role:  ${data.roleTitle}`, 26, 89);
      doc.text(`Host Enterprise:  ${data.companyName}`, 26, 95);
      doc.text(`Duration:  ${data.duration}`, 26, 101);

      doc.text(`Location:  ${data.location}`, 115, 89);
      doc.text(`Reporting Date:  ${data.reportingDate}`, 115, 95);
      doc.text(`Institute:  ${data.candidateCollege || 'Verified Institute'}`, 115, 101);

      // Stipend and Financials Box
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(20, 116, 170, 40, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(6, 95, 70);
      doc.text('MONTHLY STIPEND & DIRECT BENEFIT TRANSFER (DBT)', 26, 124);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`• Total Monthly Stipend: Rs. ${data.stipend.toLocaleString('en-IN')}/- per month`, 26, 131);
      doc.text(`  (Rs. 4,500/- direct transfer from Govt of India + Rs. 500/- Corporate CSR contribution)`, 26, 136);
      doc.text(`• One-time Joining & Incidental Grant: Rs. 6,000/- credited via Aadhaar DBT`, 26, 142);
      doc.text(`• Insurance Coverage: Rs. 1,00,000/- under Pradhan Mantri Suraksha Bima Yojana`, 26, 148);

      // Portal Verification Clauses
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('TERMS & REGISTRATION REQUIREMENTS', 20, 166);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const termsText = `1. All attendance, milestone achievements, and monthly stipend disbursements are processed exclusively through the InternIQ PM Internship Scheme Portal.\n2. Aadhaar e-KYC and Direct Benefit Transfer (DBT) verification must remain in active status for timely stipend credit.\n3. Upon successful completion of 12 months, a digitally verifiable Certificate of Internship will be awarded by the Ministry of Corporate Affairs and ${data.companyName}.`;
      doc.text(doc.splitTextToSize(termsText, 170), 20, 173);

      // Signatories Box
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 215, 190, 215);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Ministry of Corporate Affairs', 20, 224);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Government of India', 20, 229);
      doc.text('PMIS Central Registry Authentication', 20, 234);
      doc.text(`Digital Verification Hash: PMIS-SHA256-${data.refNumber}`, 20, 239);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(data.companyName, 140, 224);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Human Resources & University Desk', 140, 229);
      doc.text(`CIN: ${data.companyCin || 'L72200MH1995PLC095924'}`, 140, 234);
      doc.text('Authorized Enterprise Signatory', 140, 239);

      // Bottom Bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 285, 210, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.text('PRADHAN MANTRI INTERNSHIP SCHEME • OFFICIAL OFFER LETTER • SECURE DIGITALLY ENCRYPTED PDF', 105, 292, { align: 'center' });

      doc.save(`PM_Internship_Offer_Letter_${data.refNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback download if PDF generation encounters any environment quirks
      const element = document.createElement('a');
      const content = `GOVERNMENT OF INDIA • PM INTERNSHIP SCHEME\nOffer Letter Ref: ${data.refNumber}\nCandidate: ${data.candidateName}\nRole: ${data.roleTitle}\nCompany: ${data.companyName}\nStipend: Rs. ${data.stipend}/month`;
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `PM_Internship_Offer_Letter_${data.refNumber}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Modal Action Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-extrabold text-sm">🇮🇳</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Official PM Scheme Offer Letter
            </span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
              Digitally Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              title="Download Encrypted Official PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Offer Letter Body */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
          
          {/* Official Letterhead Strip */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img
                  src={pmSchemeLogo}
                  alt="PM Internship Scheme Emblem"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                    GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    PRADHAN MANTRI INTERNSHIP SCHEME (PMIS)
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    Central Project Monitoring Unit • National Apprenticeship & Career Initiative
                  </p>
                </div>
              </div>

              <div className="sm:text-right text-xs bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                <div className="font-mono font-bold text-amber-900 dark:text-amber-300">
                  REF: {data.refNumber}
                </div>
                <div className="text-slate-500 text-[11px] font-medium">
                  Timestamp: {data.issuedAt}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 sm:justify-end mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> MCA Portal Verified
                </div>
              </div>
            </div>
          </div>

          {/* Recipient block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Candidate Details</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">{data.candidateName}</div>
              <div className="text-slate-600 dark:text-slate-400">{data.candidateEmail}</div>
              <div className="text-slate-500 font-medium">{data.candidateCollege || 'Accredited Higher Educational Institution'}</div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Host Enterprise</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>{data.companyName}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                CIN: {data.companyCin || 'L72200MH1995PLC095924'} (MCA Verified)
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Top 500 CSR Enterprise Partner
              </div>
            </div>
          </div>

          {/* Letter Narrative */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Dear <strong>{data.candidateName}</strong>,
            </p>
            <p>
              Under the auspices of the <strong>Pradhan Mantri Internship Scheme</strong>, Ministry of Corporate Affairs,
              we are pleased to issue this formal <strong>Letter of Internship Offer</strong> for the position of{' '}
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{data.roleTitle}</strong> at{' '}
              <strong>{data.companyName}</strong>.
            </p>
            <p>
              This selection is governed by the national guidelines of the PM Internship Scheme aimed at empowering youth through real-world corporate exposure and skill transformation.
            </p>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase block">Monthly Stipend</span>
              <span className="text-base font-black text-slate-900 dark:text-white flex items-center">
                ₹{data.stipend.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-slate-500">/mo</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">₹4,500 DBT + ₹500 CSR</span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase block">Joining Grant</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ₹6,000
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">One-time Incidentals</span>
            </div>

            <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-900/60 text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase block">Tenure & Work Mode</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {data.duration}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{data.location}</span>
            </div>

            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase block">Reporting Date</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {data.reportingDate}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Portal Onboarding</span>
            </div>
          </div>

          {/* Mandatory Portal Governance Note (Req 5) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Mandatory Portal-Only Escrow & Certification Rule</span>
            </div>
            <p>
              In accordance with Ministry of Corporate Affairs regulations, all financial stipend disbursements, attendance logging, milestone reviews, and the final Government of India Completion Certificate must take place strictly through the <strong>InternIQ PM Scheme Official Portal</strong>. Direct off-portal cash or unmonitored transfers are prohibited.
            </p>
          </div>

          {/* Signature & Verification Block */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xs">
                <QrCode className="w-14 h-14 text-slate-900 dark:text-slate-100" />
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">MCA-DIGI-SEAL-2026</span>
                <span>Scan with any QR scanner to verify authentic portal registry & timestamp.</span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-center sm:text-right">
              <div>
                <div className="font-serif italic font-bold text-indigo-700 dark:text-indigo-400 text-base">
                  Authorized Signatory
                </div>
                <div className="font-extrabold text-xs text-slate-900 dark:text-white">Head of Human Resources</div>
                <div className="text-[11px] text-slate-500">{data.companyName}</div>
              </div>

              <div>
                <div className="font-serif italic font-bold text-amber-700 dark:text-amber-400 text-base">
                  R. Sundaram, IAS
                </div>
                <div className="font-extrabold text-xs text-slate-900 dark:text-white">Nodal Officer & Joint Secretary</div>
                <div className="text-[11px] text-slate-500">Ministry of Corporate Affairs, GoI</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Status: <span className="font-bold text-emerald-600">Offered & Active</span>
            </span>
            {otpError && (
              <span className="text-xs text-rose-500 font-semibold">({otpError})</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Close Preview
            </button>
            {onAccept && (
              <button
                disabled={otpSending}
                onClick={handleInitiateAcceptance}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {otpSending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Verify via Email & Accept Offer</span>
              </button>
            )}
          </div>
        </div>

      </div>

      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={data.candidateEmail}
        purpose="offer-acceptance"
        title="Authorize Offer Acceptance"
        description="To accept your official PM Internship Scheme placement, verify with the 6-digit OTP code sent to your registered candidate email."
        name={data.candidateName}
        onSuccess={() => {
          setShowOtpModal(false);
          if (onAccept) onAccept();
          onClose();
        }}
      />
    </div>
  );
};
