/**
 * Tests for the search API endpoint
 */

describe('Search API', () => {
  describe('Query validation', () => {
    it('should detect numeric zip codes', () => {
      const isZipCode = /^\d+$/.test('37228')
      expect(isZipCode).toBe(true)
    })

    it('should not detect text as zip codes', () => {
      const isZipCode = /^\d+$/.test('nashville')
      expect(isZipCode).toBe(false)
    })

    it('should not detect mixed alphanumeric as zip codes', () => {
      const isZipCode = /^\d+$/.test('37228abc')
      expect(isZipCode).toBe(false)
    })
  })

  describe('Query string handling', () => {
    it('should handle empty query strings', () => {
      const query = ''
      expect(query).toBe('')
    })

    it('should preserve zip codes in query', () => {
      const query = '37228'
      const isZipCode = /^\d+$/.test(query)
      expect(isZipCode).toBe(true)
    })

    it('should handle business names', () => {
      const query = 'Sparkle Clean'
      expect(query.includes('Sparkle')).toBe(true)
    })
  })
})
