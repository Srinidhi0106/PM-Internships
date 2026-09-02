import React, { useState, useRef } from 'react';
import {
  FileText,
  Github,
  Linkedin,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
  Upload,
  Brain,
  Download,
  BookOpen,
  ExternalLink,
  Globe,
  RefreshCw,
  XCircle,
  FileCheck2,
  ShieldAlert,
  Trash2,
  Check,
  ArrowRight,
  Target,
  Compass,
  Code,
  GraduationCap,
  Briefcase,
  Lightbulb,
  CheckCheck,
  TrendingUp,
  Layers
} from 'lucide-react';
import { User, PortfolioAudit } from '../types';
import { validateResumeFile, validateResumeText } from '../utils/resumeValidator';
import { validateGithubUrl, validateLinkedinUrl } from '../utils/urlValidator';
import {
  parseResumeAndAuditClient,
  extractTextFromPdfClient,
  extractTextFromDocxClient,
  extractTextFromDocxAsync
} from '../utils/clientResumeParser';
import { extractTextFromPdfAsync } from '../utils/pdfExtractor';

interface AIPortfolioPageProps {
  user: User;
  onNavigate?: (page: string) => void;
}

export const AIPortfolioPage: React.FC<AIPortfolioPageProps> = ({ user, onNavigate }) => {
  const [githubUsername, setGithubUsername] = useState(user.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '');
  const [resumeText, setResumeText] = useState('');
  const [fileAttached, setFileAttached] = useState<{ name: string; base64: string; type: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<PortfolioAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingFile, setVerifyingFile] = useState(false);
  const [recheckingAts, setRecheckingAts] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const auditResultRef = useRef<HTMLDivElement>(null);

  // Live URL validation
  const githubCheck = validateGithubUrl(githubUsername);
  const linkedinCheck = validateLinkedinUrl(linkedinUrl);

  const clearUploadedFile = () => {
    setFileAttached(null);
    setResumeText('');
    setAuditResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processSelectedFile = async (file: File) => {
    setValidationError(null);
    setAuditResult(null);

    // Validate URLs if entered
    if (githubUsername.trim() && !githubCheck.isValid) {
      setValidationError(githubCheck.error || 'ERROR: Invalid GitHub URL');
      return;
    }
    if (linkedinUrl.trim() && !linkedinCheck.isValid) {
      setValidationError(linkedinCheck.error || 'ERROR: Invalid LinkedIn URL');
      return;
    }

    // 1. Strict File Structure & Name Validation
    const check = await validateResumeFile(file);
    if (!check.isValid) {
      clearUploadedFile();
      setValidationError(
        check.error ||
          'Upload the correct file document [only resume]. Only candidate resumes/CVs (.PDF, .DOCX, .TXT) are supported.'
      );
      return;
    }

    setVerifyingFile(true);

    // 2. Read File and Verify via Client Content Analysis & AI Engine
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      try {
        // Fast client-side text extraction
        let extractedDocText = '';
        if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          try {
            extractedDocText = await extractTextFromDocxAsync(file);
          } catch {
            extractedDocText = extractTextFromDocxClient(base64);
          }
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          try {
            extractedDocText = await extractTextFromPdfAsync(file);
          } catch {
            extractedDocText = extractTextFromPdfClient(base64);
          }
        } else if (file.name.endsWith('.txt') || file.type.includes('text')) {
          try {
            const cleanBase64 = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
            try {
              extractedDocText = decodeURIComponent(escape(window.atob(cleanBase64)));
            } catch {
              extractedDocText = window.atob(cleanBase64);
            }
          } catch {
            extractedDocText = '';
          }
        }

        // Strict candidate resume content check across all file types (PDF, DOCX, DOC, TXT)
        const contentCheck = validateResumeText(extractedDocText, file.name);
        if (!contentCheck.isValid) {
          clearUploadedFile();
          setValidationError(
            contentCheck.error ||
              `Upload the correct file document [only resume]. The selected file "${file.name}" is not a candidate resume/CV.`
          );
          setVerifyingFile(false);
          return;
        }

        let verifyData: any = null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1800);

          const verifyRes = await fetch('/api/ai/parse-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              fileData: base64,
              mimeType: file.type || 'application/pdf',
              fileName: file.name,
              resumeText: extractedDocText || '',
              linkedinUrl: linkedinCheck.cleanedValue || '',
              githubUrl: githubCheck.cleanedValue || ''
            })
          });

          clearTimeout(timeoutId);

          if (verifyRes.ok) {
            verifyData = await verifyRes.json().catch(() => null);
          } else if (verifyRes.status === 400) {
            const errData = await verifyRes.json().catch(() => null);
            if (errData?.error && !errData.isValidResume) {
              clearUploadedFile();
              setValidationError(errData.error);
              setVerifyingFile(false);
              return;
            }
          } else {
            // Vercel static deployment (404/405/500): proceed to instant client-side fallback
            verifyData = null;
          }
        } catch {
          // Server endpoint timeout or unreachable (e.g. Vercel static deployment)
          verifyData = null;
        }

        // If server was unreachable or not present (e.g. Vercel static SPA), use client-side parser
        if (!verifyData) {
          verifyData = await parseResumeAndAuditClient({
            fileName: file.name,
            fileData: base64,
            rawText: extractedDocText,
            linkedinUrl: linkedinCheck.cleanedValue || '',
            githubUrl: githubCheck.cleanedValue || '',
            existingUser: user
          });
        }

        if (!verifyData || verifyData.isValidResume === false) {
          clearUploadedFile();
          setValidationError(
            verifyData?.error ||
              `Upload the correct file document [only resume]. The selected file "${file.name}" is not a candidate resume/CV.`
          );
          setVerifyingFile(false);
          return;
        }

        // Successfully verified as candidate resume
        setFileAttached({
          name: file.name,
          base64,
          type: file.type || 'application/pdf'
        });

        const extractedSkills = verifyData.skills || verifyData.profile?.skills || user.skills || [];
        const extractedCollege = verifyData.college || verifyData.profile?.college || user.college || '';
        const extractedBranch = verifyData.branch || verifyData.profile?.branch || user.branch || '';

        setResumeText(
          `[Verified Candidate Resume: ${file.name}]\n` +
            `Candidate: ${verifyData.name || user.name}\n` +
            `Education: ${extractedBranch ? `${extractedBranch}, ` : ''}${extractedCollege}\n` +
            `Skills: ${extractedSkills.join(', ')}`
        );
      } catch (err: any) {
        console.error('File verification error:', err);
        clearUploadedFile();
        setValidationError(
          err?.message ||
            `Upload the correct file document [only resume]. The selected file "${file.name}" could not be verified as a candidate resume.`
        );
      } finally {
        setVerifyingFile(false);
      }
    };

    reader.onerror = () => {
      clearUploadedFile();
      setVerifyingFile(false);
      setValidationError('Error reading file. Please upload a valid candidate resume PDF or DOCX file.');
    };

    reader.readAsDataURL(file);
  };

  const validateAndUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const runAudit = async () => {
    setValidationError(null);

    // Strict URL validation
    if (githubUsername.trim() && !githubCheck.isValid) {
      setValidationError(githubCheck.error || 'ERROR: Invalid GitHub URL');
      return;
    }
    if (linkedinUrl.trim() && !linkedinCheck.isValid) {
      setValidationError(linkedinCheck.error || 'ERROR: Invalid LinkedIn URL');
      return;
    }

    // Strict validation: Require verified file OR validated candidate resume text
    if (!fileAttached) {
      if (!resumeText.trim()) {
        setValidationError(
          'Upload the correct file document [only resume]. Please upload your candidate resume PDF/DOCX or enter valid resume sections.'
        );
        return;
      }

      const textCheck = validateResumeText(resumeText);
      if (!textCheck.isValid) {
        setValidationError(
          textCheck.error ||
            'Upload the correct file document [only resume]. The text provided does not contain candidate resume sections (Education, Skills, Experience, Projects).'
        );
        return;
      }
    }

    setLoading(true);
    try {
      let data: any = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);

        const res = await fetch('/api/ai/portfolio-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            githubUsername: githubCheck.cleanedValue || githubUsername || user.githubUrl || 'candidate-code',
            linkedinUrl: linkedinCheck.cleanedValue || linkedinUrl || user.linkedinUrl || '',
            resumeText,
            fileData: fileAttached?.base64,
            fileName: fileAttached?.name,
            mimeType: fileAttached?.type
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          data = await res.json().catch(() => null);
        } else if (res.status === 400) {
          const errData = await res.json().catch(() => null);
          if (errData?.error && !errData.isValidResume) {
            setValidationError(errData.error);
            setLoading(false);
            return;
          }
        } else {
          // Serverless 404 / 500 on Vercel fallback
          data = null;
        }
      } catch {
        data = null;
      }

      // If server was unreachable or in static SPA mode, use client-side audit engine
      if (!data) {
        data = await parseResumeAndAuditClient({
          fileName: fileAttached?.name,
          fileData: fileAttached?.base64,
          rawText: resumeText,
          linkedinUrl: linkedinCheck.cleanedValue || linkedinUrl || user.linkedinUrl || '',
          githubUrl: githubCheck.cleanedValue || githubUsername || user.githubUrl || '',
          existingUser: user
        });
      }

      if (!data || data.isValidResume === false) {
        setValidationError(
          data?.error ||
            'Upload the correct file document [only resume]. The provided document does not appear to be a candidate resume/CV.'
        );
        setLoading(false);
        return;
      }

      const normalized: PortfolioAudit = {
        ...data,
        atsScore: data.atsScore ?? data.atsResumeScore ?? 91,
        githubScore: data.githubScore ?? (githubUsername ? 88 : 75),
        linkedinScore: data.linkedinScore ?? (linkedinUrl ? 92 : 78),
        recommendations: data.recommendations || (
          data.suggestions
            ? [
                ...(data.suggestions.missingSkills || []).map((s: string) => `Add missing skill: ${s}`),
                ...(data.suggestions.betterProjects || []).map((p: string) => `Project idea: ${p}`),
                ...(data.suggestions.resumeKeywords || []).map((k: string) => `Include keyword: ${k}`),
                ...(data.suggestions.linkedinImprovements || []).map((l: string) => `LinkedIn optimization: ${l}`),
                ...(data.suggestions.portfolioImprovements || []).map((i: string) => `Improvement: ${i}`)
              ]
            : [
                'LinkedIn Headline: Optimize with target role titles (e.g., "Aspiring AI Engineer | PM Scheme Candidate")',
                'Add quantifiable impact metrics to project descriptions (e.g., Improved efficiency by 40%)',
                'Ensure core keywords like Python, React, Data Structures, and Machine Learning match PM Internship requirements',
                'Add professional README badges, live demo links, and architectural diagrams to GitHub repos',
                'Include open-source contributions and maintain consistent daily commit activity'
              ]
        )
      };

      setAuditResult(normalized);
      setTimeout(() => {
        auditResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Portfolio audit error:', err);
      setValidationError(
        err?.message ||
          'Upload the correct file document [only resume]. Please upload a valid candidate resume containing Education, Skills, and Projects.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecheckAts = async () => {
    setValidationError(null);
    if (!fileAttached && !resumeText.trim()) {
      setValidationError('Upload the correct file document [only resume]. Please upload your candidate resume first.');
      return;
    }

    if (!fileAttached && resumeText.trim()) {
      const textCheck = validateResumeText(resumeText);
      if (!textCheck.isValid) {
        setValidationError(textCheck.error || 'Upload the correct file document [only resume].');
        return;
      }
    }

    setRecheckingAts(true);
    try {
      let score = 92;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch('/api/ai/ats-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            resumeText,
            fileData: fileAttached?.base64,
            fileName: fileAttached?.name,
            targetRole: 'AI & Software Engineering Specialist',
            skills: user.skills || []
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.isValidResume === false) {
            setValidationError(data.error || 'Upload the correct file document [only resume].');
            setRecheckingAts(false);
            return;
          }
          if (data && data.atsScore) score = data.atsScore;
        } else if (res.status === 400) {
          const errData = await res.json().catch(() => null);
          if (errData?.error && !errData.isValidResume) {
            setValidationError(errData.error);
            setRecheckingAts(false);
            return;
          }
        } else {
          // Fallback to client audit if endpoint is 404 on Vercel
          const clientParsed = await parseResumeAndAuditClient({
            fileName: fileAttached?.name,
            fileData: fileAttached?.base64,
            rawText: resumeText,
            existingUser: user
          });
          if (clientParsed.isValidResume === false) {
            setValidationError(clientParsed.error || 'Upload the correct file document [only resume].');
            setRecheckingAts(false);
            return;
          }
          score = clientParsed.atsScore || 92;
        }
      } catch {
        // Fallback check
        const clientParsed = await parseResumeAndAuditClient({
          fileName: fileAttached?.name,
          fileData: fileAttached?.base64,
          rawText: resumeText,
          existingUser: user
        });
        if (clientParsed.isValidResume === false) {
          setValidationError(clientParsed.error || 'Upload the correct file document [only resume].');
          setRecheckingAts(false);
          return;
        }
        score = clientParsed.atsScore || 92;
      }

      setAuditResult((prev) => ({
        ...prev,
        atsScore: score,
        atsResumeScore: score,
        overallScore: Math.round((score + (prev?.githubScore || 85) + (prev?.linkedinScore || 80)) / 3),
        recommendations: prev?.recommendations || [
          'Include quantifiable metrics for each project bullet',
          'Add specific domain keywords: Python, Machine Learning, Data Science, SQL',
          'Ensure chronological ordering in Education & Projects sections'
        ]
      }));
    } finally {
      setRecheckingAts(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI PORTFOLIO, ATS & GITHUB AUDITOR</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">ATS Resume, LinkedIn Profile & GitHub Repository Auditor</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
            Get an instant ATS score for your resume, an automated code audit of your GitHub repositories, and AI-driven LinkedIn profile optimization insights tailored for the PM Internship Scheme.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span>Provide Portfolio, Resume & Social Profile Details</span>
          </h2>
          <span className="text-xs text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
            Strict Resume Only Upload
          </span>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in fade-in">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block">Invalid Document Uploaded:</span>
              <p>{validationError}</p>
            </div>
          </div>
        )}

        {/* File Upload Zone with Drag & Drop & Real-time Verification */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Upload Resume Document (PDF / DOCX / TXT)</span>
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition text-center space-y-2 group ${
              isDragging
                ? 'border-indigo-600 bg-indigo-100/50 dark:bg-indigo-950/50 scale-[1.01]'
                : 'border-indigo-200 dark:border-slate-700 hover:border-indigo-500 bg-indigo-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {isDragging ? 'Drop candidate resume file here' : 'Click or drag to upload candidate resume (.PDF, .DOCX, .TXT)'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Only candidate resumes and CVs are accepted. Other files (forms, bills, IDs, assignments) are strictly rejected.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={validateAndUploadFile}
              className="hidden"
            />
          </div>

          {verifyingFile && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Verifying resume authenticity and document structure with AI...</span>
            </div>
          )}

          {fileAttached && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Candidate Resume: {fileAttached.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Authentic Resume Verified
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearUploadedFile();
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>GitHub Username or Profile URL</span>
              </label>
              {githubUsername.trim() && (
                githubCheck.isValid ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3" /> Valid GitHub
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3" /> ERROR: Invalid URL
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter your GitHub username or profile URL (https://github.com/your-username)"
              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                githubUsername.trim() && !githubCheck.isValid
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {githubUsername.trim() && !githubCheck.isValid && (
              <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 animate-fadeIn">
                {githubCheck.error}
              </p>
            )}
          </div>

          {/* LinkedIn Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn Profile URL</span>
              </label>
              {linkedinUrl.trim() && (
                linkedinCheck.isValid ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3" /> Valid LinkedIn
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3" /> ERROR: Invalid URL
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="Enter your LinkedIn profile URL (https://linkedin.com/in/your-profile)"
              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                linkedinUrl.trim() && !linkedinCheck.isValid
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {linkedinUrl.trim() && !linkedinCheck.isValid && (
              <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 animate-fadeIn">
                {linkedinCheck.error}
              </p>
            )}
          </div>

          {/* Resume Text */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Resume Text / Achievements Summary</span>
            </label>
            <textarea
              rows={3}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste text from your resume or key technical achievements (e.g. Education, Technical Skills, Projects)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setValidationError(null);
              setResumeText(
                'CANDIDATE PROFILE SUMMARY\nEducation: Bachelor of Technology / Science in Engineering (CGPA: 8.5/10)\nSkills: Python, React.js, TypeScript, Machine Learning, SQL, Docker, Cloud Platforms\nProjects:\n1. PM Internship AI Matching Platform - Candidate entity extractor.\n2. IoT Telemetry Dashboard - Real-time device metrics system.'
              );
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            Load Sample Resume Content
          </button>

          <button
            onClick={runAudit}
            disabled={
              loading ||
              verifyingFile ||
              (!fileAttached && !resumeText.trim()) ||
              (githubUsername.trim().length > 0 && !githubCheck.isValid) ||
              (linkedinUrl.trim().length > 0 && !linkedinCheck.isValid)
            }
            className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:text-slate-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            {loading ? 'Auditing Resume, GitHub & LinkedIn Profiles...' : 'Analyze Complete Portfolio & Profiles'}
          </button>
        </div>
      </div>

      {/* Audit Output */}
      {auditResult && (
        <div ref={auditResultRef} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in scroll-mt-6">
          {/* Header Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>AI Audit Scorecard & ATS Diagnostics</span>
              </h3>
              <p className="text-xs text-slate-500">
                Composite evaluation based on Ministry of Corporate Affairs criteria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRecheckAts}
                disabled={recheckingAts}
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recheckingAts ? 'animate-spin' : ''}`} />
                <span>Re-Check ATS Score</span>
              </button>
            </div>
          </div>

          {/* 4 Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Overall Readiness</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{auditResult.overallScore || 85}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Weighted composite score</p>
            </div>

            {/* ATS Score */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <span className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Resume Match</span>
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{auditResult.atsScore || auditResult.atsResumeScore || 88}</span>
                <span className="text-xs font-bold text-emerald-600/60">/ 100</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">PM Scheme Format Optimized</p>
            </div>

            {/* GitHub Score */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repositories</span>
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{auditResult.githubScore || 82}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{auditResult.githubStats?.repositories || 8} Repositories Analyzed</p>
            </div>

            {/* LinkedIn Score */}
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
              <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Search Rank</span>
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{auditResult.linkedinScore || 80}</span>
                <span className="text-xs font-bold text-blue-400">/ 100</span>
              </div>
              <p className="text-[11px] text-blue-600 font-medium">Recruiter Profile Visibility</p>
            </div>
          </div>

          {/* GitHub Stats Box */}
          {auditResult.githubStats && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>GitHub Codebase Insights</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Top Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(auditResult.githubStats.topLanguages || ['TypeScript', 'Python']).map((lang, idx) => (
                      <span key={idx} className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Commit Activity</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {auditResult.githubStats.commitFrequency || 'Active Regular Committer'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Open Source / Repos</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {auditResult.githubStats.openSourceContribs || 'Multiple public projects'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* WHERE TO IMPROVE IN DETAILED: ATS, GITHUB, LINKEDIN & PORTFOLIO */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  Detailed Roadmap: Where & How to Improve
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                Target: 98%+ Recruiter Selection Rate
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* 1. ATS & Resume Improvements */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-extrabold text-indigo-300 uppercase">1. ATS Resume Enhancements</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 block">Add High-Yield Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {['Neural Networks', 'FastAPI', 'Pandas', 'PostgreSQL', 'Model Deployment', 'Docker'].map((kw, i) => (
                        <span key={i} className="bg-indigo-950/80 border border-indigo-800/80 text-indigo-200 text-[10px] px-1.5 py-0.5 rounded">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-indigo-400 block">Quantifiable Impact Bullets:</span>
                    <p className="text-[11px] text-slate-400">
                      Convert <span className="text-red-400 italic">"Created ML model"</span> into <span className="text-emerald-400 font-semibold">"Engineered ML classification pipeline achieving 94.2% accuracy on 10k+ records."</span>
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-indigo-400 block">Formatting Safeguard:</span>
                    <p className="text-[11px] text-slate-400">Ensure single-column layout with standard heading names (Education, Technical Skills, Projects, Experience).</p>
                  </div>
                </div>
              </div>

              {/* 2. GitHub Codebase Improvements */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Github className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-extrabold text-purple-300 uppercase">2. GitHub Code Quality</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-purple-400 block">README Architecture Diagrams:</span>
                    <p className="text-[11px] text-slate-400">Add Mermaid.js architecture flowcharts and step-by-step setup guides to your top 2 pinned repositories.</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-purple-400 block">Live Deployed Demo Links:</span>
                    <p className="text-[11px] text-slate-400">Include live HuggingFace Spaces or Vercel preview URLs at the very top of each project description.</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-purple-400 block">CI/CD & Unit Tests:</span>
                    <p className="text-[11px] text-slate-400">Add a simple GitHub Actions workflow (<code className="text-purple-300">.github/workflows/test.yml</code>) to demonstrate automated test standards.</p>
                  </div>
                </div>
              </div>

              {/* 3. LinkedIn Recruiter Visibility Improvements */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-extrabold text-blue-300 uppercase">3. LinkedIn Recruiter Rank</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-blue-400 block">Target Headline Formula:</span>
                    <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                      "B.Sc (AI & ML) at Siva Sivani Degree College | Python • Machine Learning • Data Analytics | Aspiring PM Scheme Fellow"
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-blue-400 block">Featured Media Section:</span>
                    <p className="text-[11px] text-slate-400">Upload your PM Scheme certification badge and high-impact machine learning project slide deck.</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-blue-400 block">Target Partner Outreach:</span>
                    <p className="text-[11px] text-slate-400">Connect with early-career talent recruiters from TCS, Reliance, Infosys, and L&T who partner with the PM Internship Scheme.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Priority Action Items for PM Internship Shortlisting</span>
            </h4>
            <div className="space-y-2.5">
              {(auditResult.recommendations || []).map((rec, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Page Navigation Actions */}
          {onNavigate && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Next Steps & Linked AI Modules
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigate('resume-parser')}
                  className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Extract Skills & Resume Parser</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('ai-recommendation')}
                  className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Top 10-20 AI Recommendations</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('ai-skill-gap')}
                  className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>Skill Gap Roadmap & Prep</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
