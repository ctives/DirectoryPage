import Link from 'next/link'

interface ClaimBusinessBannerProps {
  businessId: string
  businessName: string
}

export default function ClaimBusinessBanner({ businessId, businessName }: ClaimBusinessBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-300 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-600 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-neutral-900 mb-1">
            Is this your business?
          </h3>
          <p className="text-neutral-700 mb-4">
            Claim <strong>{businessName}</strong> to manage your listing, add photos, and respond to customers.
          </p>

          {/* CTA Button */}
          <Link
            href={`/claim/${businessId}`}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Claim This Business
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
