import { Internship, Application, User, InterviewAttempt, PortfolioAudit } from '../types';

export const DEMO_STUDENT: User = {
  id: 'stu-101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@iitd.ac.in',
  role: 'student',
  phone: '+91 9876543210',
  college: 'Indian Institute of Technology, Delhi',
  university: 'IIT Delhi',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  year: '3rd Year',
  cgpa: 8.9,
  skills: ['Python', 'Machine Learning', 'React', 'TypeScript', 'Node.js', 'SQL', 'Data Structures', 'Communication Skills'],
  interests: ['Artificial Intelligence', 'Full Stack Web Dev', 'Cloud Computing', 'Data Analytics'],
  preferredLocation: 'New Delhi / NCR',
  preferredWorkMode: 'Hybrid',
  resumeUrl: 'https://example.com/resumes/ananya_sharma.pdf',
  githubUrl: 'https://github.com/ananyasharma-code',
  linkedinUrl: 'https://linkedin.in/in/ananyasharma-tech'
};

export const DEMO_COMPANY: User = {
  id: 'comp-201',
  name: 'Tata Consultancy Services (TCS)',
  email: 'careers@tcs.com',
  role: 'company',
  phone: '+91 22 67789999',
  companyName: 'Tata Consultancy Services',
  hrName: 'Rajesh Varma',
  website: 'https://tcs.com',
  industry: 'Information Technology & Services',
  companyLocation: 'Mumbai, Maharashtra',
  companyDescription: 'TCS is a global leader in IT services, consulting, and business solutions under the Tata Group.',
  verified: true
};

export const DEMO_ADMIN: User = {
  id: 'admin-301',
  name: 'Ministry Admin (MCA)',
  email: 'admin.pminternship@mca.gov.in',
  role: 'admin',
  phone: '+91 11 23384000',
  verified: true
};

