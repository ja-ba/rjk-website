import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RebuildPage from '@/app/rebuild/page'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('RebuildPage', () => {
  it('renders password input and both buttons', () => {
    render(<RebuildPage />)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /staging/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /promote/i })).toBeInTheDocument()
  })

  it('buttons are disabled when password is empty', () => {
    render(<RebuildPage />)
    expect(screen.getByRole('button', { name: /staging/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /promote/i })).toBeDisabled()
  })

  it('buttons are enabled once password is entered', async () => {
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    expect(screen.getByRole('button', { name: /staging/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /promote/i })).not.toBeDisabled()
  })

  it('calls staging endpoint with Bearer header on Staging click', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ triggered: true }),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    expect(mockFetch).toHaveBeenCalledWith('/api/rebuild/staging', {
      method: 'POST',
      headers: { Authorization: 'Bearer mysecret' },
    })
  })

  it('calls promote endpoint with Bearer header on Promote click', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ triggered: true }),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /promote/i }))
    expect(mockFetch).toHaveBeenCalledWith('/api/rebuild/promote', {
      method: 'POST',
      headers: { Authorization: 'Bearer mysecret' },
    })
  })

  it('shows success message after staging is triggered', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ triggered: true }),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    await waitFor(() =>
      expect(screen.getByText(/staging rebuild triggered/i)).toBeInTheDocument()
    )
  })

  it('shows success message after promote is triggered', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ triggered: true }),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /promote/i }))
    await waitFor(() =>
      expect(screen.getByText(/production promote triggered/i)).toBeInTheDocument()
    )
  })

  it('shows error message on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    await waitFor(() =>
      expect(screen.getByText('Unauthorized')).toBeInTheDocument()
    )
  })

  it('shows error message on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    await waitFor(() =>
      expect(screen.getByText(/could not reach the server/i)).toBeInTheDocument()
    )
  })

  it('shows error when res.ok but data.triggered is missing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    await waitFor(() =>
      expect(screen.getByText(/rebuild status is unknown/i)).toBeInTheDocument()
    )
  })

  it('shows error when response body is not valid JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError('Unexpected token') },
    })
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    await waitFor(() =>
      expect(screen.getByText(/unexpected format/i)).toBeInTheDocument()
    )
  })

  it('disables buttons and shows ellipsis while fetch is in flight', async () => {
    let resolveFetch!: (value: unknown) => void
    mockFetch.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))
    render(<RebuildPage />)
    await userEvent.type(screen.getByLabelText(/password/i), 'mysecret')
    await userEvent.click(screen.getByRole('button', { name: /staging/i }))
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
      expect(btn).toHaveTextContent('…')
    })
    resolveFetch({ ok: true, json: async () => ({ triggered: true }) })
  })
})
