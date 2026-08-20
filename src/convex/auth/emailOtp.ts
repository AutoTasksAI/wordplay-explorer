import { Email } from "@convex-dev/auth/providers/Email";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

/**
 * Email OTP sign-in for parents, sent through Resend (production provider).
 *
 * Env vars (set in the Convex project's Keys tab, never in .env):
 *   RESEND_API_KEY, Resend API key (free tier)
 *   EMAIL_FROM    , verified sender, e.g. "Read with Rex <hello@readwithrex.com>"
 *
 * The 6-digit code is emailed to the parent so a grown-up can finish sign-in
 * on the child's device. The child never creates an account or shares an
 * email address (guest mode is the default in-game flow).
 */
export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error(
        "RESEND_API_KEY and EMAIL_FROM must be configured in the project Keys tab",
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your Read with Rex sign-in code",
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; background:#fff8e7; padding:24px;">
            <h1 style="color:#141414; font-size:22px;">Your sign-in code</h1>
            <p style="color:#141414; font-size:16px;">Hi parent! Use this code to finish signing in to Read with Rex:</p>
            <p style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#2e6bff;">${token}</p>
            <p style="color:#141414; font-size:14px;">The code expires in 15 minutes. If you didn't ask for this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend failed (${response.status}): ${detail}`);
    }
  },
});