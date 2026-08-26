/**
 * Strict Resume Document Validator
 * Ensures ONLY authentic candidate resumes / CVs of a real individual person are accepted across PDF, DOCX, DOC, and TXT files.
 * Strictly rejects all non-resume documents (government forms, Form 8, bills, invoices,
 * question papers, hall tickets, admit cards, job postings, syllabi, game sheets, tickets, essays, etc.)
 * 
 * CRITICAL RULE: A file is NEVER considered a valid resume solely because it contains the word "RESUME" or "CV".
 * It must possess genuine candidate resume structural pillars:
 * 1. Authentic Candidate Contact Details (Real Email or Phone or Profile Link)
 * 2. Authentic Educational Background (Real Degree/Qualification + Institution or CGPA/Score)
 * 3. Authentic Technical/Domain Skills or Structured Projects / Work Experience.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
  isBinaryStream?: boolean;
}

interface FilenameRule {
  type: string;
  regex: RegExp;
}

// Explicit indicators of non-resume files by filename
export const NON_RESUME_FILENAME_RULES: FilenameRule[] = [
  {
    type: 'official government form / electoral preview',
    regex: /\b(form\s*[-_]?\s*(?:8|16|26as|26|a|b|c|d|1|2|3|4|5|6|7|9|10|12bb|preview)?|form8|form16|form26as|form8_preview|form_preview|voter\s*id\s*form|electoral\s*roll|electoral\s*form|itr\s*form|income\s*tax\s*return|passport\s*application|visa\s*application|affidavit|gazette)\b/i
  },
  {
    type: 'project contest / hackathon problem statement / competition brief',
    regex: /\b(project\s*contest|contest|problem\s*statement|problemstatement|hackathon\s*brief|hackathon|contest\s*rubric|challenge\s*brief|competition\s*rule|competition|case\s*study\s*brief)\b/i
  },
  {
    type: 'archive or data dump',
    regex: /\b(archive|backup|dump|zip|tar|gz)\b/i
  },
  {
    type: 'academic assignment / question paper / lab manual',
    regex: /\b(lab\s*manual|lab\s*record|question\s*paper|exam\s*paper|quiz\s*paper|midterm\s*paper|test\s*paper|answer\s*key|tutorial\s*sheet|experiment\s*sheet|worksheet|assignment\s*[-_]?\d*)\b/i
  },
  {
    type: 'marksheet / exam hall ticket / admit card',
    regex: /\b(marksheet|mark\s*sheet|transcript\s*scan|hall\s*ticket|admit\s*card|rank\s*card|semester\s*result|score\s*card|grade\s*card|tabulation\s*sheet)\b/i
  },
  {
    type: 'standalone certificate document',
    regex: /\b(completion\s*certificate|participation\s*certificate|internship\s*certificate|appreciation\s*certificate|course\s*certificate|training\s*certificate|bonafide\s*certificate|letter\s*of\s*recommendation|\blor\b|^certificate\b)/i
  },
  {
    type: 'financial bill / payment receipt / payslip / bank record',
    regex: /\b(fee\s*receipt|tax\s*invoice|payment\s*receipt|salary\s*slip|payslip|electricity\s*bill|utility\s*bill|bank\s*statement|passbook\s*copy|\binvoice\b|\breceipt\b|\bbill\b|\bchallan\b|balance\s*sheet|voucher)\b/i
  },
  {
    type: 'government identity card document',
    regex: /\b(aadhaar|aadhar|pan\s*card|voter\s*id\s*card|passport\s*copy|driving\s*licen[cs]e|ration\s*card|\bid\s*card\b|identity\s*card|student\s*id)\b/i
  },
  {
    type: 'recreational sheet / ticket / travel document',
    regex: /\b(tambola|housie|sudoku|crossword|flight\s*ticket|train\s*ticket|bus\s*ticket|boarding\s*pass|itinerary|menu|recipe)\b/i
  },
  {
    type: 'course syllabus / curriculum structure',
    regex: /\b(syllabus|course\s*structure|curriculum\s*structure|academic\s*calendar|lecture\s*schedule)\b/i
  },
  {
    type: 'job description / hiring opening',
    regex: /\b(job\s*description|job\s*posting|job\s*opening|job\s*vacancy|hiring\s*opening)\b/i
  },
  {
    type: 'general article / essay / presentation',
    regex: /\b(essay|story|novel|poem|lyrics|presentation|ppt|pptx|slide\s*deck|readme|changelog|dockerfile)\b/i
  }
];

/**
 * Validates a file by name, extension, and content to guarantee it is solely a Resume / CV document.
 */
