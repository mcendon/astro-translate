import { describe, it, expect, vi, beforeEach } from 'vitest'

const mock = vi.hoisted(() => ({
  default: {
    trailingSlash: 'never',
    BASE_URL: '/',
    defaultLocale: 'en',
    locales: { en: 'English', es: 'Español', fr: 'Français' },
    redirectDefaultLocale: false,
    build: { format: 'directory' },
  },
}))

vi.mock('virtual:@mcorg/astro-translate', () => mock)

describe('resolveTrailingSlash', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('ignores trailing slash when config is never', async () => {
    mock.default.trailingSlash = 'never'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    expect(resolveTrailingSlash('/about')).toBe('/about')
    expect(resolveTrailingSlash('/about/')).toBe('/about')
  })

  it('preserves root slash when config is never', async () => {
    mock.default.trailingSlash = 'never'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    expect(resolveTrailingSlash('/')).toBe('/')
  })

  it('adds trailing slash when config is always', async () => {
    mock.default.trailingSlash = 'always'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    expect(resolveTrailingSlash('/about')).toBe('/about/')
    expect(resolveTrailingSlash('/about/')).toBe('/about/')
  })

  it('preserves root slash when config is always', async () => {
    mock.default.trailingSlash = 'always'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    expect(resolveTrailingSlash('/')).toBe('/')
  })

  it('passes through url unchanged when config is ignore', async () => {
    mock.default.trailingSlash = 'ignore'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    expect(resolveTrailingSlash('/about')).toBe('/about')
    expect(resolveTrailingSlash('/about/')).toBe('/about/')
  })

  it('handles URL objects', async () => {
    mock.default.trailingSlash = 'never'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    const url = new URL('https://example.com/about')
    expect(resolveTrailingSlash(url)).toBe('/about')
  })

  it('handles URL objects with trailingSlash=always', async () => {
    mock.default.trailingSlash = 'always'
    const { resolveTrailingSlash } = await import('../resolveTrailingSlash')
    const url = new URL('https://example.com/about')
    expect(resolveTrailingSlash(url)).toBe('/about/')
  })
})
