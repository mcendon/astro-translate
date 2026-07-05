import { describe, it, expect, vi, beforeEach } from 'vitest'

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

beforeEach(() => {
  mock.default.BASE_URL = '/'
  mock.default.trailingSlash = 'never'
  mock.default.defaultLocale = 'en'
  vi.resetModules()
})

describe('getLocaleUrl', () => {
  it('converts locale-prefixed url to default locale', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/es/about', 'en')).toBe('/about')
  })

  it('switches from one locale to another', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/es/about', 'fr')).toBe('/fr/about')
  })

  it('adds locale prefix to default locale url', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/about', 'es')).toBe('/es/about')
  })

  it('handles locale root path', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/es', 'en')).toBe('/')
    expect(getLocaleUrl('/es', 'fr')).toBe('/fr')
  })

  it('handles default locale when input is default locale', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/about', 'en')).toBe('/about')
  })

  it('handles URL objects', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    const url = new URL('https://example.com/es/about')
    expect(getLocaleUrl(url, 'fr')).toBe('/fr/about')
  })

  it('strips .html extension', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/es/about.html', 'fr')).toBe('/fr/about')
  })

  it('works with BASE_URL prefix', async () => {
    mock.default.BASE_URL = '/base'
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/base/es/about', 'en')).toBe('/base/about')
    expect(getLocaleUrl('/base/es/about', 'fr')).toBe('/base/fr/about')
    expect(getLocaleUrl('/base/about', 'es')).toBe('/base/es/about')
  })

  it('avoids catching urls that look like locale but are not', async () => {
    const { getLocaleUrl } = await import('../getLocaleUrl')
    expect(getLocaleUrl('/enigma', 'es')).toBe('/es/enigma')
    expect(getLocaleUrl('/enigma', 'en')).toBe('/enigma')
  })
})
