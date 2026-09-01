import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Search,
  Calendar,
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';
import { User, Internship, Application } from '../types';
import { SkillSelectDropdown } from '../components/SkillSelectDropdown';

interface CompanyDashboardProps {
  user: User;
  internships: Internship[];
  applications: Application[];
  onAddInternship: (newRole: Partial<Internship>) => void;
  onUpdateApplicationStatus: (appId: string, status: 'SHORTLISTED' | 'REJECTED') => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  user,
  internships,
  applications,
  onAddInternship,
  onUpdateApplicationStatus
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'post-role' | 'my-roles' | 'diversity-analytics'>('candidates');

  // New Internship Role Form State
  const [roleTitle, setRoleTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & Machine Learning');
  const [stipend, setStipend] = useState(15000);
  const [location, setLocation] = useState('Bengaluru');
  const [mode, setMode] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Hybrid');
  const [skillsList, setSkillsList] = useState<string[]>(['Python', 'Machine Learning', 'SQL']);
  const [description, setDescription] = useState('');
  const [postSuccessMsg, setPostSuccessMsg] = useState<string | null>(null);

  const companyRoles = internships.filter((i) => i.companyName === user.companyName || user.role === 'COMPANY');

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle || !description) return;

    onAddInternship({
      role: roleTitle,
      companyName: user.companyName || 'Top Partner Tech',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      domain,
      stipend: Number(stipend),
      location,
      mode,
      duration: '12 Months',
      minCGPA: 7.0,
      skillsRequired: skillsList.length > 0 ? skillsList : ['Python', 'Problem Solving'],
      description,
      responsibilities: ['Collaborate on engineering tasks', 'Deploy production models'],
      openings: 5,
      trustScore: 98
    });

    setPostSuccessMsg('✓ New PM Internship posting published and audited by AI Trust Engine!');
    setRoleTitle('');
    setDescription('');
    setTimeout(() => {
      setPostSuccessMsg(null);
      setActiveTab('my-roles');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-amber-300 shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.companyName || 'Partner Corporate Portal'}</h1>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                MCA Partner Verified
              </span>
              {user?.email && (
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span>✓</span> {user.email}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Recruiter: {user.name || 'Recruitment Officer'} • PM Internship Scheme Partner Corporate Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('post-role')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post New Internship
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'candidates'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>AI Ranked Candidates ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-roles')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'my-roles'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Postings ({companyRoles.length})
        </button>

        <button
          onClick={() => setActiveTab('post-role')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'post-role'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Post New Role
        </button>

        <button
          onClick={() => setActiveTab('diversity-analytics')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'diversity-analytics'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Diversity & Match Quality Analytics</span>
        </button>
      </div>

      {/* TAB CONTENT: CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Candidate Applications Ranked by AI Match Score
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {app.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{app.studentCollege}</p>
                  </div>

                  <span className="text-xs font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full">
                    {app.aiScore}% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">CGPA Score</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{app.studentCgpa} / 10</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                    <span
                      className={`font-bold ${
                        app.status === 'SHORTLISTED'
                          ? 'text-emerald-600'
                          : app.status === 'REJECTED'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Action Row */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onUpdateApplicationStatus(app.id, 'REJECTED')}
                    disabled={app.status === 'REJECTED'}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => onUpdateApplicationStatus(app.id, 'SHORTLISTED')}
                    disabled={app.status === 'SHORTLISTED'}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                  >
                    Shortlist Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: POST NEW ROLE */}
      {activeTab === 'post-role' && (
        <form onSubmit={handleCreateRole} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Create New PM Internship Opportunity</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">Internship Role Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. AI Systems Engineer Intern"
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 uppercase block mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                  <option value="Software Engineering & Web Development">Software Engineering</option>
                  <option value="Hardware & Embedded Systems">Hardware & Embedded Systems</option>
                  <option value="Electrical & Green Energy">Electrical & Green Energy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase block mb-1">Monthly Stipend (₹)</label>
                <input
                  type="number"
                  value={stipend}
                  onChange={(e) => setStipend(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-500 uppercase block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad / Gurugram"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase block mb-1">Work Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'Remote' | 'Hybrid' | 'Onsite')}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            {postSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{postSuccessMsg}</span>
              </div>
            )}

            <div>
              <SkillSelectDropdown
                selectedSkills={skillsList}
                onChange={setSkillsList}
                label="Required Technical Competencies & Skills"
                placeholder="Select required skills from verified dropdown catalog..."
                helperText="Candidate matching AI evaluates applicants against these selected verified competencies."
                maxSkills={10}
              />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">Role Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project responsibilities and learning outcomes..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-3 font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Role & Run AI Fraud Audit</span>
          </button>
        </form>
      )}

      {/* TAB CONTENT: MY ROLES */}
      {activeTab === 'my-roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyRoles.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.role}</h3>
                  <p className="text-xs text-slate-500">{item.domain}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ₹{item.stipend.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: DIVERSITY & MATCH QUALITY ANALYTICS */}
      {activeTab === 'diversity-analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Applications Received</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">1,840</div>
              <span className="text-[10px] text-emerald-600 font-bold">+18% this recruitment cycle</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">Avg AI Match Quality</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">88.6%</div>
              <span className="text-[10px] text-slate-500 font-medium">Top 5% Talent Alignment</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">Tier-2/3 & Rural Share</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-300">52.4%</div>
              <span className="text-[10px] text-emerald-600 font-bold">✓ Exceeds MCA 40% Mandate</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Gender Diversity</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-300">46.2%</div>
              <span className="text-[10px] text-slate-500 font-medium">Female Candidate Ratio</span>
            </div>
          </div>

          {/* Regional & College Diversity Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Geographical & Equity Distribution (PM Scheme Mandate)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Tier-2 & Tier-3 District Colleges</span>
                    <span className="text-amber-600">52.4% (964 Candidates)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '52.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Rural & Aspirational Districts (NITI Aayog)</span>
                    <span className="text-indigo-600">28.1% (517 Candidates)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '28.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Tier-1 Metro Universities</span>
                    <span className="text-slate-500">19.5% (359 Candidates)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '19.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>AI Candidate Conversion & Shortlist Quality</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Technical Assessment Pass Rate</div>
                    <div className="text-[10px] text-slate-400">Evaluated via AI Mock Assessment Matrix</div>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">92.4%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Average Resume Skill Overlap</div>
                    <div className="text-[10px] text-slate-400">NLP Vector Similarity against Job Description</div>
                  </div>
                  <span className="font-black text-indigo-600 text-sm">88.5%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Offer Acceptance / Conversion Rate</div>
                    <div className="text-[10px] text-slate-400">Post-selection candidate onboarding</div>
                  </div>
                  <span className="font-black text-amber-600 text-sm">94.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
