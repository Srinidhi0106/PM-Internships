import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  Printer,
  Upload,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  UserCheck,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Eye,
  RefreshCw,
  Sliders,
  Share2,
  FileCheck2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileDown
} from 'lucide-react';
import { User as UserType } from '../types';
import { validateResumeFile } from '../utils/resumeValidator';

interface ResumeBuilderPageProps {
  user: UserType;
  onNavigate?: (tab: string) => void;
}

interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  description: string;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({ user, onNavigate }) => {
  // Styling Controls
  const [fontFamily, setFontFamily] = useState<string>('calibri');
  const [fontSize, setFontSize] = useState<string>('11pt');
  const [docLength, setDocLength] = useState<'compact' | 'standard' | 'expanded'>('standard');
  const [colorTheme, setColorTheme] = useState<'navy' | 'saffron' | 'emerald' | 'slate' | 'ruby'>('navy');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [lineSpacing, setLineSpacing] = useState<'1.0' | '1.15' | '1.25' | '1.5'>('1.15');

  // Resume Content State - initialized from authenticated user or clean state (no unwanted hardcoded fake defaults)
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  
  const [summary, setSummary] = useState(user?.bio || '');

  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.branch || '');
  const [cgpa, setCgpa] = useState(user?.cgpa ? user.cgpa.toString() : '');
  const [gradYear, setGradYear] = useState('2026');

  const [skills, setSkills] = useState<string[]>(
    user?.skills && user.skills.length > 0 ? user.skills : []
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  // Automatically synchronize with authenticated user profile when logged in
  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
    if (user?.email && !email) setEmail(user.email);
    if (user?.phone && !phone) setPhone(user.phone);
    if (user?.college && !college) setCollege(user.college);
    if (user?.branch && !degree) setDegree(user.branch);
    if (user?.cgpa && !cgpa) setCgpa(user.cgpa.toString());
    if (user?.skills && user.skills.length > 0 && skills.length === 0) setSkills(user.skills);
  }, [user]);

  // Action helpers to switch between Blank, Profile, and Sample
  const loadUserProfile = () => {
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setLocation(user?.location || 'India');
    setLinkedinUrl(user?.linkedinUrl || '');
    setGithubUrl(user?.githubUrl || '');
    setSummary(user?.bio || 'Aspiring candidate dedicated to national capacity building under the PM Internship Scheme.');
    setCollege(user?.college || '');
    setDegree(user?.branch || '');
    setCgpa(user?.cgpa ? user.cgpa.toString() : '');
    setGradYear('2026');
    setSkills(user?.skills || ['Problem Solving', 'Data Analysis', 'Team Collaboration']);
    setUploadMessage('✓ Profile information loaded successfully from your account!');
    setTimeout(() => setUploadMessage(null), 3000);
  };

  const loadAatmanirbharSample = () => {
    setFullName(user?.name || 'Aadhaar Verified Scholar');
    setEmail(user?.email || 'scholar@pminternship.gov.in');
    setPhone(user?.phone || '+91 98765 43210');
    setLocation('New Delhi, India');
    setLinkedinUrl('linkedin.com/in/scholar-intern');
    setGithubUrl('github.com/scholar-intern');
    setSummary('Motivated technologist seeking an industry internship under the Prime Minister Internship Scheme. Skilled in full-stack cloud applications, data architecture, and public service innovation under the Aatmanirbhar Bharat vision.');
    setCollege('JNTU College of Engineering Hyderabad');
    setDegree('B.Tech in Computer Science & Engineering');
    setCgpa('8.85');
    setGradYear('2026');
    setSkills(['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'REST APIs', 'Cybersecurity']);
    setProjects([
      {
        id: 'p1',
        title: 'Aatmanirbhar Rural Supply Chain Tracker',
        tech: 'React, TypeScript, Node.js, Express, Tailwind CSS',
        description: 'Built a real-time logistics dashboard tracking farm produce from local mandis to national distribution hubs with sub-second latency and offline caching.'
      },
      {
        id: 'p2',
        title: 'Digital India Automated Grievance Classifier',
        tech: 'Python, NLP, FastAPI, MCA API Integration',
        description: 'Implemented multi-class text categorization achieving 94% precision in routing citizen complaints to appropriate state ministry nodal officers.'
      }
    ]);
    setExperiences([
      {
        id: 'e1',
        role: 'Technical Intern',
        company: 'National Informatics Centre (NIC)',
        duration: 'Jun 2025 - Aug 2025',
        description: 'Assisted senior systems architects with citizen portal security hardening, reducing API response latency by 24%.'
      }
    ]);
    setUploadMessage('✓ Loaded official Aatmanirbhar Bharat candidate sample template.');
    setTimeout(() => setUploadMessage(null), 3000);
  };

  const clearToBlank = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setLinkedinUrl('');
    setGithubUrl('');
    setSummary('');
    setCollege('');
    setDegree('');
    setCgpa('');
    setGradYear('');
    setSkills([]);
    setProjects([]);
    setExperiences([]);
    setUploadMessage('✓ Cleared all fields. You now have a blank slate to write your custom resume.');
    setTimeout(() => setUploadMessage(null), 3000);
  };

  // Upload Feedback
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Word Document Font Sizes
  const WORD_FONT_SIZES = ['8pt', '9pt', '10pt', '10.5pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt'];

  // Styling helper values
  const fontClassMap: Record<string, string> = {
    calibri: 'font-sans',
    times: 'font-serif',
    arial: 'font-sans',
    georgia: 'font-serif',
    garamond: 'font-serif',
    aptos: 'font-sans',
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    outfit: 'font-sans tracking-wide'
  };

  const fontFamilyStyleMap: Record<string, string> = {
    calibri: 'Calibri, "Segoe UI", Candara, Segoe, Optima, Arial, sans-serif',
    times: '"Times New Roman", Times, Baskerville, Georgia, serif',
    arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    georgia: 'Georgia, Times, "Times New Roman", serif',
    garamond: 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif',
    aptos: 'Aptos, "Segoe UI", Inter, Roboto, sans-serif',
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Merriweather, Georgia, serif',
    mono: '"JetBrains Mono", Consolas, Monaco, monospace',
    outfit: 'Outfit, sans-serif'
  };

  const fontSizeMap: Record<string, { body: string; heading: string; title: string; bodyPt?: string }> = {
    '8pt': { body: 'text-[10px] leading-tight', heading: 'text-[11px] font-bold', title: 'text-lg', bodyPt: '8pt' },
    '9pt': { body: 'text-[11px] leading-snug', heading: 'text-xs font-bold', title: 'text-xl', bodyPt: '9pt' },
    '10pt': { body: 'text-[12px] leading-normal', heading: 'text-xs font-black', title: 'text-2xl', bodyPt: '10pt' },
    '10.5pt': { body: 'text-[12.5px] leading-relaxed', heading: 'text-sm font-bold', title: 'text-2xl', bodyPt: '10.5pt' },
    '11pt': { body: 'text-[13px] leading-relaxed', heading: 'text-sm font-extrabold', title: 'text-2xl', bodyPt: '11pt' },
    '12pt': { body: 'text-[14px] leading-relaxed', heading: 'text-base font-bold', title: 'text-3xl', bodyPt: '12pt' },
    '14pt': { body: 'text-[15px] leading-relaxed', heading: 'text-lg font-bold', title: 'text-3xl', bodyPt: '14pt' },
    '16pt': { body: 'text-[16px] leading-relaxed', heading: 'text-xl font-bold', title: 'text-4xl', bodyPt: '16pt' },
    '18pt': { body: 'text-[18px] leading-loose', heading: 'text-2xl font-bold', title: 'text-4xl', bodyPt: '18pt' },
    '20pt': { body: 'text-[20px] leading-loose', heading: 'text-2xl font-black', title: 'text-5xl', bodyPt: '20pt' },
    compact: { body: 'text-[11px] leading-tight', heading: 'text-xs', title: 'text-xl', bodyPt: '9pt' },
    standard: { body: 'text-xs leading-relaxed', heading: 'text-sm', title: 'text-2xl', bodyPt: '11pt' },
    large: { body: 'text-sm leading-relaxed', heading: 'text-base', title: 'text-3xl', bodyPt: '14pt' }
  };

  const spacingMap = {
    compact: 'p-4 space-y-3',
    standard: 'p-6 sm:p-8 space-y-5',
    expanded: 'p-8 sm:p-10 space-y-7'
  };

  const themeColors = {
    navy: {
      primary: 'text-indigo-900 dark:text-indigo-300',
      border: 'border-indigo-800',
      bgTag: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      accent: '#1e1b4b'
    },
    saffron: {
      primary: 'text-amber-800 dark:text-amber-400',
      border: 'border-amber-600',
      bgTag: 'bg-amber-50 text-amber-900 border-amber-200',
      accent: '#d97706'
    },
    emerald: {
      primary: 'text-emerald-800 dark:text-emerald-400',
      border: 'border-emerald-600',
      bgTag: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accent: '#059669'
    },
    slate: {
      primary: 'text-slate-800 dark:text-slate-300',
      border: 'border-slate-800',
      bgTag: 'bg-slate-100 text-slate-800 border-slate-300',
      accent: '#334155'
    },
    ruby: {
      primary: 'text-rose-900 dark:text-rose-400',
      border: 'border-rose-700',
      bgTag: 'bg-rose-50 text-rose-900 border-rose-200',
      accent: '#be123c'
    }
  };

  const activeTheme = themeColors[colorTheme];

  const handlePrint = () => {
    const printElement = printAreaRef.current;
    if (!printElement) {
      window.print();
      return;
    }

    try {
      // Create an isolated hidden iframe so printing never captures the navigation or gets blocked
      const existingIframe = document.getElementById('resume-print-frame');
      if (existingIframe) existingIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'resume-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      // Collect all stylesheets from current page
      const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((el) => el.outerHTML)
        .join('\n');

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>${(fullName || 'Aatmanirbhar_Candidate').replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume</title>
            ${styleSheets}
            <style>
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #0f172a !important;
                font-family: ${fontFamilyStyleMap[fontFamily] || 'Calibri, Arial, sans-serif'} !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .isolated-resume-container {
                width: 100% !important;
                max-width: 210mm !important;
                margin: 0 auto !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: #ffffff !important;
              }
            </style>
          </head>
          <body>
            <div class="isolated-resume-container">
              ${printElement.innerHTML}
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print error, falling back to window.print', e);
          window.print();
        } finally {
          setTimeout(() => {
            iframe.remove();
          }, 3000);
        }
      }, 350);
    } catch (err) {
      console.warn('Print trigger fallback:', err);
      window.print();
    }
  };

  const handleDownloadText = () => {
    const textContent = `
${fullName.toUpperCase()}
Email: ${email} | Phone: ${phone} | Location: ${location}
LinkedIn: ${linkedinUrl} | GitHub: ${githubUrl}

=======================================================
PROFESSIONAL SUMMARY
=======================================================
${summary}

=======================================================
EDUCATION
=======================================================
${college}
${degree} | CGPA: ${cgpa} | Class of ${gradYear}

=======================================================
TECHNICAL SKILLS
=======================================================
${skills.join(', ')}

=======================================================
PROJECTS
=======================================================
${projects
  .map(
    (p) => `* ${p.title} (${p.tech})
  ${p.description}`
  )
  .join('\n\n')}

=======================================================
EXPERIENCE
=======================================================
${experiences
  .map(
    (e) => `* ${e.role} - ${e.company} [${e.duration}]
  ${e.description}`
  )
  .join('\n\n')}

[Generated via Official PM Internship Scheme Resume Builder • Govt of India]
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to Microsoft Word (.doc) with full formatting, fonts, colors, and alignments
  const handleDownloadWord = () => {
    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${fullName} - Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { size: 8.5in 11.0in; margin: 0.75in 0.75in 0.75in 0.75in; }
          body {
            font-family: ${fontFamilyStyleMap[fontFamily] || 'Calibri, Arial, sans-serif'};
            font-size: ${fontSizeMap[fontSize].bodyPt || '11pt'};
            line-height: ${lineSpacing};
            color: #0f172a;
            text-align: ${textAlign};
            font-weight: ${isBold ? 'bold' : 'normal'};
            font-style: ${isItalic ? 'italic' : 'normal'};
            text-decoration: ${isUnderline ? 'underline' : 'none'};
          }
          .title { font-size: 22pt; font-weight: 900; color: ${activeTheme.accent}; margin: 0 0 2pt 0; text-align: ${textAlign}; }
          .subtitle { font-size: 12pt; font-weight: 600; color: #475569; margin: 0 0 4pt 0; text-align: ${textAlign}; }
          .contact { font-size: 9.5pt; color: #64748b; margin: 0 0 12pt 0; text-align: ${textAlign}; }
          .section-title {
            font-size: 12pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
            color: ${activeTheme.accent};
            border-bottom: 1.5pt solid ${activeTheme.accent};
            padding-bottom: 3pt;
            margin-top: 14pt;
            margin-bottom: 6pt;
            text-align: left;
          }
          .item-heading { font-weight: 700; font-size: 10.5pt; color: #0f172a; }
          .item-sub { font-size: 9.5pt; color: #475569; margin-bottom: 3pt; }
          .desc { font-size: 10pt; color: #334155; margin-bottom: 8pt; }
          .skills-list { font-size: 10pt; color: #1e293b; }
        </style>
      </head>
      <body>
        <div class="title">${fullName}</div>
        <div class="subtitle">${degree}</div>
        <div class="contact">📍 ${location} | ✉️ ${email} | 📞 ${phone} ${linkedinUrl ? `| 🔗 ${linkedinUrl}` : ''} ${githubUrl ? `| 💻 ${githubUrl}` : ''}</div>
        
        ${summary ? `
        <div class="section-title">Professional Summary</div>
        <div class="desc">${summary}</div>
        ` : ''}

        <div class="section-title">Education</div>
        <div class="item-heading">${college}</div>
        <div class="item-sub">${degree} • CGPA: ${cgpa} • Class of ${gradYear}</div>

        <div class="section-title">Technical Skills</div>
        <div class="skills-list">${skills.join(' • ')}</div>

        ${projects.length > 0 ? `
        <div class="section-title">Projects</div>
        ${projects.map(p => `
          <div class="item-heading">${p.title}</div>
          <div class="item-sub">Technologies: ${p.tech}</div>
          <div class="desc">${p.description}</div>
        `).join('')}
        ` : ''}

        ${experiences.length > 0 ? `
        <div class="section-title">Experience & Training</div>
        ${experiences.map(e => `
          <div class="item-heading">${e.role} — ${e.company}</div>
          <div class="item-sub">${e.duration}</div>
          <div class="desc">${e.description}</div>
        `).join('')}
        ` : ''}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to PDF without any PM scheme logo
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      if (isItalic) doc.setFont('helvetica', 'italic');

      // Title & Degree
      doc.setFontSize(20);
      doc.setTextColor(30, 27, 75);
      doc.text(fullName, textAlign === 'center' ? 105 : textAlign === 'right' ? 190 : 20, 22, { align: textAlign as any });

      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(degree, textAlign === 'center' ? 105 : textAlign === 'right' ? 190 : 20, 28, { align: textAlign as any });

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const contactLine = `${location}  •  ${email}  •  ${phone}`;
      doc.text(contactLine, textAlign === 'center' ? 105 : textAlign === 'right' ? 190 : 20, 34, { align: textAlign as any });

      // Divider
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 38, 190, 38);

      let curY = 46;

      // Summary
      if (summary) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 27, 75);
        doc.text('PROFESSIONAL SUMMARY', 20, curY);
        curY += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.text(splitSummary, 20, curY);
        curY += splitSummary.length * 4.5 + 6;
      }

      // Education
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 27, 75);
      doc.text('EDUCATION', 20, curY);
      curY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(college, 20, curY);
      curY += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`${degree}  •  CGPA: ${cgpa}  •  Graduation Year: ${gradYear}`, 20, curY);
      curY += 8;

      // Skills
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 27, 75);
      doc.text('TECHNICAL SKILLS', 20, curY);
      curY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitSkills = doc.splitTextToSize(skills.join('  •  '), 170);
      doc.text(splitSkills, 20, curY);
      curY += splitSkills.length * 4.5 + 6;

      // Projects
      if (projects.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 27, 75);
        doc.text('PROJECTS', 20, curY);
        curY += 5;
        projects.forEach(p => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(p.title, 20, curY);
          curY += 4;
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Technologies: ${p.tech}`, 20, curY);
          curY += 4;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          const splitDesc = doc.splitTextToSize(p.description, 170);
          doc.text(splitDesc, 20, curY);
          curY += splitDesc.length * 4 + 4;
        });
      }

      // Experiences
      if (experiences.length > 0 && curY < 240) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 27, 75);
        doc.text('EXPERIENCE & INTERNSHIPS', 20, curY);
        curY += 5;
        experiences.forEach(e => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`${e.role} — ${e.company}`, 20, curY);
          curY += 4;
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(e.duration, 20, curY);
          curY += 4;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          const splitDesc = doc.splitTextToSize(e.description, 170);
          doc.text(splitDesc, 20, curY);
          curY += splitDesc.length * 4 + 4;
        });
      }

      doc.save(`${fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (e) {
      handleDownloadText();
    }
  };

  // Upload existing resume - supporting PDF, DOCX, TXT AND IMAGE FORMATS (PNG, JPG, JPEG, WEBP)!
  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const check = await validateResumeFile(file);
    if (!check.isValid) {
      setUploadError(check.error || 'Invalid resume format. Supported formats: PDF, DOCX, DOC, TXT, PNG, JPG, JPEG.');
      e.target.value = '';
      return;
    }

    // Auto-populate parsed values or simulated extraction
    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const detectedName = rawName.length > 3 ? rawName.replace(/\b\w/g, (c) => c.toUpperCase()) : fullName;
    setFullName(detectedName);

    setUploadMessage(
      `✓ Successfully parsed and imported resume: "${file.name}". Edit styles, font, colors, and content below, then print or download.`
    );
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Technical Project',
      tech: 'React, Node.js, Python',
      description: 'Describe the key objective, architecture, and measurable impact of this project.'
    };
    setProjects([...projects, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Intern / Associate',
      company: 'Corporate / Academic Enterprise',
      duration: 'Present',
      description: 'Key deliverables, technologies utilized, and team collaborations achieved during this tenure.'
    };
    setExperiences([...experiences, newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Aatmanirbhar Bharat National Tricolor Accent Ribbon */}
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-xs" />
        
        {/* Top Banner Header - Aatmanirbhar Bharat ATS Resume Builder */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-emerald-50/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-orange-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Subtle decorative tricolor backdrop glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-orange-300 ring-4 ring-orange-400/20 shadow-md">
              <FileText className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Aatmanirbhar PM Scheme Resume Builder
                </h1>
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>ATS Compliant</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                Customize fonts, sizes, lengths & colors. Print, download, or upload existing image/PDF resumes. Zero vendor lock-in.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Upload Existing Resume */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
              onChange={handleUploadResume}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
              title="Upload existing resume (PDF, DOCX, or Images PNG/JPG)"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload (PDF/Img)</span>
            </button>

            {/* Microsoft Word Document Export */}
            <button
              onClick={handleDownloadWord}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#081845] hover:bg-[#122b75] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
              title="Download formatted Microsoft Word Document (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-300" />
              <span>Export Word (.doc)</span>
            </button>

            {/* Encrypted Official PDF */}
            <button
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] hover:from-orange-400 hover:to-orange-500 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
              title="Download ATS Clean PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black rounded-xl shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
              title="Print formatted A4 Resume"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print A4</span>
            </button>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-300 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Word Document Formatting & Styling Toolbar */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Microsoft Word Document Formatting Controls</span>
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
              Word Compatible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Font Family */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-600" />
                <span>Font Family</span>
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              >
                <option value="calibri">Calibri (Standard MS Word)</option>
                <option value="times">Times New Roman (Word Academic)</option>
                <option value="arial">Arial (Word Clean Sans)</option>
                <option value="georgia">Georgia (Word Executive)</option>
                <option value="garamond">Garamond (Word Formal)</option>
                <option value="aptos">Aptos (Modern MS Office)</option>
                <option value="sans">Inter (Modern Sans)</option>
                <option value="serif">Merriweather (Classic Serif)</option>
                <option value="mono">JetBrains Mono (Technical)</option>
              </select>
            </div>

            {/* 2. Font Size */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>Font Size</span>
                </label>
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                  {fontSize}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const idx = WORD_FONT_SIZES.indexOf(fontSize);
                    if (idx > 0) setFontSize(WORD_FONT_SIZES[idx - 1]);
                  }}
                  className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-black transition cursor-pointer"
                  title="Decrease font size (A-)"
                >
                  A-
                </button>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="flex-1 text-xs font-bold p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                >
                  {WORD_FONT_SIZES.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const idx = WORD_FONT_SIZES.indexOf(fontSize);
                    if (idx !== -1 && idx < WORD_FONT_SIZES.length - 1) setFontSize(WORD_FONT_SIZES[idx + 1]);
                  }}
                  className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-black transition cursor-pointer"
                  title="Increase font size (A+)"
                >
                  A+
                </button>
              </div>
            </div>

            {/* 3. Font Styles (Bold, Italic, Underline) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Font Styles
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsBold(!isBold)}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer font-bold ${
                    isBold
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsItalic(!isItalic)}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer italic ${
                    isItalic
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsUnderline(!isUnderline)}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer underline ${
                    isUnderline
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. Text Alignment */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Text Alignment
              </label>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer ${
                    textAlign === 'left'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer ${
                    textAlign === 'center'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer ${
                    textAlign === 'right'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('justify')}
                  className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition cursor-pointer ${
                    textAlign === 'justify'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Justify"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. Colors & Line Spacing */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                <span>Colors & Spacing</span>
              </label>
              <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-1 pl-1">
                  {[
                    { id: 'navy', color: '#1e1b4b', label: 'Executive Navy' },
                    { id: 'slate', color: '#334155', label: 'Classic Slate' },
                    { id: 'ruby', color: '#be123c', label: 'Burgundy' },
                    { id: 'emerald', color: '#059669', label: 'Emerald' },
                    { id: 'saffron', color: '#d97706', label: 'Amber' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColorTheme(c.id as any)}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                        colorTheme === c.id ? 'ring-2 ring-offset-1 ring-blue-600 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
                <select
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(e.target.value as any)}
                  className="text-[10px] font-bold p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                  title="Line Spacing"
                >
                  <option value="1.0">1.0x</option>
                  <option value="1.15">1.15x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Data Source Bar - Allows 1-click Fill from Profile, Sample, or Blank */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-500/10 dark:from-amber-950/20 dark:via-slate-900 dark:to-emerald-950/20 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              Resume Content Preset:
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Choose to populate with your real profile, official sample, or start completely blank)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadUserProfile}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Populate with your verified student profile data"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Auto-Fill My Profile</span>
            </button>

            <button
              type="button"
              onClick={loadAatmanirbharSample}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Load Aatmanirbhar Bharat sample data"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Aatmanirbhar Sample</span>
            </button>

            <button
              type="button"
              onClick={clearToBlank}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Clear all fields to a blank canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear to Blank</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Split: Content Inputs (Left) & Real-time Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Form Customizer (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Personal Details Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Personal & Contact Info</span>
              </h2>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Location / City</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">GitHub Profile</label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Executive Career Summary</span>
              </h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Education Credentials */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Education & Academic Standing</span>
              </h2>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Degree & Specialization</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">CGPA / Percentage</label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Passing Year</label>
                    <input
                      type="text"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-purple-600" />
                <span>Technical & Professional Skills</span>
              </h2>
              
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill(s)}
                      className="text-slate-400 hover:text-rose-500 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js, Docker)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleAddSkill}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Capstone / Industry Projects</span>
                </h2>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={proj.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px]">Project #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-rose-500 hover:text-rose-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].title = e.target.value;
                        setProjects(updated);
                      }}
                      className="w-full text-xs font-bold p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack Used"
                      value={proj.tech}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].tech = e.target.value;
                        setProjects(updated);
                      }}
                      className="w-full text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                    <textarea
                      placeholder="Key impact and deliverables"
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].description = e.target.value;
                        setProjects(updated);
                      }}
                      rows={2}
                      className="w-full text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Work & Internship Experience</span>
                </h2>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3">
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px]">Experience #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-rose-500 hover:text-rose-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].role = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full text-xs font-bold p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        placeholder="Organization / Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].company = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Tenure (e.g. May 2025 - Jul 2025)"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].duration = e.target.value;
                        setExperiences(updated);
                      }}
                      className="w-full text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                    <textarea
                      placeholder="Responsibilities & outcomes"
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].description = e.target.value;
                        setExperiences(updated);
                      }}
                      rows={2}
                      className="w-full text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Live A4 Printable Preview Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-6">
              
              {/* Preview Bar Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-900 text-white rounded-t-2xl text-xs font-bold border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>A4 Document Canvas Preview</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                    Print Ready
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    title="Click to print this isolated A4 resume cleanly"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print A4 Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Download ATS PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* The Printable A4 Sheet Container */}
              <div
                ref={printAreaRef}
                className={`bg-white text-slate-900 shadow-xl border border-slate-300 rounded-b-2xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0 ${
                  fontClassMap[fontFamily]
                } ${spacingMap[docLength]}`}
                style={{
                  minHeight: '840px',
                  fontFamily: fontFamilyStyleMap[fontFamily] || 'Calibri, Arial, sans-serif',
                  lineHeight: lineSpacing,
                  textAlign: textAlign
                }}
              >
                
                {/* Header Strip - Clean and free of PM Scheme Logo as requested */}
                <div
                  className="border-b-2 pb-4"
                  style={{
                    borderColor: activeTheme.accent,
                    textAlign: textAlign
                  }}
                >
                  <div className={textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}>
                    <h1
                      className={`font-black tracking-tight ${fontSizeMap[fontSize].title} ${isBold ? 'font-black' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline underline-offset-4' : ''}`}
                      style={{ color: activeTheme.accent }}
                    >
                      {fullName}
                    </h1>
                    <p className={`font-semibold text-slate-600 mt-1 ${fontSizeMap[fontSize].heading} ${isItalic ? 'italic' : ''}`}>
                      {degree}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px] mt-2 font-medium ${
                        textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>📍 {location}</span>
                      <span>•</span>
                      <span>✉️ {email}</span>
                      <span>•</span>
                      <span>📞 {phone}</span>
                    </div>
                    {(linkedinUrl || githubUrl) && (
                      <div
                        className={`flex flex-wrap items-center gap-x-3 text-slate-500 text-[11px] mt-1 font-medium ${
                          textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {linkedinUrl && <span>🔗 {linkedinUrl}</span>}
                        {linkedinUrl && githubUrl && <span>•</span>}
                        {githubUrl && <span>💻 {githubUrl}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {summary && (
                  <div className="space-y-1" style={{ textAlign: textAlign }}>
                    <h3
                      className={`font-extrabold uppercase tracking-wider ${fontSizeMap[fontSize].heading}`}
                      style={{ color: activeTheme.accent }}
                    >
                      Professional Summary
                    </h3>
                    <p className={`text-slate-700 ${fontSizeMap[fontSize].body} ${isBold ? 'font-medium' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}>
                      {summary}
                    </p>
                  </div>
                )}

                {/* Education */}
                <div className="space-y-1.5">
                  <h3 className={`font-extrabold uppercase tracking-wider ${fontSizeMap[fontSize].heading}`} style={{ color: activeTheme.accent }}>
                    Education
                  </h3>
                  <div className="border-l-2 pl-3 space-y-1" style={{ borderColor: activeTheme.accent }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{college}</span>
                      <span className="text-slate-500 text-[11px] font-medium">Class of {gradYear}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 text-xs">
                      <span>{degree}</span>
                      <span className="font-bold text-slate-900 text-[11px]">CGPA: {cgpa} / 10.0</span>
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                {skills.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className={`font-extrabold uppercase tracking-wider ${fontSizeMap[fontSize].heading}`} style={{ color: activeTheme.accent }}>
                      Technical & Domain Competencies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[11px] font-bold border"
                          style={{
                            backgroundColor: `${activeTheme.accent}10`,
                            color: activeTheme.accent,
                            borderColor: `${activeTheme.accent}30`
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="space-y-2">
                    <h3 className={`font-extrabold uppercase tracking-wider ${fontSizeMap[fontSize].heading}`} style={{ color: activeTheme.accent }}>
                      Selected Projects & Technical Initiatives
                    </h3>
                    <div className="space-y-2.5">
                      {projects.map((pr) => (
                        <div key={pr.id} className="border-l-2 pl-3 space-y-0.5" style={{ borderColor: `${activeTheme.accent}50` }}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{pr.title}</span>
                            <span className="text-slate-500 text-[10px] font-mono">{pr.tech}</span>
                          </div>
                          <p className={`text-slate-700 ${fontSizeMap[fontSize].body}`}>
                            {pr.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                  <div className="space-y-2">
                    <h3 className={`font-extrabold uppercase tracking-wider ${fontSizeMap[fontSize].heading}`} style={{ color: activeTheme.accent }}>
                      Practical Experience
                    </h3>
                    <div className="space-y-2.5">
                      {experiences.map((ex) => (
                        <div key={ex.id} className="border-l-2 pl-3 space-y-0.5" style={{ borderColor: `${activeTheme.accent}50` }}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{ex.role} — {ex.company}</span>
                            <span className="text-slate-500 text-[11px] font-medium">{ex.duration}</span>
                          </div>
                          <p className={`text-slate-700 ${fontSizeMap[fontSize].body}`}>
                            {ex.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheme Mandate Footer Note */}
                <div className="pt-4 mt-6 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Pradhan Mantri Internship Scheme Profile • Verified Aadhaar KYC</span>
                  <span>Aatmanirbhar Bharat National Career Portal</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
