/**
 * URL Validator for GitHub and LinkedIn profile fields
 * Strictly enforces that GitHub fields only accept GitHub URLs/usernames
 * and LinkedIn fields only accept LinkedIn URLs.
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
 *  - valid GitHub username (alphanumeric with single hyphens, e.g. candidate-username)
 * 
 * Rejects any non-GitHub URLs (e.g., youtube.com, linkedin.com, facebook.com, google.com, etc.)
 */
export function validateGithubUrl(input: string): ValidationResult {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { isValid: true, cleanedValue: '' };
  }

  // Check if it's a URL
  const isUrl = /^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed) || trimmed.includes('.com') || trimmed.includes('.org') || trimmed.includes('.net') || trimmed.includes('/') || trimmed.includes('.');

  if (isUrl) {
    // Check if it explicitly belongs to github.com
    const isGithubDomain = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_.-]+)*\/?$/i.test(trimmed);
    
    if (!isGithubDomain) {
      return {
        isValid: false,
        error: 'ERROR: Invalid GitHub URL. Only authentic GitHub profile or repository links (e.g., https://github.com/username) are accepted in this field.'
      };
    }

    // Extract cleaned username/path
    const cleaned = trimmed.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/\/.*$/, '').trim();
    return {
      isValid: true,
      cleanedValue: cleaned || trimmed
    };
  }

  // If it's just a username, validate GitHub username rules:
  // 1-39 characters, alphanumeric and single hyphens, cannot start or end with hyphen
  const isUsernameValid = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed);
  if (!isUsernameValid) {
    return {
      isValid: false,
      error: 'ERROR: Invalid GitHub Username. GitHub usernames can only contain alphanumeric characters or hyphens and cannot contain spaces or other domain links.'
    };
  }

  return {
    isValid: true,
    cleanedValue: trimmed
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
 * 
 * Rejects any non-LinkedIn URLs (e.g., github.com, youtube.com, facebook.com, etc.)
 */
export function validateLinkedinUrl(input: string): ValidationResult {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { isValid: true, cleanedValue: '' };
  }

  // Check if it belongs to LinkedIn
  const isLinkedin = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.(com|in)\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?.*$/i.test(trimmed) ||
                     /^(https?:\/\/)?(www\.)?linkedin\.(com|in)\/(in|pub)\/[a-zA-Z0-9_-]+\/?.*$/i.test(trimmed);

  if (!isLinkedin) {
    return {
      isValid: false,
      error: 'ERROR: Invalid LinkedIn URL. Only authentic LinkedIn profile links (e.g., https://linkedin.com/in/your-profile) are accepted in this field.'
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
