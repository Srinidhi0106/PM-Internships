import React, { useState } from 'react';
import {
  User as UserIcon,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  Sparkles,
  BookOpen,
  Building2,
  FileText,
  ChevronRight,
  Download,
  Brain,
  MessageSquare
} from 'lucide-react';
import { User, Application, Internship } from '../types';
import { GamificationLevelUp } from '../components/GamificationLevelUp';
import { PMCertificateModal } from '../components/PMCertificateModal';
import { SkillSelectDropdown } from '../components/SkillSelectDropdown';
import { useLanguage } from '../context/LanguageContext';

interface StudentDashboardProps {
  user: User;
  applications: Application[];
  internships: Internship[];
  onUpdateUser: (updated: Partial<User>) => void;
  onNavigate?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  applications,
  internships,
  onUpdateUser,
  onNavigate
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'applications' | 'levelup' | 'certificate' | 'profile'>('applications');
  const [editingName, setEditingName] = useState(user.name || '');
  const [editingCollege, setEditingCollege] = useState(user.college || 'IIT Delhi');
  const [editingBranch, setEditingBranch] = useState(user.branch || 'Computer Science Engineering');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user.skills || ['Python', 'React', 'SQL']);
  const [editingCgpa, setEditingCgpa] = useState(user.cgpa?.toString() || '8.5');
  const [showCertModal, setShowCertModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const myApplications = applications.filter((app) => app.studentId === user.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editingName,
      college: editingCollege,
      branch: editingBranch,
      cgpa: parseFloat(editingCgpa) || 8.0,
      skills: selectedSkills
    });
    setSaveSuccessMsg('✓ Candidate profile and verified skills saved successfully to portal!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Overview Header */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-amber-300 shadow-md">
            {(user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Student Candidate'}</h1>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                Student Candidate
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              {user?.college || 'Degree College'} ({user?.branch || 'General Studies'}) • CGPA: {user?.cgpa || 8.5} / 10
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Applications</span>
            <span className="text-amber-600 dark:text-amber-400 text-base font-extrabold">{myApplications.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">XP Points</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-extrabold">{user.xp || 1450}</span>
          </div>
        </div>
      </div>

      {/* AI Career Roadmap Quick Access Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-800/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">AI Skill Gap Analysis & 8-Week Roadmap</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">Recommended</span>
            </div>
            <p className="text-xs text-slate-300">Identify missing corporate skills for {user.branch || 'your domain'} & generate a step-by-step project roadmap.</p>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('ai-skill-gap')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Launch Roadmap Engine</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'applications'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Applications ({myApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('levelup')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'levelup'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Level Up & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'certificate'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          PM Scheme Certificate
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'profile'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Edit Candidate Profile
        </button>
      </div>

      {/* TAB CONTENT: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                You have not submitted any internship applications yet.
              </p>
              <p className="text-xs text-slate-500">
                Explore 1,850+ verified PM Internship Scheme opportunities and click "One-Click Apply".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myApplications.map((app) => {
                const item = internships.find((i) => i.id === app.internshipId);

                return (
                  <div
                    key={app.id}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {item?.role || 'Internship Role'}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">
                          {item?.companyName || 'Corporate Partner'}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          app.status === 'SHORTLISTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                      <span>AI Candidate Score: <strong className="text-indigo-600">{app.aiScore}% Match</strong></span>
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>

                    {onNavigate && (
                      <div className="pt-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigate('messages')}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 rounded-xl border border-purple-200 dark:border-purple-800 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat with Recruiter Desk</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LEVEL UP GAMIFICATION */}
      {activeTab === 'levelup' && (
        <GamificationLevelUp user={user} />
      )}

      {/* TAB CONTENT: CERTIFICATE GENERATOR */}
      {activeTab === 'certificate' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              PM Internship Completion Certificate
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Issued by the Ministry of Corporate Affairs (Government of India) upon successful completion of your 12-month PM Internship tenure.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 text-left bg-slate-50 dark:bg-slate-950 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">Certificate Preview:</p>
            <p className="text-slate-600 dark:text-slate-400">
              "This is to certify that <strong>{user?.name || 'Candidate'}</strong> from <strong>{user?.college || 'Institution'}</strong> has completed the official PM Internship Scheme program with exemplary distinction."
            </p>
          </div>

          <button
            onClick={() => setShowCertModal(true)}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Official PM Scheme Certificate
          </button>
        </div>
      )}

      {/* TAB CONTENT: EDIT PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Candidate Profile</h2>
              <p className="text-xs text-slate-500">Update verified candidate information & skill competencies</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              PM Scheme Candidate
            </span>
          </div>

          {saveSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">College / University Name</label>
              <input
                type="text"
                value={editingCollege}
                onChange={(e) => setEditingCollege(e.target.value)}
                placeholder="e.g. IIT Delhi / NIT Trichy / Delhi University"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">Course & Specialization / Branch</label>
              <input
                type="text"
                value={editingBranch}
                onChange={(e) => setEditingBranch(e.target.value)}
                placeholder="e.g. B.Tech - Computer Science Engineering"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase block mb-1">Academic CGPA Score (out of 10)</label>
              <input
                type="text"
                value={editingCgpa}
                onChange={(e) => setEditingCgpa(e.target.value)}
                placeholder="8.5"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Structured Skills Dropdown & Catalog Picker */}
            <div className="pt-1">
              <SkillSelectDropdown
                selectedSkills={selectedSkills}
                onChange={setSelectedSkills}
                label="Candidate Technical & Professional Skills"
                placeholder="Select verified skills from categorized dropdown..."
                helperText="Only verified skills from our curated catalog are supported."
                maxSkills={15}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Updated Profile</span>
          </button>
        </form>
      )}

      <PMCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        user={user}
      />
    </div>
  );
};
