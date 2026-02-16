import { reducer } from '@/hooks/use-toast'

describe('toast reducer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const makeToast = (id: string) => ({
    id,
    title: `Toast ${id}`,
    open: true,
  })

  describe('ADD_TOAST', () => {
    it('adds a toast to an empty state', () => {
      const state = { toasts: [] }
      const toast = makeToast('1')
      const result = reducer(state, { type: 'ADD_TOAST', toast })
      expect(result.toasts).toHaveLength(1)
      expect(result.toasts[0].id).toBe('1')
    })

    it('prepends new toast (newest first)', () => {
      const state = { toasts: [makeToast('1')] }
      const toast = makeToast('2')
      const result = reducer(state, { type: 'ADD_TOAST', toast })
      expect(result.toasts[0].id).toBe('2')
    })

    it('enforces TOAST_LIMIT of 1', () => {
      const state = { toasts: [makeToast('1')] }
      const toast = makeToast('2')
      const result = reducer(state, { type: 'ADD_TOAST', toast })
      expect(result.toasts).toHaveLength(1)
      expect(result.toasts[0].id).toBe('2')
    })
  })

  describe('UPDATE_TOAST', () => {
    it('updates toast properties by id', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, {
        type: 'UPDATE_TOAST',
        toast: { id: '1', title: 'Updated' },
      })
      expect(result.toasts[0].title).toBe('Updated')
    })

    it('leaves other toasts unchanged', () => {
      // Since TOAST_LIMIT is 1, test with a single toast
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, {
        type: 'UPDATE_TOAST',
        toast: { id: 'nonexistent', title: 'Updated' },
      })
      expect(result.toasts[0].title).toBe('Toast 1')
    })
  })

  describe('DISMISS_TOAST', () => {
    it('sets open to false for a specific toast by id', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' })
      expect(result.toasts[0].open).toBe(false)
    })

    it('sets open to false for all toasts when toastId is undefined', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, { type: 'DISMISS_TOAST' })
      result.toasts.forEach((t) => expect(t.open).toBe(false))
    })
  })

  describe('REMOVE_TOAST', () => {
    it('removes a specific toast by id', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })
      expect(result.toasts).toHaveLength(0)
    })

    it('removes all toasts when toastId is undefined', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, { type: 'REMOVE_TOAST' })
      expect(result.toasts).toHaveLength(0)
    })

    it('returns unchanged state when removing non-existent id', () => {
      const state = { toasts: [makeToast('1')] }
      const result = reducer(state, { type: 'REMOVE_TOAST', toastId: 'nonexistent' })
      expect(result.toasts).toHaveLength(1)
    })
  })
})
