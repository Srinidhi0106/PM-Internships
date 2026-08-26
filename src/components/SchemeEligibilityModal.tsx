import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Download,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { User } from '../types';

interface SchemeEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onNavigateToInternships?: () => void;
}

export const SchemeEligibilityModal: React.FC<SchemeEligibilityModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigateToInternships
}) => {
  const [age, setAge] = useState<number>(22);
  const [income, setIncome] = useState<string>('under_8l'); // 'under_8l' or 'above_8l'
  const [employment, setEmployment] = useState<string>('unemployed'); // 'unemployed' or 'fulltime'
  const [education, setEducation] = useState<string>('btech'); // 'btech', 'diploma', 'ba_bsc', 'iti', 'other'
  const [govtJobInFamily, setGovtJobInFamily] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // MCA PM Internship Scheme Eligibility Criteria:
  // 1. Age between 21 and 24 years
  // 2. Not engaged in full-time employment or full-time education
  // 3. Family annual income less than Rs. 8 Lakhs
  // 4. No family member is a permanent government employee
  // 5. Educational qualification: High school, ITI, Diploma, BA, BSc, BCom, BTech, BBA, BCA, etc.

  const isAgeValid = age >= 21 && age <= 24;
  const isIncomeValid = income === 'under_8l';
  const isEmploymentValid = employment === 'unemployed';
  const isGovtJobValid = !govtJobInFamily;
  const isEducationValid = education !== 'other';

  const isEligible = isAgeValid && isIncomeValid && isEmploymentValid && isGovtJobValid && isEducationValid;

  const handleDownloadEligibilityPass = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1000, 650);

    // Border
    ctx.strokeStyle = '#D97706'; // Amber
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 960, 610);

    ctx.strokeStyle = '#059669'; // Emerald
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 936, 586);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('GOVERNMENT OF INDIA • MINISTRY OF CORPORATE AFFAIRS', 500, 80);

    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText('PM INTERNSHIP SCHEME ELIGIBILITY CLEARANCE', 500, 125);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 145);
    ctx.lineTo(800, 145);
    ctx.stroke();

    // Clearance Seal
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('100% VERIFIED ELIGIBLE CANDIDATE', 500, 200);

    // Details Box
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(150, 230, 700, 260);
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(150, 230, 700, 260);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Candidate Name: ${user.name.toUpperCase()}`, 180, 275);
    ctx.fillText(`Pass ID: PMIS-ELIG-2026-${Math.floor(100000 + Math.random() * 900000)}`, 180, 315);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`✓ Age Verification: ${age} Years (Criteria: 21-24 Years)`, 180, 360);
    ctx.fillText(`✓ Family Annual Income: Below ₹8,00,000/year`, 180, 395);
    ctx.fillText(`✓ Employment Status: Unemployed Candidate Seeking Placement`, 180, 430);
    ctx.fillText(`✓ Educational Qualification: Verified Recognized Degree/Diploma`, 180, 465);

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Official Digital Clearance Certificate under Prime Minister\'s Internship Scheme', 500, 540);

    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.fillText('Valid for Direct One-Click Internship Applications across Top 500 Corporate Partners in India', 500, 570);

    // Download PNG
    const link = document.createElement('a');
    link.download = `PM_Internship_Eligibility_Pass_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 h-2 w-full" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                PM Internship Scheme Eligibility Checker
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ministry of Corporate Affairs Official Standard Verification Tool
              </p>
            </div>
          </div>

          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5"
            >
              {/* Question 1: Age */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>1. What is your current age?</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">{age} Years</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={30}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>18 Yrs</span>
                  <span className="text-emerald-600 font-bold">21-24 Yrs (Eligible Window)</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              {/* Question 2: Income */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  2. What is your total family annual income?
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIncome('under_8l')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      income === 'under_8l'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ✓ Less than ₹8.0 Lakhs / year
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncome('above_8l')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      income === 'above_8l'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ✕ Above ₹8.0 Lakhs / year
                  </button>
                </div>
              </div>

              {/* Question 3: Employment */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  3. Are you currently employed in full-time job or full-time education?
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmployment('unemployed')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      employment === 'unemployed'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ✓ No (Unemployed / Seeking Internship)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployment('fulltime')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      employment === 'fulltime'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ✕ Yes (Working in Full-Time Job)
                  </button>
                </div>
              </div>

              {/* Question 4: Qualification */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  4. Select your highest educational qualification:
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="btech">B.Tech / B.E. / Engineering Degree</option>
                  <option value="diploma">Polytechnic / Industrial Diploma</option>
                  <option value="ba_bsc">B.A. / B.Sc / B.Com / BBA / BCA</option>
                  <option value="iti">ITI Certificate (Industrial Training)</option>
                  <option value="other">IIT / IIM / IISER / NIFT Graduate (Ineligible under scheme rules)</option>
                </select>
              </div>

              {/* Question 5: Govt Employee in Family */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    5. Any permanent government employee in your family?
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Rule: Candidates with permanent govt family income are excluded.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={govtJobInFamily}
                  onChange={(e) => setGovtJobInFamily(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Verify PM Scheme Eligibility Now</span>
              </button>
            </form>
          ) : (
            /* Result Screen */
            <div className="space-y-6 text-center py-2 animate-in fade-in">
              {isEligible ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                      100% Eligible Candidate Verified
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-2">
                      Congratulations, {user.name}!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      You meet all 5 criteria laid down by the Ministry of Corporate Affairs under the PM Internship Scheme 2026.
                    </p>
                  </div>

                  {/* Benefit Cards */}
                  <div className="grid grid-cols-2 gap-3 text-left pt-2">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Monthly Allowance</span>
                      <span className="text-lg font-black text-emerald-900 dark:text-emerald-200">₹5,000 / Month</span>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">One-Time Grant</span>
                      <span className="text-lg font-black text-amber-900 dark:text-amber-200">₹6,000 Grant</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleDownloadEligibilityPass}
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Official Eligibility Pass (PNG)</span>
                    </button>

                    {onNavigateToInternships && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToInternships();
                        }}
                        className="py-3.5 px-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Apply to Top Internships</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-500 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 shadow-xl">
                    <XCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                      Eligibility Check Results
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white pt-2">
                      Ineligible under Specific PM Scheme Guidelines
                    </h3>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 p-4 rounded-2xl text-left text-xs text-rose-900 dark:text-rose-200 space-y-2">
                    <span className="font-bold block">Reasons for Ineligibility:</span>
                    <ul className="list-disc list-inside space-y-1">
                      {!isAgeValid && <li>Age must be between 21 and 24 years (Selected: {age} yrs).</li>}
                      {!isIncomeValid && <li>Family annual income must be under ₹8.0 Lakhs.</li>}
                      {!isEmploymentValid && <li>Candidates in full-time employment are excluded.</li>}
                      {!isGovtJobValid && <li>Candidates with permanent govt employee in family are excluded.</li>}
                      {!isEducationValid && <li>Graduates from premier institutes (IIT/IIM/IISER) are ineligible under this scheme.</li>}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="py-3 px-6 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-evaluate Eligibility Information</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
