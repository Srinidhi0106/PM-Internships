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
  MessageSquare,
  TrendingUp,
  Target,
  Calendar,
  Layers
} from 'lucide-react';
import { User, Application, Internship, AppliedInterview } from '../types';
import { GamificationLevelUp } from '../components/GamificationLevelUp';
import { PMCertificateModal } from '../components/PMCertificateModal';
import { SkillSelectDropdown } from '../components/SkillSelectDropdown';
import { AppliedInterviewsTracker } from '../components/AppliedInterviewsTracker';
import { INITIAL_APPLIED_INTERVIEWS } from '../data/initialData';
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
  const [activeTab, setActiveTab] = useState<'applications' | 'interviews' | 'progress' | 'levelup' | 'certificate' | 'profile'>('applications');
  const [editingName, setEditingName] = useState(user.name || '');
  const [editingCollege, setEditingCollege] = useState(user.college || 'IIT Delhi');
  const [editingBranch, setEditingBranch] = useState(user.branch || 'Computer Science Engineering');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user.skills || []);
  const [editingCgpa, setEditingCgpa] = useState(user.cgpa?.toString() || '8.5');
  const [showCertModal, setShowCertModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Applied Interviews State with local persistence
  const [appliedInterviews, setAppliedInterviews] = useState<AppliedInterview[]>(() => {
    try {
      const saved = localStorage.getItem('pm_applied_interviews');
      return saved ? JSON.parse(saved) : INITIAL_APPLIED_INTERVIEWS;
    } catch {
      return INITIAL_APPLIED_INTERVIEWS;
    }
  });

  const handleScheduleNewInterview = (newIntv: AppliedInterview) => {
    const updated = [newIntv, ...appliedInterviews];
    setAppliedInterviews(updated);
    try {
      localStorage.setItem('pm_applied_interviews', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Active Internship Progress Milestones State
  const [internshipMilestones, setInternshipMilestones] = useState([
    { id: 1, month: 'Month 1-2', title: 'Onboarding & Foundation Training', status: 'COMPLETED', progress: 100, mentor: 'Senior MCA Industry Specialist', feedback: 'Completed orientation and repository setup with 100% attendance.' },
    { id: 2, month: 'Month 3-5', title: 'Core Project Implementation & AI Workflows', status: 'COMPLETED', progress: 100, mentor: 'Tech Lead / Staff Engineer', feedback: 'Integrated API endpoints and database models on schedule.' },
    { id: 3, month: 'Month 6-8', title: 'Mid-Term Evaluation & Deliverables', status: 'IN_PROGRESS', progress: 75, mentor: 'Govt MCA Scheme Evaluator', feedback: 'Mid-term presentation scored 92/100. Final optimization underway.' },
    { id: 4, month: 'Month 9-11', title: 'Production Deployment & Scale Testing', status: 'PENDING', progress: 0, mentor: 'DevOps & Reliability Team', feedback: 'Scheduled for upcoming quarter.' },
    { id: 5, month: 'Month 12', title: 'Final Assessment & Official PM Certificate Issue', status: 'PENDING', progress: 0, mentor: 'Ministry Directorate Board', feedback: 'Final audit prior to graduation.' }
  ]);

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
              {user?.email && (
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span>✓</span> Verified Email
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              {user?.email && <span className="text-slate-900 dark:text-white font-semibold">{user.email} • </span>}
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
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Interviews</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base font-extrabold">{appliedInterviews.length}</span>
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
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 sm:space-x-8 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition border-b-2 shrink-0 ${
            activeTab === 'applications'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Applications ({myApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'interviews'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>Applied Interviews ({appliedInterviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'progress'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Internship Progress (12 Mo)</span>
        </button>

        <button
          onClick={() => setActiveTab('levelup')}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
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
          className={`pb-3 transition border-b-2 shrink-0 ${
            activeTab === 'certificate'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          PM Scheme Certificate
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition border-b-2 shrink-0 ${
            activeTab === 'profile'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Edit Candidate Profile
        </button>
      </div>

      {/* TAB CONTENT: APPLIED INTERVIEWS TRACKER */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <AppliedInterviewsTracker
            interviews={appliedInterviews}
            onPracticeRole={(role, company) => {
              if (onNavigate) {
                onNavigate('ai-interview');
              }
            }}
            onScheduleNew={handleScheduleNewInterview}
            onJoinInterview={(intv) => {
              if (intv.meetingPlatform === 'AI_PORTAL_ROOM' && onNavigate) {
                onNavigate('ai-interview');
              } else if (intv.meetingLink) {
                window.open(intv.meetingLink, '_blank');
              }
            }}
          />
        </div>
      )}

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

      {/* TAB CONTENT: INTERNSHIP PROGRESS TRACKING */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PM Scheme Active 12-Month Internship Track</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Internship Tenure Progress & Skill Milestone Tracker
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Track your monthly corporate milestones, mentor evaluation scorecards, attendance logs, and automated eligibility for official PM Certificate issuance.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Completion</span>
                  <span className="text-2xl font-black text-amber-500">65%</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:border-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Stage</span>
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">Month 6-8</span>
                </div>
              </div>
            </div>

            {/* Visual Milestones Timeline */}
            <div className="pt-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                <span>12-Month Structured Ministry Milestones</span>
              </h3>

              <div className="space-y-3">
                {internshipMilestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                        : m.status === 'IN_PROGRESS'
                        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            m.status === 'COMPLETED'
                              ? 'bg-emerald-500 text-white'
                              : m.status === 'IN_PROGRESS'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {m.status === 'COMPLETED' ? '✓' : m.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">
                              {m.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {m.month}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Mentor: <strong className="text-slate-700 dark:text-slate-300">{m.mentor}</strong> • Feedback: {m.feedback}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            m.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : m.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          m.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : m.status === 'IN_PROGRESS'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Attendance rate: <strong className="text-emerald-600">98.4%</strong> (Minimum 85% required for Govt Certificate)
              </span>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Preview PM Certificate</span>
              </button>
            </div>
          </div>
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
