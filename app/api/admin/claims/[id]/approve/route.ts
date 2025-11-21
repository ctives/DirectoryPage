import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { sendClaimApprovedEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const session = await getServerSession()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const { notes } = await request.json()

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get claim request
    const { data: claimRequest, error: claimError } = await supabase
      .from('claim_requests')
      .select('id, business_id, user_id, email, first_name, last_name, status')
      .eq('id', id)
      .single()

    if (claimError || !claimRequest) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (claimRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Claim has already been ${claimRequest.status}` },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    // Update claim request
    const { error: updateError } = await supabase
      .from('claim_requests')
      .update({
        status: 'approved',
        admin_notes: notes || null,
        approved_at: new Date().toISOString(),
        approved_by: adminUser?.id,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error approving claim:', updateError)
      return NextResponse.json(
        { error: 'Failed to approve claim' },
        { status: 500 }
      )
    }

    // Update business: mark as claimed
    const { error: businessError } = await supabase
      .from('businesses')
      .update({
        claimed: true,
        claimed_at: new Date().toISOString(),
        claimed_by: claimRequest.user_id,
      })
      .eq('id', claimRequest.business_id)

    if (businessError) {
      console.error('Error updating business:', businessError)
      // Don't fail - claim is already approved
    }

    // Create business_owners record
    if (claimRequest.user_id) {
      const { error: ownerError } = await supabase
        .from('business_owners')
        .insert({
          user_id: claimRequest.user_id,
          business_id: claimRequest.business_id,
          role: 'owner',
          verified: true,
          verification_method: 'claim_verified',
          verification_date: new Date().toISOString(),
        })

      if (ownerError && !ownerError.message.includes('duplicate')) {
        console.error('Error creating business_owners record:', ownerError)
      }
    }

    // Send approval email
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

      await sendClaimApprovedEmail({
        email: claimRequest.email,
        businessName: claimRequest.first_name, // We'll need to fetch this
        loginUrl: dashboardUrl,
      })
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError)
      // Don't fail the request
    }

    return NextResponse.json({
      success: true,
      message: 'Claim approved successfully',
    })
  } catch (error) {
    console.error('Claim approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
