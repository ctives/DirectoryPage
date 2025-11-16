import Image from 'next/image'
import Link from 'next/link'
import SearchPageWrapper from '@/components/SearchPageWrapper'

// Hero images with unique alt text for each
const HERO_IMAGES = [
  {
    src: '/images/hero/kitchen-cleaning.jpg',
    alt: 'Professional kitchen cleaning service showing sparkling countertops and appliances',
  },
  {
    src: '/images/hero/bathroom-cleaning.jpg',
    alt: 'Deep bathroom cleaning and sanitization service',
  },
  {
    src: '/images/hero/living-room-cleaning.jpg',
    alt: 'Residential living room cleaning and organization',
  },
  {
    src: '/images/hero/office-cleaning.jpg',
    alt: 'Professional commercial office space cleaning',
  },
  {
    src: '/images/hero/window-cleaning.jpg',
    alt: 'Window and glass cleaning with professional results',
  },
] as const

// Revalidate page every 5 minutes to rotate hero images
export const revalidate = 300

export default function Home() {
  // Server-side random image selection
  const selectedImage = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]

  return (
    <SearchPageWrapper selectedImage={selectedImage} />
  )
}
