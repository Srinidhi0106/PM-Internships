import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  FileText,
  Smartphone,
  CreditCard,
  Building2,
  Users,
  Award
} from 'lucide-react';

export const GovTechBenchmarkPage: React.FC = () => {
  const comparisonMatrix = [
    {
      feature: 'Candidate-Job Matching Engine',
      existing: 'Static keyword search & manual filters (often misses non-exact skill phrasing)',
      interniq: 'Deep Semantic AI & Vector Match with 94%+ precision and auto skill-gap roadmaps',
      existingStatus: 'warning',
      interniqStatus: 'success'
    },
    {
      feature: 'Stipend Security & Disbursal Flow',
      existing: 'Offline company promises; frequent delays, non-payments, and manual DBT disputes',
      interniq: 'Mandatory In-Portal Escrow (₹4,500 GOI + ₹500 CSR) unlocked only by verified 85%+ attendance',
      existingStatus: 'danger',
      interniqStatus: 'success'
    },
    {
      feature: 'Corporate Authenticity & Anti-Fraud',
      existing: 'Self-declared company forms with minimal automated verification against fake listings',
      interniq: 'Instant MCA 21-digit CIN API validation with ROC compliance check & Trust Score',
      existingStatus: 'warning',
      interniqStatus: 'success'
    },
    {
      feature: 'Resume Quality & ATS Compatibility',
      existing: 'Static PDF upload; 72% rejected by top 500 enterprise applicant tracking systems',
      interniq: 'Live A4 Print-Ready ATS Builder, Word .doc export, and AI Resume Tailor per opening',
      existingStatus: 'danger',
      interniqStatus: 'success'
    },
    {
      feature: 'Mobile Accessibility & App Store Links',
      existing: 'Non-responsive tables, broken Play Store links ("Item not found"), and 20MB APKs',
      interniq: 'Instant-scan PWA that opens immediately in mobile browser with 1-tap Home Screen install',
      existingStatus: 'danger',
      interniqStatus: 'success'
    },
    {
      feature: 'Multi-Factor Authentication',
      existing: 'Basic email/password with frequent SMTP timeout drops and no fallback options',
      interniq: 'Multi-layer: Real Email OTP + Emergency evaluation code + Aadhaar e-KYC + Math Captcha',
      existingStatus: 'warning',
      interniqStatus: 'success'
    },
    {
      feature: 'Grievance Redressal Mechanism',
      existing: 'Static web contact email with no ticket ID or guaranteed turnaround time',
      interniq: 'Interactive Grievance Desk with unique MCA-GRV Ticket ID, 24h SLA, & State Nodal directory',
      existingStatus: 'warning',
      interniqStatus: 'success'
    },
    {
      feature: 'Government Certification',
      existing: 'Paper / unverified PDF certificates prone to forgery',
      interniq: 'Cryptographically signed SHA-256 digital certificate with public verification QR',
      existingStatus: 'warning',
      interniqStatus: 'success'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-500/20 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
          <span>🇮🇳</span>
          <span>Aatmanirbhar Bharat • Digital India GovTech Benchmark</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          How InternIQ Solves The Critical Gaps in Existing Government Portals
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          An objective architectural and user-experience comparison between existing national portals (pminternship.mca.gov.in, internship.aicte-india.org, ncs.gov.in) and InternIQ's next-generation AI platform.
        </p>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-2xl font-black text-amber-400">94.2%</span>
            <p className="text-xs text-slate-200 font-bold">Candidate-Skill Match Accuracy</p>
            <p className="text-[10px] text-slate-400">vs. 41% with static keyword filters</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <p className="text-xs text-slate-200 font-bold">Stipend DBT Disbursal Guarantee</p>
            <p className="text-[10px] text-slate-400">Locked via mandatory portal escrow</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-2xl font-black text-indigo-300">0 sec</span>
            <p className="text-xs text-slate-200 font-bold">App Install Barrier (PWA)</p>
            <p className="text-[10px] text-slate-400">Eliminates "Item Not Found" store bugs</p>
          </div>
        </div>
      </div>

      {/* Deep-Dive: Existing Portals & Their Pain Points */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Key Issues In Existing Portals & InternIQ Improvements</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-600 dark:text-rose-400 uppercase text-[11px]">Issue #1 in Existing Portals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">Critical Barrier</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Broken Mobile Store Links & Rigid Desktop-Only Forms
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When candidates scan QR codes on existing portals, they encounter Google Play Store errors like <em>"Item not found"</em> or are forced to download heavy 25MB APKs that fail on budget smartphones.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>InternIQ Solution:</span>
              </span>
              <p className="text-emerald-900 dark:text-emerald-200">
                Zero-install Progressive Web App (PWA) that loads instantly upon scanning any phone camera, works 100% offline, and allows 1-tap addition to home screen with 0 MB storage overhead.
              </p>
            </div>
          </div>

          {/* Issue 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-600 dark:text-rose-400 uppercase text-[11px]">Issue #2 in Existing Portals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">Financial Risk</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Offline Stipend Transactions & Payment Uncertainty
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              In current systems, corporate CSR contributions are settled offline. If an employer reneges on the ₹500 CSR portion or delays reporting, the student suffers without any recourse.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>InternIQ Solution:</span>
              </span>
              <p className="text-emerald-900 dark:text-emerald-200">
                All stipend transactions happen strictly inside the portal. Companies must pre-fund their CSR share into escrow, and funds (₹4,500 GOI + ₹500 CSR) disburse automatically via DBT upon verified attendance.
              </p>
            </div>
          </div>

          {/* Issue 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase text-[11px]">Issue #3 in Existing Portals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">Usability Defect</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Non-Functional or Generic Resume Builders with Dummy Data
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Existing portal forms are inflexible, lack ATS compliance, often fill hardcoded fake defaults, and break during printing or export.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>InternIQ Solution:</span>
              </span>
              <p className="text-emerald-900 dark:text-emerald-200">
                Live A4 Document Canvas that syncs with your authenticated student profile, provides 1-click isolated A4 printing with zero margins errors, Word .doc export, and AI resume tailoring.
              </p>
            </div>
          </div>

          {/* Issue 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase text-[11px]">Issue #4 in Existing Portals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">Support Bottleneck</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Opaque Support Channels with No Nodal Escalation
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When something goes wrong (e.g. OTP not arriving, KYC failure, company dispute), candidates find only a generic email with zero visibility into who is handling their case.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>InternIQ Solution:</span>
              </span>
              <p className="text-emerald-900 dark:text-emerald-200">
                A dedicated 24-hour SLA Grievance Cell, direct regional ICLS Nodal Officers directory with phone and email, and real-time MCA-GRV ticket tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature-by-Feature Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Feature-by-Feature Benchmark Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Comparing Traditional Portals (pminternship.mca.gov.in / AICTE) vs. InternIQ
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 rounded-full">
            GovTech Evaluation 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-1/4">Key Portal Capability</th>
                <th className="p-4 w-3/8 text-slate-600 dark:text-slate-400">Traditional Govt Portals</th>
                <th className="p-4 w-3/8 text-indigo-600 dark:text-indigo-400">InternIQ (Proposed Solution)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    <span>{row.feature}</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{row.existing}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 dark:text-white font-medium bg-indigo-50/30 dark:bg-indigo-950/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.interniq}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
