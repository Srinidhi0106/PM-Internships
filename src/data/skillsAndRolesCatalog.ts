export interface RoleCategory {
  sector: string;
  roles: {
    title: string;
    description: string;
    suitedDegrees: string;
    coreSkills: string[];
  }[];
}

export const VALID_ROLE_CATEGORIES: RoleCategory[] = [
  {
    sector: 'Software & Information Technology',
    roles: [
      {
        title: 'AI & Data Science Specialist',
        description: 'Machine learning model development, predictive analytics, and Python AI algorithms.',
        suitedDegrees: 'B.Tech / B.E. / BCA / B.Sc CS',
        coreSkills: ['Python', 'Machine Learning', 'Data Structures', 'SQL', 'PyTorch']
      },
      {
        title: 'Full Stack Web Developer (React & Node)',
        description: 'End-to-end web application architecture using modern frontend and backend frameworks.',
        suitedDegrees: 'B.Tech / BCA / B.Sc CS',
        coreSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'REST APIs']
      },
      {
        title: 'Frontend Developer (React / Next.js)',
        description: 'High-performance user interfaces, responsive design, and modern CSS architecture.',
        suitedDegrees: 'B.Tech / BCA / B.Sc / Any Degree',
        coreSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3']
      },
      {
        title: 'Backend Software Engineer (Node / Python / Java)',
        description: 'Server-side API architecture, microservices, databases, and secure system design.',
        suitedDegrees: 'B.Tech / MCA / BCA',
        coreSkills: ['Python', 'Node.js', 'Java', 'SQL', 'PostgreSQL', 'Docker', 'REST APIs']
      },
      {
        title: 'Mobile App Developer (Flutter / React Native)',
        description: 'Cross-platform mobile application development for Android and iOS systems.',
        suitedDegrees: 'B.Tech / BCA / B.Sc CS',
        coreSkills: ['Flutter', 'React Native', 'JavaScript', 'Dart', 'Mobile UI/UX', 'REST APIs']
      },
      {
        title: 'QA & Automation Test Engineer',
        description: 'Test automation frameworks, API validation, regression testing, and CI/CD quality assurance.',
        suitedDegrees: 'B.Tech / BCA / B.Sc',
        coreSkills: ['Selenium', 'Cypress', 'Python', 'Java', 'Manual Testing', 'API Testing']
      }
    ]
  },
  {
    sector: 'Artificial Intelligence & Data Analytics',
    roles: [
      {
        title: 'Machine Learning Engineer (PyTorch / TensorFlow)',
        description: 'Deep neural networks, model training, computer vision, and NLP pipelines.',
        suitedDegrees: 'B.Tech / M.Tech / MCA / B.Sc CS',
        coreSkills: ['PyTorch', 'TensorFlow', 'Python', 'Scikit-Learn', 'Pandas', 'Data Structures']
      },
      {
        title: 'Generative AI & LLM Applications Developer',
        description: 'RAG systems, prompt engineering, LangChain, vector databases, and AI agents.',
        suitedDegrees: 'B.Tech / BCA / MCA',
        coreSkills: ['Generative AI', 'Python', 'LangChain', 'ChromaDB', 'Vector Databases', 'Prompt Engineering']
      },
      {
        title: 'Data Analyst & Business Intelligence (Power BI / Tableau)',
        description: 'Data transformation, executive dashboards, SQL querying, and business analytics.',
        suitedDegrees: 'B.Sc / B.Com / BCA / BBA / B.Tech',
        coreSkills: ['SQL', 'Power BI', 'Tableau', 'Advanced Excel', 'Data Visualization', 'Python']
      },
      {
        title: 'Data Engineer & ETL Pipeline Specialist',
        description: 'Data ingestion, warehouse modeling, big data pipelines, and streaming infrastructure.',
        suitedDegrees: 'B.Tech / MCA / B.Sc CS',
        coreSkills: ['SQL', 'Python', 'PostgreSQL', 'Data Warehousing', 'Apache Spark', 'Docker']
      }
    ]
  },
  {
    sector: 'Cloud, Infrastructure & Cybersecurity',
    roles: [
      {
        title: 'Cloud & DevOps Systems Engineer',
        description: 'Cloud deployments on AWS/GCP/Azure, container orchestration with Docker/Kubernetes.',
        suitedDegrees: 'B.Tech / MCA / B.Sc CS',
        coreSkills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud (GCP)', 'Linux', 'CI/CD', 'Git']
      },
      {
        title: 'Cybersecurity & Threat Analyst',
        description: 'Vulnerability assessment, network security monitoring, incident response, and SOC operations.',
        suitedDegrees: 'B.Tech / B.Sc CS / BCA',
        coreSkills: ['Network Security', 'Wireshark', 'Linux', 'Vulnerability Assessment', 'Cryptography', 'OWASP']
      },
      {
        title: 'Linux Systems & Network Administrator',
        description: 'Enterprise server maintenance, network configuration, shell scripting, and security hardening.',
        suitedDegrees: 'B.Tech / Diploma / BCA',
        coreSkills: ['Linux', 'Bash Scripting', 'Computer Networks', 'Network Security', 'Nginx']
      }
    ]
  },
  {
    sector: 'Banking, Financial Services & Insurance (BFSI)',
    roles: [
      {
        title: 'Financial Analytics & Tally Specialist',
        description: 'Corporate accounting, GST reconciliation, financial modeling, and Tally Prime operations.',
        suitedDegrees: 'B.Com / BBA / MBA / Finance',
        coreSkills: ['Tally Prime', 'Financial Accounting', 'Advanced Excel', 'GST Compliance', 'Financial Analysis']
      },
      {
        title: 'Fintech Operations & Risk Analyst',
        description: 'Digital payments compliance, fraud detection rules, credit risk analysis, and KYC audits.',
        suitedDegrees: 'B.Com / BBA / B.Sc / B.Tech',
        coreSkills: ['Financial Analysis', 'Risk Management', 'SQL', 'Advanced Excel', 'Data Analysis']
      },
      {
        title: 'Investment & Equity Research Associate',
        description: 'Valuation models, market trend analysis, equity reports, and portfolio performance tracking.',
        suitedDegrees: 'B.Com / BBA / Economics / MBA',
        coreSkills: ['Financial Modeling', 'MS Excel', 'Valuation', 'Economic Analysis', 'Presentation Skills']
      }
    ]
  },
  {
    sector: 'E-Commerce, Digital Retail & Marketing',
    roles: [
      {
        title: 'Digital Marketing & Growth Associate',
        description: 'SEO strategy, performance marketing, conversion optimization, and social media campaigns.',
        suitedDegrees: 'B.A / BBA / B.Com / Any Graduate',
        coreSkills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media Strategy', 'Content Strategy']
      },
      {
        title: 'E-Commerce Operations & Product Associate',
        description: 'Inventory management, catalog optimization, marketplace operations, and vendor coordination.',
        suitedDegrees: 'BBA / B.Com / B.A / Any Graduate',
        coreSkills: ['E-Commerce Operations', 'Data Analysis', 'MS Office', 'Inventory Management', 'Communication']
      }
    ]
  },
  {
    sector: 'Automotive, EV & Core Engineering',
    roles: [
      {
        title: 'Automotive Embedded Systems & IoT Engineer',
        description: 'Microcontroller programming, CAN bus communication, embedded C, and vehicle telemetry.',
        suitedDegrees: 'B.Tech Mechanical / EEE / ECE',
        coreSkills: ['Embedded Systems', 'C/C++', 'Microcontrollers', 'IoT', 'MATLAB', 'Circuit Design']
      },
      {
        title: 'EV Powertrain & Battery Systems Trainee',
        description: 'Battery management systems (BMS), thermal simulation, EV motor drives, and CAD modeling.',
        suitedDegrees: 'B.Tech Electrical / Mechanical',
        coreSkills: ['MATLAB', 'Simulink', 'CAD Design', 'Electrical Circuits', 'Battery Management']
      },
      {
        title: 'VLSI & Digital Circuit Design Engineer',
        description: 'Verilog/VHDL RTL modeling, FPGA prototyping, digital electronics, and ASIC workflows.',
        suitedDegrees: 'B.Tech ECE / Electrical',
        coreSkills: ['Verilog / VHDL', 'Digital Electronics', 'VLSI Design', 'MATLAB', 'C/C++']
      },
      {
        title: 'Mechanical CAD & Design Engineer',
        description: '3D parametric modeling, finite element analysis (FEA), GD&T, and prototyping.',
        suitedDegrees: 'B.Tech Mechanical / Production',
        coreSkills: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'Engineering Drawing']
      }
    ]
  },
  {
    sector: 'Design, Creative & User Experience (UI/UX)',
    roles: [
      {
        title: 'UI/UX Designer & Product Prototyper',
        description: 'User interface design, Figma wireframing, design systems, usability research, and interactive prototyping.',
        suitedDegrees: 'B.Des / B.Tech / B.Sc / Any Degree',
        coreSkills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems']
      },
      {
        title: 'Product Design & Visual Media Associate',
        description: 'Visual branding, vector graphic illustration, product assets, and marketing creatives.',
        suitedDegrees: 'B.Des / B.A / Any Graduate',
        coreSkills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Visual Design', 'Branding']
      },
      {
        title: 'Technical Content & Documentation Specialist',
        description: 'Developer documentation, API reference guides, release notes, and technical articles.',
        suitedDegrees: 'B.A / B.Sc / BCA / B.Tech / Any Degree',
        coreSkills: ['Technical Writing', 'Markdown', 'Documentation', 'Communication Skills', 'Content Strategy']
      }
    ]
  },
  {
    sector: 'Human Resources & People Operations',
    roles: [
      {
        title: 'HR & Talent Acquisition Specialist',
        description: 'End-to-end recruitment pipelines, candidate screening, interview scheduling, and employer branding.',
        suitedDegrees: 'BBA / MBA / B.A / B.Com / Any Graduate',
        coreSkills: ['Recruitment', 'Talent Acquisition', 'HR Analytics', 'Interview Coordination', 'Communication Skills']
      },
      {
        title: 'People Operations & HR Analytics Trainee',
        description: 'HR metrics tracking, employee onboarding experience, performance appraisal systems, and payroll ops.',
        suitedDegrees: 'BBA / MBA / B.Com',
        coreSkills: ['HR Analytics', 'Advanced Excel', 'Employee Engagement', 'HRIS', 'People Operations']
      }
    ]
  },
  {
    sector: 'Civil, Infrastructure & Built Environment',
    roles: [
      {
        title: 'Civil & Structural Design Engineer',
        description: 'Structural modeling, concrete analysis, AutoCAD drafting, and construction site quality inspection.',
        suitedDegrees: 'B.Tech Civil / Diploma Civil',
        coreSkills: ['AutoCAD', 'STAAD Pro', 'Structural Analysis', 'Concrete Technology', 'Site Supervision']
      },
      {
        title: 'BIM Modeler & Smart Construction Specialist',
        description: 'Building Information Modeling (BIM), 3D architectural coordination, and Revit modeling.',
        suitedDegrees: 'B.Arch / B.Tech Civil',
        coreSkills: ['Revit', 'BIM', 'AutoCAD', 'Quantity Surveying', 'Construction Management']
      }
    ]
  },
  {
    sector: 'Renewable Energy, Climate Tech & Sustainability',
    roles: [
      {
        title: 'Solar PV & Clean Energy Systems Trainee',
        description: 'Rooftop & utility-scale solar PV system sizing, irradiance modeling, and electrical grid interconnection.',
        suitedDegrees: 'B.Tech Electrical / Renewable / Mechanical',
        coreSkills: ['Solar PV', 'PVSyst', 'Electrical Circuits', 'Renewable Energy', 'CAD Design']
      },
      {
        title: 'Sustainability & ESG Compliance Analyst',
        description: 'Carbon footprint auditing, corporate ESG reporting, sustainability metrics, and green standards.',
        suitedDegrees: 'B.Sc / B.Tech / MBA / Environmental Science',
        coreSkills: ['ESG Reporting', 'Sustainability Analysis', 'Carbon Accounting', 'Environmental Regulations']
      }
    ]
  },
  {
    sector: 'Supply Chain, Logistics & Operations',
    roles: [
      {
        title: 'Supply Chain & Logistics Operations Trainee',
        description: 'Inventory management, warehouse logistics, route dispatch optimization, and vendor tracking.',
        suitedDegrees: 'BBA / B.Com / B.Tech / Any Graduate',
        coreSkills: ['Supply Chain Management', 'Logistics', 'Advanced Excel', 'Inventory Control', 'ERP Systems']
      },
      {
        title: 'Procurement & Vendor Operations Associate',
        description: 'Purchase orders, vendor evaluation, contract management, and RFP documentation.',
        suitedDegrees: 'B.Com / BBA / MBA',
        coreSkills: ['Vendor Management', 'Procurement', 'Negotiation', 'Contract Management', 'SAP']
      }
    ]
  },
  {
    sector: 'Healthcare, Pharma & Biotechnology',
    roles: [
      {
        title: 'Bioinformatics & Computational Biology Trainee',
        description: 'Genomic sequence analysis, protein modeling, molecular docking, and Python bioinformatics.',
        suitedDegrees: 'B.Sc / B.Tech Biotech / Bioinformatics',
        coreSkills: ['Bioinformatics', 'Python', 'Genomics', 'Molecular Docking', 'Data Analysis']
      },
      {
        title: 'Clinical Data Management & Quality Specialist',
        description: 'Clinical trial protocols, electronic data capture (EDC), GCP guidelines, and regulatory validation.',
        suitedDegrees: 'B.Pharma / M.Pharma / B.Sc Life Sciences',
        coreSkills: ['Clinical Research', 'GCP Compliance', 'Regulatory Affairs', 'Data Verification', 'Quality Control']
      }
    ]
  },
  {
    sector: 'Corporate Legal, Governance & Public Policy',
    roles: [
      {
        title: 'Corporate Legal & Compliance Trainee',
        description: 'Regulatory filings, MCA corporate compliance, agreement reviews, and statutory research.',
        suitedDegrees: 'LLB / B.A. LLB / B.Com / CS Trainee',
        coreSkills: ['Corporate Law', 'Legal Research', 'Contract Review', 'MCA Compliance', 'Due Diligence']
      },
      {
        title: 'Public Policy & Administration Research Associate',
        description: 'Government scheme impact evaluation, citizen service analytics, and public administration research.',
        suitedDegrees: 'B.A / B.Sc / Public Policy / Economics',
        coreSkills: ['Public Policy', 'Policy Research', 'Data Analysis', 'Report Writing', 'Governance']
      }
    ]
  }
];

