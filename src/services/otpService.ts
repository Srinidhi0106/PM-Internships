/**
 * Centralized Real Email OTP Service
 * Communicates with backend endpoints:
 * - POST /api/auth/send-email-otp
 * - POST /api/auth/verify-email-otp
 * - POST /api/auth/resend-email-otp
 *
 * Supports reusable flows:
 * - registration
 * - forgot-password
 * - sensitive-profile-change
 * - offer-acceptance
 * - bank-account-verification
 * - certificate-access
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
  warning?: string;
  testOtpFallback?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
  purpose?: string;
  expired?: boolean;
  maxAttemptsExceeded?: boolean;
  remainingAttempts?: number;
}

export const otpService = {
  /**
   * Dispatches a real 6-digit verification code to the specified email address via Gmail SMTP
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose,
          name,
          role
        })
      });

      const data = await res.json();
      return {
        success: !!(res.ok && data.success),
        message: data.message || (res.ok ? 'OTP sent successfully' : 'Failed to send OTP'),
        email: cleanEmail,
        purpose,
        expiresInSeconds: data.expiresInSeconds || 300,
        resendAvailableInSeconds: data.resendAvailableInSeconds || 60,
        remainingSeconds: data.remainingSeconds,
        delivered: data.delivered,
        warning: data.warning,
        testOtpFallback: data.testOtpFallback
      };
    } catch (err: any) {
      console.error('[OTP Service] sendEmailOtp failed:', err);
      return {
        success: false,
        message: err.message || 'Network error: could not contact authentication server.'
      };
    }
  },

  /**
   * Verifies the user-entered 6-digit numeric OTP against the backend stored HMAC-SHA256 hash
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: cleanOtp,
          purpose,
          role,
          userDetails
        })
      });

      const data = await res.json();
      return {
        success: !!(res.ok && data.success),
        message: data.message || (res.ok ? 'Email verified successfully.' : 'Invalid OTP'),
        user: data.user,
        token: data.token,
        purpose: data.purpose || purpose,
        expired: data.expired,
        maxAttemptsExceeded: data.maxAttemptsExceeded,
        remainingAttempts: data.remainingAttempts
      };
    } catch (err: any) {
      console.error('[OTP Service] verifyEmailOtp failed:', err);
      return {
        success: false,
        message: err.message || 'Network error: could not contact verification server.'
      };
    }
  },

  /**
   * Resends a fresh 6-digit OTP after the 60-second cooldown period
   */
  async resendEmailOtp(email: string, purpose: string = 'registration'): Promise<SendOtpResult> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose
        })
      });

      const data = await res.json();
      return {
        success: !!(res.ok && data.success),
        message: data.message || (res.ok ? 'OTP sent successfully' : 'Failed to resend OTP'),
        email: cleanEmail,
        purpose,
        expiresInSeconds: data.expiresInSeconds || 300,
        resendAvailableInSeconds: data.resendAvailableInSeconds || 60,
        remainingSeconds: data.remainingSeconds,
        delivered: data.delivered,
        warning: data.warning,
        testOtpFallback: data.testOtpFallback
      };
    } catch (err: any) {
      console.error('[OTP Service] resendEmailOtp failed:', err);
      return {
        success: false,
        message: err.message || 'Network error: could not resend OTP.'
      };
    }
  }
};
