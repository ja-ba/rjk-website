import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from '@/app/about/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}))

describe('AboutPage', () => {
  it('renders the heading "About"', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Rebecca Kleinberg is an artist based in Seattle, Washington. She is currently a second-year student in the Classical Atelier at Gage Academy of Art. She is interested in still life, landscape, figure, and abstract design.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the artist statement', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Artist statement' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'My work is inspired by the beauty and intrigue of our visual world and by my feeling of sympathy and connection with this world. In both my work from life and my abstract work, I think about expressing rhythm, balance, and harmony. In my representational work, I try to capture the specific character of people, places, and things. For me, making art is about communicating emotional truths and sharing my artistic vision.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the Instagram link', () => {
    render(<AboutPage />)
    expect(screen.getByText('Instagram')).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
  })
})
