import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AboutContactPages: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'contact'>('about');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Aatmanirbhar Bharat National Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />

      {/* Sub Tabs with tactile animations */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-3 text-xs font-bold pb-1">
        <button
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          About PM Internship Scheme
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#081845] text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Helpdesk & Contact Ministry
        </button>
      </div>

      {activeSubTab === 'about' ? (
        <div className="space-y-8">
          {/* Header Banner - Aatmanirbhar Bharat Overview */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-emerald-50/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-orange-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-3">
            {/* Subtle decorative tricolor backdrop glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-black bg-gradient-to-r from-orange-500/15 via-white dark:via-slate-800 to-emerald-500/15 text-orange-950 dark:text-orange-200 border border-orange-300 dark:border-orange-800 px-3 py-1 rounded-full uppercase tracking-wider">
                🇮🇳 Government of India Initiative • Aatmanirbhar Bharat
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                PM Internship Scheme by Ministry of Corporate Affairs
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
                Aiming to provide 1 crore internship opportunities in top 500 companies over 5 years, empowering youth with real-world exposure and financial stability.
              </p>
            </div>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                12M
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">12-Month Duration</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive 1-year hands-on experience in real corporate projects.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                ₹5K
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Assistance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ₹4,500 by Govt of India + ₹500 by Company CSR per month directly to bank account.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                ₹6K
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">One-Time Grant</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ₹6,000 provided for incidental and relocation expenses upon joining.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Ministry Helpdesk & Grievance Portal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">Official Office Address</span>
                  <span>Ministry of Corporate Affairs, A-Wing, Shastri Bhawan, Rajendra Prasad Road, New Delhi 110001</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">Toll-Free Helpline</span>
                  <span>1800-11-6090 (Mon-Sat 9 AM - 6 PM IST)</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">Official Support Email</span>
                  <span>pminternship-support@mca.gov.in</span>
                </div>
              </div>
            </div>

            {/* Ticket Form */}
            {submitted ? (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Ticket Submitted!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your query has been logged under MCA Ticket #MCA-{Math.floor(100000 + Math.random() * 900000)}. An officer will reply via email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitHelp} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-500 uppercase block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Application status discrepancy / DBS account verification"
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 uppercase block mb-1">Grievance Description</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide detailed description..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-3 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] hover:from-orange-400 hover:to-orange-500 text-slate-950 font-black rounded-xl shadow-md transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  Submit Official Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
