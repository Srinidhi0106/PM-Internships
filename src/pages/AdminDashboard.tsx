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
  FileText,
  TrendingUp,
  MapPin,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  Clock,
  Mail,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Internship, Application, User } from '../types';
import { PMCertificateModal } from '../components/PMCertificateModal';
import { OfferLetterModal, OfferLetterData } from '../components/OfferLetterModal';
import { useLanguage } from '../context/LanguageContext';

interface AdminDashboardProps {
  internships: Internship[];
  applications?: Application[];
  onUpdateApplicationStatus?: (appId: string, status: 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  internships,
  applications = [],
  onUpdateApplicationStatus
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'candidates' | 'analytics' | 'regional'>('audit');
  const [candidateFilter, setCandidateFilter] = useState<'ALL' | 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED'>('ALL');

  // Offer Letter State
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferLetterData | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // Email Notification Toast State
  const [emailNotificationToast, setEmailNotificationToast] = useState<{
    candidateName: string;
    email: string;
    status: string;
    timestamp: string;
  } | null>(null);

  const [certCandidate, setCertCandidate] = useState<User>({
    id: 'ADMIN-CANDIDATE-01',
    name: 'Rahul Kumar Sharma',
    email: 'rahul.sharma@example.com',
    role: 'STUDENT',
    college: 'Indian Institute of Technology (IIT) Delhi',
    branch: 'Computer Science & AI',
    cgpa: 8.9
  });

  const domainData = [
    { name: 'AI & Data Eng', count: 480, rate: '94%' },
    { name: 'Software & Cloud', count: 420, rate: '91%' },
    { name: 'EV & Smart Hardware', count: 310, rate: '88%' },
    { name: 'FinTech & Banking', count: 240, rate: '86%' },
    { name: 'Green Energy & Solar', count: 190, rate: '89%' }
  ];

  const regionalData = [
    { state: 'Maharashtra', count: 3400, tier2Ratio: '58%' },
    { state: 'Karnataka', count: 3100, tier2Ratio: '62%' },
    { state: 'Tamil Nadu', count: 2600, tier2Ratio: '65%' },
    { state: 'Uttar Pradesh', count: 2400, tier2Ratio: '78%' },
    { state: 'Telangana', count: 2100, tier2Ratio: '55%' },
    { state: 'Gujarat', count: 1800, tier2Ratio: '60%' },
    { state: 'Madhya Pradesh', count: 1500, tier2Ratio: '84%' }
  ];

  const diversityData = [
    { name: 'Tier 2 & 3 Cities (Equity)', value: 68, color: '#f59e0b' },
    { name: 'Tier 1 Metro Applicants', value: 32, color: '#6366f1' }
  ];

  const flaggedList = internships.filter((i) => i.trustScore && i.trustScore < 90);
  const verifiedList = internships.filter((i) => !i.trustScore || i.trustScore >= 90);

  const handleOpenCertificate = (candidateName?: string) => {
    if (candidateName) {
      setCertCandidate((prev) => ({ ...prev, name: candidateName }));
    }
    setShowCertModal(true);
  };

  const handleAdminStatusChange = (app: Application, newStatus: 'SHORTLISTED' | 'SELECTED' | 'REJECTED') => {
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(app.id, newStatus);
    }
    const timestampStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const email = app.studentEmail || `${(app.studentName || 'candidate').toLowerCase().replace(/\s+/g, '.')}@example.com`;

    setEmailNotificationToast({
      candidateName: app.studentName || 'Candidate',
      email,
      status: newStatus,
      timestamp: timestampStr
    });

    setTimeout(() => {
      setEmailNotificationToast(null);
    }, 6000);
  };

