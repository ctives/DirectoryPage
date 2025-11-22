import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_APP_EMAIL || 'noreply@cleaningdirectory.com',
      to,
      subject,
      html,
    })

    if (result.error) {
      console.error('Email send error:', result.error)
      throw new Error(result.error.message)
    }

    return result
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Send magic link verification email to business owner
 */
export const sendMagicLinkEmail = async ({
  email,
  businessName,
  verifyUrl,
  verificationCode,
}: {
  email: string
  businessName: string
  verifyUrl: string
  verificationCode: string
}) => {
  const subject = 'Verify your email to claim your business'

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Claim Your Business</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
          Hi there,
        </p>

        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
          We're excited to help you claim <strong>${businessName}</strong> on our directory!
        </p>

        <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px;">
          Click the button below to verify your email and continue with the claiming process:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Verify Email & Claim Business
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
          Or enter this verification code:
        </p>
        <div style="text-align: center; margin: 20px 0; background: white; padding: 20px; border-radius: 6px; border: 2px solid #667eea;">
          <p style="margin: 0; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
            ${verificationCode}
          </p>
          <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
            Enter this code on the verification page
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          This code will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}

/**
 * Send admin notification of pending claim
 */
export const sendClaimNotificationEmail = async ({
  adminEmail,
  claimantName,
  claimantEmail,
  claimantPhone,
  businessName,
  approveUrl,
  rejectUrl,
}: {
  adminEmail: string
  claimantName: string
  claimantEmail: string
  claimantPhone: string
  businessName: string
  approveUrl: string
  rejectUrl: string
}) => {
  const subject = `New Business Claim: ${businessName}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">New Claim Request</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">Business Details</h2>

        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 12px 0;"><strong>Business Name:</strong> ${businessName}</p>
        </div>

        <h2 style="margin: 20px 0 12px 0; color: #1f2937; font-size: 20px;">Claimant Information</h2>

        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${claimantName}</p>
          <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${claimantEmail}" style="color: #667eea;">${claimantEmail}</a></p>
          <p style="margin: 0;"><strong>Phone:</strong> <a href="tel:${claimantPhone}" style="color: #667eea;">${claimantPhone}</a></p>
        </div>

        <h2 style="margin: 20px 0 12px 0; color: #1f2937; font-size: 20px;">Actions</h2>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          <a href="${approveUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            ✓ Approve Claim
          </a>
          <a href="${rejectUrl}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            ✕ Reject Claim
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          Or review in your admin panel to approve or reject this claim.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  })
}

/**
 * Send approval notification to business owner
 */
export const sendClaimApprovedEmail = async ({
  email,
  businessName,
  loginUrl,
}: {
  email: string
  businessName: string
  loginUrl: string
}) => {
  const subject = `Claim Approved: ${businessName}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">✓ Claim Approved!</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
          Congratulations! Your claim for <strong>${businessName}</strong> has been approved.
        </p>

        <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px;">
          You can now log in to your account and update your business information, add photos, and manage your listing.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Go to Your Dashboard
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          You can now update your business description, contact information, and upload photos.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}

/**
 * Send rejection notification to business owner
 */
export const sendClaimRejectedEmail = async ({
  email,
  businessName,
  reason,
}: {
  email: string
  businessName: string
  reason?: string
}) => {
  const subject = `Claim Status: ${businessName}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Claim Decision</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
          Thank you for submitting a claim for <strong>${businessName}</strong>.
        </p>

        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
          Unfortunately, we were unable to approve your claim at this time.
        </p>

        ${reason ? `<div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f97316;">
          <p style="margin: 0; color: #374151;"><strong>Reason:</strong></p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">${reason}</p>
        </div>` : ''}

        <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">
          If you have questions or believe this was an error, please contact us.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          We appreciate your interest in the Cleaning Directory.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}
