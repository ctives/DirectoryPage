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

    // Fetch photos for this business (if available)
    const { data: photos } = await supabase
      .from('business_photos')
      .select('id, photo_url, thumbnail_url, caption, photo_type, is_primary, display_order')
      .eq('business_id', id)
      .order('is_primary', { ascending: false })
      .order('display_order', { ascending: true })

    // Combine services if available
    const servicesList = services?.map((s: any) => s.service_name) || []

    // Build ratings array
    const ratings = []
    if (business.average_rating && business.average_rating > 0) {
      ratings.push({
        source: 'our_rating',
        rating: business.average_rating,
        reviewCount: business.review_count || 0,
      })
    }
    if (business.google_rating && business.google_rating > 0) {
      ratings.push({
        source: 'google',
        rating: business.google_rating,
        reviewCount: business.google_review_count,
        url: business.google_reviews_url,
      })
    }
    if (business.yelp_rating && business.yelp_rating > 0) {
      ratings.push({
        source: 'yelp',
        rating: business.yelp_rating,
        reviewCount: business.yelp_review_count,
        url: business.yelp_url,
      })
    }

    // Build social media array
    const socialMedia = []
    if (business.facebook_url) {
      socialMedia.push({
        platform: 'facebook',
        url: business.facebook_url,
        handle: business.facebook_handle,
      })
    }
    if (business.instagram_url) {
      socialMedia.push({
        platform: 'instagram',
        url: business.instagram_url,
        handle: business.instagram_handle,
      })
    }
    if (business.twitter_url) {
      socialMedia.push({
        platform: 'twitter',
        url: business.twitter_url,
        handle: business.twitter_handle,
      })
    }
    if (business.linkedin_url) {
      socialMedia.push({
        platform: 'linkedin',
        url: business.linkedin_url,
      })
    }
    if (business.youtube_url) {
      socialMedia.push({
        platform: 'youtube',
        url: business.youtube_url,
      })
    }
    if (business.tiktok_url) {
      socialMedia.push({
        platform: 'tiktok',
        url: business.tiktok_url,
        handle: business.tiktok_handle,
      })
    }

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
      insurance_verified: business.insurance_verified,
      background_check_verified: business.background_check_verified,
      services: servicesList,
      service_areas: serviceAreas?.map((sa: any) => sa.area_name) || [],
      photos: photos || [],
      ratings,
      socialMedia,
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
