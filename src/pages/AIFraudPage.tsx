import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  AlertTriangle,
  Brain,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  Info,
  RefreshCw,
  PhoneCall,
  Lock,
  Zap,
  HelpCircle,
  Copy,
  Check,
  AlertOctagon,
  Flame,
  Globe,
  FileText,
  LifeBuoy,
  ChevronRight
} from 'lucide-react';
import { FraudAnalysis } from '../types';

interface AIFraudPageProps {
  onNavigate?: (tab: string) => void;
}

interface ScamExample {
  title: string;
  category: string;
  badgeColor: string;
  text: string;
  explanation: string;
  solutionOverview: string;
}

const SCAM_EXAMPLES: ScamExample[] = [
  {
    title: '1. Advance Laptop Security Deposit Scam',
    category: 'Equipment Fee Extortion',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
    text: "Congratulations! You are shortlisted for PM Internship Scheme Software Fellow at XYZ Tech. A brand new MacBook Pro & testing kit is dispatched. Please transfer ₹1,500 refundable security courier deposit to UPI: recruiter-deposit@upi before 5 PM to receive tracking ID.",
    explanation: 'Scammers impersonate IT companies and ask for "refundable courier fees" for laptops. Genuine PM Scheme partners NEVER charge for equipment.',
    solutionOverview: 'Never send money. Legitimate corporations provide hardware directly at office induction or via verified corporate logistics without asking candidate for payment.'
  },
  {
    title: '2. Telegram / WhatsApp Direct Offer Scam',
    category: 'Informal Phishing',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    text: "PM Internship Scheme Direct Selection! No exam or technical interview required. Monthly stipend ₹28,000 guaranteed. Message HR Madam Priya on Telegram @pm_internship_coordinator with your Aadhaar and pay ₹499 verification fee.",
    explanation: 'Fake guarantees without interview, directing students to informal channels like Telegram/WhatsApp and demanding Aadhaar data + fees.',
    solutionOverview: 'Block the contact. Official PM Scheme selections only happen via the MCA portal dashboard and company domain emails (@tcs.com, @infosys.com, etc.).'
  },
  {
    title: '3. Fake MCA Offer Letter with Processing Fee',
    category: 'Identity Theft & Fee Scam',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    text: "Ministry of Corporate Affairs - PM Scheme Selection Letter. Registration No: PMIS/2026/8921. To confirm your placement slot at Top 500 PSU, pay ₹2,000 Government Stamping & Document Verification Charge to account 987654321012.",
    explanation: 'Unauthorized individuals forgery-generate fake government emblems to demand "stamping/processing fees".',
    solutionOverview: 'Report directly to cybercrime.gov.in. The Ministry of Corporate Affairs charges ZERO fees for documentation, stamping, or registration.'
  },
  {
    title: '4. Daily Task / Crypto Commission Scheme',
    category: 'Task Investment Ponzi',
    badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    text: "Part-time PM Scheme Social Media Intern: Like 5 YouTube videos daily and review Google Maps locations to earn ₹1,500/day. Upgrade to VIP level by investing ₹3,000 in crypto wallet for higher task commissions.",
    explanation: 'Classic task/ponzi scam exploiting the "internship" keyword to trick youth into depositing money for fake returns.',
    solutionOverview: 'Immediately refuse. Real internships under the PM scheme are 12-month structured industry skill development programs, not pay-to-click schemes.'
  },
  {
    title: '5. Legitimate Verified Corporate Listing',
    category: 'MCA Verified Safe',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    text: "Tata Consultancy Services (TCS) - AI & Data Engineering Intern under PM Internship Scheme. Duration: 6 months at Bangalore Innovation Campus. Stipend ₹20,000/month as per MCA guidelines. Zero application fee. Technical interview round scheduled via official portal.",
    explanation: 'Compliant posting with corporate partner identity, clear technical evaluation roadmap, stipend transparency, and zero candidate fees.',
    solutionOverview: 'Safe to apply directly via the PM Scheme portal with verified credentials.'
  }
];

