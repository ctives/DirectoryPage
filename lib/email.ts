import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; margin-bottom: 20px;">
            We received a request to reset your password. Click the link below to create a new password:
          </p>
          <p style="margin-bottom: 30px;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; margin-bottom: 10px;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #0066cc; word-break: break-all; margin-bottom: 30px;">
            ${resetUrl}
          </p>
          <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
            This link will expire in 24 hours.
          </p>
          <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
            If you didnt request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending password reset email:", result.error)
      throw new Error("Failed to send password reset email")
    }

    return result
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email</h2>
          <p style="color: #666; margin-bottom: 20px;">
            Thank you for signing up! Click the link below to verify your email address:
          </p>
          <p style="margin-bottom: 30px;">
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email
            </a>
          </p>
          <p style="color: #666; margin-bottom: 10px;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #0066cc; word-break: break-all; margin-bottom: 30px;">
            ${verificationUrl}
          </p>
          <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
            This link will expire in 24 hours.
          </p>
          <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
            If you didnt create an account, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending verification email:", result.error)
      throw new Error("Failed to send verification email")
    }

    return result
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw error
  }
}

export async function sendMagicLinkEmail(email: string, magicLinkUrl: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Claim your business - Magic link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Claim Your Business</h2>
          <p style="color: #666; margin-bottom: 20px;">
            Click the link below to claim and manage your business on Nashville Cleaning Directory:
          </p>
          <p style="margin-bottom: 30px;">
            <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Claim Business
            </a>
          </p>
          <p style="color: #666; margin-bottom: 10px;">
            Or copy and paste this link:
          </p>
          <p style="color: #0066cc; word-break: break-all; margin-bottom: 30px;">
            ${magicLinkUrl}
          </p>
          <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
            This link will expire in 24 hours.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending magic link email:", result.error)
      throw new Error("Failed to send magic link email")
    }

    return result
  } catch (error) {
    console.error("Error sending magic link email:", error)
    throw error
  }
}

export async function sendClaimNotificationEmail(email: string, businessName: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Your business claim is pending review",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Claim Received</h2>
          <p style="color: #666; margin-bottom: 20px;">
            We have received your claim for <strong>${businessName}</strong>. Our team will review and verify your claim shortly.
          </p>
          <p style="color: #666; margin-bottom: 20px;">
            You will receive an email once your claim has been approved.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending claim notification email:", result.error)
      throw new Error("Failed to send claim notification email")
    }

    return result
  } catch (error) {
    console.error("Error sending claim notification email:", error)
    throw error
  }
}

export async function sendClaimApprovedEmail(email: string, businessName: string, dashboardUrl: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Your business claim has been approved!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Claim Approved!</h2>
          <p style="color: #666; margin-bottom: 20px;">
            Congratulations! Your claim for <strong>${businessName}</strong> has been approved.
          </p>
          <p style="color: #666; margin-bottom: 30px;">
            You now have access to your business dashboard where you can manage your business information and listings.
          </p>
          <p style="margin-bottom: 30px;">
            <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Go to Dashboard
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending claim approved email:", result.error)
      throw new Error("Failed to send claim approved email")
    }

    return result
  } catch (error) {
    console.error("Error sending claim approved email:", error)
    throw error
  }
}

export async function sendClaimRejectedEmail(email: string, businessName: string, reason?: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Business claim status update",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Claim Status Update</h2>
          <p style="color: #666; margin-bottom: 20px;">
            Thank you for submitting a claim for <strong>${businessName}</strong>.
          </p>
          <p style="color: #666; margin-bottom: 20px;">
            Unfortunately, we were unable to verify your claim at this time. ${reason ? "Reason: " + reason : ""}
          </p>
          <p style="color: #666; margin-bottom: 20px;">
            You may submit a new claim or contact our support team for more information.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            © 2024 Nashville Cleaning Directory. All rights reserved.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error("Error sending claim rejected email:", result.error)
      throw new Error("Failed to send claim rejected email")
    }

    return result
  } catch (error) {
    console.error("Error sending claim rejected email:", error)
    throw error
  }
}
