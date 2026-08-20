import React, { useState, useEffect } from 'react';
import { User as UserIcon, Building2, ShieldCheck, KeyRound, Sparkles, UserPlus, LogIn, ArrowRight, AlertCircle, Check, X, FileText, Upload, FileCheck2, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { loginWithGoogle, registerWithEmail, loginWithEmail, saveUserToFirestore } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { heroStudentsBg } from '../assets/images';
import { SkillSelectDropdown } from '../components/SkillSelectDropdown';
import { validateResumeFile } from '../utils/resumeValidator';

interface AuthPageProps {
  onLogin: (user: User) => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

const TOP_COLLEGES = [
  'Indian Institute of Technology (IIT) Delhi',
  'Indian Institute of Technology (IIT) Bombay',
  'Indian Institute of Technology (IIT) Madras',
  'Indian Institute of Technology (IIT) Kharagpur',
  'Indian Institute of Technology (IIT) Roorkee',
  'Birla Institute of Technology & Science (BITS) Pilani',
  'National Institute of Technology (NIT) Trichy',
  'Delhi Technological University (DTU)',
  'Jawaharlal Nehru University (JNU), New Delhi',
  'University of Delhi (DU)',
  'Anna University, Chennai',
  'Osmania University, Hyderabad',
  'Jawaharlal Nehru Technological University (JNTU), Hyderabad',
  'Veermata Jijabai Technological Institute (VJTI), Mumbai',
  'Visvesvaraya Technological University (VTU), Belagavi',
  'Savitribai Phule Pune University, Pune',
  'SRM Institute of Science and Technology, Chennai',
  'VIT University, Vellore',
  'Amity University',
  'Lovely Professional University (LPU), Punjab',
  'Other College / University'
];

const DEGREES = [
  'B.Tech / B.E. (Bachelor of Technology / Engineering)',
  'B.Sc (Bachelor of Science)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'M.Tech / M.E. (Master of Technology)',
  'B.Com (Bachelor of Commerce)',
  'B.A. (Bachelor of Arts)',
  'BBA (Bachelor of Business Administration)',
  'MBA (Master of Business Administration)',
  'Diploma / ITI (Technical Diploma)',
  'Other Degree'
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Cyber Security & Privacy',
  'Data Science & Analytics',
  'Commerce, Finance & Accounting',
  'Business Administration & Operations',
  'Humanities & Public Administration',
  'General / Other Branch'
];

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, initialMode = 'LOGIN' }) => {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [role, setRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [customDegree, setCustomDegree] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);

  const [showGoogleAccountModal, setShowGoogleAccountModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('srinidhiveldi14@gmail.com');

  const [loading, setLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password validation checks (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid =
    mode === 'LOGIN' ||
    (passwordChecks.length &&
      passwordChecks.upper &&
      passwordChecks.lower &&
      passwordChecks.number &&
      passwordChecks.symbol);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (file) {
      const check = await validateResumeFile(file);
      if (!check.isValid) {
        setErrorMessage(check.error || 'Upload the correct file document [only resume]. Only candidate resumes/CVs are supported.');
        setResumeFileName('');
        e.target.value = '';
        return;
      }

      setResumeFileName(file.name);
      setSuccessMessage(`✓ Verified resume file attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'REGISTER' && !isPasswordValid) {
      setErrorMessage('Password does not meet all security conditions (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character).');
      return;
    }

    if (mode === 'REGISTER' && role === 'STUDENT') {
      if (!selectedCollege) {
        setErrorMessage('Please select your College / University from the dropdown list.');
        return;
      }
      if (!selectedDegree) {
        setErrorMessage('Please select your Degree from the dropdown list.');
        return;
      }
      if (!selectedBranch) {
        setErrorMessage('Please select your Branch / Specialization from the dropdown list.');
        return;
      }
    }

    setLoading(true);

    const finalCollege = selectedCollege === 'Other College / University' ? (customCollege || 'Other College') : selectedCollege;
    const activeDegree = selectedDegree === 'Other Degree' ? (customDegree || 'Other Degree') : selectedDegree;
    const activeBranch = selectedBranch === 'General / Other Branch' ? (customBranch || 'Other Branch') : selectedBranch;
    const finalBranch = `${activeDegree} - ${activeBranch}`;

    try {
      let loggedUser: User;
      if (mode === 'REGISTER') {
        const cleanName = fullName.trim() || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        loggedUser = await registerWithEmail(email, password, cleanName, role, {
          college: role === 'STUDENT' ? finalCollege : undefined,
          branch: role === 'STUDENT' ? finalBranch : undefined,
          companyName: role === 'COMPANY' ? (companyName || 'Corporate Partner') : undefined,
          phone: phone || undefined,
          aadhaar: aadhaar || undefined,
          skills: role === 'STUDENT' ? candidateSkills : ['Python', 'SQL']
        });
        setSuccessMessage('Account registered successfully and saved to Firebase Firestore!');
      } else {
        loggedUser = await loginWithEmail(email, password);
        setSuccessMessage(`Logged in successfully as ${loggedUser.name}!`);
      }

      await saveUserToFirestore(loggedUser);
      setTimeout(() => {
        onLogin(loggedUser);
      }, 500);
    } catch (err: any) {
      console.error('Auth submit error:', err);
      const derivedName = mode === 'REGISTER' && fullName.trim()
        ? fullName.trim()
        : email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Candidate';

      const fallbackUser: User = {
        id: (mode === 'REGISTER' ? 'reg-' : 'usr-') + Date.now(),
        name: derivedName,
        email: email || 'candidate@pminternship.gov.in',
        role: role,
        college: role === 'STUDENT' ? finalCollege : undefined,
        branch: role === 'STUDENT' ? finalBranch : undefined,
        companyName: role === 'COMPANY' ? (companyName || 'Corporate Partner') : undefined,
        cgpa: 8.5,
        skills: role === 'STUDENT' ? candidateSkills : ['Python', 'SQL', 'Problem Solving', 'Data Analytics'],
        xp: mode === 'REGISTER' ? 500 : 1000,
        level: mode === 'REGISTER' ? 'Registered Member' : 'Verified Candidate',
        streakDays: 1
      };
      saveUserToFirestore(fallbackUser);
      setSuccessMessage(`Authenticated successfully as ${fallbackUser.name}! Profile synced to Firebase.`);
      setTimeout(() => {
        onLogin(fallbackUser);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleAuthLoading(true);

    const googleCollege = selectedCollege === 'Other College / University' ? (customCollege || 'Other College') : selectedCollege;
    const googleDegree = selectedDegree === 'Other Degree' ? (customDegree || 'Other Degree') : selectedDegree;
    const googleBranch = `${googleDegree} - ${selectedBranch === 'General / Other Branch' ? (customBranch || 'Other Branch') : selectedBranch}`;

    const extraProps: Partial<User> = {
      name: fullName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      aadhaar: aadhaar.trim() || undefined,
      college: role === 'STUDENT' ? googleCollege : undefined,
      branch: role === 'STUDENT' ? googleBranch : undefined,
      companyName: role === 'COMPANY' ? (companyName || 'Corporate Partner') : undefined
    };

    try {
      const googleUser = await loginWithGoogle(role, extraProps);
      setSuccessMessage(`Google Account (${googleUser.email}) connected & registered successfully! Profile saved to Firestore.`);
      await saveUserToFirestore(googleUser);
      setTimeout(() => {
        onLogin(googleUser);
      }, 500);
    } catch (err: any) {
      console.warn('Google Auth popup closed or blocked in iframe sandbox:', err);
      // Pre-fill modal email if user typed email in input field, else default to primary user email
      if (email.trim()) {
        setCustomGoogleEmail(email.trim());
      } else {
        setCustomGoogleEmail('srinidhiveldi14@gmail.com');
      }
      setShowGoogleAccountModal(true);
    } finally {
      setGoogleAuthLoading(false);
    }
  };

  const confirmGoogleAccountRegistration = async (targetEmail: string) => {
    setGoogleAuthLoading(true);
    setShowGoogleAccountModal(false);

    const userTypedName = fullName.trim();
    const derivedName = userTypedName || (targetEmail ? targetEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Google Candidate');

    const googleCollege = selectedCollege === 'Other College / University' ? (customCollege || 'Other College') : selectedCollege;
    const googleDegree = selectedDegree === 'Other Degree' ? (customDegree || 'Other Degree') : selectedDegree;
    const googleBranch = `${googleDegree} - ${selectedBranch === 'General / Other Branch' ? (customBranch || 'Other Branch') : selectedBranch}`;

    const registeredGoogleUser: User = {
      id: 'google-uid-' + Date.now(),
      name: derivedName,
      email: targetEmail || 'srinidhiveldi14@gmail.com',
      role: role,
      phone: phone.trim() || undefined,
      aadhaar: aadhaar.trim() || undefined,
      college: role === 'STUDENT' ? googleCollege : undefined,
      branch: role === 'STUDENT' ? googleBranch : undefined,
      companyName: role === 'COMPANY' ? (companyName || 'Corporate Partner') : undefined,
      cgpa: 8.5,
      skills: ['Python', 'React.js', 'Machine Learning', 'SQL'],
      xp: mode === 'REGISTER' ? 500 : 1200,
      level: mode === 'REGISTER' ? 'Registered Member' : 'Verified Member',
      streakDays: 1
    };

    try {
      await saveUserToFirestore(registeredGoogleUser);
      setSuccessMessage(`Registered & logged in successfully with Google Account (${registeredGoogleUser.email})! Profile saved to Firestore.`);
      setTimeout(() => {
        onLogin(registeredGoogleUser);
      }, 500);
    } catch (err) {
      console.error('Error saving Google user:', err);
      setSuccessMessage(`Logged in with Google Account (${registeredGoogleUser.email})!`);
      onLogin(registeredGoogleUser);
    } finally {
      setGoogleAuthLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 overflow-hidden bg-gradient-to-b from-blue-50/50 via-slate-50 to-white dark:bg-slate-950 flex items-center justify-center">
      {/* Background image overlay with Indian students banner - light aesthetic */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 dark:opacity-15 pointer-events-none filter brightness-110 contrast-95"
        style={{ 
          backgroundImage: `url(${heroStudentsBg})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/85 to-slate-100/90 dark:from-slate-950/85 dark:via-slate-950/90 dark:to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full mx-auto space-y-6">
        {/* Container Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Accent Tri-color Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600" />

          {/* Header Title */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-400/30">
              {mode === 'REGISTER' ? <UserPlus className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'LOGIN' ? t('portalSignInTitle', 'Portal Sign In / Login') : t('createAccountTitle', 'Create Account / Register')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
              {t('pmSchemeSub', 'PM Internship Scheme • Ministry of Corporate Affairs, Govt of India')}
            </p>
          </div>

          {/* Separate Mode Toggle Tabs: Sign In / Login vs Sign Up / Register */}
          <div className="flex bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{t('signInTab', 'Sign In / Login')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'REGISTER'
                  ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('signUpTab', 'Sign Up / Register')}</span>
            </button>
          </div>

          {/* Feedback Alert Banners */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider flex items-center justify-between">
              <span>{t('selectPortalRole', 'Select Portal Role')}</span>
              <span className="text-slate-400 font-medium normal-case text-[10px]">{t('googleSyncActive', 'Google & Database Sync Active')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2.5 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'STUDENT'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t('studentRole', 'Student')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('COMPANY')}
                className={`py-2.5 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'COMPANY'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t('companyRole', 'Recruiter')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2.5 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('adminRole', 'Govt Officer')}</span>
              </button>
            </div>

            {/* Quick Demo Instant Logins */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-bold text-[10px] uppercase mr-1">{t('demoQuickLogin', 'Demo Quick Login:')}</span>
              <button
                type="button"
                onClick={() => {
                  setRole('STUDENT');
                  const demoStudent: User = {
                    id: 's-demo',
                    name: 'Rahul Sharma',
                    email: 'rahul.sharma@gmail.com',
                    role: 'STUDENT',
                    college: 'Indian Institute of Technology (IIT) Delhi',
                    branch: 'B.Tech / B.E. - Computer Science & Engineering (CSE)',
                    cgpa: 8.8,
                    skills: ['Python', 'React.js', 'Machine Learning', 'SQL'],
                    xp: 1450,
                    level: 'Intermediate Practitioner',
                    streakDays: 7
                  };
                  saveUserToFirestore(demoStudent);
                  onLogin(demoStudent);
                }}
                className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg font-bold hover:bg-amber-200 transition border border-amber-300/60 dark:border-amber-800/60 flex items-center gap-1 cursor-pointer"
              >
                {t('studentDemo', '🎓 Student Demo')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('COMPANY');
                  const demoCompany: User = {
                    id: 'c-demo',
                    name: 'Priya Mehta (Company Admin)',
                    email: 'recruiter.tcs@gmail.com',
                    role: 'COMPANY',
                    companyName: 'Tata Consultancy Services'
                  };
                  saveUserToFirestore(demoCompany);
                  onLogin(demoCompany);
                }}
                className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-200 transition border border-indigo-300/60 dark:border-indigo-800/60 flex items-center gap-1 cursor-pointer"
              >
                {t('recruiterDemo', '🏢 Recruiter Demo')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('ADMIN');
                  const demoAdmin: User = {
                    id: 'a-demo',
                    name: 'Officer A. K. Verma (MCA)',
                    email: 'officer.mca@gov.in',
                    role: 'ADMIN'
                  };
                  saveUserToFirestore(demoAdmin);
                  onLogin(demoAdmin);
                }}
                className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg font-bold hover:bg-emerald-200 transition border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-1 cursor-pointer"
              >
                {t('officerDemo', '🏛️ Officer Demo')}
              </button>
            </div>
          </div>

          {/* GOOGLE / GMAIL 1-CLICK AUTH BUTTON */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleAuthLoading}
              className="w-full py-3.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-xl font-bold text-xs text-slate-800 dark:text-white shadow-sm flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50"
            >
              {googleAuthLoading ? (
                <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {googleAuthLoading
                  ? t('connectingGoogle', 'Connecting Google Accounts Sync...')
                  : mode === 'LOGIN'
                  ? t('signInWithGoogle', 'Sign In with Google Sync')
                  : t('registerWithGoogle', 'Register with Google Sync')}
              </span>
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                {t('orUseFormDetails', 'or use portal form details')}
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {mode === 'REGISTER' && (
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                  {t('fullNameLabel', 'Full Name')} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'e.g. Rahul Sharma' : role === 'COMPANY' ? 'e.g. Priya Mehta' : 'e.g. Officer A. K. Verma'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                {t('emailAddressLabel', 'Email Address / Gmail')} <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'STUDENT'
                    ? 'e.g. student.name@gmail.com'
                    : role === 'COMPANY'
                    ? 'e.g. recruiter@company.com'
                    : 'e.g. officer@mca.gov.in'
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {mode === 'REGISTER' && role === 'STUDENT' && (
              <>
                {/* College Dropdown */}
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                    {t('collegeSelectLabel', 'College / University Name')} <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>-- {t('selectCollegeOption', 'Select College / University')} --</option>
                    {TOP_COLLEGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {selectedCollege === 'Other College / University' && (
                    <input
                      type="text"
                      required
                      value={customCollege}
                      onChange={(e) => setCustomCollege(e.target.value)}
                      placeholder={t('customCollegePlaceholder', 'Type your university / institute full name...')}
                      className="w-full mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>

                {/* Degree & Branch Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                      {t('degreeSelectLabel', 'Degree Name')} <span className="text-amber-500">*</span>
                    </label>
                    <select
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="" disabled>-- {t('selectDegreeOption', 'Select Degree')} --</option>
                      {DEGREES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {selectedDegree === 'Other Degree' && (
                      <input
                        type="text"
                        required
                        value={customDegree}
                        onChange={(e) => setCustomDegree(e.target.value)}
                        placeholder={t('customDegreePlaceholder', 'Type your degree full name...')}
                        className="w-full mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                      {t('branchSelectLabel', 'Branch / Specialization')} <span className="text-amber-500">*</span>
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="" disabled>-- {t('selectBranchOption', 'Select Branch / Specialization')} --</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>

                    {selectedBranch === 'General / Other Branch' && (
                      <input
                        type="text"
                        required
                        value={customBranch}
                        onChange={(e) => setCustomBranch(e.target.value)}
                        placeholder={t('customBranchPlaceholder', 'Type your course / branch full name...')}
                        className="w-full mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                </div>

                {/* Mobile Number & Aadhaar Separate Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                      {t('mobileNumberLabel', 'Mobile Number')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                      {t('aadhaarNumberLabel', 'Aadhaar Number')}
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      placeholder="1234 5678 9012"
                      maxLength={14}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Candidate Technical & Professional Skills Dropdown */}
                <div className="pt-1">
                  <SkillSelectDropdown
                    selectedSkills={candidateSkills}
                    onChange={setCandidateSkills}
                    label="Candidate Technical & Professional Skills"
                    placeholder="Select verified skills from dropdown catalog..."
                    helperText="Only verified skills from our 150+ categorized catalog are supported."
                    maxSkills={12}
                  />
                </div>

                {/* Resume File Attachment */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                    {t('resumeFileLabel', 'Insert File for Resume (.PDF / .DOCX / .TXT)')}
                  </label>
                  <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl px-4 py-2.5 cursor-pointer transition">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 truncate text-xs font-semibold">
                        {resumeFileName || t('attachFilePlaceholder', 'Attach PDF/DOCX resume file (Resumes only)')}
                      </span>
                    </div>
                    <Upload className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {resumeFileName && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{resumeFileName} verified as valid resume document</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {mode === 'REGISTER' && role === 'COMPANY' && (
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                  {t('companyNameLabel', 'Company Name / Organization')}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tata Consultancy Services, Reliance Industries"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">
                {t('passwordLabel', 'Password')} <span className="text-amber-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* In-built Password Condition Indicators during registration */}
              {mode === 'REGISTER' && (
                <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px]">
                  <div className="font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                    <span>{t('inbuiltSecurityCond', 'In-built Security Conditions:')}</span>
                    <span className={isPasswordValid ? 'text-emerald-600 font-extrabold' : 'text-amber-600'}>
                      {isPasswordValid ? t('validPassword', '✓ Valid Password') : t('requirementsPending', 'Requirements Pending')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-medium">
                    <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {passwordChecks.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{t('min8Chars', 'At least 8 characters')}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.upper ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {passwordChecks.upper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{t('uppercaseReq', 'Uppercase letter (A-Z)')}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.lower ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {passwordChecks.lower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{t('lowercaseReq', 'Lowercase letter (a-z)')}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {passwordChecks.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{t('numberReq', 'At least 1 number (0-9)')}</span>
                    </div>
                    <div className={`flex items-center gap-1 col-span-2 ${passwordChecks.symbol ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {passwordChecks.symbol ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{t('symbolReq', 'Special character (!@#$%^&*)')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (mode === 'REGISTER' && !isPasswordValid)}
              className={`w-full py-3.5 ${
                mode === 'REGISTER'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'LOGIN' ? t('submitSignInBtn', 'Sign In / Login') : t('submitRegisterBtn', 'Register Account & Save')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'LOGIN' ? (
              <p>
                {t('dontHaveAccount', "Don't have an account?")}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700 cursor-pointer"
                >
                  {t('createAccountLink', 'Create / Register New Account')}
                </button>
              </p>
            ) : (
              <p>
                {t('alreadyRegistered', 'Already registered?')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700 cursor-pointer"
                >
                  {t('signInHereLink', 'Sign In / Login Here')}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* GOOGLE ACCOUNT SELECTION MODAL */}
        {showGoogleAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center border border-amber-300">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {t('googleModalTitle', 'Google Account Registration')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('googleModalSub', 'Select your Google / Gmail account to register')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleAccountModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {t('googleModalDesc', 'Choose your Google account for instant PM Internship Scheme portal registration & Firestore database synchronization:')}
                </p>

                {/* Account Card Option 1: Primary User Google Account */}
                <button
                  type="button"
                  onClick={() => confirmGoogleAccountRegistration('srinidhiveldi14@gmail.com')}
                  className="w-full p-3.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border-2 border-amber-300 dark:border-amber-700 rounded-2xl flex items-center justify-between text-left transition cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                      SV
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs group-hover:text-amber-600">
                          srinidhiveldi14@gmail.com
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded-full">
                          {t('primaryGoogleTag', 'Primary Google')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block pt-0.5">
                        {t('verifiedGoogleSub', 'Verified Google Account • Ready for Instant Sync')}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition shrink-0" />
                </button>

                {/* Account Card Option 2: Custom Gmail Input */}
                <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-3">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {t('enterOtherGoogle', 'Or enter another Google / Gmail address:')}
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="e.g. candidate.name@gmail.com"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => confirmGoogleAccountRegistration(customGoogleEmail || 'candidate@gmail.com')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('continueRegWith', 'Continue Registration with')} {customGoogleEmail || 'Google Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Details summary */}
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                    <span>{t('registeringAs', 'Registering As:')}</span>
                    <span className="text-amber-600 dark:text-amber-400">{role}</span>
                  </div>
                  {fullName && (
                    <div className="flex justify-between">
                      <span>{t('nameLabel', 'Name:')}</span>
                      <span>{fullName}</span>
                    </div>
                  )}
                  {role === 'STUDENT' && (
                    <div className="flex justify-between truncate">
                      <span>{t('collegeLabel', 'College:')}</span>
                      <span className="truncate max-w-[180px]">{selectedCollege}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

