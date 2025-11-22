import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLinkEmail, sendClaimNotificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { businessId, firstName, lastName, email, phone } = await request.json()

    // Validate required fields
    if (!businessId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate phone format (basic)
    const phoneRegex = /^\d{10,}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if business exists
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, claimed')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Check if business is already claimed
    if (business.claimed) {
      return NextResponse.json(
        { error: 'This business has already been claimed' },
        { status: 400 }
      )
    }

    // Check if claim already exists for this email/business combo
    const { data: existingClaim } = await supabase
      .from('claim_requests')
      .select('id, status')
      .eq('business_id', businessId)
      .eq('email', email)
      .single()

    if (existingClaim) {
      if (existingClaim.status === 'pending') {
        return NextResponse.json(
          { error: 'A claim request already exists for this email. Please check your email for verification instructions.' },
          { status: 400 }
        )
      }
    }

    // Create claim request
    const { data: claimRequest, error: claimError } = await supabase
      .from('claim_requests')
      .insert({
        business_id: businessId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        status: 'pending',
      })
      .select()
      .single()

    if (claimError || !claimRequest) {
      console.error('Claim creation error:', claimError)
      return NextResponse.json(
        { error: 'Failed to create claim request' },
        { status: 500 }
      )
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification code
    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert({
        email: email,
        code: verificationCode,
        claim_request_id: claimRequest.id,
        expires_at: expiresAt.toISOString(),
      })

    if (codeError) {
      console.error('Code creation error:', codeError)
      return NextResponse.json(
        { error: 'Failed to create verification code' },
        { status: 500 }
      )
    }

    // Build verification URL
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${businessId}/verify?code=${verificationCode}&email=${encodeURIComponent(email)}`

    // Send magic link email to user
    try {
      await sendMagicLinkEmail({
        email: email,
        businessName: business.name,
        verifyUrl: verifyUrl,
        verificationCode: verificationCode,
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the request, but log the error
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cleaningdirectory.com'
      const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/claims/${claimRequest.id}?action=review`
      const rejectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/claims/${claimRequest.id}?action=review`

      await sendClaimNotificationEmail({
        adminEmail: adminEmail,
        claimantName: `${firstName} ${lastName}`,
        claimantEmail: email,
        claimantPhone: phone,
        businessName: business.name,
        approveUrl: approveUrl,
        rejectUrl: rejectUrl,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
      // Don't fail the request
    }

    return NextResponse.json({
      success: true,
      claimId: claimRequest.id,
      message: 'Claim request submitted. Please check your email for verification instructions.',
    })
  } catch (error) {
    console.error('Claim submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
