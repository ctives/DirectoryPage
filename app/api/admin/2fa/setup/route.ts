import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { generateTwoFASecret } from '@/lib/2fa'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions as any)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate 2FA secret and QR code
    const { secret, qrCode, backupCodes } = await generateTwoFASecret(
      session.user.email || 'admin'
    )

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      backupCodes,
      message: 'Scan the QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)',
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to generate 2FA setup' },
      { status: 500 }
    )
  }
}