  const handleViewOffer = (app: Application) => {
    const candidateEmail = app.studentEmail || `${(app.studentName || 'candidate').toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const nowIso = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const reportingIso = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    setSelectedOfferLetter({
      id: `OFFER-${app.id}`,
      candidateName: app.studentName || 'Selected Intern',
      candidateEmail: candidateEmail,
      candidateCollege: app.studentCollege || 'IIT Delhi',
      roleTitle: 'Software Engineering & AI Intern',
      companyName: 'Tata Consultancy Services',
      companyCin: 'L72200MH1995PLC095924',
      stipend: 15000,
      duration: '12 Months',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      reportingDate: reportingIso,
      issuedAt: nowIso,
      refNumber: app.offerLetterRef || `PMIS-OFFER-${Date.now().toString().slice(-6)}`
    });
    setOfferModalOpen(true);
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter =
      candidateFilter === 'ALL'
        ? true
        : candidateFilter === 'APPLIED'
        ? app.status === 'APPLIED' || app.status === 'Applied'
        : candidateFilter === 'SHORTLISTED'
        ? app.status === 'SHORTLISTED' || app.status === 'Shortlisted'
        : candidateFilter === 'SELECTED'
        ? app.status === 'SELECTED' || app.status === 'Selected'
        : app.status === 'REJECTED' || app.status === 'Rejected';

    const matchesSearch =
      !searchTerm ||
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentCollege?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>MINISTRY OF CORPORATE AFFAIRS (GOVT OF INDIA)</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">National Audit & Governance Portal</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Supervise corporate CIN compliance, oversee candidate candidate workflows (Applied, Shortlisted, Selected with timestamps), and dispatch automated notifications under the PM Internship Scheme.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold shrink-0 text-center">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Postings</span>
            <span className="text-amber-600 dark:text-amber-400 text-base font-black">{internships.length}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Applicants</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base font-black">{applications.length}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Flagged</span>
            <span className="text-rose-600 dark:text-rose-400 text-base font-black">{flaggedList.length}</span>
          </div>
        </div>
      </div>

      {/* Automated Email Dispatched Toast Alert */}
      {emailNotificationToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-400 dark:border-emerald-700 rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Ministry Automated Email Notification Dispatched
                </span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {emailNotificationToast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                Candidate <strong className="font-bold text-slate-900 dark:text-white">{emailNotificationToast.candidateName}</strong> ({emailNotificationToast.email}) notified of official status: <strong className="font-black text-emerald-700 dark:text-emerald-300">[{emailNotificationToast.status}]</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmailNotificationToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs for Ministry Desk */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 sm:space-x-8 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Corporate CIN & Postings Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'candidates'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>National Candidate Pipeline ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Domain Placements & DBT Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('regional')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'regional'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>Regional & Tier-2/3 Equity</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CORPORATE CIN & POSTINGS AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Flagged Scams Alert Box */}
          {flaggedList.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Action Required: {flaggedList.length} Low-Trust Postings Detected by AI Audit</span>
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
                      <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold cursor-pointer">
                        Block & Delist Posting
                      </button>
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer">
                        Mark Verified
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Corporate Partners with Verified CINs */}
          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-500">
              Verified Corporate Partners (CIN & MCA ROC Active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedList.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">{item.companyName}</h4>
                      <p className="text-slate-500 font-semibold">{item.role}</p>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                      ✓ CIN Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">CIN Code</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">L72200MH1995PLC095924</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">Stipend Rate</span>
                      <span className="font-bold text-emerald-600">₹{item.stipend.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>ROC Filing Status: <strong className="text-emerald-600">Active</strong></span>
                    <span>Trust Index: <strong className="text-amber-500">{item.trustScore || 98}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CANDIDATE PIPELINE (APPLIED, SHORTLISTED, SELECTED WITH TIMESTAMPS) */}
      {/* ========================================================================= */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setCandidateFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setCandidateFilter('APPLIED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'APPLIED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Applied ({applications.filter((a) => a.status === 'APPLIED' || a.status === 'Applied').length})
              </button>
              <button
                onClick={() => setCandidateFilter('SHORTLISTED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'SHORTLISTED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Shortlisted ({applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'Shortlisted').length})
              </button>
              <button
                onClick={() => setCandidateFilter('SELECTED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'SELECTED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Selected ({applications.filter((a) => a.status === 'SELECTED' || a.status === 'Selected').length})
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate, roll no, college..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Candidate Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => {
              const isSelected = app.status === 'SELECTED' || app.status === 'Selected';
              const isShortlisted = app.status === 'SHORTLISTED' || app.status === 'Shortlisted';
              const isRejected = app.status === 'REJECTED' || app.status === 'Rejected';

              return (
                <div
                  key={app.id}
                  className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border transition shadow-xs space-y-4 ${
                    isSelected
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20'
                      : isShortlisted
                      ? 'border-amber-300 dark:border-amber-800 bg-amber-50/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-slate-900 dark:text-white">
                          {app.studentName || 'Candidate Applicant'}
                        </h4>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isSelected
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                              : isShortlisted
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
                        {app.studentCollege || 'IIT Delhi'} • CGPA {app.studentCgpa || 8.8} / 10
                      </p>
                    </div>

                    <span className="text-xs font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full shrink-0">
                      {app.aiScore || 94}% AI Match
                    </span>
                  </div>

                  {/* Timestamp Card */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Timestamp</span>
                      <div className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>
                          {isSelected && app.selectedAt
                            ? new Date(app.selectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                            : isShortlisted && app.shortlistedAt
                            ? new Date(app.shortlistedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                            : '04 Sep 2026, 05:22 PM'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Automated Email</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Dispatched
                      </span>
                    </div>
                  </div>

                  {/* Oversight Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {isSelected && (
                      <button
                        onClick={() => handleViewOffer(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Govt Offer Letter</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleAdminStatusChange(app, 'REJECTED')}
                        disabled={isRejected}
                        className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-50 transition cursor-pointer disabled:opacity-40"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleAdminStatusChange(app, 'SHORTLISTED')}
                        disabled={isShortlisted}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-40"
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() => handleAdminStatusChange(app, 'SELECTED')}
                        disabled={isSelected}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition cursor-pointer disabled:opacity-40 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Select Candidate</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANALYTICS & SUCCESS RATES */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Success Rates */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Popular Domains & Placement Success Rates</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
                  Active Cycle
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diversity Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-500" />
                <span>Geographic Tier-2 / Tier-3 Distribution</span>
              </h3>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diversityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {diversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REGIONAL TRENDS */}
      {/* ========================================================================= */}
      {activeTab === 'regional' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>State & District Regional Adoption Trends</span>
              </h3>
              <p className="text-xs text-slate-500">Live monitoring of candidate registrations across states</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
              36 States & UTs Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionalData.map((r) => (
              <div key={r.state} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{r.state}</h4>
                  <span className="text-xs font-black text-amber-500">{r.count.toLocaleString()} Enrolled</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tier-2/3 Inclusivity:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{r.tier2Ratio}</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: r.tier2Ratio }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official PM Scheme Certificate Desk */}
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
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition shrink-0 w-full sm:w-auto cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        </div>
      </div>

      {/* Modals */}
      <PMCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        user={certCandidate}
      />

      {selectedOfferLetter && (
        <OfferLetterModal
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          data={selectedOfferLetter}
        />
      )}
    </div>
  );
};
