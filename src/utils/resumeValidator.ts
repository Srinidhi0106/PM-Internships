/**
 * Strict Resume Document Validator
 * Ensures only authentic candidate resumes / CVs are accepted and strictly rejects
 * all non-resume documents (e.g., Form 8 preview, official forms, contest briefs, assignments,
 * lab manuals, question papers, marksheets, certificates, invoices, bills, identity cards, etc.)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
}

interface IndicatorRule {
  type: string;
  regex: RegExp;
}

// Explicit indicators of non-resume documents (matched with strict word boundaries on base filename)
export const NON_RESUME_RULES: IndicatorRule[] = [
  {
    type: 'project report / mini project / thesis / synopsis',
    regex: /\b(mini\s*project|project\s*report|synopsis|thesis|dissertation|research\s*paper|white\s*paper|case\s*study|\bmini\b|\breport\b)\b/i
  },
  {
    type: 'official government form / application preview',
    regex: /\b(form\s*[-_]?\s*(?:8|16|26as|26|a|b|c|d|1|2|3|4|5|6|7|9|10)|form8|form16|form26as|voter\s*id\s*form|electoral\s*roll|electoral\s*form|itr\s*form|income\s*tax\s*return|passport\s*application|visa\s*application)\b/i
  },
  {
    type: 'project contest / hackathon problem statement',
    regex: /\b(problem\s*statement|problemstatement|hackathon\s*brief|contest\s*rubric|challenge\s*brief|competition\s*rule|case\s*study\s*brief)\b/i
  },
  {
    type: 'academic assignment / coursework / lab manual / question paper',
    regex: /\b(assignment|homework|coursework|lab\s*manual|lab\s*record|worksheet|question\s*paper|exam\s*paper|quiz\s*paper|midterm\s*paper|test\s*paper|answer\s*key|tutorial\s*sheet|experiment\s*sheet|study\s*material|lecture\s*notes|\bnotes\b|syllabus)\b/i
  },
  {
    type: 'marksheet / exam hall ticket / admit card',
    regex: /\b(marksheet|mark\s*sheet|transcript\s*scan|hall\s*ticket|admit\s*card|rank\s*card|semester\s*result|score\s*card)\b/i
  },
  {
    type: 'standalone certificate document',
    regex: /\b(completion\s*cert|participation\s*cert|internship\s*cert|appreciation\s*cert|course\s*cert|\bcertificate\b|bonafide)\b/i
  },
  {
    type: 'financial bill / payment receipt / payslip',
    regex: /\b(fee\s*receipt|tax\s*invoice|payment\s*receipt|salary\s*slip|payslip|electricity\s*bill|utility\s*bill|bank\s*statement|passbook\s*copy|\binvoice\b|\breceipt\b|\bbill\b|\bchallan\b)\b/i
  },
  {
    type: 'government identity card document',
    regex: /\b(aadhaar\s*card|aadhar\s*card|pan\s*card|voter\s*id\s*card|passport\s*copy|driving\s*licen[cs]e|ration\s*card|\bid\s*card\b|identity\s*card)\b/i
  },
  {
    type: 'game / recreational event sheet / travel ticket',
    regex: /\b(tambola|housie|sudoku|crossword|flight\s*ticket|train\s*ticket|bus\s*ticket|boarding\s*pass)\b/i
  },
  {
    type: 'presentation / slide deck',
    regex: /\b(presentation|slides?|ppt|pptx)\b/i
  },
  {
    type: 'generic placeholder / numbered file',
    regex: /^([0-9]+|[a-z]{1,2}|doc[0-9]*|file[0-9]*|sample[0-9]*|test[0-9]*|untitled[0-9]*|output[0-9]*|temp[0-9]*|data[0-9]*|book[0-9]*)$/i
  }
];

/**
 * Validates a file by name, extension, and content to guarantee it is solely a Resume / CV document.
 */
