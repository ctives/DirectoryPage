'use client'

import { Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react'

interface SocialMedia {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  url: string
  handle?: string
}

interface SocialMediaLinksProps {
  socialMedia: SocialMedia[]
}

export default function SocialMediaLinks({ socialMedia }: SocialMediaLinksProps) {
  if (!socialMedia || socialMedia.length === 0) {
    return null
  }

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={20} />
      case 'instagram':
        return <Instagram size={20} />
      case 'twitter':
        return <Twitter size={20} />
      case 'linkedin':
        return <Linkedin size={20} />
      case 'youtube':
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case 'tiktok':
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.92-3v3.75a6.74 6.74 0 1 0 5.92 6.75V9.01a9.26 9.26 0 0 0 6.59-6.86l-.09-.02A4.15 4.15 0 0 1 19.59 6.69z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'hover:text-blue-600 hover:bg-blue-50'
      case 'instagram':
        return 'hover:text-pink-600 hover:bg-pink-50'
      case 'twitter':
        return 'hover:text-sky-600 hover:bg-sky-50'
      case 'linkedin':
        return 'hover:text-blue-700 hover:bg-blue-50'
      case 'youtube':
        return 'hover:text-red-600 hover:bg-red-50'
      case 'tiktok':
        return 'hover:text-black hover:bg-gray-100'
      default:
        return 'hover:text-gray-600 hover:bg-gray-50'
    }
  }

  const getPlatformLabel = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {socialMedia.map((social, idx) => (
        <a
          key={idx}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${getPlatformLabel(social.platform)} ${social.handle ? `- ${social.handle}` : ''}`}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 transition ${getPlatformColor(
            social.platform
          )}`}
          aria-label={`Visit ${getPlatformLabel(social.platform)}`}
        >
          {getIcon(social.platform)}
        </a>
      ))}
    </div>
  )
}
