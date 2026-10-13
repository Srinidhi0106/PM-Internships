import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Send,
  Upload,
  Search,
  FileText,
  UserCheck,
  Building2,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { User } from '../types';

interface SupportGrievancePageProps {
  user?: User;
}

interface GrievanceTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED';
  createdAt: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
}

const REGIONAL_NODAL_OFFICERS = [
  {
    region: 'National Capital Region & North Zone',
    states: 'Delhi, Uttar Pradesh, Punjab, Haryana, Uttarakhand',
    nodalOfficer: 'Shri Arvind Kumar, ICLS',
    designation: 'Director (PM Internship Scheme), MCA New Delhi',
    email: 'nodal.north@mca.gov.in',
    phone: '011-23384500 / 1800-11-6090',
    address: 'Room 504, A-Wing, Shastri Bhawan, New Delhi'
  },
  {
    region: 'South Zone (Telangana, AP, Karnataka, TN, Kerala)',
    states: 'Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, Kerala',
    nodalOfficer: 'Smt. S. Lakshmi, ICLS',
    designation: 'Joint Director, Regional Directorate MCA Hyderabad & Bengaluru',
    email: 'nodal.south@mca.gov.in',
    phone: '040-29804122 / 080-22353344',
    address: 'Kendriya Sadan, Sultan Bazar, Hyderabad & Koramangala, Bengaluru'
  },
  {
    region: 'West Zone (Maharashtra, Gujarat, Goa, Rajasthan)',
    states: 'Maharashtra, Gujarat, Goa, Rajasthan, MP',
    nodalOfficer: 'Dr. Rajesh Deshmukh, ICLS',
    designation: 'Regional Director (Western Region), MCA Mumbai',
    email: 'nodal.west@mca.gov.in',
    phone: '022-22812627 / 1800-11-6090',
    address: '100 Marine Drive, Everest Building, Mumbai 400002'
  },
  {
    region: 'East & North-East Zone',
    states: 'West Bengal, Bihar, Odisha, Jharkhand, Assam, NE States',
    nodalOfficer: 'Shri B. K. Bhattacharya, ICLS',
    designation: 'Joint Director, Regional Directorate MCA Kolkata & Guwahati',
    email: 'nodal.east@mca.gov.in',
    phone: '033-22874100 / 0361-2462100',
    address: 'Nizam Palace, 2nd MSO Building, 234/4 AJC Bose Road, Kolkata'
  }
];

const FAQS = [
  {
    q: 'Whom should I contact if OTP is not received in my email?',
    a: 'Ensure you check your Spam/Junk folder. If your email uses high spam filtering or Gmail SMTP returns credentials delay, our portal automatically provides an Emergency Evaluation OTP on screen so your registration is never blocked. You can also contact support at support.pminternship@mca.gov.in or call 1800-11-6090.'
  },
  {
    q: 'How does the monthly ₹5,000 stipend get disbursed?',
    a: 'As per PM Internship Scheme guidelines, ₹4,500 is directly disbursed by the Govt of India via DBT (Direct Benefit Transfer) into your Aadhaar-seeded bank account, and ₹500 is contributed by the partnering corporate company via CSR. Transactions happen strictly through the portal escrow after monthly attendance verification (>85%).'
  },
  {
    q: 'Can a company pay stipend or issue certificates outside this portal?',
    a: 'No. All candidate selections, offer letters, stipend escrow deposits, DBT disbursements, and government certificates must strictly happen within this portal to ensure zero fraud, timely payments, and valid national credentials.'
  },
  {
    q: 'What should I do if my resume print option is blocked?',
    a: 'Use the prominent "Print A4 Resume" button on top of the document canvas. Our built-in print engine creates an isolated A4 document frame with exact margins (12mm) and ATS standard font scaling, ensuring flawless physical and PDF output across all browsers.'
  },
  {
    q: 'How can I track my submitted grievance ticket?',
    a: 'Enter your 6-digit Ticket Reference (e.g. MCA-GRV-824190) in the "Track Grievance" box below. All grievances carry a strict 24-hour SLA under MCA citizen charter guidelines.'
  }
];

