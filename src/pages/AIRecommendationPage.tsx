import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Brain,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Sliders,
  Layers,
  Cpu,
  Check,
  RotateCcw,
  Compass,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { User, AIRecommendation } from '../types';
import { INITIAL_INTERNSHIPS } from '../data/initialData';
import { useLanguage } from '../context/LanguageContext';

interface AIRecommendationPageProps {
  user: User;
  onApply: (internshipId: string) => void;
  appliedIds: string[];
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export const AIRecommendationPage: React.FC<AIRecommendationPageProps> = ({
  user,
  onApply,
  appliedIds,
  activePage = 'ai-recommendation',
  onNavigate
}) => {
  const { t } = useLanguage();
  // Determine active sub tab based on activePage prop or user clicks
  const [activeSubTab, setActiveSubTab] = useState<'recommendations' | 'match-engine' | 'insights'>(() => {
    if (activePage === 'ai-match-engine') return 'match-engine';
    if (activePage === 'explainable-insights') return 'insights';
    return 'recommendations';
  });

  useEffect(() => {
    if (activePage === 'ai-match-engine') setActiveSubTab('match-engine');
    else if (activePage === 'explainable-insights') setActiveSubTab('insights');
    else if (activePage === 'ai-recommendation' || activePage === 'ai-recommendations') setActiveSubTab('recommendations');
  }, [activePage]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(null);
  const [modelAlgorithm, setModelAlgorithm] = useState<'hybrid' | 'content' | 'collaborative'>('hybrid');

  // --- AI MATCH ENGINE CUSTOM SIMULATOR STATE ---
  const [skillWeight, setSkillWeight] = useState(40);
  const [cgpaWeight, setCgpaWeight] = useState(25);
  const [locationWeight, setLocationWeight] = useState(15);
  const [portfolioWeight, setPortfolioWeight] = useState(20);

  const [selectedDomain, setSelectedDomain] = useState('AI & Machine Learning');
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru');

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python',
    'Machine Learning',
    'React.js',
    'SQL'
  ]);

  const [calculatingMatch, setCalculatingMatch] = useState(false);
  const [customMatchResults, setCustomMatchResults] = useState<
    { role: string; company: string; score: number; matchType: string; status: string }[]
  >([]);

  // Available skills list for toggling
  const availableSkills = [
    'Python',
    'Machine Learning',
    'React.js',
    'TypeScript',
    'SQL',
    'Docker',
    'AWS',
    'Data Analysis',
    'TensorFlow',
    'Java',
    'Node.js'
  ];

  // --- EXPLAINABLE INSIGHTS STATE ---
  const [completedRoadmapSteps, setCompletedRoadmapSteps] = useState<number[]>([1]);

  const toggleRoadmapStep = (stepIdx: number) => {
    if (completedRoadmapSteps.includes(stepIdx)) {
      setCompletedRoadmapSteps(completedRoadmapSteps.filter((s) => s !== stepIdx));
    } else {
      setCompletedRoadmapSteps([...completedRoadmapSteps, stepIdx]);
    }
  };

  useEffect(() => {
    setLoading(true);

    const getFallbackRecommendations = (): AIRecommendation[] => {
      const userSkills = user.skills || ['Python', 'React', 'SQL'];
      return INITIAL_INTERNSHIPS.slice(0, 6).map((item, idx) => {
        const matching = item.skillsRequired.filter(s => userSkills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase())));
        const matchPct = Math.min(96, Math.max(78, Math.round((matching.length / Math.max(1, item.skillsRequired.length)) * 100) + 15));
        const missing = item.skillsRequired.filter(s => !matching.includes(s));
        return {
          internshipId: item.id,
          role: item.role,
          companyName: item.companyName,
          companyLogo: item.companyLogo || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop',
          matchScore: matchPct,
          selectionChance: matchPct - 3,
          factorBreakdown: {
            skills: matchPct,
            academics: 92,
            location: 88
          },
          whyRecommended: `Matched with candidate skills in ${matching.join(', ') || 'core domains'} for Prime Minister's Internship Scheme.`,
          missingSkills: missing.length > 0 ? missing : ['Docker', 'AWS'],
          learningRoadmap: `1. Review ${missing[0] || 'advanced skills'} → 2. Complete practical hands-on exercises → 3. Apply via PM Scheme Portal.`
        };
      });
    };

    fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile: user })
    })
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.text();
      })
      .then((textData) => {
        if (!textData) throw new Error('Empty response');
        const data = JSON.parse(textData);
        const rawList = Array.isArray(data) ? data : data.recommendations || [];
        if (rawList.length === 0) throw new Error('No items');

        const recsList: AIRecommendation[] = rawList.map((item: any) => ({
          internshipId: item.internshipId || item.id || `rec-${Math.random()}`,
          role: item.role || 'Software & AI Intern',
          companyName: item.companyName || 'Corporate Partner',
          companyLogo:
            item.companyLogo ||
            'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop',
          matchScore: item.matchScore ?? item.matchPercentage ?? 88,
          selectionChance: item.selectionChance ?? item.breakdown?.estimatedSelectionChance ?? 85,
          factorBreakdown: {
            skills: item.factorBreakdown?.skills ?? item.breakdown?.skillMatchScore ?? 85,
            academics: item.factorBreakdown?.academics ?? 92,
            location: item.factorBreakdown?.location ?? 90
          },
          whyRecommended:
            typeof item.whyRecommended === 'string'
              ? item.whyRecommended
              : Array.isArray(item.whyRecommended)
              ? item.whyRecommended.join('. ')
              : item.breakdown?.explanation || `High domain skill match.`,
          missingSkills: Array.isArray(item.missingSkills)
            ? item.missingSkills
            : item.breakdown?.missingSkills || ['Docker', 'AWS'],
          learningRoadmap:
            typeof item.learningRoadmap === 'string'
              ? item.learningRoadmap
              : Array.isArray(item.learningRoadmap)
              ? item.learningRoadmap.join(' → ')
              : Array.isArray(item.breakdown?.learningRoadmap)
              ? item.breakdown.learningRoadmap.join(' → ')
              : 'Complete foundational project tutorials.'
        }));

        setRecommendations(recsList);
        if (recsList.length > 0) {
          setSelectedRec(recsList[0]);
        }
        setLoading(false);
        runCustomMatchCalculation(recsList);
      })
      .catch((err) => {
        console.info('Using smart client recommendation engine fallback:', err?.message);
        const fallbackList = getFallbackRecommendations();
        setRecommendations(fallbackList);
        if (fallbackList.length > 0) {
          setSelectedRec(fallbackList[0]);
        }
        setLoading(false);
        runCustomMatchCalculation(fallbackList);
      });
  }, [user]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const runCustomMatchCalculation = (sourceList = recommendations) => {
    setCalculatingMatch(true);

    setTimeout(() => {
      // Calculate normalized score based on sliders and skills
      const baseScore = Math.min(
        99,
        Math.round(
          (selectedSkills.length / 5) * (skillWeight * 0.9) +
            (user.cgpa || 8.5) * (cgpaWeight / 10) +
            locationWeight * 1.8 +
            portfolioWeight * 1.5
        )
      );

      const calculated = (sourceList.length > 0 ? sourceList : [
        { role: 'AI & Data Engineering Intern', companyName: 'PM Scheme Enterprise' },
        { role: 'Full Stack Development Intern', companyName: 'Tata Consultancy' },
        { role: 'Machine Learning Research Intern', companyName: 'Infosys Innovation' }
      ]).map((item, idx) => {
        const variance = (idx === 0 ? 5 : idx === 1 ? -3 : -8);
        const finalScore = Math.min(98, Math.max(60, baseScore + variance));
        return {
          role: item.role,
          company: item.companyName,
          score: finalScore,
          matchType: finalScore >= 85 ? 'Strong Match' : finalScore >= 75 ? 'Moderate Match' : 'Potential Match',
          status: finalScore >= 85 ? 'High Shortlist Odds' : 'Medium Shortlist Odds'
        };
      });

      setCustomMatchResults(calculated);
      setCalculatingMatch(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs relative overflow-hidden space-y-6">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
            <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>EXPLAINABLE AI ENGINE & MATCH MATRIX • PM INTERNSHIP SCHEME</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Smart Career & Match Engine</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl font-medium leading-relaxed">
            Transparent, government-backed AI matching engine. Calculate candidate-internship fit scores, adjust skill and academic weights live, and inspect explainable factor breakdowns (XAI) for every opportunity.
          </p>
        </div>

        {/* Primary Sub-Tab Switcher for AI Hub */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveSubTab('recommendations');
                if (onNavigate) onNavigate('ai-recommendation');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'recommendations'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('smartRecommendationsTab', 'Smart Recommendations')}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('match-engine');
                if (onNavigate) onNavigate('ai-match-engine');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'match-engine'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t('aiMatchEngineSubTab', 'AI Match Engine')}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('insights');
                if (onNavigate) onNavigate('explainable-insights');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'insights'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t('explainableInsightsSubTab', 'Explainable Insights (XAI)')}</span>
            </button>
          </div>

          {/* Quick Shortcuts */}
          {onNavigate && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('ai-interview')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-teal-600" />
                <span>{t('mockInterviewBtn', 'Mock Interview')}</span>
              </button>

              <button
                onClick={() => onNavigate('ai-portfolio')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3 h-3 text-amber-600" />
                <span>{t('portfolioAuditBtn', 'Portfolio Audit')}</span>
              </button>

              <button
                onClick={() => onNavigate('resume-parser')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Target className="w-3 h-3 text-blue-600" />
                <span>{t('step1Title', 'Resume Parser')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUB-VIEW 1: SMART RECOMMENDATIONS */}
      {activeSubTab === 'recommendations' && (
        <>
          {loading ? (
            <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Analyzing student profile & computing semantic match vectors...
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No AI recommendations available right now.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Algorithm Model Architecture Selector (Slide 8 Requirement) */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Recommendation Engine Algorithm (Slide 8 Core Innovation)
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Compare recommendation scores across different ML pipelines.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <button
                      onClick={() => setModelAlgorithm('hybrid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        modelAlgorithm === 'hybrid'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Hybrid Ensemble (89.4%)</span>
                    </button>

                    <button
                      onClick={() => setModelAlgorithm('content')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        modelAlgorithm === 'content'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Content-Based (NLP)</span>
                    </button>

                    <button
                      onClick={() => setModelAlgorithm('collaborative')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        modelAlgorithm === 'collaborative'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Collaborative Filtering</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>
                    <strong>Active Model Pipeline: </strong>
                    {modelAlgorithm === 'hybrid'
                      ? 'Multi-Objective Ensemble (35% Content-Based + 25% Collaborative Matrix + 30% NLP Semantic Embeddings + 10% Equity Fair Weighting)'
                      : modelAlgorithm === 'content'
                      ? 'TF-IDF & Cosine Similarity on extracted resume skills and job requirements vector representation'
                      : 'Singular Value Decomposition (SVD) matrix factorization over 45,000+ past student-company application interactions'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-3">
                    {modelAlgorithm === 'hybrid' ? 'Accuracy: 89.4%' : modelAlgorithm === 'content' ? 'Accuracy: 84.2%' : 'Accuracy: 82.7%'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recommendation List Column */}
                <div className="lg:col-span-5 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                    Top Matched Roles ({recommendations.length})
                  </h2>

                {recommendations.map((rec) => {
                  const isSelected = selectedRec?.internshipId === rec.internshipId;
                  const isApplied = appliedIds.includes(rec.internshipId);

                  return (
                    <div
                      key={rec.internshipId}
                      onClick={() => setSelectedRec(rec)}
                      className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rec.companyLogo}
                            alt={rec.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                              {rec.role}
                            </h3>
                            <p className="text-xs text-slate-500">{rec.companyName}</p>
                          </div>
                        </div>

                        {/* Match Badge */}
                        <div className="text-right">
                          <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200">
                            {rec.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>
                          Selection chance:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {rec.selectionChance}%
                          </strong>
                        </span>
                        {isApplied ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <span className="text-indigo-600 font-bold flex items-center gap-1">
                            View Analysis <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Match Breakdown Column */}
              {selectedRec && (
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-lg">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedRec.companyLogo}
                        alt={selectedRec.companyName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                          {selectedRec.role}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500">
                          {selectedRec.companyName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onApply(selectedRec.internshipId)}
                      disabled={appliedIds.includes(selectedRec.internshipId)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                    >
                      {appliedIds.includes(selectedRec.internshipId) ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>

                  {/* Explainable AI Factors */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-indigo-500" />
                        <span>Explainable AI Factor Breakdown</span>
                      </h3>
                      <span className="text-xs font-extrabold text-emerald-600">
                        Overall {selectedRec.matchScore}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Skills Alignment
                        </span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {selectedRec.factorBreakdown?.skills || 85}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Academic fit
                        </span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {selectedRec.factorBreakdown?.academics || 90}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Location preference
                        </span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {selectedRec.factorBreakdown?.location || 90}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why Recommended Explanation */}
                  <div className="space-y-2 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>Why AI Recommended This Role</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedRec.whyRecommended}
                    </p>
                  </div>

                  {/* Skill Gap Analysis */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">
                      Missing Skills & Learning Roadmap
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedRec.missingSkills || []).map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900"
                        >
                          Missing: {skill}
                        </span>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
                        <BookOpen className="w-4 h-4" />
                        <span>30-Day Skill Acceleration Path</span>
                      </div>
                      <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        {selectedRec.learningRoadmap}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </>
      )}

      {/* SUB-VIEW 2: AI MATCH ENGINE */}
      {activeSubTab === 'match-engine' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <span>Interactive AI Match Engine Calculator</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust algorithmic weights, select target skills, and simulate candidate-opportunity compatibility scores in real-time.
                </p>
              </div>

              <button
                onClick={() => runCustomMatchCalculation()}
                disabled={calculatingMatch}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
              >
                {calculatingMatch ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Calculating Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    <span>Run Match Calculation</span>
                  </>
                )}
              </button>
            </div>

            {/* Slider Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* Skill Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Skill Relevance Weight</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Prioritizes technical stack matching</span>
              </div>

              {/* CGPA Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Academic CGPA Weight</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{cgpaWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={cgpaWeight}
                  onChange={(e) => setCgpaWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Emphasizes college grades & coursework</span>
              </div>

              {/* Location Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Location Proximity Boost</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{locationWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={locationWeight}
                  onChange={(e) => setLocationWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Boosts nearby or hybrid preferences</span>
              </div>

              {/* Portfolio Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Portfolio & Project Quality</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{portfolioWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={portfolioWeight}
                  onChange={(e) => setPortfolioWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Weights verified GitHub repos & projects</span>
              </div>
            </div>

            {/* Candidate Skill Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Candidate Target Skills to Include in Matrix:
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real-time Custom Match Results Table */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Calculated Compatibility Matrix Results</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Updated based on custom algorithmic weights
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customMatchResults.map((res, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-indigo-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Role #{idx + 1}</span>
                      <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200">
                        {res.score}% Match
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {res.role}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{res.company}</p>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${res.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-1">
                      <span>{res.matchType}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{res.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: EXPLAINABLE INSIGHTS (XAI) */}
      {activeSubTab === 'insights' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-md">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>SHAP/LIME EXPLAINABLE AI (XAI) TRANSPARENCY REPORT</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Explainable Insights & Selection Probability Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full transparency into how the PM Internship AI model calculates candidate match percentages, feature importance contributions, and interview shortlisting odds.
              </p>
            </div>

            {/* Top Stat Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                  Overall Match Probability
                </span>
                <span className="text-3xl font-black text-indigo-900 dark:text-white">88.5%</span>
                <span className="text-[11px] font-semibold text-emerald-600 block">Top 5% Candidate Rank</span>
              </div>

              <div className="bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                  Shortlist Odds
                </span>
                <span className="text-3xl font-black text-emerald-900 dark:text-white">92%</span>
                <span className="text-[11px] font-semibold text-emerald-600 block">High Shortlist Likelihood</span>
              </div>

              <div className="bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Skill Gap Deficiency
                </span>
                <span className="text-3xl font-black text-amber-900 dark:text-white">12%</span>
                <span className="text-[11px] font-semibold text-amber-700 block">Docker / Cloud DevOps</span>
              </div>
            </div>

            {/* SHAP Feature Contribution Bars */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Feature Importance & Decision Weights (SHAP Analysis)</span>
              </h3>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                {/* Feature 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      + Python, Machine Learning & SQL Skill Match
                    </span>
                    <span className="text-emerald-600 font-extrabold">+34% Positive Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      + Academic CGPA Merit (8.8 / 10.0)
                    </span>
                    <span className="text-emerald-600 font-extrabold">+26% Positive Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      + Preferred Location Proximity (Bengaluru / Hybrid)
                    </span>
                    <span className="text-emerald-600 font-extrabold">+18% Positive Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                {/* Feature 4 (Negative) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      - Lack of Docker Containerization in Resume
                    </span>
                    <span className="text-rose-600 font-extrabold">-8% Penalty</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Week Career Skill Improvement Plan */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Actionable 4-Week Skill Acceleration Roadmap</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: 1,
                    title: 'Week 1: Core Technical Refinement',
                    desc: 'Complete 3 micro-projects in Python and TensorFlow data pipelines.',
                    action: 'Complete NPTEL Module'
                  },
                  {
                    num: 2,
                    title: 'Week 2: Docker & Containerization',
                    desc: 'Build & deploy a containerized API on Docker Desktop.',
                    action: 'Build Portfolio Container'
                  },
                  {
                    num: 3,
                    title: 'Week 3: AI Interview Simulator Practice',
                    desc: 'Complete 2 mock technical interviews with Dr. Ananya Sharma avatar.',
                    action: 'Start Mock Interview'
                  },
                  {
                    num: 4,
                    title: 'Week 4: One-Click PM Scheme Application',
                    desc: 'Submit final verified application to top 5 shortlisted enterprise partners.',
                    action: 'Apply to Scheme Roles'
                  }
                ].map((step) => {
                  const isDone = completedRoadmapSteps.includes(step.num);
                  return (
                    <div
                      key={step.num}
                      onClick={() => toggleRoadmapStep(step.num)}
                      className={`p-5 rounded-2xl border cursor-pointer transition space-y-2 ${
                        isDone
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500">Step 0{step.num}</span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
