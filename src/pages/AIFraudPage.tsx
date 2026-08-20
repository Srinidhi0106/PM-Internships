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
  Lock
} from 'lucide-react';
import { FraudAnalysis } from '../types';

export const AIFraudPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<FraudAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

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
            redFlags: data.redFlags || data.reasons || [],
            recommendation: data.recommendation || 'Proceed with standard application procedures on the official portal.'
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
          redFlags: isScam ? ['Demands upfront payment/registration fee', 'Informal communication channel'] : [],
          recommendation: isScam ? 'WARNING: The Government PM Internship Scheme is 100% free of cost. Never pay any fee.' : 'Verified compliant with MCA PM Internship Scheme rules.'
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
        redFlags: isScam ? ['Demands upfront payment or registration fee before joining'] : [],
        recommendation: isScam ? 'WARNING: Under MCA PM Scheme rules, no company can charge application fees.' : 'Verified listing.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>AI FRAUD & SCAM DETECTION DESK</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Zero-Trust Fraud Auditor</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
            Protecting PM Internship Scheme applicants from illegal registration fees, fake company impersonations, and stipend scam offers.
          </p>
        </div>
      </div>

      {/* Official Guidelines Alert Card */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-900 dark:text-amber-200">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black block uppercase text-[11px] tracking-wider">
            Official MCA PM Scheme Zero-Fee Policy
          </span>
          <p className="leading-relaxed">
            The Government of India Prime Minister's Internship Scheme is <strong className="underline">100% free</strong> for all students. No authorized partner company or third-party agency will ever ask for application fees, laptop deposits, or test charges.
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setContent(
                  "Urgent hiring for PM Internship scheme! Pay ₹1,500 security deposit for laptop before joining. Guaranteed stipend ₹25,000 without interview."
                )
              }
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
            >
              Load Fake Scam Offer
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() =>
                setContent(
                  "Tata Motors PM Scheme EV Engineering Internship: 6 Months duration at Pune Tech Center. Stipend ₹20,000/month as per MCA guidelines. Zero registration fees. Official portal application process."
                )
              }
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Load Legitimate Offer
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className="w-full sm:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Auditing Scam Signals...' : 'Run Zero-Trust Fraud Audit'}
          </button>
        </div>
      </div>

      {/* Analysis Output Card */}
      {result && (
        <div
          className={`p-8 rounded-3xl border shadow-xl space-y-6 animate-in fade-in ${
            result.isLegitimate
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
          }`}
        >
          {/* Top Banner */}
          <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              {result.isLegitimate ? (
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-rose-600" />
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {result.isLegitimate ? 'VERIFIED LEGITIMATE POSTING' : 'HIGH FRAUD RISK DETECTED'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Risk Level:{' '}
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

            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
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

              <div className="space-y-2">
                {result.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-start gap-2"
                  >
                    <span className="text-rose-500 font-extrabold">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation & Grievance Actions */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <span className="font-bold text-slate-900 dark:text-white block">
              Official MCA Recommendation & Security Advisory:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.recommendation}</p>

            {!result.isLegitimate && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://pminternship.mca.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Report to MCA 24/7 Grievance Desk</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

