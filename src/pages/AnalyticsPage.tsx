import React from 'react';
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Users, MapPin, Award, Building2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const domainData = [
    { name: 'AI & Machine Learning', count: 420 },
    { name: 'Software & Web', count: 380 },
    { name: 'EV & Hardware', count: 290 },
    { name: 'Cloud & Cyber Security', count: 210 },
    { name: 'Electrical & Green', count: 180 },
    { name: 'FinTech & Banking', count: 160 }
  ];

  const stateData = [
    { name: 'Maharashtra', count: 3200 },
    { name: 'Karnataka', count: 2900 },
    { name: 'Tamil Nadu', count: 2400 },
    { name: 'Uttar Pradesh', count: 2100 },
    { name: 'Telangana', count: 1900 },
    { name: 'Gujarat', count: 1600 }
  ];

  const genderData = [
    { name: 'Female Applicants', value: 48, color: '#ec4899' },
    { name: 'Male Applicants', value: 50, color: '#3b82f6' },
    { name: 'Non-Binary / Other', value: 2, color: '#10b981' }
  ];

  const cgpaData = [
    { range: '6.0 - 7.0', candidates: 1200 },
    { range: '7.0 - 8.0', candidates: 3400 },
    { range: '8.0 - 9.0', candidates: 4200 },
    { range: '9.0 - 10.0', candidates: 1800 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Aatmanirbhar Bharat National Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />

      {/* Header Banner - Aatmanirbhar Bharat National Telemetry & Analytics */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-emerald-50/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-orange-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        {/* Subtle decorative tricolor backdrop glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/15 via-white dark:via-slate-800 to-emerald-500/15 text-orange-950 dark:text-orange-200 border border-orange-300 dark:border-orange-800 text-xs font-black uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>🇮🇳 Aatmanirbhar Bharat • National Scheme Telemetry & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            PM Internship National Data Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
            Real-time visual telemetry tracking domain adoption, state distribution, gender diversity, and placement rates across 1,25,000 yearly seats.
          </p>
        </div>
      </div>

      {/* Grid of Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Domain Popularity Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Top Internship Domains by Opening Volume</span>
          </h2>

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
        </div>

        {/* State Wise Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>State-Wise Candidate Participation</span>
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Inclusion Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Gender Equality & Inclusion Index</span>
          </h2>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CGPA Spread */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-500" />
            <span>Academic Performance Spread (CGPA)</span>
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="candidates" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