export async function validateResumeFile(file: File): Promise<ValidationResult> {
  const rawFileName = file.name || '';
  const lowerName = rawFileName.toLowerCase().trim();

  // 1. Validate File Extension (Strictly PDF, DOCX, DOC, TXT only)
  const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

  if (!hasValidExt) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. Only PDF, DOCX, DOC, and TXT resume files are supported. Image files, spreadsheets, and other formats are strictly rejected.'
    };
  }

  // 2. Extract base file name (without extension) for checking against non-resume filename indicators
  const baseName = lowerName.replace(/\.[a-zA-Z0-9]+$/, '').trim();

  // Check filename against explicit non-resume rules
  for (const rule of NON_RESUME_FILENAME_RULES) {
    if (rule.regex.test(baseName) || rule.regex.test(lowerName)) {
      return {
        isValid: false,
        detectedType: rule.type,
        error: `Upload the correct file document [only resume]. The selected file "${rawFileName}" is a ${rule.type}, not a candidate resume/CV. Only candidate resumes containing Education, Skills, and Projects/Experience are accepted.`
      };
    }
  }

  // 3. File Size Limits (minimum 50 bytes, maximum 30MB)
  if (file.size < 50) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The selected file is empty or too small to be a candidate resume.'
    };
  }

  if (file.size > 30 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'Resume file size exceeds 30MB limit. Please upload a standard PDF, DOCX, or TXT resume document.'
    };
  }

  return { isValid: true };
}

/**
 * Checks if a string is raw uncompressed PDF header/binary stream metadata
 */
export function isRawBinaryStream(text: string): boolean {
  if (!text) return false;
  if (
    text.includes('%PDF-') ||
    text.includes('/Filter /FlateDecode') ||
    text.includes('/Type /Catalog') ||
    text.includes('/Type /Pages') ||
    text.includes('<< /Length') ||
    text.startsWith('PK\x03\x04') ||
    text.includes('word/document.xml')
  ) {
    return true;
  }
  return false;
}

/**
 * Inspects raw or extracted text content for essential candidate resume sections
 * and strictly rejects non-resume documents (forms, bills, question papers, tickets, essays, job postings, etc.)
 * 
 * IMPORTANT: Seeing the word "RESUME" or "CV" alone does NOT make a document a valid resume!
 */
