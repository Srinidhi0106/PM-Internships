import React, { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SchemeEligibilityModal } from './components/SchemeEligibilityModal';
import { StipendCalculatorModal } from './components/StipendCalculatorModal';
import { SkillReadinessQuizModal } from './components/SkillReadinessQuizModal';
import { PMCertificateModal } from './components/PMCertificateModal';
import { CreativeIntroExperience } from './components/CreativeIntroExperience';

import { LandingPage } from './pages/LandingPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { AIRecommendationPage } from './pages/AIRecommendationPage';
import { AIInterviewPage } from './pages/AIInterviewPage';
import { AIPortfolioPage } from './pages/AIPortfolioPage';
import { AIFraudPage } from './pages/AIFraudPage';
import { AISkillGapRoadmapPage } from './pages/AISkillGapRoadmapPage';
import { ResumeParserPage } from './pages/ResumeParserPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutContactPages } from './pages/AboutContactPages';
import { MessagingReviewsPage } from './pages/MessagingReviewsPage';
import { AuthPage } from './pages/AuthPage';

import { User, Internship, Application, UserRole } from './types';
import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from './data/initialData';
import { useLanguage } from './context/LanguageContext';
import {
  subscribeToFirestoreInternships,
  subscribeToFirestoreApplications,
  saveInternshipToFirestore,
  saveApplicationToFirestore,
  updateApplicationStatusInFirestore,
  saveUserToFirestore
} from './firebase';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest Candidate',
  email: 'guest@mca.gov.in',
  role: 'STUDENT',
  college: 'General Applicant',
  branch: 'General',
  cgpa: 0,
  skills: [],
  xp: 0,
  level: 'Visitor',
  streakDays: 0
};

