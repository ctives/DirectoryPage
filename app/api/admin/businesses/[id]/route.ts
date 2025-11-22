import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions as any)

    if (!session || (session.user as any).role !== 'admin') {
      logger.warn('Unauthorized business fetch attempt', { businessId: params.id })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: business, error } = await supabase
      .from('businesses')
      .select(
        `
        id,
        name,
        address,
        city,
        state,
        phone,
        email,
        website,
        description,
        rating,
        review_count,
        owner_id,
        status,
        created_at,
        updated_at
      `
      )
      .eq('id', params.id)
      .single()

    if (error) {
      logger.error('Error fetching business', { businessId: params.id, error })
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    logger.info('Business fetched successfully', { businessId: params.id })

    return NextResponse.json({
      success: true,
      data: business,
    })
  } catch (error) {
    logger.error('Business fetch error', { businessId: params.id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions as any)

    if (!session || (session.user as any).role !== 'admin') {
      logger.warn('Unauthorized business update attempt', { businessId: params.id })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, address, city, state, zip, phone, email, website, description, status } = body

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update business
    const { data: business, error } = await supabase
      .from('businesses')
      .update({
        name,
        address,
        city,
        state,
        zip,
        phone,
        email,
        website,
        description,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      logger.error('Error updating business', { businessId: params.id, error })
      return NextResponse.json(
        { error: 'Failed to update business' },
        { status: 500 }
      )
    }

    logger.info('Business updated successfully', {
      businessId: params.id,
      businessName: business?.name,
    })

    return NextResponse.json({
      success: true,
      data: business,
    })
  } catch (error) {
    logger.error('Business update error', { businessId: params.id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions as any)

    if (!session || (session.user as any).role !== 'admin') {
      logger.warn('Unauthorized business delete attempt', { businessId: params.id })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Delete business
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', params.id)

    if (error) {
      logger.error('Error deleting business', { businessId: params.id, error })
      return NextResponse.json(
        { error: 'Failed to delete business' },
        { status: 500 }
      )
    }

    logger.info('Business deleted successfully', { businessId: params.id })

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully',
    })
  } catch (error) {
    logger.error('Business delete error', { businessId: params.id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
