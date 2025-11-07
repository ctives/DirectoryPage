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

      const title = screen.getByText('Find Cleaning Services in Nashville')
      expect(title).toBeInTheDocument()
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

    it('should load businesses on component mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/search')
      })
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

  describe('Business display', () => {
    it('should display empty state when no results found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })

      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/No businesses found/)).toBeInTheDocument()
      })
    })

    it('should display business names when data loads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: '1',
              name: 'Sparkle Clean',
              description: 'Professional cleaning',
              average_rating: 4.5,
              review_count: 20,
              service_type: 'residential',
              zip_code: '37201',
              address: '123 Main St'
            }
          ],
          count: 1
        })
      })

      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('Sparkle Clean')).toBeInTheDocument()
      })
    })
  })
})
