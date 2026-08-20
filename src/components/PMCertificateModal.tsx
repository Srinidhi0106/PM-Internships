import React, { useRef } from 'react';
import { Award, Download, X, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PMCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const PMCertificateModal: React.FC<PMCertificateModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { t } = useLanguage();
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadImage = () => {
    // Generate a high quality PNG certificate using HTML Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient & Border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1200, 850);

    // Decorative Gold Outer Border
    ctx.strokeStyle = '#D97706'; // Amber 600
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1140, 790);

    // Inner Thin Line
    ctx.strokeStyle = '#1E293B'; // Slate 800
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 760);

    // Header Text - Govt of India
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 22px serif';
    ctx.fillText('GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS', 600, 110);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 36px serif';
    ctx.fillText('PM INTERNSHIP SCHEME (PMIS)', 600, 160);

    ctx.fillStyle = '#64748B';
    ctx.font = '16px sans-serif';
    ctx.fillText('NATIONAL SKILLS & YOUTH OPPORTUNITY PORTAL', 600, 190);

    // Divider
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300, 210);
    ctx.lineTo(900, 210);
    ctx.stroke();

    // Certificate Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText('OFFICIAL CERTIFICATE OF ELIGIBILITY & REGISTRATION', 600, 270);

    // Body Text
    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText('This is to certify that candidate', 600, 330);

    // Candidate Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText(user.name.toUpperCase(), 600, 390);

    // Candidate Details
    ctx.fillStyle = '#475569';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Student at ${user.college || 'Recognized Indian University'} (${user.branch || 'General Stream'})`, 600, 435);
    ctx.fillText(`Registration ID: PMIS-2026-${user.id ? user.id.slice(0, 8).toUpperCase() : 'IND9842'}`, 600, 465);

    // Citation Body
    ctx.fillStyle = '#1E293B';
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText('has been officially verified and registered under the Prime Minister\'s Internship Scheme,', 600, 520);
    ctx.fillText('empowering youth with industry training across India\'s Top 500 Corporate Partners.', 600, 550);

    // Badges & Seal
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(100, 620, 260, 120);
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(100, 620, 260, 120);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('✓ VERIFIED BY MCA', 230, 660);
    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Issued Date: ${new Date().toLocaleDateString('en-IN')}`, 230, 690);

    // Stamp / Signatures
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Dr. Manoj Sharma, IAS', 950, 670);
    ctx.fillStyle = '#64748B';
    ctx.font = '14px sans-serif';
    ctx.fillText('Joint Secretary, Govt of India', 950, 695);

    // Trigger image download
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `PM_Internship_Certificate_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 relative shadow-2xl space-y-6">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                PM Scheme Official Certificate
              </h2>
              <p className="text-xs text-slate-500">Ministry of Corporate Affairs • Govt of India</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Download Certificate (PNG)
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div
          ref={certRef}
          className="bg-amber-50/30 dark:bg-slate-950 border-4 border-amber-600/80 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden space-y-6 shadow-inner"
        >
          {/* Subtle Background Watermark / Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-600" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-widest bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government of India • Ministry of Corporate Affairs</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white pt-2 font-serif">
              PM INTERNSHIP SCHEME (PMIS)
            </h1>
            <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
              Official Candidate Registration & Participation Certificate
            </p>
          </div>

          <div className="w-32 h-0.5 bg-amber-500 mx-auto" />

          {/* Recipient Details */}
          <div className="space-y-3 relative z-10 py-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
              This official government credential certifies that
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400 font-serif tracking-wide uppercase">
              {user.name}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              {user.college || 'Indian University'} • Branch: {user.branch || 'Technology & Governance'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Registration ID: PMIS-2026-{(user.id || 'GOVIND842').slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Citation Paragraph */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed relative z-10 font-serif">
            Is successfully registered on the National PM Internship Portal and is recognized as an eligible candidate for placement across India's Top 500 Corporate Partner companies with a monthly stipend of ₹5,000.
          </p>

          {/* Bottom Footer Verification Seals */}
          <div className="pt-6 border-t border-amber-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-left relative z-10 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center font-bold border border-emerald-300 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Govt Verified Profile</p>
                <p className="text-[10px] text-slate-500">Issued: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-serif font-black text-slate-900 dark:text-white text-sm">Dr. Manoj Sharma, IAS</p>
              <p className="text-[10px] text-slate-500 font-bold">Joint Secretary, Ministry of Corporate Affairs</p>
              <p className="text-[9px] text-amber-600 font-semibold">Govt of India Official Seal</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