export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'int-001',
    companyId: 'comp-201',
    companyName: 'Tata Consultancy Services (TCS)',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    role: 'AI & Data Science Intern',
    domain: 'Artificial Intelligence & Machine Learning',
    location: 'Bengaluru, Karnataka',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: 25000,
    skillsRequired: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'React'],
    minCGPA: 7.5,
    deadline: '2026-09-15',
    postedDate: '2026-08-01',
    description: 'Work alongside senior AI architects on building natural language processing models and scalable data pipelines for enterprise PM Internship matching.',
    responsibilities: [
      'Build baseline ML prediction pipelines using Scikit-Learn',
      'Optimize NLP vector embeddings for recommendation matching',
      'Collaborate with frontend engineers to integrate React dashboard components'
    ],
    perks: ['Certificate of Excellence', 'Pre-Placement Offer (PPO) Opportunity', 'Free Transport & Food Coupons'],
    trustScore: 98,
    riskLevel: 'Safe',
    fraudReason: 'Official verified company domain, government partner TCS portal.',
    status: 'active',
    openings: 15
  },
  {
    id: 'int-002',
    companyId: 'comp-202',
    companyName: 'Reliance Industries Limited',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    role: 'Full Stack Software Engineer Intern',
    domain: 'Software Engineering & Web Development',
    location: 'Mumbai, Maharashtra',
    mode: 'Onsite',
    duration: '6 Months',
    stipend: 22000,
    skillsRequired: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Git'],
    minCGPA: 7.0,
    deadline: '2026-09-20',
    postedDate: '2026-08-03',
    description: 'Join Jio Digital Services engineering division to build high-concurrency cloud applications and user dashboards.',
    responsibilities: [
      'Develop responsive UI components in React and Tailwind CSS',
      'Design RESTful APIs with Node.js and Express',
      'Write database migration queries and optimize MongoDB indexing'
    ],
    perks: ['Subsidized Housing', 'Jio Center Gym Access', 'PM Scheme Internship Certificate'],
    trustScore: 96,
    riskLevel: 'Safe',
    fraudReason: 'Verified corporate domain, approved by MCA audit board.',
    status: 'active',
    openings: 20
  },
  {
    id: 'int-003',
    companyId: 'comp-203',
    companyName: 'Larsen & Toubro (L&T)',
    companyLogo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&auto=format&fit=crop&q=80',
    role: 'IoT & Embedded Systems Engineering Intern',
    domain: 'Hardware & Embedded Systems',
    location: 'Pune, Maharashtra',
    mode: 'Onsite',
    duration: '12 Months',
    stipend: 20000,
    skillsRequired: ['C++', 'Embedded C', 'IoT Protocols', 'Python', 'Microcontrollers'],
    minCGPA: 6.5,
    deadline: '2026-09-30',
    postedDate: '2026-08-04',
    description: 'Engage in smart grid telemetry and industrial automation research under L&T Smart World project.',
    responsibilities: [
      'Program ARM Cortex microcontrollers for sensor telemetry',
      'Test MQTT and CoAP network transmission reliability',
      'Assist in hardware PCB design review'
    ],
    perks: ['Mentorship by L&T Chief Engineers', 'Govt PM Stipend Bonus'],
    trustScore: 95,
    riskLevel: 'Safe',
    fraudReason: 'Official L&T corporate registry matched.',
    status: 'active',
    openings: 10
  },
  {
    id: 'int-004',
    companyId: 'comp-204',
    companyName: 'Infosys Limited',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
    role: 'Cloud Operations & Cyber Security Intern',
    domain: 'Cloud Computing & Cyber Security',
    location: 'Hyderabad, Telangana',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: 21000,
    skillsRequired: ['AWS', 'Docker', 'Linux', 'Python', 'Cyber Security Basics'],
    minCGPA: 7.2,
    deadline: '2026-09-25',
    postedDate: '2026-08-02',
    description: 'Learn modern DevOps pipelines, AWS Cloud Infrastructure management, and threat vulnerability assessments.',
    responsibilities: [
      'Automate deployment scripts using Docker and Bash',
      'Monitor CloudWatch alarms and analyze log files',
      'Perform baseline penetration testing audits'
    ],
    perks: ['Infosys Springboard Certification', 'Flexible Work Hours'],
    trustScore: 97,
    riskLevel: 'Safe',
    fraudReason: 'Infosys official CSR / PM Internship partnership verified.',
    status: 'active',
    openings: 25
  },
  {
    id: 'int-005',
    companyId: 'comp-205',
    companyName: 'Bharat Heavy Electricals Limited (BHEL)',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80',
    role: 'Renewable Energy Systems Intern',
    domain: 'Electrical & Green Energy',
    location: 'New Delhi / NCR',
    mode: 'Onsite',
    duration: '6 Months',
    stipend: 18000,
    skillsRequired: ['MATLAB', 'Solar PV Design', 'Python', 'Power Electronics'],
    minCGPA: 6.8,
    deadline: '2026-10-01',
    postedDate: '2026-08-05',
    description: 'Govt PSU internship in solar power grid integration and heavy electrical transformer analytics.',
    responsibilities: [
      'Simulate solar panel grid efficiency in MATLAB',
      'Collect telemetry logs from solar farms across NCR',
      'Prepare technical feasibility research reports'
    ],
    perks: ['Government PSU Certificate', 'Direct PPO Interview Call'],
    trustScore: 99,
    riskLevel: 'Safe',
    fraudReason: 'Verified Ministry PSU Entity.',
    status: 'active',
    openings: 12
  },
  {
    id: 'int-006',
    companyId: 'comp-206',
    companyName: 'NITI Aayog (Govt of India)',
    companyLogo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=80',
    role: 'Public Policy & AI Research Intern',
    domain: 'Data Science & Public Administration',
    location: 'New Delhi, Delhi',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: 20000,
    skillsRequired: ['Python', 'Data Analytics', 'Policy Research', 'Excel', 'Communication'],
    minCGPA: 8.0,
    deadline: '2026-09-18',
    postedDate: '2026-08-01',
    description: 'Work with policy advisors on analyzing national economic metrics, AI ethics guidelines, and youth employment trends.',
    responsibilities: [
      'Clean state-level employment datasets',
      'Create interactive charts for ministry briefings',
      'Draft policy executive summaries'
    ],
    perks: ['Govt of India Citation Certificate', 'High Visibility Project'],
    trustScore: 100,
    riskLevel: 'Safe',
    fraudReason: 'Direct Ministry Body.',
    status: 'active',
    openings: 8
  },
  {
    id: 'int-007',
    companyId: 'comp-207',
    companyName: 'Maruti Suzuki India Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&auto=format&fit=crop&q=80',
    role: 'Automotive Software & EV Analytics Intern',
    domain: 'Automotive Engineering & Software',
    location: 'Gurugram, Haryana',
    mode: 'Onsite',
    duration: '6 Months',
    stipend: 22500,
    skillsRequired: ['Python', 'C++', 'Battery Management Systems', 'Data Visualization'],
    minCGPA: 7.0,
    deadline: '2026-09-28',
    postedDate: '2026-08-06',
    description: 'Electric Vehicle telemetry modeling and battery life cycle predictive analytics.',
    responsibilities: [
      'Analyze battery temperature profiles during rapid charging',
      'Develop Python visualization scripts for CAN bus diagnostics',
      'Test firmware updates on simulator bench'
    ],
    perks: ['Plant Tour & Manufacturing Insights', 'Company Shuttle Facility'],
    trustScore: 97,
    riskLevel: 'Safe',
    fraudReason: 'Verified Automotive Leader.',
    status: 'active',
    openings: 14
  },
  {
    id: 'int-008',
    companyId: 'comp-208',
    companyName: 'State Bank of India (SBI)',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    role: 'FinTech & Blockchain Security Intern',
    domain: 'FinTech & Banking Solutions',
    location: 'Navi Mumbai, Maharashtra',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: 19500,
    skillsRequired: ['Java', 'SQL', 'Cyber Security', 'Financial Modeling', 'React'],
    minCGPA: 7.0,
    deadline: '2026-09-22',
    postedDate: '2026-08-05',
    description: 'Assist SBI YONO innovation lab in building fraud detection microservices and digital transaction audit tools.',
    responsibilities: [
      'Build anomaly detection filters for online payment flows',
      'Create UI dashboards for loan application monitoring',
      'Test cryptographic hashing verification'
    ],
    perks: ['Official SBI FinTech Certificate', 'Stipend + Meal Allowance'],
    trustScore: 99,
    riskLevel: 'Safe',
    fraudReason: 'Official National Bank.',
    status: 'active',
    openings: 18
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-501',
    internshipId: 'int-001',
    internshipTitle: 'AI & Data Science Intern',
    companyName: 'Tata Consultancy Services (TCS)',
    studentId: 'stu-101',
    studentName: 'Ananya Sharma',
    studentEmail: 'ananya.sharma@iitd.ac.in',
    studentCollege: 'IIT Delhi',
    studentBranch: 'Computer Science & Engineering',
    studentCGPA: 8.9,
    studentSkills: ['Python', 'Machine Learning', 'React', 'TypeScript', 'Node.js'],
    appliedDate: '2026-08-02',
    status: 'Shortlisted',
    aiCandidateRankScore: 94,
    aiRankExplanation: 'High skill overlap in Python, ML and React. Strong CGPA of 8.9/10.',
    interviewDate: '2026-08-14',
    interviewTime: '11:00 AM IST',
    interviewLink: 'https://meet.google.com/pminternship-tcs-101'
  },
  {
    id: 'app-502',
    internshipId: 'int-002',
    internshipTitle: 'Full Stack Software Engineer Intern',
    companyName: 'Reliance Industries Limited',
    studentId: 'stu-101',
    studentName: 'Ananya Sharma',
    studentEmail: 'ananya.sharma@iitd.ac.in',
    studentCollege: 'IIT Delhi',
    studentBranch: 'Computer Science & Engineering',
    studentCGPA: 8.9,
    studentSkills: ['React', 'Node.js', 'TypeScript'],
    appliedDate: '2026-08-04',
    status: 'Under Review',
    aiCandidateRankScore: 88,
    aiRankExplanation: 'Solid React and TypeScript expertise.'
  }
];