export const ALL_VALID_ROLES: string[] = VALID_ROLE_CATEGORIES.flatMap(cat => cat.roles.map(r => r.title));

export interface SkillCategory {
  categoryName: string;
  skills: string[];
}

export const VALID_SKILL_CATEGORIES: SkillCategory[] = [
  {
    categoryName: 'Programming & Software Development',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Next.js',
      'Java',
      'C++',
      'C#',
      'C Programming',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Express.js',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'Data Structures',
      'Algorithms',
      'REST APIs',
      'GraphQL',
      'Flutter',
      'React Native',
      'Dart',
      'Git',
      'GitHub'
    ]
  },
  {
    categoryName: 'AI, Machine Learning & Data Science',
    skills: [
      'Machine Learning',
      'Deep Learning',
      'PyTorch',
      'TensorFlow',
      'Scikit-Learn',
      'Pandas',
      'NumPy',
      'Generative AI',
      'Prompt Engineering',
      'LangChain',
      'Computer Vision',
      'Natural Language Processing (NLP)',
      'Large Language Models (LLMs)',
      'Vector Databases',
      'ChromaDB',
      'Data Analysis',
      'Data Visualization',
      'Matplotlib',
      'Seaborn',
      'Statistical Modeling'
    ]
  },
  {
    categoryName: 'Databases & Business Intelligence',
    skills: [
      'SQL',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'Firebase',
      'SQLite',
      'Power BI',
      'Tableau',
      'Advanced Excel',
      'Data Warehousing',
      'ETL Pipelines',
      'Big Data Basics'
    ]
  },
  {
    categoryName: 'Cloud, DevOps & Cybersecurity',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Google Cloud (GCP)',
      'Microsoft Azure',
      'Linux',
      'CI/CD Pipelines',
      'Bash Scripting',
      'Microservices',
      'Nginx',
      'Computer Networks',
      'Network Security',
      'Wireshark',
      'Vulnerability Assessment',
      'Cryptography',
      'OWASP Top 10'
    ]
  },
  {
    categoryName: 'Finance, Banking & Business',
    skills: [
      'Financial Accounting',
      'Tally Prime',
      'GST Compliance',
      'Financial Analysis',
      'Financial Modeling',
      'Risk Management',
      'Corporate Finance',
      'Banking Operations',
      'Cost Accounting',
      'Auditing'
    ]
  },
  {
    categoryName: 'Marketing, E-Commerce & Management',
    skills: [
      'Digital Marketing',
      'Search Engine Optimization (SEO)',
      'Google Analytics',
      'Social Media Strategy',
      'Content Marketing',
      'E-Commerce Operations',
      'Product Management',
      'Agile / Scrum',
      'Jira',
      'Market Research'
    ]
  },
  {
    categoryName: 'Core Engineering & Hardware',
    skills: [
      'Embedded Systems',
      'Microcontrollers',
      'IoT (Internet of Things)',
      'Arduino',
      'Raspberry Pi',
      'MATLAB',
      'Simulink',
      'AutoCAD',
      'SolidWorks',
      'CATIA',
      'ANSYS',
      'VLSI Design',
      'Verilog / VHDL',
      'Digital Electronics',
      'Circuit Design'
    ]
  },
  {
    categoryName: 'Soft Skills & Professionalism',
    skills: [
      'Communication Skills',
      'Problem Solving',
      'Critical Thinking',
      'Team Collaboration',
      'Time Management',
      'Presentation Skills',
      'STAR Interview Technique',
      'Technical Writing'
    ]
  }
];

