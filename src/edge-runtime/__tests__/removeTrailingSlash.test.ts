import { describe, it, expect } from 'vitest'
import { removeTrailingSlash } from '../removeTrailingSlash'

describe('removeTrailingSlash', () => {
  it('removes trailing slash', () => {
    expect(removeTrailingSlash('/about/')).toBe('/about')
  })

  it('returns path unchanged when no trailing slash', () => {
    expect(removeTrailingSlash('/about')).toBe('/about')
  })

  it('strips root slash to empty string', () => {
    expect(removeTrailingSlash('/')).toBe('')
  })

  it('handles empty string', () => {
    expect(removeTrailingSlash('')).toBe('')
  })

  it('removes trailing slash from nested path', () => {
    expect(removeTrailingSlash('/products/item/')).toBe('/products/item')
  })
})
