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

// Sample photo URLs - using direct image links that are more reliable
const cleaningPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Professional residential cleaning service'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Kitchen and countertop cleaning'
  },
  {
    url: 'https://images.unsplash.com/photo-1585421514407-46a2ffc4330d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Bathroom deep cleaning'
  },
  {
    url: 'https://images.unsplash.com/photo-1577805643033-4e2e4b7a7a5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Living room sanitization'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Office space cleaning'
  },
  {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Commercial building maintenance'
  }
]

async function seedPhotos() {
  try {
    console.log('📸 Starting business photos seed...\n')

    // Get the first two active businesses
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('status', 'active')
      .limit(2)

    if (businessError) {
      console.error('❌ Error fetching businesses:', businessError)
      process.exit(1)
    }

    if (!businesses || businesses.length === 0) {
      console.error('❌ No active businesses found. Please seed businesses first.')
      process.exit(1)
    }

    // First business: Single photo
    if (businesses.length > 0) {
      const business1 = businesses[0]
      console.log(`📷 Adding photos to: ${business1.name}`)

      const photo1 = {
        business_id: business1.id,
        photo_url: cleaningPhotos[0].url,
        caption: cleaningPhotos[0].caption,
        photo_type: 'portfolio',
        display_order: 0,
        is_primary: true
      }

      const { error: insertError1 } = await supabase
        .from('business_photos')
        .insert([photo1])

      if (insertError1) {
        console.error(`❌ Error adding photo to ${business1.name}:`, insertError1)
      } else {
        console.log(`✅ Added 1 photo to ${business1.name}`)
      }
    }

    // Second business: Multiple photos
    if (businesses.length > 1) {
      const business2 = businesses[1]
      console.log(`\n📷 Adding photos to: ${business2.name}`)

      const photos2 = [
        {
          business_id: business2.id,
          photo_url: cleaningPhotos[1].url,
          caption: cleaningPhotos[1].caption,
          photo_type: 'portfolio',
          display_order: 0,
          is_primary: true
        },
        {
          business_id: business2.id,
          photo_url: cleaningPhotos[2].url,
          caption: cleaningPhotos[2].caption,
          photo_type: 'portfolio',
          display_order: 1,
          is_primary: false
        },
        {
          business_id: business2.id,
          photo_url: cleaningPhotos[3].url,
          caption: cleaningPhotos[3].caption,
          photo_type: 'portfolio',
          display_order: 2,
          is_primary: false
        },
        {
          business_id: business2.id,
          photo_url: cleaningPhotos[4].url,
          caption: cleaningPhotos[4].caption,
          photo_type: 'before_after',
          display_order: 3,
          is_primary: false
        }
      ]

      const { error: insertError2 } = await supabase
        .from('business_photos')
        .insert(photos2)

      if (insertError2) {
        console.error(`❌ Error adding photos to ${business2.name}:`, insertError2)
      } else {
        console.log(`✅ Added ${photos2.length} photos to ${business2.name}`)
      }
    }

    console.log('\n🎉 Business photos seed completed successfully!')

  } catch (error) {
    console.error('❌ Unexpected error during seed:', error)
    process.exit(1)
  }
}

seedPhotos()
