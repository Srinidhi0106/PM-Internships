import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Compass,
  ArrowRight,
  Download,
  Plus,
  X,
  Award,
  Clock,
  Layers,
  Code,
  Briefcase,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Check,
  HelpCircle
} from 'lucide-react';
import { User, SkillGapRoadmapResult, SkillGapItem, RoadmapPhase } from '../types';
import { jsPDF } from 'jspdf';
import {
  VALID_ROLE_CATEGORIES,
  ALL_VALID_ROLES,
  VALID_SKILL_CATEGORIES,
  ALL_VALID_SKILLS,
  isValidRole,
  isValidSkill,
  searchSkills
} from '../data/skillsAndRolesCatalog';

interface AISkillGapRoadmapPageProps {
  user: User;
  onNavigateToInternships?: () => void;
  onUpdateUserSkills?: (skills: string[]) => void;
}

const POPULAR_TARGET_ROLES = [
  { title: 'AI & Data Science Specialist', domain: 'Software & Information Technology', targetBg: 'B.Tech / BCA / B.Sc CS' },
  { title: 'Full Stack Web Developer (React & Node)', domain: 'Software & Information Technology', targetBg: 'B.Tech / BCA' },
  { title: 'Financial Analytics & Tally Specialist', domain: 'Banking, Financial Services & Insurance (BFSI)', targetBg: 'B.Com / BBA' },
  { title: 'Data Analyst & Advanced Excel BI Specialist', domain: 'Banking & Financial Services', targetBg: 'B.Sc / B.Com / BCA' },
  { title: 'Digital Marketing & Growth Associate', domain: 'E-Commerce & Digital Retail', targetBg: 'B.A / BBA / Any Degree' },
  { title: 'Cloud & DevOps Systems Engineer', domain: 'Cloud Infrastructure', targetBg: 'B.Tech / MCA' },
  { title: 'Cybersecurity & Threat Analyst', domain: 'Information Security', targetBg: 'B.Tech / B.Sc CS' }
];

const ACADEMIC_PRESETS = [
  {
    label: '🎓 B.Tech 4th Year (Final Year Capstone)',
    degreeType: 'B.Tech / B.E. (4-Year Engineering)' as const,
    degreeYear: '4th Year (Final Year)',
    role: 'AI & Data Science Specialist',
    industry: 'Software & Information Technology',
    skills: ['Python', 'Data Structures', 'React', 'SQL', 'System Design', 'Git']
  },
  {
    label: '💻 B.Tech 3rd Year (Pre-Final Internship)',
    degreeType: 'B.Tech / B.E. (4-Year Engineering)' as const,
    degreeYear: '3rd Year (Pre-Final Year)',
    role: 'Full Stack Web Developer (React & Node)',
    industry: 'Software & Information Technology',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'HTML5', 'CSS3']
  },
  {
    label: '📊 Degree 3rd Year (Final Year B.Com/B.Sc/BCA)',
    degreeType: '3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)' as const,
    degreeYear: '3rd Year (Final Year)',
    role: 'Financial Analytics & Tally Specialist',
    industry: 'Banking, Financial Services & Insurance (BFSI)',
    skills: ['Financial Accounting', 'Advanced Excel', 'Tally Prime', 'Financial Analysis', 'Communication Skills']
  },
  {
    label: '📈 Degree 2nd Year (Pre-Final B.Sc/BCA/BBA)',
    degreeType: '3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)' as const,
    degreeYear: '2nd Year (Pre-Final Year)',
    role: 'Data Analyst & Business Intelligence (Power BI / Tableau)',
    industry: 'Banking, Financial Services & Insurance (BFSI)',
    skills: ['Advanced Excel', 'SQL', 'Python', 'Data Visualization', 'Problem Solving']
  },
  {
    label: '🏆 4-Year NEP Honors Degree Student',
    degreeType: '4-Year NEP Honors Degree' as const,
    degreeYear: '3rd Year (Pre-Final Year)',
    role: 'Digital Marketing & Growth Associate',
    industry: 'E-Commerce & Digital Retail',
    skills: ['Digital Marketing', 'Search Engine Optimization (SEO)', 'Content Marketing', 'Social Media Strategy', 'Communication Skills']
  }
];

