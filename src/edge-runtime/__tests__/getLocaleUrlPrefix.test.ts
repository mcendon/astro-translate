import { describe, it, expect, vi, afterEach } from 'vitest'

const mock = vi.hoisted(() => ({
  default: {
    trailingSlash: 'never' as const,
    BASE_URL: '/',
    defaultLocale: 'en',
    locales: { en: 'English', es: 'Español', fr: 'Français' },
    redirectDefaultLocale: false,
    build: { format: 'directory' },
  },
}))

vi.mock('virtual:@mcorg/astro-translate', () => mock)

afterEach(() => {
  vi.resetModules()
})

describe('getLocaleUrlPrefix', () => {
  it('returns locale prefix for non-default locale url', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/es/about')).toBe('/es')
  })

  it('returns empty string for default locale url', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/about')).toBe('')
  })

  it('returns locale prefix for locale root path', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/es')).toBe('/es')
  })

  it('avoids catching urls that look like locale prefix', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/enigma')).toBe('')
  })

  it('handles URL objects', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    const url = new URL('https://example.com/fr/about')
    expect(getLocaleUrlPrefix(url)).toBe('/fr')
  })

  it('strips .html extension', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/es/about.html')).toBe('/es')
  })

  it('works with BASE_URL prefix', async () => {
    mock.default.BASE_URL = '/base'
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/base/es/about')).toBe('/es')
    expect(getLocaleUrlPrefix('/base/about')).toBe('')
  })

  it('returns empty string for root', async () => {
    const { getLocaleUrlPrefix } = await import('../getLocaleUrlPrefix')
    expect(getLocaleUrlPrefix('/')).toBe('')
  })
})