export function validateResumeText(text: string, fileName?: string): ValidationResult {
  if (!text || text.trim().length < 60) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The document is empty or too short to contain authentic candidate resume details.'
    };
  }

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Strict Negative Check for Unambiguous Non-Resume Document Types
  const isGovtForm = /(election\s*commission\s*of\s*india|electoral\s*registration\s*officer|epic\s*no\b|assembly\s*constituency\s*no|form\s*[-_]?\s*8\b|form\s*[-_]?\s*16\b|form\s*[-_]?\s*26as\b|income\s*tax\s*department\s*government|assessment\s*year\s*20\d\d|part\s*no\s*and\s*serial\s*no)/i.test(lower);
  const isExamQuestionPaper = /(maximum\s*marks\s*:\s*\d+|time\s*allowed\s*:\s*\d+\s*(?:hours|hrs|mins)|answer\s*all\s*questions|answer\s*any\s*(?:three|four|five|\d+)\s*questions|section\s*[-–]\s*[a-d]\s*[:(]|invigilator\s*signature|question\s*paper\s*code|roll\s*no\s*:\s*_{3,}|end\s*semester\s*examination|mid\s*semester\s*examination)/i.test(lower);
  const isInvoiceBill = /(tax\s*invoice|bill\s*to\s*:|ship\s*to\s*:|invoice\s*number\s*:|gstin\s*:|total\s*amount\s*due|electricity\s*bill\s*account|payment\s*receipt\s*no|challan\s*no|amount\s*in\s*words\s*:|subtotal\s*:)/i.test(lower);
  const isAdmitCard = /(hall\s*ticket\s*number|admit\s*card\s*for|examination\s*centre\s*code|roll\s*number\s*:\s*_{3,}|candidate\s*signature\s*in\s*presence\s*of\s*invigilator)/i.test(lower);
  const isTravelTicket = /(boarding\s*pass|pnr\s*no\b|train\s*no\s*:|flight\s*no\s*:|seat\s*\/item\s*no|ticket\s*fare\s*:|departure\s*time\s*:|arrival\s*time\s*:)/i.test(lower);
  const isJobPosting = /(we\s*are\s*hiring|job\s*opening\b|job\s*requirements?\b|roles?\s*and\s*responsibilities\s*for\s*the\s*role|company\s*profile\s*:|how\s*to\s*apply\s*:|send\s*(?:your)?\s*resume\s*to\s*:|submit\s*(?:your)?\s*(?:resume|application)\s*to\s*:|hiring\s*for\s*the\s*role|years\s*of\s*experience\s*required|eligibility\s*criteria\s*for\s*application|ctc\s*:\s*[\d.]+|salary\s*range\s*:|perks\s*and\s*benefits\s*:)/i.test(lower);
  const isSyllabus = /(prescribed\s*textbooks|reference\s*books|curriculum\s*structure|academic\s*calendar|lecture\s*schedule|subject\s*code\s*[:\n]|department\s*syllabus|unit\s*[-–—:]\s*[i|v|x|\d]+\s*[:\n]|course\s*objectives\s*[:\n]|course\s*outcomes\s*\(co\))/i.test(lower);
  const isLabManual = /(experiment\s*no\s*:\s*\d+|apparatus\s*required|procedure\s*and\s*precautions|viva\s*voce\s*questions|laboratory\s*manual)/i.test(lower);

  if (isGovtForm) {
    return {
      isValid: false,
      detectedType: 'official government form',
      error: 'Upload the correct file document [only resume]. The uploaded file contains an official government form, not a candidate resume/CV.'
    };
  }

  if (isExamQuestionPaper) {
    return {
      isValid: false,
      detectedType: 'examination question paper',
      error: 'Upload the correct file document [only resume]. The uploaded file contains an examination question paper, not a candidate resume/CV.'
    };
  }

  if (isInvoiceBill) {
    return {
      isValid: false,
      detectedType: 'financial bill / tax invoice',
      error: 'Upload the correct file document [only resume]. The uploaded file contains a financial invoice or payment receipt, not a candidate resume/CV.'
    };
  }

  if (isAdmitCard) {
    return {
      isValid: false,
      detectedType: 'exam admit card / hall ticket',
      error: 'Upload the correct file document [only resume]. The uploaded file is an exam admit card or hall ticket, not a candidate resume/CV.'
    };
  }

  if (isTravelTicket) {
    return {
      isValid: false,
      detectedType: 'travel ticket / boarding pass',
      error: 'Upload the correct file document [only resume]. The uploaded file is a travel ticket or boarding pass, not a candidate resume/CV.'
    };
  }

  if (isJobPosting) {
    return {
      isValid: false,
      detectedType: 'job vacancy posting / recruitment description',
      error: 'Upload the correct file document [only resume]. The uploaded file is a job description / hiring notice, not an individual candidate resume/CV.'
    };
  }

  if (isSyllabus) {
    return {
      isValid: false,
      detectedType: 'course syllabus / academic curriculum',
      error: 'Upload the correct file document [only resume]. The uploaded file is an academic syllabus or curriculum document, not a candidate resume/CV.'
    };
  }

  if (isLabManual) {
    return {
      isValid: false,
      detectedType: 'lab manual / experiment record',
      error: 'Upload the correct file document [only resume]. The uploaded file is a lab manual or experiment record, not a candidate resume/CV.'
    };
  }

  // 2. Candidate Contact Verification: MUST have actual contact details (Email, Phone, or Profile Link)
  // (Note: The word "email" or "phone" alone is NOT enough - must have an actual valid pattern)
  const hasActualEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cleanText);
  const hasActualPhone = /(?:\+?\d{1,3}[-.\s]?)?(?:\d{10}|\d{5}\s*\d{5})/.test(cleanText);
  const hasActualProfileLink = /(?:linkedin\.com\/(?:in|pub)\/|github\.com\/[a-zA-Z0-9_-]+|leetcode\.com\/|hackerrank\.com\/|codechef\.com\/|gitlab\.com\/)/i.test(cleanText);
  const hasContactInfo = hasActualEmail || hasActualPhone || hasActualProfileLink;

  // 3. Candidate Education Verification: MUST have an actual degree/program AND institution or metric
  // (NOTE: The word "resume", "student", or "cv" is EXCLUDED from degrees!)
  const hasSpecificDegree = /\b(b\.?tech|b\.?e\b|b\.?sc|bca\b|mca\b|m\.?tech|b\.?com|bba\b|diploma|intermediate|matriculation|secondary\s*school|higher\s*secondary|10th\s*class|12th\s*class|hsc\b|ssc\b|bachelor\s*of|master\s*of|b\.?a\b|m\.?a\b|b\.?pharm|m\.?pharm|b\.?arch|m\.?arch|ph\.?d|b\.?des|undergraduate|postgraduate)\b/i.test(lower);
  const hasEduInstitution = /\b(college|university|institute|school|academy|iit\b|nit\b|iiit\b|bits\b|polytechnic|campus|board\s*of\s*intermediate|state\s*board|cbse|icse)\b/i.test(lower);
  const hasEduMetrics = /\b(cgpa|sgpa|gpa|percentage|marks|passed\s*out|passout|batch\s*(?:of\s*)?20\d\d|academic\s*qualifications?|education\s*details)\b/i.test(lower);

  const hasEducation = (hasSpecificDegree && (hasEduInstitution || hasEduMetrics)) || 
                       (hasEduInstitution && hasEduMetrics) ||
                       (hasSpecificDegree && /\b(education|academics|academic\s*background)\b/i.test(lower));

  // 4. Candidate Technical Skills Verification
  // Must match authentic technical skills or domain competencies
  const knownSkillTokens = [
    'python', 'java', 'c++', 'c#', 'sql', 'mysql', 'postgresql', 'mongodb', 'javascript', 'typescript',
    'react', 'angular', 'vue', 'node', 'express', 'html', 'css', 'data structures', 'algorithms',
    'machine learning', 'artificial intelligence', 'data science', 'deep learning', 'pandas', 'numpy',
    'scikit', 'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'linux',
    'tableau', 'power bi', 'excel', 'flask', 'django', 'fastapi', 'spring', 'figma', 'problem solving',
    'cyber security', 'devops', 'nlp', 'computer vision', 'r programming', 'matlab', 'android',
    'flutter', 'kotlin', 'swift', 'c programming', 'powerpoint', 'communication skills'
  ];
  const matchedSkillCount = knownSkillTokens.filter((s) => {
    if (s === 'c++') return lower.includes('c++') || lower.includes('cpp');
    if (s === 'c') return /\bc programming\b/i.test(lower);
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(lower);
  }).length;

  const hasExplicitSkillSection = /\b(technical\s*skills|core\s*competencies|programming\s*languages|key\s*skills|areas\s*of\s*expertise|tools\s*&?\s*technologies)\b/i.test(lower);
  const hasTechnicalSkills = (hasExplicitSkillSection && matchedSkillCount >= 1) || matchedSkillCount >= 2;

  // 5. Candidate Projects or Experience Verification
  const hasProjectsOrExperience = /\b(academic\s*projects?|mini\s*project|major\s*project|capstone\s*project|work\s*experience|professional\s*experience|internship\s*experience|employment\s*history|work\s*history|responsibilities\s*:|key\s*achievements\s*:|career\s*objective|professional\s*summary)\b/i.test(lower) ||
                                 (/\bprojects\b/i.test(lower) && matchedSkillCount >= 1);

  // STRICT VALIDATION ENFORCEMENT:
  // A candidate resume MUST have at least:
  // (1) Authentic contact info (Email, Phone, or Profile Link) AND
  // (2) Authentic Education (Degree + College / CGPA) AND
  // (3) Authentic Technical Skills OR Projects/Experience.
  //
  // A document that only has the word "RESUME" or generic text without these pillars is REJECTED.

  if (!hasContactInfo) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The uploaded file does not contain candidate contact information (Valid Email, Phone Number, or LinkedIn/GitHub profile).'
    };
  }

  if (!hasEducation) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The uploaded file does not contain authentic candidate education details (Degree, College/University, or Academic CGPA/Scores).'
    };
  }

  if (!hasTechnicalSkills && !hasProjectsOrExperience) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The uploaded file does not contain candidate Technical Skills, Projects, or Work Experience.'
    };
  }

  return { isValid: true };
}
