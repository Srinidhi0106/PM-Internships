/**
 * Centralized Real Email OTP Service
 * Communicates strictly with backend endpoints:
 * - POST /api/auth/send-email-otp
 * - POST /api/auth/verify-email-otp
 * - POST /api/auth/resend-email-otp
 *
 * Passcodes are generated server-side, stored as HMAC-SHA256 hashes,
 * and dispatched exclusively to the user's verified email inbox.
 */

export interface SendOtpResult {
  success: boolean;
  message: string;
  email?: string;
  purpose?: string;
  expiresInSeconds?: number;
  resendAvailableInSeconds?: number;
  remainingSeconds?: number;
  delivered?: boolean;
  emailUnconfigured?: boolean;
  warning?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
  otpVerificationToken?: string;
  purpose?: string;
  expired?: boolean;
  maxAttemptsExceeded?: boolean;
  remainingAttempts?: number;
}

async function safeReadJsonResponse(res: Response): Promise<{ ok: boolean; data: any; nonJsonError?: string }> {
  const rawText = await res.text();
  if (!rawText) {
    return { ok: res.ok, data: {} };
  }
  try {
    return { ok: res.ok, data: JSON.parse(rawText) };
  } catch {
    return {
      ok: false,
      data: null,
      nonJsonError: `Authentication service returned an unexpected response (HTTP ${res.status}). Ensure your server is running and Resend email configuration (RESEND_API_KEY & verified EMAIL_FROM) is valid.`
    };
  }
}

export const otpService = {
  /**
   * Dispatches a 6-digit numeric passcode exclusively to the specified email address via Resend.
   */
  async sendEmailOtp(
    email: string,
    purpose: string = 'registration',
    name?: string,
    role: string = 'STUDENT'
  ): Promise<SendOtpResult> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose,
          name,
          role
        })
      });

      const parsed = await safeReadJsonResponse(res);
      if (!parsed.data) {
        return {
          success: false,
          delivered: false,
          message: parsed.nonJsonError || 'Unable to parse verification server response.'
        };
      }

      const data = parsed.data;
      return {
        success: !!(parsed.ok && data.success),
        message: data.message || (parsed.ok ? 'Passcode sent to your email address.' : 'Failed to send passcode.'),
        email: cleanEmail,
        purpose,
        expiresInSeconds: data.expiresInSeconds || 300,
        resendAvailableInSeconds: data.resendAvailableInSeconds || 60,
        remainingSeconds: data.remainingSeconds,
        delivered: Boolean(data.delivered),
        emailUnconfigured: Boolean(data.emailUnconfigured),
        warning: data.warning
      };
    } catch (err: any) {
      console.error('[OTP Service] sendEmailOtp failed:', err);
      return {
        success: false,
        message: err?.message || 'Network error: could not contact authentication server.'
      };
    }
  },

  /**
   * Verifies the user-entered 6-digit numeric passcode against the backend stored HMAC-SHA256 hash.
   */
  async verifyEmailOtp(
    email: string,
    otp: string,
    purpose: string = 'registration',
    role?: string,
    userDetails?: any
  ): Promise<VerifyOtpResult> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanOtp = otp.trim();

      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: cleanOtp,
          purpose,
          role,
          userDetails
        })
      });

      const parsed = await safeReadJsonResponse(res);
      if (!parsed.data) {
        return {
          success: false,
          message: parsed.nonJsonError || 'Unable to parse verification response.'
        };
      }

      const data = parsed.data;
      return {
        success: !!(parsed.ok && data.success),
        message: data.message || (parsed.ok ? 'Email verified successfully.' : 'Invalid passcode'),
        user: data.user,
        token: data.token,
        otpVerificationToken: data.otpVerificationToken,
        purpose: data.purpose || purpose,
        expired: data.expired,
        maxAttemptsExceeded: data.maxAttemptsExceeded,
        remainingAttempts: data.remainingAttempts
      };
    } catch (err: any) {
      console.error('[OTP Service] verifyEmailOtp failed:', err);
      return {
        success: false,
        message: err?.message || 'Network error: could not contact verification server.'
      };
    }
  },

  /**
   * Resends a fresh 6-digit passcode after the 60-second cooldown period.
   */
  async resendEmailOtp(email: string, purpose: string = 'registration'): Promise<SendOtpResult> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose
        })
      });

      const parsed = await safeReadJsonResponse(res);
      if (!parsed.data) {
        return {
          success: false,
          delivered: false,
          message: parsed.nonJsonError || 'Unable to parse resend verification response.'
        };
      }

      const data = parsed.data;
      return {
        success: !!(parsed.ok && data.success),
        message: data.message || (parsed.ok ? 'Passcode resent to your email address.' : 'Failed to resend passcode.'),
        email: cleanEmail,
        purpose,
        expiresInSeconds: data.expiresInSeconds || 300,
        resendAvailableInSeconds: data.resendAvailableInSeconds || 60,
        remainingSeconds: data.remainingSeconds,
        delivered: Boolean(data.delivered),
        emailUnconfigured: Boolean(data.emailUnconfigured),
        warning: data.warning
      };
    } catch (err: any) {
      console.error('[OTP Service] resendEmailOtp failed:', err);
      return {
        success: false,
        message: err?.message || 'Network error: could not resend passcode.'
      };
    }
  }
};

export const sendEmailOtp = otpService.sendEmailOtp.bind(otpService);
export const verifyEmailOtp = otpService.verifyEmailOtp.bind(otpService);
export const resendEmailOtp = otpService.resendEmailOtp.bind(otpService);
export default otpService;