export const ALL_VALID_SKILLS: string[] = VALID_SKILL_CATEGORIES.flatMap(cat => cat.skills);

// Validation helpers
export function isValidRole(role: string): boolean {
  if (!role || role.trim().length < 3) return false;
  const clean = role.trim().toLowerCase();
  
  // Reject obvious gibberish or single meaningless words
  if (/^(abc|xyz|test|asdf|qwerty|123|none|na|nil|aaa|bbb|ccc|foo|bar|baz)$/i.test(clean)) {
    return false;
  }
  
  // Check exact or partial match in ALL_VALID_ROLES
  return ALL_VALID_ROLES.some(validRole => {
    const vr = validRole.toLowerCase();
    return vr === clean || vr.includes(clean) || clean.includes(vr) ||
      (clean.includes('developer') && vr.includes('developer')) ||
      (clean.includes('engineer') && vr.includes('engineer')) ||
      (clean.includes('analyst') && vr.includes('analyst')) ||
      (clean.includes('specialist') && vr.includes('specialist'));
  });
}

export function isValidSkill(skill: string): boolean {
  if (!skill || skill.trim().length < 2) return false;
  const clean = skill.trim().toLowerCase();

  // Reject gibberish patterns like "abc", "xyz", "asdf", "123", single consonants
  if (/^(abc|xyz|test|asdf|qwerty|123|none|na|nil|aaa|bbb|ccc|foo|bar|baz|blah)$/i.test(clean)) {
    return false;
  }

  // Must have at least one vowel or be standard known abbreviation (C, C++, SQL, R, CI/CD, AWS, GCP, NLP, RAG, CAD, UI/UX, AI, ML)
  const knownAbbreviations = ['c', 'c++', 'c#', 'r', 'sql', 'aws', 'gcp', 'nlp', 'rag', 'cad', 'ui/ux', 'ai', 'ml', 'qa', 'bi', 'bms', 'iot', 'gst', 'seo', 'llm', 'llms', 'gis', 'fea', 'sre', 'soc', 'api', 'apis'];
  if (knownAbbreviations.includes(clean)) return true;

  if (!/[aeiouy]/i.test(clean) && clean.length > 2) {
    return false;
  }

  // Check against ALL_VALID_SKILLS
  return ALL_VALID_SKILLS.some(validSkill => {
    const vs = validSkill.toLowerCase();
    return vs === clean || vs.includes(clean) || clean.includes(vs);
  });
}

export function searchSkills(query: string, limit = 10): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return ALL_VALID_SKILLS.filter(s => s.toLowerCase().includes(q)).slice(0, limit);
}
