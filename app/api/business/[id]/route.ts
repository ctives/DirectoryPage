import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600 // Revalidate every hour (ISR)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Use public anon key for read-only access
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch the business by ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (businessError || !business) {
      console.error('Business not found:', businessError)
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Fetch services for this business (if available)
    const { data: services } = await supabase
      .from('business_services')
      .select('service_name')
      .eq('business_id', id)

    // Fetch service areas for this business (if available)
    const { data: serviceAreas } = await supabase
      .from('service_areas')
      .select('area_name')
      .eq('business_id', id)

    // Combine services if available
    const servicesList = services?.map((s: any) => s.service_name) || []

    // Return the business with additional details
    return NextResponse.json({
      id: business.id,
      name: business.name,
      description: business.description,
      address: business.address,
      zip_code: business.zip_code,
      phone: business.phone,
      email: business.email,
      website: business.website,
      latitude: business.latitude,
      longitude: business.longitude,
      average_rating: business.average_rating,
      review_count: business.review_count,
      service_type: business.service_type,
      years_in_business: business.years_in_business,
      insurance_verification: business.insurance_verification,
      services: servicesList,
      service_areas: serviceAreas?.map((sa: any) => sa.area_name) || [],
      owner_name: business.owner_name,
      owner_email: business.owner_email,
      created_at: business.created_at,
      status: business.status,
    })
  } catch (error) {
    console.error('Business API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