export default function App() {
  const { language, setLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  // Always trigger the creative opening experience on page load / refresh
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleIntroComplete = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setCurrentPage('landing');
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

  // Default initial candidate state (Guest / Logged out)
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('pm_scheme_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return GUEST_USER;
  });

  const [internships, setInternships] = useState<Internship[]>(INITIAL_INTERNSHIPS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [appliedIds, setAppliedIds] = useState<string[]>(['int-1']);

  useEffect(() => {
    // Fetch initial internships from Express server with graceful fallback
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/internships');
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
        const res = await fetch('/api/applications');
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
      const res = await fetch('/api/applications', {
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

  const handleUpdateApplicationStatus = (appId: string, status: 'SHORTLISTED' | 'REJECTED') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
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

  const handleRoleSwitch = (newRole: UserRole) => {
    const roleUpper = newRole.toUpperCase() as 'STUDENT' | 'COMPANY' | 'ADMIN';
    let newUser: User;
    if (roleUpper === 'COMPANY') {
      newUser = {
        id: 'c1',
        name: 'Priya Mehta',
        email: 'priya@tata.com',
        role: 'COMPANY',
        companyName: 'Tata Consultancy Services'
      };
    } else if (roleUpper === 'ADMIN') {
      newUser = {
        id: 'a1',
        name: 'Officer A. K. Verma',
        email: 'akverma@mca.gov.in',
        role: 'ADMIN'
      };
    } else {
      newUser = {
        id: 's1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        role: 'STUDENT',
        college: 'IIT Delhi',
        branch: 'Computer Science Engineering',
        cgpa: 8.8,
        skills: ['Python', 'React.js', 'Machine Learning', 'TypeScript', 'SQL'],
        githubUrl: 'rahul-sharma-code',
        xp: 1450,
        level: 'Intermediate Practitioner',
        streakDays: 7
      };
    }
    localStorage.setItem('pm_scheme_user', JSON.stringify(newUser));
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
      case 'home':
        return (
          <LandingPage
            setActiveTab={setCurrentPage}
            openVoiceSearch={() => setVoiceModalOpen(true)}
            language={language}
            openEligibilityModal={() => setEligibilityModalOpen(true)}
            openStipendModal={() => setStipendModalOpen(true)}
            openQuizModal={() => setQuizModalOpen(true)}
            openCertModal={() => setCertModalOpen(true)}
          />
        );
      case 'internships':
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
        return (
          <AIRecommendationPage
            user={user}
            onApply={handleApply}
            appliedIds={appliedIds}
            activePage={currentPage}
            onNavigate={setCurrentPage}
          />
        );
      case 'ai-interview':
        return <AIInterviewPage user={user} />;
      case 'ai-portfolio':
        return <AIPortfolioPage user={user} />;
      case 'ai-fraud':
        return <AIFraudPage />;
      case 'ai-skill-gap':
      case 'skill-gap':
      case 'career-roadmap':
        return (
          <AISkillGapRoadmapPage
            user={user}
            onNavigateToInternships={() => setCurrentPage('internships')}
            onUpdateUserSkills={(updatedSkills) => handleUpdateUser({ skills: updatedSkills })}
          />
        );
      case 'resume-parser':
        return <ResumeParserPage user={user} onUpdateUser={handleUpdateUser} />;
      case 'company-dashboard':
        return (
          <CompanyDashboard
            user={
              user.role === 'COMPANY'
                ? user
                : {
                    id: 'c1',
                    name: 'Priya Mehta',
                    email: 'priya@tata.com',
                    role: 'COMPANY',
                    companyName: 'Tata Consultancy Services'
                  }
            }
            internships={internships}
            applications={applications}
            onAddInternship={handleAddInternship}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard internships={internships} />;
      case 'dashboard':
      case 'student-dashboard':
        if (user.role === 'COMPANY') {
          return (
            <CompanyDashboard
              user={user}
              internships={internships}
              applications={applications}
              onAddInternship={handleAddInternship}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          );
        } else if (user.role === 'ADMIN') {
          return <AdminDashboard internships={internships} />;
        } else {
          return (
            <StudentDashboard
              user={user}
              applications={applications}
              internships={internships}
              onUpdateUser={handleUpdateUser}
              onNavigate={(tab) => setCurrentPage(tab)}
            />
          );
        }
      case 'analytics':
        return <AnalyticsPage />;
      case 'messages':
      case 'messaging':
      case 'reviews':
      case 'messaging-reviews':
        return <MessagingReviewsPage user={user} />;
      case 'about':
      case 'contact':
        return <AboutContactPages />;
      case 'auth':
      case 'auth-login':
      case 'auth-register':
      case 'company-register':
        return (
          <AuthPage
            initialMode={currentPage === 'auth-register' ? 'REGISTER' : 'LOGIN'}
            onLogin={(loggedInUser) => {
              localStorage.setItem('pm_scheme_user', JSON.stringify(loggedInUser));
              setUser(loggedInUser);
              setCurrentPage('dashboard');
            }}
          />
        );
      default:
        return (
          <LandingPage
            setActiveTab={setCurrentPage}
            openVoiceSearch={() => setVoiceModalOpen(true)}
            language={language}
            openEligibilityModal={() => setEligibilityModalOpen(true)}
            openStipendModal={() => setStipendModalOpen(true)}
            openQuizModal={() => setQuizModalOpen(true)}
            openCertModal={() => setCertModalOpen(true)}
          />
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pm_scheme_user');
    setUser(GUEST_USER);
    setCurrentPage('home');
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
        setActiveTab={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRoleSwitch={handleRoleSwitch}
        openVoiceSearch={() => setVoiceModalOpen(true)}
        onLogout={handleLogout}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main Rendered Page */}
      <main className="flex-1 pb-16">{renderPage()}</main>

      {/* Floating AI Chatbot */}
      <FloatingChatbot user={user} />

      {/* Voice Assistant Search Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSearchNavigate={() => {
          setCurrentPage('internships');
        }}
      />

      {/* PM Scheme Eligibility Modal */}
      <SchemeEligibilityModal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        user={user}
        onNavigateToInternships={() => setCurrentPage('internships')}
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
        onNavigateToInternships={() => setCurrentPage('internships')}
      />

      {/* Official PM Digital Registration Certificate Modal */}
      <PMCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        user={user}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setCurrentPage} />
    </div>
  );
}