export const AISkillGapRoadmapPage: React.FC<AISkillGapRoadmapPageProps> = ({
  user,
  onNavigateToInternships,
  onUpdateUserSkills
}) => {
  const [targetRole, setTargetRole] = useState('AI & Data Science Specialist');
  const [targetIndustry, setTargetIndustry] = useState('Software & Information Technology');
  const [degreeType, setDegreeType] = useState<'B.Tech / B.E. (4-Year Engineering)' | '3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)' | '4-Year NEP Honors Degree' | 'Postgraduate (M.Tech / MCA / M.Sc / MBA)'>('B.Tech / B.E. (4-Year Engineering)');
  const [degreeYear, setDegreeYear] = useState('3rd Year (Pre-Final Year)');
  const [skillsList, setSkillsList] = useState<string[]>(
    user.skills && user.skills.length > 0
      ? user.skills.filter(s => isValidSkill(s))
      : []
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [roleValidationError, setRoleValidationError] = useState<string | null>(null);
  const [skillValidationError, setSkillValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Skill category browser state
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>(VALID_SKILL_CATEGORIES[0].categoryName);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapRoadmapResult | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'roadmap' | 'certifications'>('roadmap');
  const [expandedPhase, setExpandedPhase] = useState<number>(1);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Auto adjust default year selection when degreeType changes
  useEffect(() => {
    if (degreeType === '3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)') {
      setDegreeYear('2nd Year (Pre-Final Year)');
    } else if (degreeType === 'B.Tech / B.E. (4-Year Engineering)') {
      setDegreeYear('3rd Year (Pre-Final Year)');
    } else if (degreeType === 'Postgraduate (M.Tech / MCA / M.Sc / MBA)') {
      setDegreeYear('1st Year (Pre-Final)');
    } else {
      setDegreeYear('3rd Year (Pre-Final Year)');
    }
  }, [degreeType]);

  // Validate target role on change
  useEffect(() => {
    if (targetRole && !isValidRole(targetRole)) {
      setRoleValidationError(`"${targetRole}" is not a recognized professional role. Please choose a valid role from the catalog.`);
    } else {
      setRoleValidationError(null);
    }
  }, [targetRole]);

  // Fetch initial analysis on component load (only if candidate has skills)
  useEffect(() => {
    if (skillsList.length > 0) {
      fetchSkillGapAnalysis();
    }
  }, []);

  const handleRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    setServerError(null);
    // Find matching category to sync industry
    for (const cat of VALID_ROLE_CATEGORIES) {
      const match = cat.roles.find(r => r.title.toLowerCase() === newRole.toLowerCase());
      if (match) {
        setTargetIndustry(cat.sector);
        break;
      }
    }
  };

  const handleSkillInputChange = (value: string) => {
    setNewSkillInput(value);
    setSkillValidationError(null);
    setServerError(null);
    if (value.trim().length >= 1) {
      const results = searchSkills(value, 6);
      setSkillSuggestions(results);
      setShowSkillDropdown(true);
    } else {
      setSkillSuggestions([]);
      setShowSkillDropdown(false);
    }
  };

  const handleSelectSuggestedSkill = (skill: string) => {
    if (!skillsList.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setSkillsList([...skillsList, skill]);
    }
    setNewSkillInput('');
    setSkillSuggestions([]);
    setShowSkillDropdown(false);
    setSkillValidationError(null);
  };

  const handleAddSkill = () => {
    const clean = newSkillInput.trim();
    if (!clean) return;

    // Strict validation: Reject gibberish like 'abc', 'xyz', 'test'
    if (!isValidSkill(clean)) {
      setSkillValidationError(`"${clean}" is not a recognized industry skill. Please select from the dropdown or catalog (e.g., Python, React, SQL, Docker, Machine Learning).`);
      return;
    }

    if (skillsList.some(s => s.toLowerCase() === clean.toLowerCase())) {
      setSkillValidationError(`"${clean}" is already in your skills list.`);
      return;
    }

    setSkillsList([...skillsList, clean]);
    setNewSkillInput('');
    setSkillSuggestions([]);
    setShowSkillDropdown(false);
    setSkillValidationError(null);
  };

  const handleToggleCatalogSkill = (skill: string) => {
    if (skillsList.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setSkillsList(skillsList.filter(s => s.toLowerCase() !== skill.toLowerCase()));
    } else {
      setSkillsList([...skillsList, skill]);
    }
    setSkillValidationError(null);
    setServerError(null);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const fetchSkillGapAnalysis = async () => {
    // Validate before request
    if (!isValidRole(targetRole)) {
      setRoleValidationError(`Please select a valid recognized job role (e.g. AI & Data Science Specialist, Full Stack Developer, Data Analyst).`);
      return;
    }

    const filteredSkills = skillsList.filter(s => isValidSkill(s));
    if (filteredSkills.length === 0) {
      setSkillValidationError(`Please select at least 1 valid recognized skill to evaluate your profile gap.`);
      return;
    }

    setLoading(true);
    setSyncSuccess(false);
    setServerError(null);
    setRoleValidationError(null);
    setSkillValidationError(null);

    try {
      const response = await fetch('/api/ai/skill-gap-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetIndustry,
          degreeType,
          degreeYear,
          currentSkills: filteredSkills,
          collegeBranch: user.branch || 'Engineering & Technology'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setServerError(data.error || 'Failed to generate roadmap. Please check role and skills.');
      }
    } catch (err) {
      console.error('Error analyzing skill gap:', err);
      setServerError('An unexpected network error occurred while generating your roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSkillsToProfile = () => {
    if (!result || !onUpdateUserSkills) return;
    const missingSkillsToAppend = result.missingSkills.map(m => m.skill);
    const updated = Array.from(new Set([...skillsList, ...missingSkillsToAppend]));
    onUpdateUserSkills(updated);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  const downloadPDFRoadmap = () => {
    if (!result) return;
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('PM INTERNSHIP SCHEME • CAREER ROADMAP', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(217, 119, 6); // Amber
    doc.text(`Target Role: ${result.targetRole} (${result.targetIndustry})`, 14, 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Candidate: ${user.name} | Current Match Score: ${result.currentMatchScore}% -> Projected: ${result.projectedMatchScoreAfterRoadmap}%`, 14, 35);
    doc.text(`Readiness Level: ${result.overallReadinessLevel}`, 14, 41);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 45, 196, 45);

    let y = 52;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Strategic Skill Gap Matrix', 14, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Mastered Skills (${result.masteredSkills.length}): ${result.masteredSkills.join(', ')}`, 14, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Key Missing Skills to Master:', 14, y);
    y += 6;

    result.missingSkills.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(225, 29, 72); // Rose
      doc.text(`• [${item.priority} Priority] ${item.skill} (${item.estimatedHoursToMaster} hrs)`, 16, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const splitReason = doc.splitTextToSize(`  Reason: ${item.importanceReason}`, 175);
      doc.text(splitReason, 16, y);
      y += splitReason.length * 4.5 + 2;
    });

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('2. 8-Week Step-by-Step Personalized Roadmap', 14, y);
    y += 8;

    result.roadmapPhases.forEach((phase) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text(`${phase.phaseTitle}`, 14, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`Focus: ${phase.focusGoal}`, 16, y);
      y += 5;

      doc.setFont('helvetica', 'bold');
      doc.text(`Recommended Project: ${phase.recommendedProject.title}`, 16, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      const splitProj = doc.splitTextToSize(`Deliverable: ${phase.recommendedProject.deliverable}`, 175);
      doc.text(splitProj, 16, y);
      y += splitProj.length * 4.5 + 4;
    });

    doc.save(`${user.name.replace(/\s+/g, '_')}_Skill_Gap_Roadmap.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>AI Skill Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Skill Gap Analysis & 8-Week Career Roadmap
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Identify exact missing technical and soft skills required by India's Top 500 PM Internship Scheme corporate partners. Follow a personalized, step-by-step project roadmap to maximize your selection chances.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {result && (
              <button
                onClick={downloadPDFRoadmap}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download PDF Roadmap</span>
              </button>
            )}
            {onNavigateToInternships && (
              <button
                onClick={onNavigateToInternships}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Matching Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target Role & Skills Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Target Internship Role & Candidate Skills
            </h2>
          </div>
        </div>

        {/* One-Click Academic Background Presets */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              ⚡ Quick Select Academic Profile Presets:
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              Supports 3-Year Degree & 4-Year B.Tech
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACADEMIC_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setDegreeType(preset.degreeType);
                  setDegreeYear(preset.degreeYear);
                  setTargetRole(preset.role);
                  setTargetIndustry(preset.industry);
                }}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  degreeType === preset.degreeType && degreeYear === preset.degreeYear
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:text-amber-600'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Role & Academic Pathway Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Role Selector */}
          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Target Role Selection:</span>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                  Recognized Roles Only
                </span>
              </label>
              {isValidRole(targetRole) ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Valid Technical Role</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Invalid / Unrecognized</span>
                </span>
              )}
            </div>

            {/* Categorized Dropdown */}
            <select
              value={targetRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                roleValidationError ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500'
              }`}
            >
              {VALID_ROLE_CATEGORIES.map((category) => (
                <optgroup key={category.sector} label={`📁 ${category.sector}`}>
                  {category.roles.map((role) => (
                    <option key={role.title} value={role.title}>
                      {role.title} ({role.suitedDegrees ? role.suitedDegrees.split(' / ')[0] : 'All Degrees'})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {roleValidationError && (
              <div className="flex items-start gap-1.5 p-2 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                <span>{roleValidationError}</span>
              </div>
            )}

            {/* Quick curated role pills */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                Top PM Scheme Tracks:
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_TARGET_ROLES.map((role) => (
                  <button
                    key={role.title}
                    type="button"
                    onClick={() => handleRoleChange(role.title)}
                    className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${
                      targetRole === role.title
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Degree Program Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Degree Program:
            </label>
            <select
              value={degreeType}
              onChange={(e) => setDegreeType(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="B.Tech / B.E. (4-Year Engineering)">B.Tech / B.E. (4-Year Program)</option>
              <option value="3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)">3-Year Degree (B.Sc, B.Com, BCA, BBA)</option>
              <option value="4-Year NEP Honors Degree">4-Year Degree (NEP Honors)</option>
              <option value="Postgraduate (M.Tech / MCA / M.Sc / MBA)">Postgraduate (MCA, M.Tech, MBA)</option>
            </select>
          </div>

          {/* Year of Study */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Current Year of Study:
            </label>
            <select
              value={degreeYear}
              onChange={(e) => setDegreeYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {degreeType === '3-Year Degree (B.Sc / B.Com / B.CA / B.BA / B.A)' ? (
                <>
                  <option value="1st Year (Foundations & Core)">1st Year (Foundations & Core)</option>
                  <option value="2nd Year (Pre-Final Year)">2nd Year (Pre-Final Year)</option>
                  <option value="3rd Year (Final Year)">3rd Year (Final Year / Passing Out)</option>
                  <option value="Recent Graduate">Recent Graduate / Passed Out</option>
                </>
              ) : degreeType === 'Postgraduate (M.Tech / MCA / M.Sc / MBA)' ? (
                <>
                  <option value="1st Year (Pre-Final)">1st Year PG (Pre-Final Year)</option>
                  <option value="2nd Year (Final Year)">2nd Year PG (Final Year)</option>
                  <option value="Recent Post-Graduate">Recent Post-Graduate / Fresher</option>
                </>
              ) : (
                <>
                  <option value="1st Year (Engineering Foundations)">1st Year (Engineering Foundations)</option>
                  <option value="2nd Year (Core Engineering)">2nd Year (Core Engineering)</option>
                  <option value="3rd Year (Pre-Final Year)">3rd Year (Pre-Final Year)</option>
                  <option value="4th Year (Final Year)">4th Year (Final Year Capstone)</option>
                  <option value="Recent B.Tech Graduate">Recent Engineering Graduate</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Current Skills Section with Categorized Dropdown & Strict Validation */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Your Selected Skills ({skillsList.length}):</span>
                {skillsList.length > 0 && (
                  <>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                      {skillsList.length} Verified Skills
                    </span>
                    <button
                      type="button"
                      onClick={() => setSkillsList([])}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 underline cursor-pointer ml-1"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Search or select skills below to add them to your profile (skills are only added when you choose them).
              </p>
            </div>

            {/* Quick-Add Skill from Master Catalog Dropdown */}
            <div className="w-full sm:w-auto min-w-[240px]">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleToggleCatalogSkill(e.target.value);
                  }
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">➕ Quick-Add Skill from Catalog...</option>
                {VALID_SKILL_CATEGORIES.map((cat) => (
                  <optgroup key={cat.categoryName} label={`⚡ ${cat.categoryName}`}>
                    {cat.skills.map((s) => (
                      <option key={s} value={s} disabled={skillsList.some(sk => sk.toLowerCase() === s.toLowerCase())}>
                        {skillsList.some(sk => sk.toLowerCase() === s.toLowerCase()) ? `✓ ${s} (Added)` : `+ ${s}`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Active Skills Pills */}
          <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
            {skillsList.length === 0 ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                No skills selected yet. Click any skill tag below or search to add skills to your profile.
              </span>
            ) : (
              skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
                >
                  <Check className="w-3 h-3 text-indigo-500" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer ml-0.5"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Skill Search & Input with Auto-Suggestions & Strict Validation */}
          <div className="space-y-2 relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onFocus={() => {
                    if (newSkillInput.trim().length >= 1) setShowSkillDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Search recognized skill (e.g., Python, Docker, React, PyTorch, SQL, Communication)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Auto-suggest dropdown */}
            {showSkillDropdown && skillSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-28 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {skillSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSelectSuggestedSkill(suggestion)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 flex items-center justify-between cursor-pointer transition"
                  >
                    <span>{suggestion}</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">+ Add to Profile</span>
                  </button>
                ))}
              </div>
            )}

            {/* Validation Error Banner for Gibberish like 'abc' */}
            {skillValidationError && (
              <div className="flex items-start gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{skillValidationError}</span>
              </div>
            )}
          </div>

          {/* Interactive Skill Category Browser */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Browse Skills by Industry Category:
              </span>
              <span className="text-[10px] text-slate-500">
                Click any tag to add/remove
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {VALID_SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.categoryName}
                  type="button"
                  onClick={() => setActiveSkillCategory(cat.categoryName)}
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    activeSkillCategory === cat.categoryName
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {cat.categoryName ? `${cat.categoryName.split(' ')[0]} ${cat.categoryName.split(' ')[1] || ''}` : 'Category'}
                </button>
              ))}
            </div>

            {/* Skills in active category */}
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              {VALID_SKILL_CATEGORIES.find(c => c.categoryName === activeSkillCategory)?.skills.map((skill) => {
                const isSelected = skillsList.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleCatalogSkill(skill)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 font-extrabold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Server Error Display */}
        {serverError && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-200 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Candidate Branch: <span className="font-bold text-slate-700 dark:text-slate-300">{user.branch || 'Computer Science & Engineering'}</span>
          </div>

          <button
            type="button"
            onClick={fetchSkillGapAnalysis}
            disabled={loading || !isValidRole(targetRole) || skillsList.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Corporate Skill Requirements...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Run AI Skill Gap & Generate 8-Week Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync toast alert */}
      {syncSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Successfully synced newly identified skills to your profile and Firestore database!</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 text-center animate-pulse">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl mx-auto flex items-center justify-center">
            <Brain className="w-8 h-8 text-amber-500 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Evaluating Skill Requirements for {targetRole}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Comparing your profile skills against live PM Internship Scheme database requirements from India's top 500 corporate partners...
            </p>
          </div>
          <div className="h-2 w-48 bg-amber-200 dark:bg-amber-800/60 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-amber-500 w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {result && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metric Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score 1: Match Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Role Readiness
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  result.overallReadinessLevel === 'High Readiness'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {result.overallReadinessLevel}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {result.currentMatchScore}%
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Goal: {result.projectedMatchScoreAfterRoadmap}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 flex">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${result.currentMatchScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Current Fit</span>
                  <span>Post 8-Week Goal ({result.projectedMatchScoreAfterRoadmap}%)</span>
                </div>
              </div>
            </div>

            {/* Score 2: Mastered vs Missing */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Skill Balance Breakdown
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-2xl">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {result.masteredSkills.length}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Mastered Skills
                  </span>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3 rounded-2xl">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                    {result.missingSkills.length}
                  </span>
                  <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                    Gaps To Bridge
                  </span>
                </div>
              </div>
            </div>

            {/* Score 3: Sync Actions */}
            <div className="bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                  Profile Synchronization
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                  Add newly identified missing skills to your student profile to get higher match rankings on the AI recommendation engine.
                </p>
              </div>

              <button
                onClick={handleSyncSkillsToProfile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Sync Roadmap Skills to Profile</span>
              </button>
            </div>
          </div>

          {/* Strategic Overview Callout */}
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                AI Strategic Assessment for {result.targetRole}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {result.summaryOverview}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`pb-3 px-2 text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'roadmap'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>8-Week Career Roadmap</span>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
                4 Phases
              </span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`pb-3 px-2 text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'matrix'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Skill Gap Matrix</span>
              <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-full">
                {result.missingSkills.length} Items
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`pb-3 px-2 text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'certifications'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Govt Certifications & Matching PM Roles</span>
            </button>
          </div>

          {/* TAB 1: ROADMAP PHASES */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Personalized 8-Week Step-by-Step Learning Plan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designed to take you from {result.currentMatchScore}% to {result.projectedMatchScoreAfterRoadmap}% match readiness.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {result.roadmapPhases.map((phase) => {
                  const isExpanded = expandedPhase === phase.phaseNumber;
                  return (
                    <div
                      key={phase.phaseNumber}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs transition"
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phaseNumber)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 ${
                            phase.phaseNumber === 1
                              ? 'bg-amber-500 text-slate-950'
                              : phase.phaseNumber === 2
                              ? 'bg-indigo-600 text-white'
                              : phase.phaseNumber === 3
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          }`}>
                            P{phase.phaseNumber}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                              {phase.durationWeeks}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {phase.phaseTitle}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {phase.keyActionItems.length} Action Items
                          </span>
                          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
                          {/* Goal */}
                          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-4 rounded-2xl">
                            <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                              Phase Goal:
                            </span>
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold pt-0.5">
                              {phase.focusGoal}
                            </p>
                          </div>

                          {/* Action Checklist */}
                          <div className="space-y-2">
                            <h5 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                              Action Items Checklist:
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {phase.keyActionItems.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Portfolio Project */}
                          {phase.recommendedProject && (
                            <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 p-5 rounded-2xl space-y-3 shadow-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                    Recommended Portfolio Deliverable
                                  </span>
                                </div>
                                <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                                  Project Benchmark
                                </span>
                              </div>

                              <h6 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {phase.recommendedProject.title}
                              </h6>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {phase.recommendedProject.description}
                              </p>

                              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                                  Tangible Deliverable:
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {phase.recommendedProject.deliverable}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400">Tech Stack:</span>
                                {phase.recommendedProject.techStack?.map((t) => (
                                  <span key={t} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-2 py-0.5 rounded-md">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Curated Learning Resources */}
                          {phase.learningResources && phase.learningResources.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                Curated Free Courses & Documentation:
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {phase.learningResources.map((res, i) => (
                                  <a
                                    key={i}
                                    href={res.url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 p-3 rounded-2xl flex flex-col justify-between space-y-2 group transition"
                                  >
                                    <div>
                                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-block mb-1">
                                        {res.type}
                                      </span>
                                      <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 line-clamp-2">
                                        {res.title}
                                      </h6>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>{res.estimatedTime}</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SKILL GAP MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Missing Technical Skills */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Missing Technical Skills & Tools
                      </h3>
                      <p className="text-xs text-slate-500">
                        Top competencies requested by recruiters for {targetRole}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.missingSkills.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {item.skill}
                            </span>
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            item.priority === 'High'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.importanceReason}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pt-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>Estimated Time: ~{item.estimatedHoursToMaster} Hours</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mastered & Soft Skills */}
                <div className="space-y-6">
                  {/* Mastered Skills */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Verified Strengths ({result.masteredSkills.length})
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {result.masteredSkills.map((s) => (
                        <span
                          key={s}
                          className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Briefcase className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Corporate Soft Skill Competencies
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {result.softSkillGaps?.map((sg, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-medium">{sg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATIONS & MATCHING PM ROLES */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Government Recognized Certifications */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Award className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Recommended Government & Industry Certifications
                      </h3>
                      <p className="text-xs text-slate-500">
                        NPTEL, SWAYAM, and Skill India Digital programs
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {result.suggestedCertifications?.map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 p-3.5 rounded-2xl">
                        <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                            {cert}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Verified PM Scheme Partner Credential
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Qualifying Internship Titles */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Top Qualifying PM Scheme Roles
                      </h3>
                      <p className="text-xs text-slate-500">
                        Corporate listings you will unlock upon roadmap completion
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {result.recommendedInternshipRoles?.map((roleName, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {roleName}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      </div>
                    ))}
                  </div>

                  {onNavigateToInternships && (
                    <button
                      onClick={onNavigateToInternships}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <span>Explore Live PM Scheme Portal Openings</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
