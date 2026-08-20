export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN' | 'student' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  aadhaar?: string;
  avatar?: string;
  // Student fields
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  skills?: string[];
  interests?: string[];
  preferredLocation?: string;
  preferredWorkMode?: 'Remote' | 'Hybrid' | 'Onsite' | 'Any';
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  xp?: number;
  level?: string;
  streakDays?: number;
  // Company fields
  companyName?: string;
  hrName?: string;
  website?: string;
  industry?: string;
  companyLocation?: string;
  companyDescription?: string;
  verified?: boolean;
}

export interface Internship {
  id: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  domain: string;
  location: string;
  mode: 'Remote' | 'Hybrid' | 'Onsite';
  duration: string; // e.g., "6 Months"
  stipend: number; // e.g. 15000 in INR / month
  skillsRequired: string[];
  minCGPA: number;
  deadline?: string;
  postedDate?: string;
  postedAt?: string;
  description: string;
  responsibilities?: string[];
  perks?: string[];
  trustScore?: number;
  riskLevel?: 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Fraudulent';
  fraudReason?: string;
  status?: 'active' | 'under_review' | 'flagged' | 'closed';
  openings: number;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle?: string;
  companyName?: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentCollege?: string;
  studentBranch?: string;
  studentCgpa?: number;
  studentCGPA?: number;
  studentSkills?: string[];
  appliedAt?: string;
  appliedDate?: string;
  status: 'APPLIED' | 'Applied' | 'Under Review' | 'SHORTLISTED' | 'Shortlisted' | 'Interview' | 'Selected' | 'REJECTED' | 'Rejected';
  aiScore?: number;
  aiCandidateRankScore?: number;
  aiRankExplanation?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  notes?: string;
}

export interface AIRecommendation {
  internshipId: string;
  role: string;
  companyName: string;
  companyLogo: string;
  matchScore: number;
  selectionChance: number;
  factorBreakdown: {
    skills: number;
    academics: number;
    location: number;
  };
  whyRecommended: string;
  missingSkills: string[];
  learningRoadmap: string;
}

export interface AIInterviewQuestion {
  id: number | string;
  questionText: string;
  userAnswer?: string;
  feedback?: string;
  score?: number;
}

export interface AIInterviewSession {
  id: string;
  role: string;
  completed: boolean;
  currentQuestionIndex: number;
  questions: AIInterviewQuestion[];
  overallScore?: number;
}

export interface InterviewAttempt {
  id: string;
  studentId: string;
  companyName: string;
  role: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  interviewType: 'HR' | 'Technical' | 'Aptitude' | 'Coding' | 'Behavioural' | 'Mixed';
  date: string;
  overallScore: number;
  confidenceScore: number;
  communicationScore: number;
  technicalScore: number;
  grammarScore: number;
  problemSolvingScore: number;
  professionalismScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
  suggestedCertifications: string[];
  expectedSuccessRate: number;
  transcript?: { question: string; answer: string; score: number; feedback: string }[];
}

export interface PortfolioAudit {
  id?: string;
  studentId?: string;
  date?: string;
  overallScore?: number;
  atsScore?: number;
  githubScore?: number;
  atsResumeScore?: number;
  linkedinScore?: number;
  portfolioQualityScore?: number;
  recommendations?: string[];
  githubStats?: {
    repositories: number;
    topLanguages: string[];
    commitFrequency: string;
    openSourceContribs: string;
  };
  suggestions?: {
    missingSkills: string[];
    betterProjects: string[];
    resumeKeywords: string[];
    portfolioImprovements: string[];
    linkedinImprovements: string[];
  };
}

export interface FraudAnalysis {
  isLegitimate: boolean;
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Fraudulent';
  trustScore: number;
  redFlags: string[];
  recommendation: string;
}

export interface FraudCheckResult extends FraudAnalysis {
  reasons?: string[];
  websiteValid?: boolean;
  officialEmailDomain?: boolean;
  addressVerified?: boolean;
  salaryRealistic?: boolean;
  suspiciousKeywordsFound?: string[];
}

export interface CertificateData {
  id: string;
  certificateNumber: string;
  studentName: string;
  companyName: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  verificationCode: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'Technical' | 'Soft Skill' | 'Tool / Framework' | 'Domain Knowledge';
  priority: 'High' | 'Medium' | 'Low';
  importanceReason: string;
  estimatedHoursToMaster: number;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  durationWeeks: string;
  focusGoal: string;
  keyActionItems: string[];
  recommendedProject: {
    title: string;
    description: string;
    deliverable: string;
    techStack: string[];
  };
  learningResources: {
    title: string;
    type: 'NPTEL' | 'SWAYAM' | 'Skill India' | 'YouTube' | 'Documentation' | 'Coursera' | 'GitHub';
    url?: string;
    estimatedTime: string;
  }[];
}

export interface SkillGapRoadmapResult {
  targetRole: string;
  targetIndustry: string;
  currentMatchScore: number;
  projectedMatchScoreAfterRoadmap: number;
  overallReadinessLevel: 'High Readiness' | 'Moderate Gap' | 'Significant Learning Needed';
  summaryOverview: string;
  masteredSkills: string[];
  missingSkills: SkillGapItem[];
  softSkillGaps: string[];
  roadmapPhases: RoadmapPhase[];
  suggestedCertifications: string[];
  recommendedInternshipRoles: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'application';
}
