import { paintings, drawings, allArtworks, type Artwork } from '@/lib/artwork-data'

describe('artwork-data', () => {
  function validateArtwork(artwork: Artwork) {
    expect(artwork.id).toBeTruthy()
    expect(artwork.title).toBeTruthy()
    expect(artwork.material).toBeTruthy()
    expect(artwork.src).toBeTruthy()
    expect(artwork.width).toBeGreaterThan(0)
    expect(artwork.height).toBeGreaterThan(0)
    expect(artwork.year).toBeGreaterThanOrEqual(2020)
    expect(artwork.year).toBeLessThanOrEqual(2030)
  }

  describe('paintings array', () => {
    it('has exactly 10 paintings', () => {
      expect(paintings).toHaveLength(10)
    })

    it('every painting has category "paintings"', () => {
      paintings.forEach((p) => {
        expect(p.category).toBe('paintings')
      })
    })

    it('every painting has a unique id starting with "p"', () => {
      const ids = paintings.map((p) => p.id)
      expect(new Set(ids).size).toBe(ids.length)
      ids.forEach((id) => {
        expect(id).toMatch(/^p\d+$/)
      })
    })

    it('every painting has valid fields', () => {
      paintings.forEach(validateArtwork)
    })

    it('every painting src matches /images/paintings/', () => {
      paintings.forEach((p) => {
        expect(p.src).toMatch(/^\/images\/paintings\//)
      })
    })
  })

  describe('drawings array', () => {
    it('has exactly 9 drawings', () => {
      expect(drawings).toHaveLength(9)
    })

    it('every drawing has category "drawings"', () => {
      drawings.forEach((d) => {
        expect(d.category).toBe('drawings')
      })
    })

    it('every drawing has a unique id starting with "d"', () => {
      const ids = drawings.map((d) => d.id)
      expect(new Set(ids).size).toBe(ids.length)
      ids.forEach((id) => {
        expect(id).toMatch(/^d\d+$/)
      })
    })

    it('every drawing has valid fields', () => {
      drawings.forEach(validateArtwork)
    })

    it('every drawing src matches /images/drawings/', () => {
      drawings.forEach((d) => {
        expect(d.src).toMatch(/^\/images\/drawings\//)
      })
    })
  })

  describe('allArtworks array', () => {
    it('has exactly 19 items (10 paintings + 9 drawings)', () => {
      expect(allArtworks).toHaveLength(19)
    })

    it('contains all paintings and drawings', () => {
      const allIds = allArtworks.map((a) => a.id)
      paintings.forEach((p) => expect(allIds).toContain(p.id))
      drawings.forEach((d) => expect(allIds).toContain(d.id))
    })

    it('all ids are unique across the combined array', () => {
      const ids = allArtworks.map((a) => a.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })
})
