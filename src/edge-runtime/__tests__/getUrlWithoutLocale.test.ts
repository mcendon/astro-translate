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

describe('getUrlWithoutLocale', () => {
  it('strips locale prefix from url', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/es/about')).toBe('/about')
  })

  it('returns url unchanged for default locale', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/about')).toBe('/about')
  })

  it('handles locale root path', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/es')).toBe('/')
  })

  it('avoids catching urls that look like locale prefix', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/enigma')).toBe('/enigma')
  })

  it('handles URL objects', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    const url = new URL('https://example.com/fr/about')
    expect(getUrlWithoutLocale(url)).toBe('/about')
  })

  it('strips .html extension', async () => {
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/es/about.html')).toBe('/about')
  })

  it('works with BASE_URL prefix', async () => {
    mock.default.BASE_URL = '/base'
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/base/es/about')).toBe('/base/about')
    expect(getUrlWithoutLocale('/base/about')).toBe('/base/about')
  })

  it('returns root for locale root with BASE_URL', async () => {
    mock.default.BASE_URL = '/base'
    const { getUrlWithoutLocale } = await import('../getUrlWithoutLocale')
    expect(getUrlWithoutLocale('/base/es')).toBe('/base')
  })
})