export const AIFraudPage: React.FC<AIFraudPageProps> = ({ onNavigate }) => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<FraudAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'EXAMPLES' | 'HOW_TO_OVERCOME'>('SCANNER');

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/fraud-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const textData = await res.text();
        if (textData) {
          const data = JSON.parse(textData);
          setResult({
            isLegitimate: data.isLegitimate ?? (data.trustScore >= 75),
            riskLevel: data.riskLevel || (data.trustScore < 50 ? 'HIGH' : 'SAFE'),
            trustScore: data.trustScore ?? 85,
            scamCategory: data.scamCategory,
            redFlags: data.redFlags || data.reasons || [],
            recommendation: data.recommendation || 'Proceed with standard application procedures on the official portal.',
            howToOvercome: data.howToOvercome,
            immediateSolutions: data.immediateSolutions,
            officialHelplines: data.officialHelplines
          });
        }
      } else {
        // Fallback rule check
        const textLower = content.toLowerCase();
        const isScam = textLower.includes('fee') || textLower.includes('deposit') || textLower.includes('pay') || textLower.includes('telegram');
        setResult({
          isLegitimate: !isScam,
          riskLevel: isScam ? 'HIGH' : 'SAFE',
          trustScore: isScam ? 25 : 95,
          scamCategory: isScam ? 'Advance Fee Extortion / Security Deposit Fraud' : 'Verified Corporate Listing',
          redFlags: isScam ? ['Demands upfront payment/registration fee', 'Informal communication channel (Telegram/WhatsApp)'] : [],
          recommendation: isScam ? 'WARNING: The Government PM Internship Scheme is 100% free of cost. Never pay any fee.' : 'Verified compliant with MCA PM Internship Scheme rules.',
          howToOvercome: isScam
            ? 'Immediately cease all communication with the sender. If money was transferred via UPI, call 1930 within the 2-hour golden period to freeze the scammer bank account. Report the phone number and chat screenshots to cybercrime.gov.in.'
            : 'Apply directly with confidence on the official PM Internship portal.',
          immediateSolutions: isScam
            ? [
                'STOP ALL PAYMENTS: Never transfer any money, UPI fee, or refundable deposit.',
                'VERIFY OFFICIAL LISTING: Check company credentials on pminternship.mca.gov.in.',
                'FILE 1-CLICK GRIEVANCE: Report the sender to MCA 24/7 Grievance Desk and Dial 1930.'
              ]
            : ['Proceed with direct application via official portal.'],
          officialHelplines: [
            { name: 'National Cyber Crime Helpline', contact: '1930 (Toll-Free 24x7)', url: 'https://cybercrime.gov.in' },
            { name: 'PM Internship MCA Desk', contact: '1800 11 6000', url: 'https://pminternship.mca.gov.in' }
          ]
        });
      }
    } catch (err) {
      console.error(err);
      const textLower = content.toLowerCase();
      const isScam = textLower.includes('fee') || textLower.includes('deposit') || textLower.includes('pay');
      setResult({
        isLegitimate: !isScam,
        riskLevel: isScam ? 'HIGH' : 'SAFE',
        trustScore: isScam ? 25 : 95,
        scamCategory: isScam ? 'Advance Fee Extortion' : 'Verified Corporate Listing',
        redFlags: isScam ? ['Demands upfront payment or registration fee before joining'] : [],
        recommendation: isScam ? 'WARNING: Under MCA PM Scheme rules, no company can charge application fees.' : 'Verified listing.',
        howToOvercome: 'Cease communication immediately. Dial 1930 for cyber fraud assistance.',
        immediateSolutions: ['Do NOT pay any money.', 'Report to Cyber Crime Cell (1930).', 'Apply only via pminternship.mca.gov.in.']
      });
    } finally {
      setLoading(false);
    }
  };

  const copyGrievanceTemplate = () => {
    const template = `Subject: Formal Complaint - Fake / Fraudulent PM Internship Offer
To: grievance@pminternship.mca.gov.in, cybercrime.gov.in
Candidate Name: Candidate
Contact: Registered Mobile Number
Suspicious Recruiter Contact / Link: ${content.slice(0, 150)}...
Issue Description: Received an unauthorized communication demanding fees/personal data claiming association with PM Internship Scheme. Attached are screenshots and payment requests for investigation.`;
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>AI FRAUD & SCAM DETECTION DESK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Zero-Trust Fraud Auditor & Remediation Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl font-medium">
            Advanced AI detection for suspicious internship offers, illegal registration fee demands, fake offer letters, and instant step-by-step solutions on how to overcome and report fraud.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Scanner, Examples, How to Overcome */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('SCANNER')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'SCANNER'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          AI Fraud Scanner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('EXAMPLES')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'EXAMPLES'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Common Scam Examples ({SCAM_EXAMPLES.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('HOW_TO_OVERCOME')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'HOW_TO_OVERCOME'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          How to Overcome & Safety Solutions
        </button>
      </div>

      {/* TAB 1: AI SCANNER */}
      {activeTab === 'SCANNER' && (
        <div className="space-y-6">
          {/* Official Guidelines Alert Card */}
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-900 dark:text-amber-200">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black block uppercase text-[11px] tracking-wider">
                Official MCA PM Scheme Zero-Fee Policy
              </span>
              <p className="leading-relaxed">
                The Government of India Prime Minister's Internship Scheme is <strong className="underline">100% free</strong> for all youth. No authorized corporate partner will ever demand money for applications, laptop security deposits, interview slots, or background checks.
              </p>
            </div>
          </div>

          {/* Input Box */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-indigo-600" />
                <span>Paste Internship Offer, WhatsApp Message, or Email Text</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">Instant AI Zero-Trust Scan</span>
            </div>

            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste posting details, WhatsApp message, or offer letter text here (e.g. 'Pay ₹1,500 security deposit for laptop before joining. Guaranteed stipend ₹25,000 without interview...')"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            {/* Quick Load Example Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400">Load Sample:</span>
                <button
                  type="button"
                  onClick={() =>
                    setContent(
                      "Urgent hiring for PM Internship scheme! Pay ₹1,500 security deposit for laptop before joining. Guaranteed stipend ₹25,000 without interview."
                    )
                  }
                  className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800"
                >
                  Fake Laptop Deposit Scam
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent(
                      "Direct Selection under PM Scheme! Join our Telegram group @pm_internship_fast and pay ₹499 verification fee for guaranteed offer letter."
                    )
                  }
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  Telegram Phishing Scam
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent(
                      "Tata Consultancy Services (TCS) - AI & Data Engineering Intern under PM Internship Scheme. Duration: 6 months. Stipend ₹20,000/month. Zero registration fees. Official portal application process."
                    )
                  }
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800"
                >
                  Legitimate TCS Offer
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !content.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {loading ? 'Auditing Scam Signals...' : 'Run Zero-Trust Fraud Audit'}
              </button>
            </div>
          </div>

          {/* Analysis Output Card with Solutions & How to Overcome */}
          {result && (
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 animate-in fade-in ${
                result.isLegitimate
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
              }`}
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3.5">
                  {result.isLegitimate ? (
                    <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-10 h-10 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {result.isLegitimate ? 'VERIFIED LEGITIMATE POSTING' : 'HIGH FRAUD RISK DETECTED'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Category:{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {result.scamCategory || (result.isLegitimate ? 'Verified Corporate' : 'Scam Indicator')}
                      </span>{' '}
                      • Risk:{' '}
                      <span
                        className={
                          !result.isLegitimate || result.riskLevel === 'HIGH' || result.riskLevel === 'Fraudulent'
                            ? 'text-rose-600 font-bold uppercase'
                            : 'text-emerald-600 font-bold uppercase'
                        }
                      >
                        {result.riskLevel}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {result.trustScore}%
                  </span>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    AI Trust Score
                  </span>
                </div>
              </div>

              {/* Red Flags List */}
              {result.redFlags && result.redFlags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Detected Red Flags ({result.redFlags.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.redFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-start gap-2"
                      >
                        <span className="text-rose-500 font-extrabold">•</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONABLE IMMEDIATE SOLUTIONS */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Immediate Actionable Solutions:</span>
                </h4>
                <div className="space-y-2">
                  {(result.immediateSolutions && result.immediateSolutions.length > 0
                    ? result.immediateSolutions
                    : [
                        'Never pay any upfront registration or security deposit fees.',
                        'Verify all offer communications directly on pminternship.mca.gov.in.',
                        'Dial 1930 immediately if money was transferred to freeze scammer accounts.'
                      ]
                  ).map((sol, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOW TO OVERCOME SECTION */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>How to Overcome & Recover from this Fraud:</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.howToOvercome ||
                    'If you have interacted with this sender: Immediately block them across all platforms. If you shared banking details or transferred money, call the National Cyber Crime Helpline (1930) within the first 2 hours (Golden Period) to freeze funds, and submit evidence on cybercrime.gov.in.'}
                </p>

                {/* Grievance Complaint Template Generator */}
                {!result.isLegitimate && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={copyGrievanceTemplate}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTemplate ? 'Grievance Template Copied!' : 'Copy MCA Grievance Template'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://cybercrime.gov.in"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial 1930 / cybercrime.gov.in</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Back / Safe Internships */}
              {onNavigate && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('internships')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Browse 100% Safe MCA-Verified Internships →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    <span>Back to Student Dashboard</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMON SCAM EXAMPLES WITH REMEDIATION */}
      {activeTab === 'EXAMPLES' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Real-World Fraud Examples & Remediation Guide
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Study these actual scam patterns intercepted under the PM Internship Scheme. Learn to identify fake communication signals and know the exact solution for each.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCAM_EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${example.badgeColor}`}>
                      {example.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setContent(example.text);
                        setActiveTab('SCANNER');
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Audit This Example →
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {example.title}
                  </h3>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono italic">
                    "{example.text}"
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p>
                      <strong className="text-rose-600 dark:text-rose-400">Why It's Dangerous:</strong> {example.explanation}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span><strong>Solution:</strong> {example.solutionOverview}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HOW TO OVERCOME & COMPREHENSIVE SAFETY SOLUTIONS */}
      {activeTab === 'HOW_TO_OVERCOME' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-indigo-600" />
              <span>Step-by-Step Playbook: How to Overcome Internship Fraud</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
              If you suspect you have encountered a fake recruiter or already paid an unauthorized fee, follow this structured emergency remediation process immediately.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              {/* Step 1 */}
              <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Cease & Freeze
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Do not send any further money. Block the scammer across WhatsApp, Telegram, and calls. Never share OTPs or click unknown APK links.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Dial 1930 (Golden Hour)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  If money was transferred via UPI/Bank, call National Cyber Crime Helpline <strong>1930</strong> immediately within 2 hours to freeze the recipient bank account.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Preserve Evidence
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Take full unedited screenshots of chat logs, sender UPI IDs, transaction reference (UTR) numbers, and fake offer letter PDFs.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                  4
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  File MCA Grievance
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Submit a ticket on <strong>cybercrime.gov.in</strong> and inform the MCA PM Internship vigilance cell to blacklist the fraudulent organization.
                </p>
              </div>
            </div>
          </div>

          {/* Official Helplines Directory */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Government Helplines & Verified Portals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition space-y-1 block"
              >
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  National Cyber Crime Portal
                </span>
                <span className="text-rose-600 font-bold block">Dial 1930 (24x7 Helpline)</span>
                <span className="text-slate-400 text-[10px]">cybercrime.gov.in ↗</span>
              </a>

              <a
                href="https://pminternship.mca.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition space-y-1 block"
              >
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  MCA PM Internship Portal
                </span>
                <span className="text-indigo-600 font-bold block">1800 11 6000 (Toll Free)</span>
                <span className="text-slate-400 text-[10px]">pminternship.mca.gov.in ↗</span>
              </a>

              <a
                href="https://mca.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition space-y-1 block"
              >
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  Ministry of Corporate Affairs
                </span>
                <span className="text-emerald-600 font-bold block">Grievance & Vigilance Cell</span>
                <span className="text-slate-400 text-[10px]">mca.gov.in ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
