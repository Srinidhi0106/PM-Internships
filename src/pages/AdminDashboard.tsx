import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Search,
  Check,
  Award,
  Download,
  FileText
} from 'lucide-react';
import { Internship, User } from '../types';
import { PMCertificateModal } from '../components/PMCertificateModal';
import { useLanguage } from '../context/LanguageContext';

interface AdminDashboardProps {
  internships: Internship[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ internships }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [certCandidate, setCertCandidate] = useState<User>({
    id: 'ADMIN-CANDIDATE-01',
    name: 'Rahul Kumar Sharma',
    email: 'rahul.sharma@example.com',
    role: 'STUDENT',
    college: 'Indian Institute of Technology (IIT) Delhi',
    branch: 'Computer Science & AI',
    cgpa: 8.9
  });

  const flaggedList = internships.filter((i) => i.trustScore && i.trustScore < 90);
  const verifiedList = internships.filter((i) => !i.trustScore || i.trustScore >= 90);

  const handleOpenCertificate = (candidateName?: string) => {
    if (candidateName) {
      setCertCandidate(prev => ({ ...prev, name: candidateName }));
    }
    setShowCertModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MINISTRY OF CORPORATE AFFAIRS (GOVT OF INDIA)</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">National Audit & Governance Portal</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Audit top 500 corporate partner postings, issue official PM Scheme Certificates, and track national PM Internship Scheme metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold shrink-0">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Postings</span>
            <span className="text-amber-600 dark:text-amber-400 text-base font-black">{internships.length}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Flagged Scams</span>
            <span className="text-rose-600 dark:text-rose-400 text-base font-black">{flaggedList.length}</span>
          </div>
        </div>
      </div>

      {/* Official PM Scheme Certificate Generation & Download Desk */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900/10 border border-amber-300/60 dark:border-amber-800/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full text-xs">
            <Award className="w-4 h-4" />
            <span>PM Scheme Certificate Desk</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Official Govt PM Internship Certificate Generator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            Generate, preview, and download official verified PM Scheme Certificates with QR verification for candidate beneficiaries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Candidate Name or Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white w-full sm:w-64"
          />
          <button
            onClick={() => handleOpenCertificate(searchTerm || undefined)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition shrink-0 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        </div>
      </div>

      {/* Flagged Alert Desk */}
      {flaggedList.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Action Required: {flaggedList.length} Low-Trust Postings Detected by Smart AI Audit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.role}</h4>
                    <p className="text-slate-500">{item.companyName}</p>
                  </div>
                  <span className="font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {item.trustScore}% Trust
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold">
                    Block & Delist Posting
                  </button>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold">
                    Mark Verified
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* National Telemetry Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Youth Beneficiaries</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">1,25,000 / Yr</div>
          <p className="text-xs text-emerald-600 font-semibold">100% Fully MCA Funded</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Youth Stipend</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹5,000 / Month</div>
          <p className="text-xs text-slate-500 font-semibold">+ ₹6,000 One-time Incidentals</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Corporate CSR Contribution</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Top 500 Companies</div>
          <p className="text-xs text-indigo-600 font-semibold">100% Industry Partnership</p>
        </div>
      </div>

      <PMCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        user={certCandidate}
      />
    </div>
  );
};
