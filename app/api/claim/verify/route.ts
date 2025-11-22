import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendClaimNotificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json(
        { error: 'Missing code or email' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find verification code
    const { data: verificationCode, error: codeError } = await supabase
      .from('verification_codes')
      .select('id, code, claim_request_id, expires_at, verified')
      .eq('code', code)
      .eq('email', email)
      .single()

    if (codeError || !verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Check if code is expired
    if (new Date(verificationCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (verificationCode.verified) {
      return NextResponse.json(
        { error: 'This code has already been used' },
        { status: 400 }
      )
    }

    // Get claim request
    const { data: claimRequest, error: claimError } = await supabase
      .from('claim_requests')
      .select('id, business_id, first_name, last_name, email, phone, status')
      .eq('id', verificationCode.claim_request_id)
      .single()

    if (claimError || !claimRequest) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    // Check claim status
    if (claimRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Claim has already been ${claimRequest.status}` },
        { status: 400 }
      )
    }

    // Mark code as verified
    const { error: updateCodeError } = await supabase
      .from('verification_codes')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', verificationCode.id)

    if (updateCodeError) {
      console.error('Error marking code as verified:', updateCodeError)
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      )
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create new user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true, // Auto-confirm since we verified via code
        user_metadata: {
          first_name: claimRequest.first_name,
          last_name: claimRequest.last_name,
        },
      })

      if (authError || !authData.user) {
        console.error('Auth user creation error:', authError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }

      userId = authData.user.id

      // Create user in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          name: `${claimRequest.first_name} ${claimRequest.last_name}`,
          role: 'business',
          verified: true,
        })

      if (userError) {
        console.error('User table creation error:', userError)
        // User auth was created but profile insert failed
        // This is a partial success - user can still claim
      }
    }

    // Update claim request with user_id
    const { error: claimUpdateError } = await supabase
      .from('claim_requests')
      .update({
        user_id: userId,
      })
      .eq('id', claimRequest.id)

    if (claimUpdateError) {
      console.error('Error updating claim request:', claimUpdateError)
    }

    // Get business information for the admin email
    const { data: business } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', claimRequest.business_id)
      .single()

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cleaningdirectory.com'
      const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/claims/${claimRequest.id}?action=review`
      const rejectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/claims/${claimRequest.id}?action=review`

      await sendClaimNotificationEmail({
        adminEmail: adminEmail,
        claimantName: `${claimRequest.first_name} ${claimRequest.last_name}`,
        claimantEmail: claimRequest.email,
        claimantPhone: claimRequest.phone,
        businessName: business?.name || 'Unknown Business',
        approveUrl: approveUrl,
        rejectUrl: rejectUrl,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
      // Don't fail the response, but log the error
    }

    return NextResponse.json({
      success: true,
      claimId: claimRequest.id,
      businessId: claimRequest.business_id,
      userId: userId,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
