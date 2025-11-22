import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions as any)

    if (!session || (session.user as any).role !== 'admin') {
      logger.warn('Unauthorized business list access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get query parameters for filtering and pagination
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
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
        status,
        created_at
      `,
        { count: 'exact' }
      )

    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%`)
    }

    const { data: businesses, error: businessesError, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (businessesError) {
      logger.error('Error fetching businesses', businessesError)
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      )
    }

    logger.info('Businesses fetched successfully', {
      page,
      limit,
      count: count || 0,
      resultsReturned: (businesses || []).length,
    })

    return NextResponse.json({
      success: true,
      data: businesses || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    logger.error('Businesses fetch error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions as any)

    if (!session || (session.user as any).role !== 'admin') {
      logger.warn('Unauthorized business creation attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      website,
      description,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create new business
    const { data: newBusiness, error: createError } = await supabase
      .from('businesses')
      .insert({
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        website: website || null,
        description: description || null,
        status: 'active',
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating business', createError)
      return NextResponse.json(
        { error: 'Failed to create business' },
        { status: 500 }
      )
    }

    logger.info('Business created successfully', {
      businessId: newBusiness?.id,
      businessName: newBusiness?.name,
    })

    return NextResponse.json({
      success: true,
      data: newBusiness,
    })
  } catch (error) {
    logger.error('Business creation error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
