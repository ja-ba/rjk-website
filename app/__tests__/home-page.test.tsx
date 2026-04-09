import { redirect } from 'next/navigation'
import HomePage from '@/app/page'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('REDIRECT') }),
}))

describe('HomePage', () => {
  it('redirects to /about', () => {
    expect(() => HomePage()).toThrow('REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/about')
  })
})
