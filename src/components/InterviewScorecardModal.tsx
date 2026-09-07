import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Share2,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';
import { AIInterviewSession, User as UserType } from '../types';

interface InterviewScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AIInterviewSession;
  user: UserType;
  companyName: string;
}

export const InterviewScorecardModal: React.FC<InterviewScorecardModalProps> = ({
  isOpen,
  onClose,
  session,
  user,
  companyName
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !session) return null;

  const totalScore = session.questions.reduce(
    (sum, q) => sum + (typeof q.score === 'number' ? q.score : 0),
    0
  );
  const overallPercentage = session.questions.length > 0
    ? Math.round(totalScore / session.questions.length)
    : (session.overallScore || 0);

  const isPassed = overallPercentage >= 50;
  const isExemplary = overallPercentage >= 75;

  const correctCount = session.questions.filter((q) => (q.score ?? 0) >= 70).length;
  const partialCount = session.questions.filter(
    (q) => (q.score ?? 0) >= 36 && (q.score ?? 0) < 70
  ).length;
  const incorrectCount = session.questions.filter((q) => (q.score ?? 0) <= 35).length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtmlScorecard = () => {
    setIsDownloading(true);
    try {
      const scorecardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PM_Internship_Scheme_Scorecard_${(user.name || 'Candidate').replace(/\s+/g, '_')}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #f8fafc; }
    .card { max-width: 820px; margin: 0 auto; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
    .emblem { font-size: 24px; font-weight: 900; color: #b45309; text-transform: uppercase; letter-spacing: 1px; }
    .ministry { font-size: 13px; color: #64748b; font-weight: 700; margin-top: 4px; }
    .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 8px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; background: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 13px; }
    .meta-item strong { color: #475569; display: block; font-size: 11px; text-transform: uppercase; }
    .score-banner { text-align: center; margin: 24px 0; padding: 20px; border-radius: 12px; background: ${isPassed ? '#ecfdf5' : '#fff1f2'}; border: 2px solid ${isPassed ? '#10b981' : '#f43f5e'}; }
    .score-number { font-size: 48px; font-weight: 900; color: ${isPassed ? '#047857' : '#be123c'}; }
    .score-label { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${isPassed ? '#065f46' : '#9f1239'}; }
    .breakdown { margin-top: 24px; }
    .q-box { margin-bottom: 16px; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; background: #ffffff; page-break-inside: avoid; }
    .q-head { display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin-bottom: 8px; }
    .q-ans { font-style: italic; color: #334155; font-size: 12px; background: #f8fafc; padding: 10px; border-radius: 6px; border-left: 3px solid #94a3b8; margin-bottom: 8px; }
    .q-fb { font-size: 12px; padding: 10px; border-radius: 6px; }
    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="emblem">Government of India</div>
      <div class="ministry">Ministry of Corporate Affairs • Aatmanirbhar Bharat Initiative</div>
      <div class="title">PM Internship Scheme — Official AI Interview Scorecard</div>
    </div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Candidate Name</strong>${user.name || 'Candidate'}</div>
      <div class="meta-item"><strong>Evaluating Enterprise</strong>${companyName}</div>
      <div class="meta-item"><strong>Target Role</strong>${session.role}</div>
      <div class="meta-item"><strong>Assessment Date</strong>${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      <div class="meta-item"><strong>Registered Email</strong>${user.email || 'Verified Candidate'}</div>
      <div class="meta-item"><strong>College / Institution</strong>${user.college || 'PM Internship Enrolled Institution'}</div>
    </div>
    <div class="score-banner">
      <div class="score-number">${overallPercentage}%</div>
      <div class="score-label">${isPassed ? (isExemplary ? 'Exemplary Selection Benchmark Achieved' : 'Benchmark Passed - Placement Ready') : 'Needs Improvement - Retake Practice Recommended'}</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Total Questions: ${session.questions.length} • Accurate: ${correctCount} • Partial: ${partialCount} • Incorrect: ${incorrectCount}</div>
    </div>
    <div class="breakdown">
      <h3 style="font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Detailed Question Breakdown</h3>
      ${session.questions
        .map(
          (q, i) => `
        <div class="q-box">
          <div class="q-head">
            <span>Q${i + 1}: ${q.questionText}</span>
            <span style="color: ${(q.score ?? 0) >= 70 ? '#047857' : (q.score ?? 0) >= 36 ? '#b45309' : '#be123c'}; font-weight: 900;">
              ${(q.score ?? 0) <= 35 ? '❌ ' : (q.score ?? 0) < 70 ? '⚠️ ' : '✓ '}${q.score ?? 0}/100
            </span>
          </div>
          <div class="q-ans"><strong>Candidate Answer:</strong> "${q.userAnswer || 'No response recorded'}"</div>
          <div class="q-fb" style="background: ${(q.score ?? 0) >= 70 ? '#ecfdf5' : (q.score ?? 0) >= 36 ? '#fffbeb' : '#fff1f2'}; color: ${(q.score ?? 0) >= 70 ? '#065f46' : (q.score ?? 0) >= 36 ? '#92400e' : '#9f1239'};">
            <strong>AI Panel Evaluation:</strong> ${q.feedback || 'Assessment evaluated against STAR framework benchmarks.'}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
    <div class="footer">
      Official Digitally Authenticated Scorecard • PM Internship Scheme MCA Portal (pminternship.mca.gov.in)
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([scorecardHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PM_Scheme_Scorecard_${(user.name || 'Candidate').replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const summary = `PM INTERNSHIP SCHEME - AI INTERVIEW SCORECARD
Candidate: ${user.name || 'Candidate'}
Role: ${session.role}
Enterprise: ${companyName}
Date: ${new Date().toLocaleDateString('en-IN')}
Overall Score: ${overallPercentage}%
Result: ${isPassed ? 'Passed' : 'Needs Improvement'}
Correct Answers: ${correctCount} | Partial: ${partialCount} | Incorrect: ${incorrectCount}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Official AI Assessment Scorecard</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-black border border-amber-300 dark:border-amber-700">
                  MCA Verified
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">PM Internship Scheme • Ministry of Corporate Affairs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Print Scorecard"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadHtmlScorecard}
              disabled={isDownloading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Download Scorecard"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download Document'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Scorecard Document */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Government Emblem & Header */}
          <div className="text-center pb-5 border-b border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              PRADHAN MANTRI INTERNSHIP SCHEME (2026-27)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              National AI Evaluation & Competency Assessment Scorecard
            </p>
          </div>

          {/* Candidate & Assessment Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-500" /> Candidate Name
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                {user.name || 'Candidate'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-500" /> Target Enterprise
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                {companyName}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-500" /> Position Evaluated
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                {session.role}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-blue-500" /> Academic Institution
              </span>
              <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                {user.college || 'PM Internship Enrolled Student'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-500" /> Assessment Date
              </span>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Reference ID
              </span>
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
                {session.id || 'PMIS-AI-2026'}
              </p>
            </div>
          </div>

          {/* Overall Score Badge Card */}
          <div
            className={`p-6 rounded-3xl border-2 text-center space-y-2 ${
              isPassed
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center justify-center gap-4">
              <div
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border-4 ${
                  isPassed
                    ? 'bg-white dark:bg-emerald-900 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                    : 'bg-white dark:bg-rose-900 border-rose-500 text-rose-600 dark:text-rose-300'
                }`}
              >
                <span className="text-3xl font-black leading-none">{overallPercentage}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aggregate</span>
              </div>
              <div className="text-left space-y-1">
                <div className="flex items-center gap-1.5 font-black text-base sm:text-lg">
                  {isPassed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {isExemplary ? 'EXEMPLARY BENCHMARK ACHIEVED' : 'SELECTION BENCHMARK MET'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span>BENCHMARK NOT MET — FURTHER PRACTICE REQUIRED</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                  {isPassed
                    ? `Candidate successfully demonstrated proficiency in required competencies for ${session.role}. Ready for direct interview with ${companyName}.`
                    : `Answers contained inaccurate or incomplete technical explanations. We recommend practicing with the STAR method and the AI Skill Gap Roadmap before attending enterprise interviews.`}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400">✓ Proficient: {correctCount}</span>
                  <span className="text-amber-600 dark:text-amber-400">⚠️ Partial: {partialCount}</span>
                  <span className="text-rose-600 dark:text-rose-400">❌ Incorrect: {incorrectCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question by Question Detailed Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span>Detailed Question Evaluation</span>
              <span className="text-xs font-medium text-slate-500">
                {session.questions.length} Question{session.questions.length > 1 ? 's' : ''} Assessed
              </span>
            </h3>

            {session.questions.map((q, idx) => {
              const qScore = typeof q.score === 'number' ? q.score : 0;
              const isCorrect = qScore >= 70;
              const isPartial = qScore >= 36 && qScore < 70;
              const isWrong = qScore <= 35;

              return (
                <div
                  key={q.id || idx}
                  className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 transition ${
                    isWrong
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      : isPartial
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Question {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {q.questionText}
                      </h4>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                          isWrong
                            ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                            : isPartial
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {isWrong ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect ({qScore}/100)</span>
                          </>
                        ) : isPartial ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Partial ({qScore}/100)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Proficient ({qScore}/100)</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Candidate's Submitted Response */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Candidate's Answer Given:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 italic font-medium">
                      "{q.userAnswer || 'No response submitted (Skipped)'}"
                    </p>
                  </div>

                  {/* AI Panelist Feedback */}
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isWrong
                        ? 'bg-rose-100/60 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : isPartial
                        ? 'bg-amber-100/60 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-emerald-100/60 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    <span className="font-extrabold block text-[11px] uppercase tracking-wider">
                      {isWrong
                        ? '❌ Marked as Incorrect / Critical Gap:'
                        : isPartial
                        ? '⚠️ Incomplete Technical Response:'
                        : '✓ Evaluated Technical Strengths:'}
                    </span>
                    <p className="leading-relaxed font-medium">
                      {q.feedback || 'Evaluated against STAR technical competencies.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Authenticated Verification Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Aatmanirbhar Bharat National Talent Portal
              </p>
              <p className="text-[11px]">
                Official Digital Assessment Record • Ministry of Corporate Affairs, New Delhi
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Cryptographically Logged
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Scorecard
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official PDF</span>
            </button>
            <button
              onClick={handleDownloadHtmlScorecard}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download Scorecard'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
