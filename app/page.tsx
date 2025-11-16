import Image from 'next/image'
import Link from 'next/link'
import ClientSearchComponent from '@/components/ClientSearchComponent'

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
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-700 hover:text-primary-800">
              Nashville Cleaning Directory
            </Link>
            <div className="flex gap-4 items-center">
              <Link
                href="/auth/login"
                className="text-neutral-700 hover:text-primary-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Rotating Background Image */}
      <section className="relative h-[600px] w-full overflow-hidden bg-gray-900">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            priority
            sizes="100vw"
            quality={85}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            <h1 className="mb-4 text-center text-5xl font-bold text-white drop-shadow-lg md:text-6xl">
              Find Trusted Cleaning Services Near You
            </h1>
            <p className="mb-8 text-center text-lg text-white/95 drop-shadow font-medium md:text-xl">
              Connect with local cleaners, read reviews, and book with confidence
            </p>

            {/* Search Form Component */}
            <ClientSearchComponent />
          </div>
        </div>
      </section>

      {/* Results Section - Handled by ClientSearchComponent */}
      <ClientSearchComponent showResults={true} />

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Nashville Cleaning Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
