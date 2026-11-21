import React, { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SchemeEligibilityModal } from './components/SchemeEligibilityModal';
import { StipendCalculatorModal } from './components/StipendCalculatorModal';
import { SkillReadinessQuizModal } from './components/SkillReadinessQuizModal';
import { PMCertificateModal } from './components/PMCertificateModal';
import { NotificationSystemModal } from './components/NotificationSystemModal';
import { CreativeIntroExperience } from './components/CreativeIntroExperience';
import { ContestDeliverablesModal } from './components/ContestDeliverablesModal';
import { AppDownloadQRModal } from './components/AppDownloadQRModal';
import { PhonePePaymentModal } from './components/PhonePePaymentModal';
import { EmailOtpWorkbenchModal } from './components/EmailOtpWorkbenchModal';

import { LandingPage } from './pages/LandingPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { AIRecommendationPage } from './pages/AIRecommendationPage';
import { AIInterviewPage } from './pages/AIInterviewPage';
import { AIPortfolioPage } from './pages/AIPortfolioPage';
import { AIFraudPage } from './pages/AIFraudPage';
import { AISkillGapRoadmapPage } from './pages/AISkillGapRoadmapPage';
import { ResumeParserPage } from './pages/ResumeParserPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { AIResumeTailorPage } from './pages/AIResumeTailorPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutContactPages } from './pages/AboutContactPages';
import { MessagingReviewsPage } from './pages/MessagingReviewsPage';
import { AuthPage } from './pages/AuthPage';
import { SupportGrievancePage } from './pages/SupportGrievancePage';
import { GovTechBenchmarkPage } from './pages/GovTechBenchmarkPage';
import { UserManualBudgetPage } from './pages/UserManualBudgetPage';
import { DownloadAppPage } from './pages/DownloadAppPage';

import { User, Internship, Application, UserRole } from './types';
import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from './data/initialData';
import { useLanguage } from './context/LanguageContext';
import { buildApiUrl } from './config/api';
import {
  subscribeToFirestoreInternships,
  subscribeToFirestoreApplications,
  saveInternshipToFirestore,
  saveApplicationToFirestore,
  updateApplicationStatusInFirestore,
  saveUserToFirestore,
  logoutFirebase
} from './firebase';

const GUEST_USER: User = {
  id: 'guest',
  name: '',
  email: '',
  role: 'STUDENT',
  college: '',
  branch: '',
  cgpa: 0,
  skills: [],
  xp: 0,
  level: 'Visitor',
  streakDays: 0
};

