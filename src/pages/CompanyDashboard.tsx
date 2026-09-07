import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Search,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  Mail,
  FileCheck2,
  Download,
  Trash2,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Award,
  CreditCard,
  Landmark,
  FileText,
  RefreshCw,
  Receipt,
  Share2
} from 'lucide-react';
import { User, Internship, Application } from '../types';
import { SkillSelectDropdown } from '../components/SkillSelectDropdown';
import { OfferLetterModal, OfferLetterData } from '../components/OfferLetterModal';

interface CompanyDashboardProps {
  user: User;
  internships: Internship[];
  applications: Application[];
  onAddInternship: (newRole: Partial<Internship>) => void;
  onUpdateApplicationStatus: (appId: string, status: 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED') => void;
  onDeleteInternship?: (id: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  user,
  internships,
  applications,
  onAddInternship,
  onUpdateApplicationStatus,
  onDeleteInternship
}) => {
  const [activeTab, setActiveTab] = useState<
    'candidates' | 'post-role' | 'my-roles' | 'security-check' | 'diversity-analytics' | 'portal-transactions'
  >('candidates');
  const [candidateFilter, setCandidateFilter] = useState<'ALL' | 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Portal Banking & Transactions State
  const [escrowBalance, setEscrowBalance] = useState<number>(450000); // INR 4.5 Lakhs in RBI escrow
  const [disbursedLogs, setDisbursedLogs] = useState<{
    id: string;
    candidateName: string;
    accountMasked: string;
    amount: number;
    dbtReference: string;
    utrNumber: string;
    timestamp: string;
    status: 'SUCCESS' | 'PROCESSING';
  }[]>([
    {
      id: 'tx-101',
      candidateName: 'Rahul Verma',
      accountMasked: 'SBI •••• 4921',
      amount: 15000,
      dbtReference: 'MCA/DBT/2026/09/8812',
      utrNumber: 'P1422609071249102',
      timestamp: 'Today, 10:15 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-102',
      candidateName: 'Aarav Patel',
      accountMasked: 'HDFC •••• 8104',
      amount: 15000,
      dbtReference: 'MCA/DBT/2026/09/8813',
      utrNumber: 'P1422609071249103',
      timestamp: 'Yesterday',
      status: 'SUCCESS'
    }
  ]);
  const [selectedCandidateForCert, setSelectedCandidateForCert] = useState<string | null>(null);
  const [certIssuedNotice, setCertIssuedNotice] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);

