import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data for random generation
const businessNamePrefixes = [
  'Sparkle', 'Crystal', 'Pristine', 'Elite', 'Premium', 'Perfect',
  'Supreme', 'Professional', 'Expert', 'Quality', 'Reliable', 'Star'
]

const businessNameSuffixes = [
  'Clean', 'Cleaning', 'Services', 'Solutions', 'Care', 'Maintenance',
  'Specialists', 'Professionals', 'Team', 'Group', 'Company', 'Partners'
]

const neighborhoods = [
  'Downtown', 'East Nashville', 'West Nashville', 'Sylvan Park', 'Business District',
  'Green Hills', 'Germantown', 'Belmont', 'Hillsboro', 'Murfreesboro Pike'
]

const nashvilleZipCodes = [
  '37201', '37202', '37203', '37204', '37205', '37206', '37207', '37208',
  '37209', '37210', '37211', '37212', '37213', '37214', '37215', '37216',
  '37217', '37218', '37219', '37220', '37221', '37222', '37224', '37228'
]

const streets = [
  'Broadway', 'Main Street', 'Church Street', 'Charlotte Avenue', 'Jefferson Street',
  'Dickerson Pike', 'Murfreesboro Pike', 'Gallatin Pike', 'Nolensville Pike', 'White Bridge Road'
]

const descriptions = [
  'Professional cleaning services with years of experience',
  'Dedicated to providing exceptional cleaning solutions',
  'Trusted by Nashville residents for quality and reliability',
  'Award-winning cleaning team serving the Nashville area',
  'Committed to excellence in every cleaning project',
  'Your trusted partner for spotless spaces',
  'Premium cleaning services tailored to your needs',
  'Eco-friendly cleaning solutions for modern homes',
  'Fast, reliable, and affordable cleaning services',
  'Transforming spaces with professional care'
]

const serviceCategories = [
  'residential_deep_clean',
  'residential_regular',
  'commercial_office',
  'commercial_janitorial',
  'carpet_cleaning',
  'window_cleaning',
  'post_construction'
]

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomBusiness() {
  const serviceType = randomElement(['residential', 'commercial', 'both'])
  const firstName = randomElement(businessNamePrefixes)
  const lastName = randomElement(businessNameSuffixes)
  const businessName = `${firstName} ${lastName}`

  const streetNumber = randomRange(100, 9999)
  const street = randomElement(streets)
  const address = `${streetNumber} ${street}`

  const zipCode = randomElement(nashvilleZipCodes)
  const yearsInBusiness = randomRange(1, 20)
  const rating = Number((randomRange(38, 50) / 10).toFixed(1)) // 3.8 to 5.0
  const reviewCount = randomRange(10, 500)

  return {
    name: businessName,
    description: randomElement(descriptions),
    phone: `${randomRange(100, 999)}-${randomRange(100, 999)}-${randomRange(1000, 9999)}`,
    email: `info@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
    website: `https://www.${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
    address,
    city: 'Nashville',
    state: 'TN',
    zip_code: zipCode,
    years_in_business: yearsInBusiness,
    service_type: serviceType,
    status: 'active',
    verified: randomElement([true, false]),
    insurance_verified: randomElement([true, false]),
    background_check_verified: randomElement([true, false]),
    average_rating: rating,
    review_count: reviewCount,
    subscription_tier: randomElement(['starter', 'professional', 'enterprise'])
  }
}

function generateServiceAreas(businessId: string) {
  const numAreas = randomRange(2, 5)
  const selectedNeighborhoods = new Set<string>()

  while (selectedNeighborhoods.size < numAreas) {
    selectedNeighborhoods.add(randomElement(neighborhoods))
  }

  return Array.from(selectedNeighborhoods).map(neighborhood => ({
    business_id: businessId,
    area_type: 'neighborhood',
    area_name: neighborhood,
    zip_code: randomElement(nashvilleZipCodes)
  }))
}

function generateServices(businessId: string) {
  const numServices = randomRange(2, 5)
  const selectedCategories = new Set<string>()

  while (selectedCategories.size < numServices) {
    selectedCategories.add(randomElement(serviceCategories))
  }

  return Array.from(selectedCategories).map(category => ({
    business_id: businessId,
    category,
    name: category.replace(/_/g, ' ').toUpperCase(),
    description: randomElement(descriptions),
    frequency: randomElement(['one_time', 'weekly', 'bi_weekly', 'monthly']),
    estimated_price_min: randomRange(50, 200),
    estimated_price_max: randomRange(200, 1000)
  }))
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed with 50 random businesses...\n')

    // Generate 50 random businesses
    const businesses = Array.from({ length: 50 }, () => generateRandomBusiness())

    console.log(`📝 Inserting ${businesses.length} businesses...`)
    const { data: insertedBusinesses, error: businessError } = await supabase
      .from('businesses')
      .insert(businesses)
      .select('id')

    if (businessError) {
      console.error('❌ Error inserting businesses:', businessError)
      process.exit(1)
    }

    if (!insertedBusinesses || insertedBusinesses.length === 0) {
      console.error('❌ No businesses were inserted')
      process.exit(1)
    }

    console.log(`✅ Successfully inserted ${insertedBusinesses.length} businesses`)

    // Insert service areas for each business
    console.log(`\n📍 Inserting service areas...`)
    let totalServiceAreas = 0

    for (const business of insertedBusinesses) {
      const serviceAreas = generateServiceAreas(business.id)
      const { error: areaError } = await supabase
        .from('service_areas')
        .insert(serviceAreas)

      if (areaError) {
        console.error(`❌ Error inserting service areas for business ${business.id}:`, areaError)
        continue
      }

      totalServiceAreas += serviceAreas.length
    }

    console.log(`✅ Successfully inserted ${totalServiceAreas} service areas`)

    // Insert services for each business
    console.log(`\n🛠️  Inserting services...`)
    let totalServices = 0

    for (const business of insertedBusinesses) {
      const services = generateServices(business.id)
      const { error: serviceError } = await supabase
        .from('services')
        .insert(services)

      if (serviceError) {
        console.error(`❌ Error inserting services for business ${business.id}:`, serviceError)
        continue
      }

      totalServices += services.length
    }

    console.log(`✅ Successfully inserted ${totalServices} services`)

    console.log(`\n🎉 Seed completed successfully!`)
    console.log(`   - ${insertedBusinesses.length} businesses`)
    console.log(`   - ${totalServiceAreas} service areas`)
    console.log(`   - ${totalServices} services`)

  } catch (error) {
    console.error('❌ Unexpected error during seed:', error)
    process.exit(1)
  }
}

seedDatabase()