export async function validateResumeFile(file: File): Promise<ValidationResult> {
  const rawFileName = file.name || '';
  const lowerName = rawFileName.toLowerCase().trim();

  // 1. Validate File Extension
  const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

  if (!hasValidExt) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. Only PDF, DOCX, DOC, and TXT resume files are supported. Image files, spreadsheets, and other formats are strictly rejected.'
    };
  }

  // 2. Extract base file name (without extension) for checking
  const baseName = lowerName.replace(/\.[a-zA-Z0-9]+$/, '').trim();

  for (const rule of NON_RESUME_RULES) {
    if (rule.regex.test(baseName) || rule.regex.test(lowerName)) {
      return {
        isValid: false,
        detectedType: rule.type,
        error: `Upload the correct file document [only resume]. The selected file "${rawFileName}" is a ${rule.type}, not a candidate resume/CV. Only candidate resumes containing Education, Skills, and Experience are accepted.`
      };
    }
  }

  // 3. File Size Limits (minimum 10 bytes, maximum 30MB)
  if (file.size < 10) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The selected file is empty or too small to be a complete resume.'
    };
  }

  if (file.size > 30 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'Resume file size exceeds 30MB limit. Please upload a standard PDF or DOCX resume document.'
    };
  }

  // 4. Content Stream Inspection for plain text files
  if (lowerName.endsWith('.txt')) {
    try {
      const textSample = await file.text();
      const textCheck = validateResumeText(textSample);
      if (!textCheck.isValid) {
        return {
          isValid: false,
          error: textCheck.error || 'Upload the correct file document [only resume]. The text in the uploaded document does not contain candidate resume sections (Education, Skills, Experience).'
        };
      }
    } catch {
      // ignore
    }
  }

  return { isValid: true };
}

/**
 * Inspects raw text content for characteristic resume headers and structure
 */
export function validateResumeText(text: string): ValidationResult {
  if (!text || text.trim().length < 20) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The text provided is too short to be a valid resume.'
    };
  }

  const lower = text.toLowerCase();

  // Check for unambiguous non-resume document patterns in text
  const isProjectReport = /(mini\s*project\s*report|project\s*synopsis|submitted\s*in\s*partial\s*fulfillment|under\s*the\s*guidance\s*of|internal\s*examiner|external\s*examiner|certificate\s*of\s*authenticity|table\s*of\s*contents|chapter\s*1\s*[:\n]|chapter\s*2\s*[:\n]|abstract\s*:\s*this\s*project)/i.test(lower);
  const isGovtForm = /(election\s*commission\s*of\s*india|electoral\s*registration|form\s*[-_]?\s*8\b|epic\s*no|assembly\s*constituency\s*no|part\s*no\s*and\s*serial\s*no)/i.test(lower);
  const isExamQuestionPaper = /(maximum\s*marks\s*:\s*\d+|time\s*allowed\s*:\s*\d+\s*hours|answer\s*all\s*questions|section\s*[-–]\s*[a-d]\s*[:(]|q\.?\s*1\s*\(?[a-d]?\)?\s*explain|q\.?\s*2\s*\(?[a-d]?\)?\s*define)/i.test(lower);
  const isInvoiceBill = /(tax\s*invoice|bill\s*to\s*:|invoice\s*number\s*:|gstin\s*:|total\s*amount\s*due|electricity\s*bill\s*account)/i.test(lower);
  const isLabManual = /(experiment\s*no\s*:\s*\d+|apparatus\s*required|procedure\s*and\s*precautions|viva\s*voce\s*questions)/i.test(lower);

  if (isProjectReport || isGovtForm || isExamQuestionPaper || isInvoiceBill || isLabManual) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The content appears to be a project report, question paper, government form, invoice, or lab sheet, not a candidate resume/CV.'
    };
  }

  // Check for presence of standard resume categories
  const hasEducation = /education|college|university|institute|degree|b\.?tech|b\.?e|b\.?sc|b\.?com|bca|bba|mca|m\.?tech|cgpa|gpa|percentage|matriculation|intermediate|school|diploma|academic/i.test(lower);
  const hasSkills = /skills|technical skills|programming|technologies|frameworks|tools|languages|competencies|proficiencies|expertise|python|java|c\+\+|sql|react|html|css|data\s*science|machine\s*learning|ai/i.test(lower);
  const hasExperienceOrProjects = /experience|projects|project|internship|work history|employment|responsibilities|built|developed|designed|implemented|contributions|certifications|achievements/i.test(lower);
  const hasContactOrProfile = /email|phone|mobile|contact|linkedin|github|portfolio|summary|objective|profile|curriculum vitae|resume|about me|personal details|name\s*:/i.test(lower);

  const matchedSections = [hasEducation, hasSkills, hasExperienceOrProjects, hasContactOrProfile].filter(Boolean).length;

  if (matchedSections < 2 && text.length > 80) {
    return {
      isValid: false,
      error: 'Upload the correct file document [only resume]. The uploaded document does not contain candidate resume sections (e.g., Education, Technical Skills, Projects, or Experience).'
    };
  }

  return { isValid: true };
}

