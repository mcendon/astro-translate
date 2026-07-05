import { describe, it, expect } from 'vitest'
import { removeHtmlExtension } from '../removeHtmlExtension'

describe('removeHtmlExtension', () => {
  it('removes .html extension', () => {
    expect(removeHtmlExtension('/about.html')).toBe('/about')
  })

  it('returns url unchanged when no .html extension', () => {
    expect(removeHtmlExtension('/about')).toBe('/about')
  })

  it('handles root path', () => {
    expect(removeHtmlExtension('/')).toBe('/')
  })

  it('handles nested paths with .html', () => {
    expect(removeHtmlExtension('/products/item.html')).toBe('/products/item')
  })

  it('handles empty string', () => {
    expect(removeHtmlExtension('')).toBe('')
  })

  it('does not strip .html in the middle of the path', () => {
    expect(removeHtmlExtension('/html/about')).toBe('/html/about')
  })
})