export const INITIAL_INTERVIEW_ATTEMPTS: InterviewAttempt[] = [
  {
    id: 'intv-801',
    studentId: 'stu-101',
    companyName: 'Tata Consultancy Services (TCS)',
    role: 'AI & Data Science Intern',
    domain: 'Artificial Intelligence & Machine Learning',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    date: '2026-08-06',
    overallScore: 88,
    confidenceScore: 85,
    communicationScore: 90,
    technicalScore: 89,
    grammarScore: 92,
    problemSolvingScore: 84,
    professionalismScore: 90,
    strengths: ['Excellent explanation of Gradient Descent', 'Clear articulation of React state hooks', 'Fluent technical communication'],
    weaknesses: ['Needs deeper understanding of Transformer self-attention complexity', 'Slight hesitation on SQL JOIN query syntax'],
    recommendedTopics: ['Attention Mechanisms in LLMs', 'SQL Window Functions & Indexing', 'Docker Container Deployment'],
    suggestedCertifications: ['NPTEL Deep Learning Specialization', 'TensorFlow Developer Certificate'],
    expectedSuccessRate: 91,
    transcript: [
      { question: 'Explain how Content-Based Filtering works in AI Recommendations.', answer: 'Content-based filtering matches item attributes like required skills with user profile features using TF-IDF or vector embeddings like Cosine Similarity.', score: 92, feedback: 'Accurate and structured answer with relevant terminology.' },
      { question: 'What is the difference between supervised and unsupervised machine learning?', answer: 'Supervised learning uses labeled training data, while unsupervised learning discovers hidden patterns in unlabeled data using clustering algorithms like K-Means.', score: 90, feedback: 'Crisp and correct distinction.' }
    ]
  }
];

export const INITIAL_PORTFOLIO_AUDITS: PortfolioAudit[] = [
  {
    id: 'port-901',
    studentId: 'stu-101',
    date: '2026-08-05',
    overallScore: 89,
    atsResumeScore: 92,
    githubScore: 86,
    linkedinScore: 88,
    portfolioQualityScore: 90,
    githubStats: {
      repositories: 14,
      topLanguages: ['Python', 'TypeScript', 'Jupyter Notebook', 'HTML/CSS'],
      commitFrequency: 'High (Avg 18 commits/week)',
      openSourceContribs: '3 pull requests merged in open-source ML projects'
    },
    suggestions: {
      missingSkills: ['Docker', 'PyTorch', 'Kubernetes'],
      betterProjects: ['Deploy a live full-stack PM recommendation app with CI/CD', 'Add unit tests for ML vector API endpoints'],
      resumeKeywords: ['Model Quantization', 'Vector Database', 'FastAPI', 'Microservices'],
      portfolioImprovements: ['Add live demo links to top 3 GitHub repositories', 'Include performance benchmarks in Readme files'],
      linkedinImprovements: ['Request 2 peer or professor recommendations', 'Add PM Internship Certification badge']
    }
  }
];
