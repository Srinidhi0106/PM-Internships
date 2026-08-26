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
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'audit' | 'analytics' | 'regional'>('audit');
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

      {/* Navigation Tabs for Ministry Desk */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 sm:space-x-8 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Partner Postings Audit & Scams</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'analytics'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ministry Success Rate & Domain Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('regional')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'regional'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>Regional & Tier-2/3 Equity Trends</span>
        </button>
      </div>

      {/* TAB CONTENT: ANALYTICS & SUCCESS RATES */}
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
                  Overall Success: 91.2%
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {domainData.map(d => (
                  <div key={d.name} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 truncate">{d.name}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{d.rate} Success</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diversity & Equity Ratio */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  <span>Tier-2, Tier-3 & Rural Equity Distribution</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-md">
                  68% Affirmative Equity
                </span>
              </div>

              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diversityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {diversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Ensuring equal access for candidates from non-metro districts in accordance with MCA PM Internship directives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REGIONAL TRENDS */}
      {activeTab === 'regional' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>State & District Regional Adoption Trends</span>
              </h3>
              <p className="text-xs text-slate-500">Live monitoring of candidate registrations and top corporate placements across states</p>
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

      {/* TAB CONTENT: AUDIT DESK (FLAGGED & VERIFIED) */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
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
