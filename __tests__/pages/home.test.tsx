/**
 * Tests for the homepage component
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  }))
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }: any) => children
})

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Suppress console.error for this test suite
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('Homepage', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Page structure', () => {
    it('should render the page title', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      const title = screen.getByText('Find Trusted Cleaning Services Near You')
      expect(title).toBeInTheDocument()
    })

    it('should render the hero subtitle', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      const subtitle = screen.getByText('Connect with local cleaners, read reviews, and book with confidence')
      expect(subtitle).toBeInTheDocument()
    })

    it('should render the search form', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toBeInTheDocument()
    })
  })

  describe('Search functionality', () => {
    it('should update search query on input change', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      const user = userEvent.setup()
      render(<Home />)

      const searchInput = screen.getByPlaceholderText(/Search by name, zip code, or neighborhood/)
      await user.type(searchInput, 'Test')

      expect(searchInput).toHaveValue('Test')
    })

    it('should handle search form submission', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], count: 0 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], count: 0 })
        })

      const user = userEvent.setup()
      render(<Home />)

      const searchInput = screen.getByPlaceholderText(/Search by name, zip code, or neighborhood/)
      const searchButton = screen.getByRole('button', { name: 'Search' })

      await user.type(searchInput, 'Sparkle')
      await user.click(searchButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('query=Sparkle')
        )
      })
    })
  })

  describe('Navigation', () => {
    it('should render navigation bar with brand name', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      expect(screen.getByText('Nashville Cleaning Directory')).toBeInTheDocument()
    })
  })
})