export default function App() {
  const { language, setLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = (params.get('page') || '').toLowerCase().trim();
      if (pageParam === 'download-app' || pageParam === 'mobile-app') {
        return 'download-app';
      }
    }
    return 'landing';
  });
  // Automatic curtain unveil experience before home page opens
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = (params.get('page') || '').toLowerCase().trim();
      if (pageParam === 'download-app' || pageParam === 'mobile-app') {
        return false;
      }
    }
    return true;
  });

  const handleIntroComplete = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setCurrentPage((prev) => (prev === 'download-app' ? 'download-app' : 'landing'));
    setShowIntro(false);
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState<boolean>(false);
  const [stipendModalOpen, setStipendModalOpen] = useState<boolean>(false);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
  const [contestModalOpen, setContestModalOpen] = useState<boolean>(false);
  const [appDownloadModalOpen, setAppDownloadModalOpen] = useState<boolean>(false);
  const [phonePeModalOpen, setPhonePeModalOpen] = useState<boolean>(false);
  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState<boolean>(false);
  const [pendingAuthRole, setPendingAuthRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');
  const [authSecurityMessage, setAuthSecurityMessage] = useState<string>('');
  const [authSessionToken, setAuthSessionToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('pm_scheme_session_token');
    } catch {
      return null;
    }
  });

  // Default initial candidate state (Guest / Logged out)
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('pm_scheme_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'guest' && parsed.email) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return GUEST_USER;
  });

  const [internships, setInternships] = useState<Internship[]>(INITIAL_INTERNSHIPS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch initial internships from Express server with graceful fallback
    const fetchInitialData = async () => {
      try {
        const res = await fetch(buildApiUrl('/api/internships'));
        if (res.ok) {
          const textData = await res.text();
          if (textData) {
            const data = JSON.parse(textData);
            if (Array.isArray(data) && data.length > 0) setInternships(data);
          }
        }
      } catch (err) {
        // Fallback already populated via INITIAL_INTERNSHIPS
      }

      try {
        const res = await fetch(buildApiUrl('/api/applications'));
        if (res.ok) {
          const textData = await res.text();
          if (textData) {
            const data = JSON.parse(textData);
            if (Array.isArray(data) && data.length > 0) setApplications(data);
          }
        }
      } catch (err) {
        // Fallback already populated via INITIAL_APPLICATIONS
      }
    };

    fetchInitialData();

    // Real-time Firestore sync
    const unsubInternships = subscribeToFirestoreInternships((data) => {
      if (data && data.length > 0) setInternships(data);
    });
    const unsubApplications = subscribeToFirestoreApplications((data) => {
      if (data && data.length > 0) setApplications(data);
    });

    return () => {
      unsubInternships();
      unsubApplications();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleApply = async (internshipId: string) => {
    if (appliedIds.includes(internshipId)) return;

    try {
      const res = await fetch(buildApiUrl('/api/applications'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId,
          studentProfile: user
        })
      });
      if (res.ok) {
        const textData = await res.text();
        if (textData) {
          const data = JSON.parse(textData);
          if (data.application) {
            setApplications((prev) => [...prev, data.application]);
            setAppliedIds((prev) => [...prev, internshipId]);
            saveApplicationToFirestore(data.application);
            alert('One-Click Application Submitted successfully under PM Internship Scheme!');
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInternship = (newRole: Partial<Internship>) => {
    const created: Internship = {
      id: 'int-' + Date.now(),
      role: newRole.role || 'New Role',
      companyName: newRole.companyName || user.companyName || 'Corporate Partner',
      companyLogo: newRole.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      domain: newRole.domain || 'Software Engineering & Web Development',
      stipend: newRole.stipend || 15000,
      location: newRole.location || 'Bengaluru',
      mode: newRole.mode || 'Hybrid',
      duration: '12 Months',
      minCGPA: 7.0,
      skillsRequired: newRole.skillsRequired || ['Python'],
      description: newRole.description || 'Full-time PM Internship opening.',
      responsibilities: newRole.responsibilities || ['Collaborate on engineering tasks'],
      openings: newRole.openings || 5,
      trustScore: 98,
      postedAt: new Date().toISOString()
    };

    setInternships((prev) => [created, ...prev]);
    saveInternshipToFirestore(created);
  };

  const handleUpdateApplicationStatus = (
    appId: string,
    status: 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED'
  ) => {
    const nowIso = new Date().toISOString();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updated: Application = { ...app, status };
        if (status === 'SHORTLISTED') {
          updated.shortlistedAt = nowIso;
        } else if (status === 'SELECTED') {
          updated.selectedAt = nowIso;
          updated.offerLetterIssued = true;
          updated.offerLetterRef = `PMIS-OFFER-${Date.now().toString().slice(-6)}`;
        }
        return updated;
      })
    );
    updateApplicationStatusInFirestore(appId, status);
  };

  const handleUpdateUser = (updatedProps: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedProps };
      if (updated.id !== 'guest') {
        localStorage.setItem('pm_scheme_user', JSON.stringify(updated));
      }
      saveUserToFirestore(updated);
      return updated;
    });
  };

  const clearAllIdentityCaches = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key === 'pm_scheme_user' ||
            key.startsWith('pm_scheme_') ||
            key.startsWith('auth_') ||
            key.startsWith('token') ||
            key.startsWith('firebase:authUser'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore storage errors
    }

    try {
      sessionStorage.clear();
    } catch {
      // ignore storage errors
    }

    try {
      if (typeof document !== 'undefined' && document.cookie) {
        document.cookie.split(';').forEach((cookieStr) => {
          const cookieName = cookieStr.split('=')[0]?.trim();
          if (cookieName) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          }
        });
      }
    } catch {
      // ignore cookie errors
    }

    logoutFirebase().catch(() => {});
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const roleUpper = (newRole || 'student').toUpperCase() as 'STUDENT' | 'COMPANY' | 'ADMIN';
    const activeToken = authSessionToken;

    clearAllIdentityCaches();

    fetch(buildApiUrl('/api/auth/switch-role'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
      },
      body: JSON.stringify({ role: roleUpper })
    }).catch(() => {});

    setUser(GUEST_USER);
    setAppliedIds([]);
    setAuthSessionToken(null);
    setPendingAuthRole(roleUpper);
    setAuthSecurityMessage(
      `Previous session terminated for strict identity isolation. Authenticate as ${roleUpper} using Mail ID passcode verification.`
    );
    setCurrentPage('auth-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (loggedInUser: User, token?: string) => {
    const normalizedRole = ((loggedInUser.role || 'STUDENT') + '').toUpperCase() as 'STUDENT' | 'COMPANY' | 'ADMIN';
    const sanitizedUser: User = {
      ...loggedInUser,
      role: normalizedRole
    };

    try {
      localStorage.setItem('pm_scheme_user', JSON.stringify(sanitizedUser));
      if (token) {
        sessionStorage.setItem('pm_scheme_session_token', token);
      }
    } catch {
      // ignore storage errors
    }

    setUser(sanitizedUser);
    setAuthSessionToken(token || null);
    setAuthSecurityMessage('');
    setPendingAuthRole(normalizedRole);

    if (normalizedRole === 'COMPANY') {
      handleNavigate('company-dashboard');
    } else if (normalizedRole === 'ADMIN') {
      handleNavigate('admin-dashboard');
    } else {
      handleNavigate('home');
    }
  };

  const handleNavigate = (tab: string) => {
    const cleanTab = (tab || '').toLowerCase().trim();

    // Check modal triggers
    if (['notifications', 'notification', 'alerts', 'alert', 'notification-hub'].includes(cleanTab)) {
      setNotificationModalOpen(true);
      return;
    }
    if (['voice', 'voice-search', 'voice-assistant', 'mic'].includes(cleanTab)) {
      setVoiceModalOpen(true);
      return;
    }
    if (['eligibility', 'scheme-eligibility', 'check-eligibility'].includes(cleanTab)) {
      setEligibilityModalOpen(true);
      return;
    }
    if (['stipend', 'stipend-calculator', 'calculator', 'allowance', 'dbt-calculator'].includes(cleanTab)) {
      setStipendModalOpen(true);
      return;
    }
    if (['quiz', 'skill-quiz', 'assessment', 'test'].includes(cleanTab)) {
      setQuizModalOpen(true);
      return;
    }
    if (['cert', 'certificate', 'pm-certificate', 'completion-certificate', 'credentials'].includes(cleanTab)) {
      setCertModalOpen(true);
      return;
    }
    if (['contest', 'contest-showcase', 'srs', 'deliverables', 'benchmark', 'demo-script', 'contest-docs'].includes(cleanTab)) {
      setContestModalOpen(true);
      return;
    }
    if (['phonepe', 'phonepe-pay', 'upi', 'upi-pay', 'stipend-disburse', 'payment-gateway', 'pay-stipend'].includes(cleanTab)) {
      setPhonePeModalOpen(true);
      return;
    }
    if (['mail-otp', 'otp-guide', 'email-otp', 'otp-setup', 'email-otp-workbench', 'otp-workbench'].includes(cleanTab)) {
      setEmailOtpModalOpen(true);
      return;
    }

    // Direct page routing
    setCurrentPage(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
      case 'home':
        return (
          <LandingPage
            setActiveTab={handleNavigate}
            openVoiceSearch={() => setVoiceModalOpen(true)}
            language={language}
            openEligibilityModal={() => setEligibilityModalOpen(true)}
            openStipendModal={() => setStipendModalOpen(true)}
            openQuizModal={() => setQuizModalOpen(true)}
            openCertModal={() => setCertModalOpen(true)}
          />
        );
      case 'internships':
      case 'explore':
      case 'jobs':
      case 'opportunities':
      case 'browse':
        return (
          <InternshipsPage
            user={user}
            onApply={handleApply}
            openVoiceSearch={() => setVoiceModalOpen(true)}
            appliedIds={appliedIds}
          />
        );
      case 'ai-recommendation':
      case 'ai-recommendations':
      case 'ai-hub':
      case 'ai-match-engine':
      case 'explainable-insights':
      case 'recommendation':
      case 'recommendations':
      case 'matches':
        return (
          <AIRecommendationPage
            user={user}
            onApply={handleApply}
            appliedIds={appliedIds}
            activePage={currentPage}
            onNavigate={handleNavigate}
          />
        );
      case 'ai-interview':
      case 'interview':
      case 'mock-interview':
      case 'ai-mock-interview':
        return <AIInterviewPage user={user} onNavigate={handleNavigate} />;
      case 'ai-portfolio':
      case 'portfolio':
      case 'ats':
      case 'ats-checker':
        return <AIPortfolioPage user={user} onNavigate={handleNavigate} />;
      case 'ai-fraud':
      case 'fraud':
      case 'scam':
      case 'trust-check':
        return <AIFraudPage onNavigate={handleNavigate} />;
      case 'ai-skill-gap':
      case 'skill-gap':
      case 'career-roadmap':
      case 'roadmap':
      case 'skills':
        return (
          <AISkillGapRoadmapPage
            user={user}
            onNavigateToInternships={() => handleNavigate('internships')}
            onUpdateUserSkills={(updatedSkills) => handleUpdateUser({ skills: updatedSkills })}
          />
        );
      case 'resume-parser':
      case 'resume':
      case 'parser':
        return <ResumeParserPage user={user} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />;
      case 'resume-builder':
      case 'builder':
        return <ResumeBuilderPage user={user} onNavigate={handleNavigate} />;
      case 'ai-resume-tailor':
      case 'resume-tailor':
      case 'tailor':
      case 'ats-tailor':
      case 'jobsuit':
        return (
          <AIResumeTailorPage
            user={user}
            onUpdateUser={handleUpdateUser}
            language={language}
            onNavigateToParser={() => handleNavigate('resume-parser')}
          />
        );
      case 'company-dashboard':
      case 'company':
      case 'recruiter':
      case 'employer':
        if (!user || user.id === 'guest' || (user.role || '').toString().toUpperCase() !== 'COMPANY') {
          return (
            <AuthPage
              initialMode="LOGIN"
              initialRole="COMPANY"
              securityMessage={
                authSecurityMessage ||
                'Company Partner authentication via Mail ID passcode is required before accessing the Recruiter Dashboard.'
              }
              onLogin={handleAuthSuccess}
            />
          );
        }
        return (
          <CompanyDashboard
            user={user}
            internships={internships}
            applications={applications}
            onAddInternship={handleAddInternship}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        );
      case 'admin-dashboard':
      case 'admin':
      case 'ministry':
        if (!user || user.id === 'guest' || (user.role || '').toString().toUpperCase() !== 'ADMIN') {
          return (
            <AuthPage
              initialMode="LOGIN"
              initialRole="ADMIN"
              securityMessage={
                authSecurityMessage ||
                'Authorized Ministry Admin authentication via Mail ID passcode is required before accessing the Governance Desk.'
              }
              onLogin={handleAuthSuccess}
            />
          );
        }
        return (
          <AdminDashboard
            user={user}
            internships={internships}
            applications={applications}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        );
      case 'transactions':
      case 'transaction-history':
      case 'payments':
      case 'stipend-ledger':
        if (!user || user.id === 'guest') {
          return (
            <AuthPage
              initialMode="LOGIN"
              initialRole="STUDENT"
              securityMessage={
                authSecurityMessage ||
                'Sign in with your verified Mail ID passcode to view paid internship transactions and PDF receipts.'
              }
              onLogin={handleAuthSuccess}
            />
          );
        }
        return (
          <StudentDashboard
            user={user}
            applications={applications}
            internships={internships}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
            initialTab="transactions"
          />
        );
      case 'dashboard':
      case 'student-dashboard':
      case 'student':
      case 'profile':
        if (!user || user.id === 'guest') {
          return (
            <AuthPage
              initialMode="LOGIN"
              initialRole={pendingAuthRole}
              securityMessage={
                authSecurityMessage ||
                'Sign in with your verified Mail ID passcode to access your portal dashboard.'
              }
              onLogin={handleAuthSuccess}
            />
          );
        }
        if ((user.role || '').toString().toUpperCase() === 'COMPANY') {
          return (
            <CompanyDashboard
              user={user}
              internships={internships}
              applications={applications}
              onAddInternship={handleAddInternship}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          );
        } else if ((user.role || '').toString().toUpperCase() === 'ADMIN') {
          return (
            <AdminDashboard
              user={user}
              internships={internships}
              applications={applications}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          );
        } else {
          return (
            <StudentDashboard
              user={user}
              applications={applications}
              internships={internships}
              onUpdateUser={handleUpdateUser}
              onNavigate={handleNavigate}
            />
          );
        }
      case 'download-app':
      case 'mobile-app':
      case 'app-download':
      case 'android-app':
        return <DownloadAppPage onNavigate={handleNavigate} />;
      case 'analytics':
      case 'stats':
      case 'metrics':
        return <AnalyticsPage />;
      case 'messages':
      case 'messaging':
      case 'reviews':
      case 'messaging-reviews':
      case 'chat':
        return <MessagingReviewsPage user={user} />;
      case 'support-grievance':
      case 'grievance':
      case 'support':
      case 'queries':
      case 'helpdesk':
        return <SupportGrievancePage onNavigate={handleNavigate} />;
      case 'govtech-benchmark':
      case 'benchmark':
      case 'govt-comparison':
        return <GovTechBenchmarkPage onNavigate={handleNavigate} />;
      case 'user-manual-budget':
      case 'manual':
      case 'budget':
      case 'user-guide':
        return <UserManualBudgetPage onNavigate={handleNavigate} />;
      case 'about':
      case 'contact':
      case 'help':
      case 'faq':
      case 'terms':
      case 'privacy':
        return <AboutContactPages />;
      case 'auth':
      case 'auth-login':
      case 'auth-register':
      case 'company-register':
      case 'login':
      case 'register':
      case 'signup':
        return (
          <AuthPage
            initialMode={currentPage === 'auth-register' || currentPage === 'register' || currentPage === 'signup' ? 'REGISTER' : 'LOGIN'}
            initialRole={currentPage === 'company-register' ? 'COMPANY' : pendingAuthRole}
            securityMessage={authSecurityMessage}
            onLogin={handleAuthSuccess}
          />
        );
      default:
        return (
          <LandingPage
            setActiveTab={handleNavigate}
            openVoiceSearch={() => setVoiceModalOpen(true)}
            language={language}
            openEligibilityModal={() => setEligibilityModalOpen(true)}
            openStipendModal={() => setStipendModalOpen(true)}
            openQuizModal={() => setQuizModalOpen(true)}
            openCertModal={() => setCertModalOpen(true)}
            onReplayIntro={() => setShowIntro(true)}
          />
        );
    }
  };

  const handleLogout = () => {
    const activeToken = authSessionToken;
    clearAllIdentityCaches();

    fetch(buildApiUrl('/api/auth/logout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
      }
    }).catch(() => {});

    setUser(GUEST_USER);
    setAppliedIds([]);
    setAuthSessionToken(null);
    setPendingAuthRole('STUDENT');
    setAuthSecurityMessage('');
    handleNavigate('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Creative Dynamic Opening Sequence */}
      {showIntro && (
        <CreativeIntroExperience onComplete={handleIntroComplete} />
      )}

      {/* Top Navigation Header */}
      <HeaderNavbar
        user={user}
        activeTab={currentPage}
        setActiveTab={handleNavigate}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRoleSwitch={handleRoleSwitch}
        openVoiceSearch={() => setVoiceModalOpen(true)}
        openNotifications={() => setNotificationModalOpen(true)}
        openAppDownload={() => setAppDownloadModalOpen(true)}
        openPhonePeModal={() => setPhonePeModalOpen(true)}
        openEmailOtpGuide={() => setEmailOtpModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Rendered Page */}
      <main className="flex-1 pb-16">{renderPage()}</main>

      {/* Floating AI Chatbot */}
      <FloatingChatbot user={user} />

      {/* Multi-Channel Notification Hub Modal */}
      <NotificationSystemModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        userEmail={user.email}
        userName={user.name}
        onNavigate={handleNavigate}
        openCertModal={() => setCertModalOpen(true)}
        openStipendModal={() => setStipendModalOpen(true)}
      />

      {/* Voice Assistant Search Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSearchNavigate={() => {
          handleNavigate('internships');
        }}
      />

      {/* PM Scheme Eligibility Modal */}
      <SchemeEligibilityModal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        user={user}
        onNavigateToInternships={() => handleNavigate('internships')}
      />

      {/* Stipend & Budget Calculator Modal */}
      <StipendCalculatorModal
        isOpen={stipendModalOpen}
        onClose={() => setStipendModalOpen(false)}
      />

      {/* Skill Readiness Quiz Assessment Modal */}
      <SkillReadinessQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onNavigateToInternships={() => handleNavigate('internships')}
      />

      {/* Official PM Digital Registration Certificate Modal */}
      <PMCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
      />

      {/* Real Time Project Design Contest & SRS Showcase Modal */}
      <ContestDeliverablesModal
        isOpen={contestModalOpen}
        onClose={() => setContestModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Official PM Scheme Mobile App QR Download Modal */}
      <AppDownloadQRModal
        isOpen={appDownloadModalOpen}
        onClose={() => setAppDownloadModalOpen(false)}
      />

      {/* PhonePe UPI Paid Internship Money Transaction Modal */}
      <PhonePePaymentModal
        isOpen={phonePeModalOpen}
        onClose={() => setPhonePeModalOpen(false)}
        candidateName={user?.name || 'Verified Candidate'}
        candidateCollege={user?.college || 'PM Internship Partner Institute'}
        candidateRole="Full-Stack AI Engineering Intern"
        candidateAccount="State Bank of India •••• 4921"
        candidateUpiId={user?.email ? `${user.email.split('@')[0]}@ybl` : 'candidate@ybl'}
        defaultAmount={15000}
        onPaymentSuccess={(tx) => {
          fetch(buildApiUrl('/api/payments/phonepe-verify'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: tx.orderId,
              candidateName: tx.candidateName,
              candidateAccount: 'State Bank of India •••• 4921',
              amount: tx.amount,
              paymentRail: 'PhonePe UPI',
              notes: `Portal Disbursal via PhonePe UPI (UTR: ${tx.utrNumber})`
            })
          }).catch(console.error);
        }}
      />

      {/* Google AI Studio Mail ID OTP Integration Workbench & Live Tester */}
      <EmailOtpWorkbenchModal
        isOpen={emailOtpModalOpen}
        onClose={() => setEmailOtpModalOpen(false)}
        initialEmail={user?.email || 'candidate.pmscheme@gmail.com'}
      />

      {/* Global Footer */}
      <Footer setActiveTab={handleNavigate} />
    </div>
  );
}

