import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  X,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  Upload,
  Check,
  FileCheck2,
  Tag
} from 'lucide-react';
import { Internship, User } from '../types';
import { INITIAL_INTERNSHIPS } from '../data/initialData';
import { useLanguage } from '../context/LanguageContext';
import { ALL_VALID_SKILLS } from '../data/skillsAndRolesCatalog';
import { validateResumeFile, validateResumeText } from '../utils/resumeValidator';
import { extractTextFromPdfAsync } from '../utils/pdfExtractor';
import { extractTextFromDocxAsync, extractTextFromDocxClient, extractTextFromPdfClient } from '../utils/clientResumeParser';

interface InternshipsPageProps {
  user: User;
  onApply: (internshipId: string) => void;
  openVoiceSearch: () => void;
  appliedIds: string[];
}

export const InternshipsPage: React.FC<InternshipsPageProps> = ({
  user,
  onApply,
  openVoiceSearch,
  appliedIds
}) => {
  const { t } = useLanguage();
  const [internships, setInternships] = useState<Internship[]>(INITIAL_INTERNSHIPS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [minStipend, setMinStipend] = useState<number>(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Application Modal state
  const [applyModalInternship, setApplyModalInternship] = useState<Internship | null>(null);
  const [selectedCompanyUnit, setSelectedCompanyUnit] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState('');

  useEffect(() => {
    fetch('/api/internships')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.text();
      })
      .then((textData) => {
        if (textData) {
          const data = JSON.parse(textData);
          if (Array.isArray(data) && data.length > 0) setInternships(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const domains = [
    'All',
    'Artificial Intelligence & Machine Learning',
    'Software Engineering & Web Development',
    'Hardware & Embedded Systems',
    'Cloud Computing & Cyber Security',
    'Electrical & Green Energy',
    'Data Science & Public Administration',
    'Automotive Engineering & Software',
    'FinTech & Banking Solutions'
  ];

  // Extract unique company names for dropdown filter
  const companyNames = ['All', ...Array.from(new Set(internships.map((i) => i.companyName)))];

  // Extract top skills for quick dropdown selection
  const popularSkillOptions = ['All', ...Array.from(new Set(['Python', 'React', 'Machine Learning', 'SQL', 'TypeScript', 'Docker', 'AWS', 'Java', 'Data Structures', 'Node.js', 'PyTorch', 'Power BI', 'Embedded Systems', 'Tally Prime', 'Digital Marketing', ...ALL_VALID_SKILLS.slice(0, 30)]))];

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
    const matchesCompany = selectedCompany === 'All' || item.companyName === selectedCompany;
    const matchesSkill = selectedSkillFilter === 'All' || item.skillsRequired.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()) || selectedSkillFilter.toLowerCase().includes(s.toLowerCase()));
    const matchesMode = selectedMode === 'All' || item.mode === selectedMode;
    const matchesStipend = item.stipend >= minStipend;

    return matchesSearch && matchesDomain && matchesCompany && matchesSkill && matchesMode && matchesStipend;
  });

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((i) => i !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const handleOpenApplyModal = (internship: Internship) => {
    setApplyModalInternship(internship);
    setSelectedCompanyUnit(`${internship.companyName} - Primary Division (${internship.location})`);
    setResumeFile(null);
    setUploadError(null);
    setApplicationSuccess('');
  };

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const check = await validateResumeFile(file);
    if (!check.isValid) {
      setUploadError(check.error || 'Upload the correct file document [only resume]. Only PDF, DOCX, DOC, and TXT resume files are supported.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }

    try {
      let extractedDocText = '';
      if (file.name.endsWith('.txt')) {
        extractedDocText = await file.text();
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        try {
          extractedDocText = await extractTextFromDocxAsync(file);
        } catch {
          extractedDocText = '';
        }
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          extractedDocText = await extractTextFromPdfAsync(file);
        } catch {
          extractedDocText = '';
        }
      }

      const contentCheck = validateResumeText(extractedDocText, file.name);
      if (!contentCheck.isValid) {
        setUploadError(contentCheck.error || `Upload the correct file document [only resume]. The selected file "${file.name}" is not a candidate resume/CV.`);
        setResumeFile(null);
        e.target.value = '';
        return;
      }
    } catch {
      // Continue if extraction completed
    }

    setResumeFile(file);
  };

  const handleConfirmApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalInternship) return;

    onApply(applyModalInternship.id);
    setApplicationSuccess(`Application submitted successfully for ${applyModalInternship.role} at ${selectedCompanyUnit}!`);
    setTimeout(() => {
      setApplyModalInternship(null);
      setApplicationSuccess('');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PM INTERNSHIP SCHEME PORTAL</span>
          </div>
          <h1 className="text-3xl font-black">Explore 1,850+ Verified PM Internships</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Browse active internships across top 500 Indian companies. Filter by domain, company name dropdown, location, stipend, and mode. Every posting is audited with an AI Trust Score.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, skill (Python, React), company or city..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={openVoiceSearch}
            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>{t('voiceSearchBtn', 'Voice Search')}</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {t('domainFilterLabel', 'Domain Filter')}
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Item #3: Company Name Dropdown Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {t('companyNameLabel', 'Company Name (Dropdown)')}
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
            >
              {companyNames.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? t('allCompanies', 'All Companies') : c}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Skills Dropdown Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Required Skill (Dropdown)
            </label>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
            >
              {popularSkillOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Skills' : s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {t('workModeLabel', 'Work Mode')}
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
            >
              <option value="All">{t('allModes', 'All Modes (Remote / Hybrid / Onsite)')}</option>
              <option value="Remote">{t('remoteOnly', 'Remote Only')}</option>
              <option value="Hybrid">{t('hybrid', 'Hybrid')}</option>
              <option value="Onsite">{t('onsite', 'Onsite')}</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {t('minStipendLabel', 'Min Stipend')}: ₹{minStipend.toLocaleString('en-IN')}/mo
            </label>
            <input
              type="range"
              min={0}
              max={30000}
              step={2000}
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Internships Grid */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading PM Internship opportunities...</p>
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No internships match your active filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDomain('All');
              setSelectedMode('All');
              setMinStipend(0);
            }}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((item) => {
            const isApplied = appliedIds.includes(item.id);
            const isSaved = savedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-xl transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Row: Logo & Trust Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.companyLogo}
                        alt={item.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                          {item.role}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {item.companyName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 rounded-lg transition ${
                        isSaved
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Internship'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* AI Trust Badge */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      {item.domain}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        item.trustScore && item.trustScore > 90
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{item.trustScore || 95}% AI Safe</span>
                    </span>
                  </div>

                  {/* Key Stats Pill */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="truncate">{item.location} ({item.mode})</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>₹{item.stipend.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.skillsRequired.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedInternship(item)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition"
                  >
                    {t('viewDetails', 'View Details')}
                  </button>

                  <button
                    onClick={() => handleOpenApplyModal(item)}
                    disabled={isApplied}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                      isApplied
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('applied', 'Applied')}
                      </>
                    ) : (
                      `${t('applyNow', 'Apply Now')} →`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ITEM #5 & #7: APPLY NOW MODAL WITH COMPANY NAMES DROPDOWN AND FILE UPLOAD */}
      {applyModalInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
            {/* Top Header & Close */}
            <div className="relative">
              <button
                onClick={() => setApplyModalInternship(null)}
                className="absolute -top-2 -right-2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Internship Overview: Location, Duration, and Skills According to this Application */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    PM Internship Scheme • Application Form
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {applyModalInternship.role}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                    {applyModalInternship.companyName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 inline-block">
                    ₹{applyModalInternship.stipend.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>

              {/* Location & Duration Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block leading-tight">Location & Mode</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {applyModalInternship.location} • {applyModalInternship.mode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block leading-tight">Duration</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {applyModalInternship.duration || '6 Months (12 Mo Scheme)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Skills according to this application */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-500" />
                    <span>Skills Required for this Application:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {applyModalInternship.skillsRequired.length} skills evaluated
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {applyModalInternship.skillsRequired.map((skill, sIdx) => {
                    const candidateHasSkill = user.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <span
                        key={sIdx}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                          candidateHasSkill
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        }`}
                      >
                        {candidateHasSkill && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>{skill}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {applicationSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>{applicationSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmApplication} className="space-y-4 text-xs">
                {/* Item #5: Company Name / Division Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Select Target Company Unit / Center (Dropdown) <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={selectedCompanyUnit}
                    onChange={(e) => setSelectedCompanyUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={`${applyModalInternship.companyName} - Main Innovation Center (${applyModalInternship.location})`}>
                      {applyModalInternship.companyName} - Main Innovation Center ({applyModalInternship.location})
                    </option>
                    <option value={`${applyModalInternship.companyName} - AI & Technology Division (Bengaluru)`}>
                      {applyModalInternship.companyName} - AI & Technology Division (Bengaluru)
                    </option>
                    <option value={`${applyModalInternship.companyName} - Regional Digital Hub (Hyderabad)`}>
                      {applyModalInternship.companyName} - Regional Digital Hub (Hyderabad)
                    </option>
                    <option value={`${applyModalInternship.companyName} - R&D Center (Pune / NCR)`}>
                      {applyModalInternship.companyName} - R&D Center (Pune / NCR)
                    </option>
                  </select>
                </div>

                {/* Candidate Information */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidate Profile</span>
                  <p className="font-bold text-slate-800 dark:text-white">{user.name} ({user.email})</p>
                  <p className="text-slate-500 font-medium">{user.college || 'IIT Delhi'} • {user.branch || 'CSE & AI'}</p>
                </div>

                {/* Item #7: Insert file for resume */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Insert File for Resume (.PDF / .DOCX / .TXT only)
                  </label>
                  <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-3 cursor-pointer transition">
                    <div className="flex items-center gap-2 truncate">
                      <Upload className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 font-medium text-xs truncate">
                        {resumeFile ? resumeFile.name : 'Click to select verified resume file (PDF / DOCX / TXT)'}
                      </span>
                    </div>
                    {resumeFile && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleResumeFileSelect}
                      className="hidden"
                    />
                  </label>

                  {uploadError && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {resumeFile && !uploadError && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{resumeFile.name} verified as valid resume document</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalInternship(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition"
                  >
                    Confirm & Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Modal Header */}
            <div className="flex items-start space-x-4">
              <img
                src={selectedInternship.companyLogo}
                alt={selectedInternship.companyName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedInternship.role}</h2>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{selectedInternship.companyName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedInternship.domain}
                  </span>
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedInternship.mode}
                  </span>
                </div>
              </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stipend</span>
                <span className="font-bold text-emerald-600 text-sm">₹{selectedInternship.stipend.toLocaleString('en-IN')}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{selectedInternship.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Min CGPA</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{selectedInternship.minCGPA} / 10</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Openings</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{selectedInternship.openings} Seats</span>
              </div>
            </div>

            {/* Description & Responsibilities */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">About the Role</h3>
              <p>{selectedInternship.description}</p>

              {selectedInternship.responsibilities && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Key Responsibilities:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedInternship.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const current = selectedInternship;
                  setSelectedInternship(null);
                  handleOpenApplyModal(current);
                }}
                disabled={appliedIds.includes(selectedInternship.id)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                {appliedIds.includes(selectedInternship.id) ? 'Already Applied' : 'Apply Now (Select Company Unit)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
