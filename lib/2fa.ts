import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface TwoFASetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

/**
 * Generate 2FA secret and QR code for setup
 */
export async function generateTwoFASecret(
  email: string,
  appName: string = 'Nashville Cleaning Directory'
): Promise<TwoFASetup> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `${appName} (${email})`,
    issuer: appName,
    length: 32, // Longer secret for better security
  })

  if (!secret.otpauth_url) {
    throw new Error('Failed to generate OTP auth URL')
  }

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url)

  // Generate backup codes (10 codes of 8 characters each)
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  )

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  }
}

/**
 * Verify a TOTP token
 */
export function verifyTOTPToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 30 seconds before/after
  })
}

/**
 * Verify a backup code
 */
export function verifyBackupCode(
  backupCodes: string[],
  code: string
): { valid: boolean; remaining: string[] } {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '')

  // Check if code exists
  const codeIndex = backupCodes.findIndex(
    (c) => c.toUpperCase() === normalizedCode
  )

  if (codeIndex === -1) {
    return { valid: false, remaining: backupCodes }
  }

  // Remove used code
  const remaining = backupCodes.filter((_, index) => index !== codeIndex)

  return { valid: true, remaining }
}

/**
 * Format backup codes for display
 */
export function formatBackupCodes(codes: string[]): string {
  return codes.map((code, index) => `${index + 1}. ${code}`).join('\n')
}

/**
 * Verify 2FA token and return whether it's valid
 */
export function verify2FA(secret: string, token: string): boolean {
  const cleanToken = token.replace(/\s/g, '')

  // Token should be 6 digits
  if (!/^\d{6}$/.test(cleanToken)) {
    return false
  }

  return verifyTOTPToken(secret, cleanToken)
}
