import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { businessId, email } = await request.json()

    // Validate required fields
    if (!businessId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if there's an existing claim request for this email/business
    const { data: existingClaim } = await supabase
      .from('claim_requests')
      .select('id, business_id')
      .eq('business_id', businessId)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (!existingClaim) {
      return NextResponse.json(
        { error: 'No pending claim found for this email and business' },
        { status: 404 }
      )
    }

    // Check if a verification code already exists and is not expired
    const { data: existingCode } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('claim_request_id', existingClaim.id)
      .gt('expires_at', new Date().toISOString())
      .single()

    // Generate new verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete old code if exists
    if (existingCode) {
      await supabase
        .from('verification_codes')
        .delete()
        .eq('claim_request_id', existingClaim.id)
    }

    // Create new verification code
    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert({
        email: email,
        code: verificationCode,
        claim_request_id: existingClaim.id,
        expires_at: expiresAt.toISOString(),
      })

    if (codeError) {
      console.error('Code creation error:', codeError)
      return NextResponse.json(
        { error: 'Failed to create verification code' },
        { status: 500 }
      )
    }

    // Get business name for email
    const { data: business } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', businessId)
      .single()

    // Build verification URL
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${businessId}/verify?code=${verificationCode}&email=${encodeURIComponent(email)}`

    // Send magic link email to user
    try {
      await sendMagicLinkEmail({
        email: email,
        businessName: business?.name || 'Your Business',
        verifyUrl: verifyUrl,
        verificationCode: verificationCode,
      })
    } catch (emailError) {
      console.error('Failed to send resend email:', emailError)
      // Don't fail the request, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code resent to your email',
    })
  } catch (error) {
    console.error('Resend code error:', error)
    return NextResponse.json(
      { error: 'An error occurred while resending the code' },
      { status: 500 }
    )
  }
}
