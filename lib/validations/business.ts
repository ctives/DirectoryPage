import { z } from 'zod'

export const BusinessProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(255, 'Business name must be less than 255 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  email: z
    .string()
    .email('Invalid email address'),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
  yearsInBusiness: z
    .number()
    .int()
    .min(0, 'Years in business must be 0 or greater')
    .max(100, 'Please enter a valid number'),
  serviceType: z.array(z.string()).min(1, 'Select at least one service type'),
  serviceAreas: z.array(z.string()).min(1, 'Select at least one service area'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  businessLicenseUrl: z.string().url('Invalid license URL').optional(),
  insuranceCertificateUrl: z.string().url('Invalid certificate URL').optional(),
  backgroundCheckUrl: z.string().url('Invalid background check URL').optional(),
})

export const QuoteRequestSchema = z.object({
  businessIds: z.array(z.string().uuid()).min(1, 'Select at least one business'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  serviceType: z
    .string()
    .min(1, 'Please select a service type'),
  propertyType: z
    .enum(['residential', 'commercial']),
  propertySizeSqft: z
    .number()
    .int()
    .positive('Property size must be greater than 0')
    .optional(),
  serviceAddress: z
    .string()
    .min(5, 'Please enter a valid address'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
  preferredDate: z
    .date()
    .refine((date) => date > new Date(), 'Date must be in the future')
    .optional(),
  frequency: z
    .enum(['one_time', 'weekly', 'bi_weekly', 'monthly'] as const)
    .optional(),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
})

export const ReviewSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  title: z
    .string()
    .min(5, 'Review title must be at least 5 characters')
    .max(100, 'Review title must be less than 100 characters'),
  reviewText: z
    .string()
    .min(20, 'Review must be at least 20 characters')
    .max(2000, 'Review must be less than 2000 characters'),
  serviceType: z
    .string()
    .min(1, 'Please select a service type'),
  serviceDate: z
    .date()
    .refine((date) => date <= new Date(), 'Service date must be in the past'),
  verificationMethod: z
    .enum(['quote_request', 'receipt_upload', 'email'] as const)
    .optional(),
  verificationPhotoUrl: z
    .string()
    .url('Invalid photo URL')
    .optional(),
})

export type BusinessProfileInput = z.infer<typeof BusinessProfileSchema>
export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>
export type ReviewInput = z.infer<typeof ReviewSchema>