  // Offer Letter Modal State
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferLetterData | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // Email Notification Dispatch Toast State
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    candidateName: string;
    email: string;
    status: string;
    timestamp: string;
  } | null>(null);

  // New Internship Role Form State
  const [roleTitle, setRoleTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & Machine Learning');
  const [stipend, setStipend] = useState(15000);
  const [location, setLocation] = useState('Bengaluru');
  const [mode, setMode] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Hybrid');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [openings, setOpenings] = useState(5);
  const [postSuccessMsg, setPostSuccessMsg] = useState<string | null>(null);

  // CIN Security Check State
  const [cinNumber, setCinNumber] = useState('L72200MH1995PLC095924');
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [cinVerificationResult, setCinVerificationResult] = useState<{
    status: 'VERIFIED' | 'PENDING';
    rocStatus: string;
    escrowLinked: boolean;
    trustScore: number;
    auditDate: string;
  }>({
    status: 'VERIFIED',
    rocStatus: 'ACTIVE / COMPLIANT (ROC Mumbai, MCA)',
    escrowLinked: true,
    trustScore: 99,
    auditDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  const companyRoles = internships.filter((i) => i.companyName === user.companyName || user.role === 'COMPANY');

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle || !description) return;

    onAddInternship({
      role: roleTitle,
      companyName: user.companyName || 'Corporate Partner Tech',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      domain,
      stipend: Number(stipend),
      location,
      mode,
      duration: '12 Months',
      minCGPA: 7.0,
      skillsRequired: skillsList.length > 0 ? skillsList : ['Problem Solving'],
      description,
      responsibilities: ['Collaborate on engineering tasks', 'Deploy production models'],
      openings: Number(openings) || 5,
      trustScore: 98
    });

    setPostSuccessMsg('✓ New PM Internship role published and verified by MCA Trust Engine!');
    setRoleTitle('');
    setDescription('');
    setTimeout(() => {
      setPostSuccessMsg(null);
      setActiveTab('my-roles');
    }, 1500);
  };

  const handleRunSecurityCheck = () => {
    setIsVerifyingCin(true);
    setTimeout(() => {
      setIsVerifyingCin(false);
      setCinVerificationResult({
        status: 'VERIFIED',
        rocStatus: 'ACTIVE & REGULARLY FILED (ROC Mumbai, MCA)',
        escrowLinked: true,
        trustScore: 99,
        auditDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }, 900);
  };

  const triggerStatusUpdate = (app: Application, newStatus: 'SHORTLISTED' | 'SELECTED' | 'REJECTED') => {
    onUpdateApplicationStatus(app.id, newStatus);
    const nowTimestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const candidateEmail = app.studentEmail || `${(app.studentName || 'candidate').toLowerCase().replace(/\s+/g, '.')}@example.com`;

    // Show Automated Email Confirmation Banner
    setNotificationToast({
      show: true,
      candidateName: app.studentName || 'Candidate',
      email: candidateEmail,
      status: newStatus,
      timestamp: nowTimestamp
    });

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setNotificationToast(null);
    }, 6000);
  };

  const handleOpenOfferLetter = (app: Application) => {
    const candidateEmail = app.studentEmail || `${(app.studentName || 'candidate').toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const nowIso = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const reportingIso = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    setSelectedOfferLetter({
      id: `OFFER-${app.id}`,
      candidateName: app.studentName || 'Selected Intern',
      candidateEmail: candidateEmail,
      candidateCollege: app.studentCollege || 'Indian Institute of Technology (IIT) Delhi',
      roleTitle: 'Software Engineering & AI Intern',
      companyName: user.companyName || 'Tata Consultancy Services',
      companyCin: cinNumber,
      stipend: 15000,
      duration: '12 Months',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      reportingDate: reportingIso,
      issuedAt: nowIso,
      refNumber: app.offerLetterRef || `PMIS-OFFER-${Date.now().toString().slice(-6)}`
    });
    setOfferModalOpen(true);
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
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
      !searchQuery ||
      app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentCollege?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-amber-300 shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {user.companyName || 'Corporate Recruiter Portal'}
              </h1>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> MCA Partner Verified
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                CIN: {cinNumber}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Recruiter Officer: {user.name || 'Priya Mehta'} • PM Internship Scheme National Partner Hub
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('security-check')}
            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>CIN Security Check</span>
          </button>
          <button
            onClick={() => setActiveTab('post-role')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Post New Internship
          </button>
        </div>
      </div>

      {/* Automated Email Notification Dispatch Banner */}
      {notificationToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-400 dark:border-emerald-700 rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Automated Candidate Email Dispatched
                </span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {notificationToast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                Official status update email delivered to <strong className="font-bold text-slate-900 dark:text-white">{notificationToast.candidateName}</strong> at <code className="bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-900 dark:text-emerald-200 font-mono text-[11px]">{notificationToast.email}</code>. Status marked as <strong className="font-black text-emerald-700 dark:text-emerald-300">[{notificationToast.status}]</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'candidates'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-roles')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'my-roles'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Active Postings ({companyRoles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('post-role')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'post-role'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Post New Role</span>
        </button>

        <button
          onClick={() => setActiveTab('security-check')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'security-check'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>CIN Verification & Escrow</span>
        </button>

        <button
          onClick={() => setActiveTab('diversity-analytics')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'diversity-analytics'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Diversity Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('portal-transactions')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'portal-transactions'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Portal Transactions & Banking</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-extrabold">
            Mandatory DBT
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CANDIDATES PIPELINE (APPLIED, SHORTLISTED, SELECTED WITH TIMESTAMPS) */}
      {/* ========================================================================= */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter Pills */}
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
                Applied ({applications.filter(a => a.status === 'APPLIED' || a.status === 'Applied').length})
              </button>
              <button
                onClick={() => setCandidateFilter('SHORTLISTED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'SHORTLISTED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Shortlisted ({applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'Shortlisted').length})
              </button>
              <button
                onClick={() => setCandidateFilter('SELECTED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'SELECTED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Selected ({applications.filter(a => a.status === 'SELECTED' || a.status === 'Selected').length})
              </button>
              <button
                onClick={() => setCandidateFilter('REJECTED')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  candidateFilter === 'REJECTED'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Rejected ({applications.filter(a => a.status === 'REJECTED' || a.status === 'Rejected').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate or college..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredApplications.length === 0 ? (
              <div className="col-span-full p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-3">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-black text-slate-700 dark:text-slate-300">No candidate applications found</h3>
                <p className="text-xs text-slate-500">Try adjusting your filter or search criteria.</p>
              </div>
            ) : (
              filteredApplications.map((app) => {
                const isSelected = app.status === 'SELECTED' || app.status === 'Selected';
                const isShortlisted = app.status === 'SHORTLISTED' || app.status === 'Shortlisted';
                const isApplied = app.status === 'APPLIED' || app.status === 'Applied';
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
                    {/* Top Row: Candidate Name & Match Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-slate-900 dark:text-white">
                            {app.studentName || 'Candidate Applicant'}
                          </h3>
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
                          {app.studentCollege || 'IIT Delhi'} • {app.studentBranch || 'Computer Science'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                          {app.aiScore || 94}% AI Match
                        </span>
                      </div>
                    </div>

                    {/* Academic & Timestamp Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic CGPA</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                          {app.studentCgpa || app.studentCGPA || 8.8} / 10
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Timestamp</span>
                        <div className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>
                            {isSelected && app.selectedAt
                              ? new Date(app.selectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                              : isShortlisted && app.shortlistedAt
                              ? new Date(app.shortlistedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                              : '04 Sep 2026, 05:20 PM'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Automated Notification Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                      <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Automated notification email actively synced with timestamp seal
                      </span>
                    </div>

                    {/* Candidate Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {isSelected && (
                        <button
                          onClick={() => handleOpenOfferLetter(app)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Issue / View Offer Letter</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => triggerStatusUpdate(app, 'REJECTED')}
                          disabled={isRejected}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => triggerStatusUpdate(app, 'SHORTLISTED')}
                          disabled={isShortlisted}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-40"
                        >
                          Shortlist
                        </button>

                        <button
                          onClick={() => triggerStatusUpdate(app, 'SELECTED')}
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
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACTIVE POSTINGS (MY ROLES) */}
      {/* ========================================================================= */}
      {activeTab === 'my-roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Live Verified Opportunities ({companyRoles.length})
            </h2>
            <button
              onClick={() => setActiveTab('post-role')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyRoles.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">{item.role}</h3>
                    <p className="text-xs text-slate-500 font-medium">{item.domain}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ₹{item.stipend.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Openings</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.openings || 5} Seats</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mode</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.mode || 'Hybrid'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicants</span>
                    <span className="font-bold text-amber-600">{applications.length} Applied</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published on MCA Registry
                  </span>
                  {onDeleteInternship && (
                    <button
                      onClick={() => onDeleteInternship(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Close Role
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: POST NEW ROLE */}
      {/* ========================================================================= */}
      {activeTab === 'post-role' && (
        <form onSubmit={handleCreateRole} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Create New PM Internship Opportunity</h2>
              <p className="text-xs text-slate-500">Auto-audited for legitimacy and DBT Escrow stipend linkage</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Internship Role Title</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. AI Systems Engineer Intern"
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                  <option value="Software Engineering & Web Development">Software Engineering</option>
                  <option value="Hardware & Embedded Systems">Hardware & Embedded Systems</option>
                  <option value="Electrical & Green Energy">Electrical & Green Energy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Monthly Stipend (₹)</label>
                <input
                  type="number"
                  value={stipend}
                  onChange={(e) => setStipend(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Work Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'Remote' | 'Hybrid' | 'Onsite')}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Total Openings</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={openings}
                  onChange={(e) => setOpenings(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <SkillSelectDropdown
                selectedSkills={skillsList}
                onChange={setSkillsList}
                label="Required Technical Competencies & Skills"
                placeholder="Select required skills from verified dropdown catalog..."
                helperText="Candidate matching AI evaluates applicants against these selected verified competencies."
                maxSkills={10}
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Role Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project responsibilities and learning outcomes..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-3 font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Role to National Portal</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CIN VERIFICATION & SECURITY CHECK */}
      {/* ========================================================================= */}
      {activeTab === 'security-check' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Corporate CIN & Security Audit Verification
                </h2>
                <p className="text-xs text-slate-500">
                  Direct live bridge with MCA Ministry of Corporate Affairs ROC Registry
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  21-Digit Corporate Identification Number (CIN)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={21}
                    value={cinNumber}
                    onChange={(e) => setCinNumber(e.target.value.toUpperCase())}
                    className="flex-1 font-mono uppercase bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-black text-slate-900 dark:text-white tracking-widest text-sm"
                  />
                  <button
                    onClick={handleRunSecurityCheck}
                    disabled={isVerifyingCin}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingCin ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Run Live Security Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Report Card */}
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm">
                      MCA Security Check Passed (Verified Safe)
                    </span>
                  </div>
                  <span className="text-xs font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full">
                    Trust Score {cinVerificationResult.trustScore}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ROC MCA Status</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{cinVerificationResult.rocStatus}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">DBT Stipend Escrow</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">Linked & Auto-Disbursement Enabled</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Last verified on: <strong>{cinVerificationResult.auditDate}</strong> • Digital cryptographic seal verified by MCA Portal.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DIVERSITY ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'diversity-analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Applications Received</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{applications.length + 1840}</div>
              <span className="text-[10px] text-emerald-600 font-bold">+18% cycle momentum</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600">Avg AI Match Quality</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">89.2%</div>
              <span className="text-[10px] text-slate-500 font-medium">Verified technical competence</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-600">Tier-2/3 District Ratio</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-300">54.6%</div>
              <span className="text-[10px] text-emerald-600 font-bold">✓ Exceeds 40% PM Mandate</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-600">Gender Diversity</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-300">47.8%</div>
              <span className="text-[10px] text-slate-500 font-medium">Female Candidate Ratio</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PORTAL TRANSACTIONS & BANKING (ESCROW, DBT & DIGITAL CERTIFICATES) */}
      {/* ========================================================================= */}
      {activeTab === 'portal-transactions' && (
        <div className="space-y-6">
          {/* Statutory Policy Guarantee Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 mt-0.5">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Government of India Mandatory Portal Banking & Certification Rule 14(b)
                </span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 px-2 py-0.5 rounded-full font-bold">
                  Zero Off-Platform Allowed
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                When an enterprise accepts an intern under the Prime Minister's Internship Scheme, <strong>all subsequent transactions must be conducted exclusively through this portal</strong>. This encompasses corporate escrow reserves, Aadhaar Payment Bridge (APBS) Direct Benefit Transfers (DBT), monthly CSR stipends, and digitally signed completion certificates pushed directly to DigiLocker.
              </p>
            </div>
          </div>

          {/* Top Row: Escrow Vault Status & Quick Deposit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Corporate Escrow Account (PFMS / RBI Linked)
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      CIN Verified: {cinNumber}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Active
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-4 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Available Stipend Reserve</span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ₹{escrowBalance.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-xs text-slate-400 pl-4 border-l border-slate-700 space-y-1">
                  <div>• Monthly Outflow: <strong>₹{applications.filter(a => a.status === 'SELECTED').length * 15000 || 30000}/mo</strong></div>
                  <div>• Runway: <strong>{(escrowBalance / (applications.filter(a => a.status === 'SELECTED').length * 15000 || 30000)).toFixed(1)} Months</strong></div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deposit CSR Funds to Portal Escrow</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationToast({
                      show: true,
                      candidateName: 'Escrow Audit',
                      email: 'nodal.officer@mca.gov.in',
                      status: 'AUDIT_VERIFIED',
                      timestamp: 'Just now'
                    });
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download RBI Escrow Certificate</span>
                </button>
              </div>
            </div>

            {/* Quick DBT Stats */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                DBT Disbursal Performance
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">On-Time Disbursal:</span>
                  <span className="text-emerald-600">100% (Zero Delayed)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Aadhaar APBS Linkage:</span>
                  <span className="text-indigo-600">100% Seeded</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Certificates Issued:</span>
                  <span className="text-purple-600">12 Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">DigiLocker Pushed:</span>
                  <span className="text-emerald-600">✓ 100% Compliant</span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                🛡️ All payments directly credit candidate Jan Dhan/Aadhaar accounts with 0 intermediary delays.
              </div>
            </div>
          </div>

          {/* Section 2: Accepted Interns Direct Banking & Stipend Disbursal Roster */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Accepted Interns Banking & Stipend Disbursal Roster</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Execute monthly stipend transfers directly through the portal with real-time PFMS / APBS banking rails.
                </p>
              </div>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 rounded-full w-fit">
                {applications.filter(a => a.status === 'SELECTED').length || 2} Accepted Candidates
              </span>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                    <th className="pb-3">Candidate / Role</th>
                    <th className="pb-3">Aadhaar Bank Seeded</th>
                    <th className="pb-3">Monthly Breakdown</th>
                    <th className="pb-3">Portal Payment Action</th>
                    <th className="pb-3 text-right">Digital Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      id: 'sel-1',
                      name: 'Rohan Sharma',
                      role: 'AI & Full-Stack Systems Engineer',
                      college: 'JNTU Hyderabad',
                      bank: 'State Bank of India (SBIN0004921)',
                      account: '•••• 4921',
                      dbtStatus: 'Active',
                      stipend: 15000,
                      certIssued: true
                    },
                    {
                      id: 'sel-2',
                      name: 'Aarav Patel',
                      role: 'Data Science & Machine Learning Intern',
                      college: 'IIT Delhi',
                      bank: 'HDFC Bank (HDFC0001842)',
                      account: '•••• 8104',
                      dbtStatus: 'Active',
                      stipend: 15000,
                      certIssued: false
                    }
                  ].map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 pr-3">
                        <div className="font-extrabold text-slate-900 dark:text-white">{cand.name}</div>
                        <div className="text-[11px] text-slate-500">{cand.role}</div>
                        <div className="text-[10px] text-indigo-600 font-semibold">{cand.college}</div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{cand.bank}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">A/c: {cand.account}</div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                          ✓ APBS Direct Benefit Ready
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-black text-slate-900 dark:text-white">
                          ₹{cand.stipend.toLocaleString('en-IN')}/month
                        </div>
                        <div className="text-[10px] text-slate-500">
                          (Govt: ₹4,500 + Company: ₹{(cand.stipend - 4500).toLocaleString('en-IN')})
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (escrowBalance < cand.stipend) {
                              alert('Escrow balance insufficient. Please deposit funds.');
                              return;
                            }
                            const newLog = {
                              id: `tx-${Date.now()}`,
                              candidateName: cand.name,
                              accountMasked: cand.bank.split(' ')[0] + ' ' + cand.account,
                              amount: cand.stipend,
                              dbtReference: `MCA/DBT/2026/09/${Math.floor(1000 + Math.random() * 9000)}`,
                              utrNumber: `P142260907${Math.floor(1000000 + Math.random() * 9000000)}`,
                              timestamp: 'Just now',
                              status: 'SUCCESS' as const
                            };
                            setEscrowBalance(prev => prev - cand.stipend);
                            setDisbursedLogs([newLog, ...disbursedLogs]);
                            setNotificationToast({
                              show: true,
                              candidateName: cand.name,
                              email: 'candidate@pminternship.gov.in',
                              status: 'STIPEND_DISBURSED_₹' + cand.stipend,
                              timestamp: 'Just now'
                            });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                          title="Disburse monthly stipend through RBI/PFMS directly to candidate account"
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Disburse ₹{cand.stipend.toLocaleString('en-IN')}</span>
                        </button>
                      </td>
                      <td className="py-3.5 text-right">
                        {cand.certIssued ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              <Award className="w-3 h-3" /> DigiLocker Synced
                            </span>
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCandidateForCert(cand.name);
                                  setCertIssuedNotice(`Digital Certificate for ${cand.name} verified with MCA QR Code.`);
                                  setTimeout(() => setCertIssuedNotice(null), 4000);
                                }}
                                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                              >
                                View Certificate
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidateForCert(cand.name);
                              setCertIssuedNotice(`✓ Successfully generated and signed MCA PM Scheme Certificate for ${cand.name}! Pushed to DigiLocker.`);
                              setTimeout(() => setCertIssuedNotice(null), 4000);
                            }}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                            title="Generate official digital certificate and push to DigiLocker"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Issue Certificate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {certIssuedNotice && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 rounded-2xl text-xs text-purple-900 dark:text-purple-200 font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{certIssuedNotice}</span>
              </div>
            )}
          </div>

          {/* Section 3: Official Real-time Banking Audit Trail (PFMS / APBS Rails) */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Live Banking Transaction Ledger & PFMS Settlement Receipts
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Encrypted SHA-256 Audit Trail
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Candidate & Bank</th>
                    <th className="pb-2">PFMS Reference</th>
                    <th className="pb-2">Bank UTR #</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {disbursedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 pr-2 text-slate-500 font-sans text-[11px]">{log.timestamp}</td>
                      <td className="py-2.5 pr-2 font-sans font-bold text-slate-800 dark:text-slate-200">
                        {log.candidateName} <span className="text-slate-400 text-[10px]">({log.accountMasked})</span>
                      </td>
                      <td className="py-2.5 pr-2 text-indigo-600 text-[11px]">{log.dbtReference}</td>
                      <td className="py-2.5 pr-2 text-slate-600 dark:text-slate-400 text-[11px]">{log.utrNumber}</td>
                      <td className="py-2.5 pr-2 font-black text-slate-900 dark:text-white font-sans">
                        ₹{log.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-right font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deposit Escrow Modal */}
          {showDepositModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Corporate Escrow Deposit
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">
                    Deposit funds into the Ministry of Corporate Affairs linked RBI PM Scheme Escrow Pool to guarantee automated monthly stipend payments.
                  </p>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Deposit Amount (INR)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[25000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        +₹{(amt / 1000)}k
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Payment Method:</span>
                      <strong className="text-slate-800 dark:text-slate-200">Corporate NetBanking / RTGS</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Beneficiary:</span>
                      <strong className="text-slate-800 dark:text-slate-200">RBI PM-Scheme Escrow Trust</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEscrowBalance(prev => prev + depositAmount);
                      setShowDepositModal(false);
                      setNotificationToast({
                        show: true,
                        candidateName: 'Corporate Escrow',
                        email: 'accounts@company.com',
                        status: `ESCROW_CREDITED_₹${depositAmount.toLocaleString('en-IN')}`,
                        timestamp: 'Just now'
                      });
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-md transition cursor-pointer"
                  >
                    Confirm & Transfer ₹{depositAmount.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Offer Letter Modal */}
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
