/**
 * URL Validator for GitHub and LinkedIn profile fields
 * Strictly enforces that GitHub fields only accept GitHub URLs/usernames
 * and LinkedIn fields only accept LinkedIn URLs.
 * Rejects any foreign domains, invalid formats, or swapped links with clear error feedback.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  cleanedValue?: string;
}

/**
 * Validates a GitHub URL or username.
 * Accepts:
 *  - https://github.com/username
 *  - http://github.com/username
 *  - https://www.github.com/username
 *  - github.com/username
 *  - github.com/username/repo
 *  - valid GitHub username (e.g. candidate-username)
 * 
 * Strictly rejects any non-GitHub URLs (e.g. linkedin.com, youtube.com, google.com, etc.)
 */
export function validateGithubUrl(input: string): ValidationResult {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { isValid: true, cleanedValue: '' };
  }

  // 1. Check if user accidentally pasted a LinkedIn link
  if (/linkedin\.com/i.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid GitHub Link: You provided a LinkedIn URL. This field only accepts authentic GitHub profile or repository links (e.g., https://github.com/your-username).'
    };
  }

  // 2. Check if it's a URL or contains domain/path indicators
  const isUrl = /^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed) || trimmed.includes('.com') || trimmed.includes('.org') || trimmed.includes('.net') || trimmed.includes('.io') || trimmed.includes('.dev') || trimmed.includes('/') || trimmed.includes('.');

  if (isUrl) {
    // Check if it explicitly belongs to github.com
    const isGithubDomain = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_.-]+)*\/?$/i.test(trimmed);
    
    if (!isGithubDomain) {
      return {
        isValid: false,
        error: 'Invalid GitHub Link: Only authentic GitHub profile or repository URLs (e.g., https://github.com/your-username) are accepted in this field.'
      };
    }

    // Standardize to full https://github.com/path format
    let fullUrl = trimmed;
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = `https://${fullUrl.replace(/^www\./i, 'www.')}`;
    }

    // Extract cleaned username
    const usernameMatch = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const username = usernameMatch ? usernameMatch[1] : '';

    return {
      isValid: true,
      cleanedValue: fullUrl
    };
  }

  // 3. If it's pure username, validate standard GitHub username rules:
  // 1-39 alphanumeric characters or single hyphens, no consecutive hyphens, cannot start or end with hyphen
  const isUsernameValid = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed);
  if (!isUsernameValid) {
    return {
      isValid: false,
      error: 'Invalid GitHub Username: GitHub usernames can only contain alphanumeric characters or hyphens (e.g., your-username) without spaces or other domains.'
    };
  }

  return {
    isValid: true,
    cleanedValue: `https://github.com/${trimmed}`
  };
}

/**
 * Validates a LinkedIn profile URL.
 * Accepts:
 *  - https://linkedin.com/in/username
 *  - https://www.linkedin.com/in/username
 *  - https://in.linkedin.com/in/username
 *  - linkedin.com/in/username
 *  - https://linkedin.com/pub/...
 *  - https://linkedin.com/company/...
 * 
 * Strictly rejects any non-LinkedIn URLs (e.g. github.com, youtube.com, google.com, etc.)
 */
export function validateLinkedinUrl(input: string): ValidationResult {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { isValid: true, cleanedValue: '' };
  }

  // 1. Check if user accidentally pasted a GitHub link
  if (/github\.com/i.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid LinkedIn Link: You provided a GitHub URL. This field only accepts authentic LinkedIn profile links (e.g., https://linkedin.com/in/your-profile).'
    };
  }

  // 2. Check if it belongs to LinkedIn
  const isLinkedin = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.(com|in)\/(in|pub|company)\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_.-]+)*\/?.*$/i.test(trimmed) ||
                     /^(https?:\/\/)?(www\.)?linkedin\.(com|in)\/(in|pub|company)\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_.-]+)*\/?.*$/i.test(trimmed);

  if (!isLinkedin) {
    return {
      isValid: false,
      error: 'Invalid LinkedIn Link: Only authentic LinkedIn profile URLs (e.g., https://linkedin.com/in/your-profile) are accepted in this field.'
    };
  }

  // Ensure full https:// format
  let fullUrl = trimmed;
  if (!/^https?:\/\//i.test(fullUrl)) {
    fullUrl = `https://${fullUrl.replace(/^www\./i, 'www.')}`;
  }

  return {
    isValid: true,
    cleanedValue: fullUrl
  };
}

