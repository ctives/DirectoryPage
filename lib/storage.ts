import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Get Supabase Storage client for file uploads
 */
const getStorageClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Upload a photo to Supabase Storage
 * Path format: business-photos/{businessId}/{timestamp}-{filename}
 */
export const uploadBusinessPhoto = async ({
  businessId,
  file,
  userId,
}: {
  businessId: string
  file: File
  userId: string
}): Promise<{ url: string; path: string }> => {
  try {
    const supabase = getStorageClient()

    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('File must be an image (JPEG, PNG, WebP, or GIF)')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    const path = `${businessId}/${filename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('business-photos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('business-photos').getPublicUrl(path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Photo upload error:', error)
    throw error
  }
}

/**
 * Delete a photo from Supabase Storage
 */
export const deleteBusinessPhoto = async (path: string): Promise<void> => {
  try {
    const supabase = getStorageClient()

    const { error } = await supabase.storage
      .from('business-photos')
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Photo delete error:', error)
    throw error
  }
}

/**
 * Get public URL for a photo
 */
export const getPublicPhotoUrl = (path: string): string => {
  const supabase = getStorageClient()
  const {
    data: { publicUrl },
  } = supabase.storage.from('business-photos').getPublicUrl(path)
  return publicUrl
}
