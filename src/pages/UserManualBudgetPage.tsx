import React, { useState } from 'react';
import {
  BookOpen,
  DollarSign,
  Layers,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Server,
  Smartphone,
  Cpu,
  Download,
  Users,
  Building2,
  Lock,
  Zap,
  HelpCircle
} from 'lucide-react';

export const UserManualBudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'requirements' | 'budget'>('manual');
  const [userRoleGuide, setUserRoleGuide] = useState<'student' | 'company' | 'admin'>('student');

  const budgetItems = [
    {
      category: '1. Cloud Infrastructure & Hosting',
      solution: 'NIC MeghRaj (Govt of India Cloud) / Self-Hosted Docker Container',
      commercialCost: '₹3,50,000/yr (AWS/GCP)',
      govtAffordableCost: '₹12,000/yr',
      notes: 'Ministry of Corporate Affairs qualifies for free or subsidised NIC MeghRaj cloud compute.'
    },
    {
      category: '2. Database & Persistent Storage',
      solution: 'Open-Source PostgreSQL with automated nightly backup to MeghRaj S3',
      commercialCost: '₹1,80,000/yr (Managed DB)',
      govtAffordableCost: '₹18,000/yr',
      notes: 'Zero proprietary database licensing fees; 100% data sovereignty within India.'
    },
    {
      category: '3. National SMS & Email OTP Gateway',
      solution: 'NIC eGov National SMS Gateway (C-DAC) + Government NIC Mail Relay',
      commercialCost: '₹1,20,000/yr (Twilio/SendGrid)',
      govtAffordableCost: '₹24,000/yr',
      notes: 'Subsidised rate of ~₹0.05 per transactional SMS for official government schemes.'
    },
    {
      category: '4. Identity & Aadhaar e-KYC Verification',
      solution: 'DigiLocker & MeriPehchaan (National Single Sign-On, MeitY)',
      commercialCost: '₹2,50,000/yr (Private KYC SDKs)',
      govtAffordableCost: '₹0 (Free Govt API)',
      notes: 'Official MeitY DigiLocker API integration is provided free to Central Ministries.'
    },
    {
      category: '5. Corporate Verification (CIN)',
      solution: 'Ministry of Corporate Affairs MCA21 Master Data API',
      commercialCost: '₹80,000/yr (Private credit bureau)',
      govtAffordableCost: '₹0 (Internal MCA Link)',
      notes: 'Direct database lookup against existing Registrar of Companies (ROC) records.'
    },
    {
      category: '6. Security Audit & Compliance',
      solution: 'CERT-In Empanelled Auditor Pre-Production VAPT & Safe-to-Host Certification',
      commercialCost: '₹2,00,000',
      govtAffordableCost: '₹75,000 (Empanelled Govt Rate)',
      notes: 'Mandatory standard compliance for launching any .gov.in citizen-facing web application.'
    },
    {
      category: '7. Domain & SSL Certificates',
      solution: '.gov.in Domain registration via NIC + NIC CA / Let’s Encrypt Wildcard SSL',
      commercialCost: '₹25,000/yr',
      govtAffordableCost: '₹0 (Complimentary for MCA)',
      notes: 'NIC provides official government domains and security certificates free to ministries.'
    },
    {
      category: '8. Annual Maintenance & Pilot Support (12 Months)',
      solution: 'Lean Open-Source Maintenance, Bug Fixes & Pilot Support',
      commercialCost: '₹5,00,000/yr',
      govtAffordableCost: '₹58,000/yr',
      notes: 'Retainer for server monitoring, patch updates, and database indexing.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Aatmanirbhar Bharat National Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />

      {/* Header Banner - Aatmanirbhar Bharat Documentation & Roadmap */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-emerald-50/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-orange-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
        {/* Subtle decorative tricolor backdrop glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/15 via-white dark:via-slate-800 to-emerald-500/15 text-orange-950 dark:text-orange-200 border border-orange-300 dark:border-orange-800 text-xs font-black uppercase tracking-wider">
            <span>🇮🇳</span>
            <span>Aatmanirbhar Bharat • National User Manual & Affordable Budget</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Government User Manual, System Requirements & Ultra-Affordable Budget
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-medium">
            Comprehensive step-by-step user manuals for Candidates and Corporates, conversion architecture for mobile and web, and a highly affordable budget tailored to government resource constraints.
          </p>
        </div>
      </div>

      {/* Navigation Tabs with Aatmanirbhar Bharat Tricolor Highlights & Button Animations */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>User Manual (उपयोगकर्ता पुस्तिका)</span>
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'requirements'
              ? 'bg-[#081845] text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Conversion Requirements (App & Web)</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Affordable Government Pilot Budget</span>
        </button>
      </div>

      {/* TAB 1: USER MANUAL */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Sub-role selector with tactile animations */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Select User Role:</span>
            <button
              onClick={() => setUserRoleGuide('student')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                userRoleGuide === 'student'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🎓 Candidate Manual
            </button>
            <button
              onClick={() => setUserRoleGuide('company')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                userRoleGuide === 'company'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🏢 Corporate / Employer Manual
            </button>
            <button
              onClick={() => setUserRoleGuide('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                userRoleGuide === 'admin'
                  ? 'bg-[#081845] text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🏛️ Ministry Admin Manual
            </button>
          </div>

          {/* Student Manual Content */}
          {userRoleGuide === 'student' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-xs">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>Candidate / Student Step-by-Step User Manual</span>
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">1</span>
                    <span>Registration & Multi-Layer Authentication</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    1. Navigate to the <strong>Authentication</strong> tab.<br />
                    2. Select your verification method: <strong>Email OTP</strong>, <strong>Aadhaar e-KYC</strong>, or <strong>Mobile SMS</strong>.<br />
                    3. Solve the mandatory Bot-Prevention Captcha math calculation.<br />
                    4. Enter the 6-digit OTP sent to your verified email. <em>(If your email provider delays delivery, an instant Emergency Evaluation Code is automatically provided on-screen so you can test and proceed immediately).</em>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">2</span>
                    <span>Building Your ATS-Compliant Resume</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    1. Open the <strong>Resume Builder</strong> tab.<br />
                    2. Click <strong>"Auto-Fill From Profile"</strong> to populate with your verified details, or <strong>"Clear to Blank"</strong> to start fresh.<br />
                    3. Customize typography, margins, and sections.<br />
                    4. Click <strong>"Print A4 Resume"</strong> directly on the preview canvas header for an isolated, print-ready document with zero browser styling conflicts.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">3</span>
                    <span>AI Internship Matching & 1-Click Application</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    1. View top recommended roles under <strong>PM Schemes & Internships</strong>.<br />
                    2. Check the AI Semantic Match Score and Skill Gap breakdown.<br />
                    3. Submit your application with attached profile and resume.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">4</span>
                    <span>In-Portal Offer Acceptance & Stipend Disbursal (DBT)</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    1. When selected, your <strong>Student Dashboard</strong> displays the Digital Offer Letter.<br />
                    2. Verify terms and sign using the 6-digit OTP verification gate.<br />
                    3. All monthly stipends (₹4,500 Govt + ₹500 CSR = ₹5,000) disburse directly to your Aadhaar-seeded bank account via in-portal escrow.<br />
                    4. Upon completion, download your SHA-256 Digitally Signed MCA Certificate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Company Manual Content */}
          {userRoleGuide === 'company' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-xs">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <span>Corporate Employer Step-by-Step User Manual</span>
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">1</span>
                    <span>Corporate Registration & MCA 21-Digit CIN Verification</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    Companies must enter their 21-digit Corporate Identity Number (CIN). The portal validates against the Ministry ROC database, establishing corporate legitimacy and anti-fraud status.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">2</span>
                    <span>Posting Internship Opportunities & Setting Stipend Escrow</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    Specify title, sector, requirements, and location. Corporate commitments strictly stipulate a ₹500/month CSR contribution, which must be committed via in-portal escrow before offer letters can be generated.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">3</span>
                    <span>In-Portal Candidate Evaluation & Offer Issuance</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    Review applicant profiles, ATS resumes, and video pitches. All offer letters and acceptance contracts are executed strictly inside the portal. Offline contracts are void under scheme rules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Manual Content */}
          {userRoleGuide === 'admin' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-xs">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <span>Ministry Admin & Nodal Officer Step-by-Step Manual</span>
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">1</span>
                    <span>DBT Stipend Release Approval & PFMS Integration</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    Ministry nodal officers review monthly attendance logs submitted by corporate mentors. Once attendance &gt; 85% is confirmed, a single batch approval triggers automated DBT payment to student bank accounts.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">2</span>
                    <span>24-Hour SLA Citizen Grievance Redressal</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    Regional directors monitor the live ticket queue, triage incoming issues, and resolve complaints within the 24-hour Citizen Charter SLA.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONVERSION REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-xs">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Technical & Functional Requirements for App & Website Conversion</span>
            </h2>
            <p className="text-slate-500 mt-1">
              Prerequisites, APIs, and infrastructure stack needed to transition InternIQ into the permanent national portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Application Strategy (Zero Store Dropoffs)</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5 leading-relaxed">
                <li><strong>Progressive Web App (PWA) First:</strong> Enables instantaneous 1-tap installation directly from any mobile browser without requiring Play Store or App Store approvals.</li>
                <li><strong>WebAPK Packaging:</strong> Generate a lightweight (&lt; 2MB) signed Android APK for users who explicitly prefer an app from the Play Store.</li>
                <li><strong>Offline Caching:</strong> Service Workers cache scheme details, applied jobs, and resume drafts for rural areas with spotty connectivity.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Backend & Database Infrastructure</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5 leading-relaxed">
                <li><strong>Host:</strong> NIC MeghRaj Cloud Container Service (Dockerized Node.js runtime).</li>
                <li><strong>Database:</strong> PostgreSQL with relational schemas for students, corporate mentors, applications, and escrow ledgers.</li>
                <li><strong>High Availability:</strong> Stateless microservices behind Nginx reverse proxy with automated health checks.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Government API Integrations</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5 leading-relaxed">
                <li><strong>MCA21 Gateway:</strong> Validates 21-digit corporate CIN numbers in real time.</li>
                <li><strong>DigiLocker / MeriPehchaan:</strong> Free MeitY Single Sign-On for candidate credential extraction.</li>
                <li><strong>PFMS / NPCI Aadhaar Bridge:</strong> Direct Benefit Transfer (DBT) endpoint for monthly stipend disbursement.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Security & Regulatory Compliance</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5 leading-relaxed">
                <li><strong>CERT-In VAPT Audit:</strong> Pre-launch security assessment by a CERT-In empanelled auditing firm.</li>
                <li><strong>GIGW Compliance:</strong> Guidelines for Indian Government Websites (bilingual Hindi/English, WCAG AA accessibility).</li>
                <li><strong>Data Sovereignty:</strong> 100% data residency within Indian borders on NIC MeghRaj infrastructure.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ULTRA-AFFORDABLE PILOT BUDGET */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span>Ultra-Affordable National Pilot Budget (12 Months / 50,000 Users)</span>
              </h2>
              <p className="text-slate-500 mt-1">
                Optimized specifically for government budget constraints by leveraging open-source software and existing NIC / MeitY infrastructure.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Total Pilot Budget</span>
              <p className="text-xl font-black text-emerald-600 font-mono">₹1,87,000 / Year</p>
              <p className="text-[10px] text-slate-500">Less than ₹3.75 per candidate!</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Component / Service</th>
                  <th className="p-3">Architecture Solution</th>
                  <th className="p-3 text-slate-400 line-through">Commercial Rate</th>
                  <th className="p-3 text-emerald-600 font-black">Govt Affordable Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {budgetItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {item.category}
                      <p className="text-[10px] text-slate-500 font-normal">{item.notes}</p>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{item.solution}</td>
                    <td className="p-3 text-slate-400 line-through">{item.commercialCost}</td>
                    <td className="p-3 text-emerald-600 font-bold font-mono bg-emerald-50/20 dark:bg-emerald-950/20">
                      {item.govtAffordableCost}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-950 font-black border-t-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <td colSpan={2} className="p-3 text-slate-900 dark:text-white">
                    TOTAL ESTIMATED NATIONAL PILOT BUDGET (50,000 CANDIDATES)
                  </td>
                  <td className="p-3 text-slate-400 line-through">₹16,45,000</td>
                  <td className="p-3 text-emerald-600 text-sm font-mono font-black bg-emerald-100 dark:bg-emerald-950">
                    ₹1,87,000 (~$2,250 USD)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl space-y-2">
            <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Why This Budget is Uniquely Affordable for the Government:</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Commercial private portals charge 10x more because of proprietary licensing and vendor lock-in. By utilizing <strong>open-source stacks (TypeScript, React, Node.js, PostgreSQL)</strong> and routing authentication through existing public digital utilities (<strong>MeghRaj Cloud, DigiLocker, NIC eGov Gateway</strong>), the Government of India achieves an enterprise-grade, fraud-proof national platform for merely <strong>₹1.87 Lakhs ($2,250)</strong> annually!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