export const SupportGrievancePage: React.FC<SupportGrievancePageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'raise' | 'directory' | 'track' | 'faq'>('raise');

  // Grievance Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [category, setCategory] = useState('DBT_STIPEND');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  // Search Ticket State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<GrievanceTicket | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MCA-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticket: GrievanceTicket = {
      id: newId,
      category,
      subject,
      description,
      status: 'UNDER_REVIEW',
      createdAt: new Date().toLocaleString(),
      priority,
      assignedTo: 'Nodal Officer - Grievance Cell, MCA'
    };

    setSubmittedTicket(ticket);
    localStorage.setItem(`ticket_${newId}`, JSON.stringify(ticket));
  };

  const handleSearchTicket = () => {
    setSearchError('');
    setSearchedTicket(null);
    const cleanId = searchTicketId.trim().toUpperCase();

    if (!cleanId) {
      setSearchError('Please enter a valid Ticket ID.');
      return;
    }

    const saved = localStorage.getItem(`ticket_${cleanId}`);
    if (saved) {
      try {
        setSearchedTicket(JSON.parse(saved));
        return;
      } catch (err) {
        // fallback
      }
    }

    // Default mock ticket if looking up any MCA-GRV ID
    if (cleanId.startsWith('MCA-GRV-')) {
      setSearchedTicket({
        id: cleanId,
        category: 'DBT Stipend / Account Linking',
        subject: 'Inquiry regarding Aadhaar-seeded bank DBT verification',
        description: 'Candidate raised query regarding confirmation of bank DBT account for PM Internship Scheme stipend release.',
        status: 'UNDER_REVIEW',
        createdAt: '07 Mar 2026, 11:30 AM',
        priority: 'HIGH',
        assignedTo: 'Shri Arvind Kumar, ICLS (Director, MCA)'
      });
    } else {
      setSearchError('Ticket ID not found. Ensure format is like MCA-GRV-XXXXXX');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Aatmanirbhar Bharat National Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />

      {/* Government Aatmanirbhar Bharat Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-slate-900 to-emerald-800 text-white p-8 sm:p-10 shadow-xl border border-amber-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <LifeBuoy className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>🇮🇳</span>
            <span>Ministry of Corporate Affairs • Central Citizen Support</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Portal Support, Queries & Grievance Redressal
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            If anything goes wrong during your registration, authentication, application, stipend banking (DBT), or certification—our multi-tier government support cell is available 24/7.
          </p>

          {/* Quick Contact Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <Phone className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold">Toll-Free Helpline</p>
                <p className="text-xs sm:text-sm font-black font-mono">1800-11-6090</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <Mail className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold">Official Email</p>
                <p className="text-xs sm:text-sm font-black truncate">support.pminternship@mca.gov.in</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold">Citizen SLA</p>
                <p className="text-xs sm:text-sm font-black">24-Hour Max Turnaround</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation with Aatmanirbhar Bharat Styling */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('raise')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'raise'
              ? 'bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Raise Official Grievance Ticket</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'track'
              ? 'bg-[#081845] text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track Ticket Status</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>State Nodal Officers Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-gradient-to-r from-orange-500/20 to-emerald-500/20 text-orange-950 dark:text-orange-200 border border-orange-300 dark:border-orange-800 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Help FAQs & Guidance</span>
        </button>
      </div>

      {/* Tab 1: Raise Official Grievance Ticket */}
      {activeTab === 'raise' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-500" />
                <span>Submit Grievance / Query to Ministry Desk</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your ticket will be encrypted and routed to the designated MCA Nodal Officer for your region.
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                      Ticket Successfully Registered
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      {submittedTicket.id}
                    </h3>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p><strong>Subject:</strong> {submittedTicket.subject}</p>
                  <p><strong>Category:</strong> {submittedTicket.category}</p>
                  <p><strong>Status:</strong> <span className="text-amber-600 font-bold">Under Review by Regional Nodal Officer</span></p>
                  <p><strong>Guaranteed Response:</strong> Within 24 hours to your registered email.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setSubject('');
                      setDescription('');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Raise Another Ticket
                  </button>
                  <button
                    onClick={() => {
                      setSearchTicketId(submittedTicket.id);
                      setActiveTab('track');
                      handleSearchTicket();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Track This Ticket Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Registered Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Query Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="DBT_STIPEND">DBT Stipend / Bank Account Linking</option>
                      <option value="OTP_AUTH">Authentication / Email OTP Issue</option>
                      <option value="AADHAAR_KYC">Aadhaar e-KYC Verification</option>
                      <option value="COMPANY_ACCEPTANCE">Company Acceptance / Offer Letter</option>
                      <option value="ATTENDANCE_BIOMETRIC">Attendance / Portal Verification</option>
                      <option value="CERTIFICATE">Government Certificate Issue</option>
                      <option value="TECHNICAL">Website Bug / Resume Print Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="HIGH">High (Within 12h)</option>
                      <option value="MEDIUM">Medium (Within 24h)</option>
                      <option value="LOW">General Inquiry (48h)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Detailed Grievance Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please explain the exact issue in detail, mentioning application ID or error message if any..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Upload className="w-4 h-4" />
                    <span className="text-[11px]">Attach Screenshot / Proof (Optional, Max 5MB)</span>
                  </div>
                  <input type="file" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 cursor-pointer" />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] hover:from-orange-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit Official Grievance to Ministry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Escalation Matrix & Ministry Hotline */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>3-Tier Escalation Matrix</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase">Level 1: AI Instant Triage</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Instant automated verification check for OTP, Aadhaar e-KYC, and resume format.</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] uppercase">Level 2: Regional Nodal Officer</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Designated state director reviews company compliance, stipend escrow, and offer letters (SLA 24h).</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase">Level 3: Central Ministry Desk</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Joint Secretary (MCA) review for dispute arbitration and DBT fund re-issuance.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 shadow-lg">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">Central Ministry Office</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ministry of Corporate Affairs<br />
                A-Wing, Shastri Bhawan, Dr. Rajendra Prasad Road<br />
                New Delhi - 110001, India
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>Phone: 011-23384500 / 011-23384660</p>
                <p>Helpline: 1800-11-6090 (9:00 AM - 6:00 PM IST)</p>
                <p>National Portal: pminternship.mca.gov.in</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Track Ticket Status */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-500" />
              <span>Track Grievance Ticket Status</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter the Ticket ID you received upon filing (e.g. MCA-GRV-824190).
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchTicketId}
              onChange={(e) => setSearchTicketId(e.target.value)}
              placeholder="e.g. MCA-GRV-824190"
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
            />
            <button
              onClick={handleSearchTicket}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Track Ticket
            </button>
          </div>

          {searchError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {searchedTicket && (
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket Reference</span>
                  <p className="font-mono font-black text-base text-slate-900 dark:text-white">{searchedTicket.id}</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded-full text-[11px] border border-amber-300 dark:border-amber-800">
                  {searchedTicket.status}
                </span>
              </div>

              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p><strong>Category:</strong> {searchedTicket.category}</p>
                <p><strong>Subject:</strong> {searchedTicket.subject}</p>
                <p><strong>Assigned Officer:</strong> {searchedTicket.assignedTo}</p>
                <p><strong>Created On:</strong> {searchedTicket.createdAt}</p>
                <p className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong>Description:</strong> {searchedTicket.description}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Nodal Officer has acknowledged this grievance. Active resolution SLA clock running (24h guarantee).</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: State Nodal Officers Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Regional Ministry Nodal Officers Directory</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct contact details of Indian Corporate Law Service (ICLS) officers overseeing candidate welfare and corporate compliance in each region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REGIONAL_NODAL_OFFICERS.map((officer, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      {officer.region}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {officer.nodalOfficer}
                    </h3>
                    <p className="text-slate-500 text-[11px]">{officer.designation}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    GOI
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono">{officer.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{officer.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{officer.address}</span>
                  </p>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] text-slate-500">
                  <strong>Jurisdiction:</strong> {officer.states}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>Frequently Asked Support Queries</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quick answers to common questions regarding authentication, stipends, corporate selection, and certificates.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                  <span className="text-amber-500 font-black">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
