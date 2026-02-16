import type { Artwork } from '@/lib/artwork-data'

let mockId = 0

export function createMockArtwork(overrides: Partial<Artwork> = {}): Artwork {
  mockId++
  return {
    id: `mock-${mockId}`,
    title: `Mock Artwork ${mockId}`,
    year: 2024,
    material: 'Oil on canvas, 100 x 100 cm',
    src: `/images/paintings/mock-${mockId}.jpg`,
    width: 4,
    height: 3,
    category: 'paintings',
    ...overrides,
  }
}

export function createMockArtworks(count: number, overrides: Partial<Artwork> = {}): Artwork[] {
  return Array.from({ length: count }, () => createMockArtwork(overrides))
}

export function resetMockId() {
  mockId = 0
}
