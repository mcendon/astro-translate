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

vi.mock('virtual:@mcendon/astro-translate', () => mock)

afterEach(() => {
  vi.resetModules()
})

describe('getLocale', () => {
  it('returns locale key for url with locale prefix', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/es/about')).toBe('es')
  })

  it('returns defaultLocale for url without locale prefix', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/about')).toBe('en')
  })

  it('avoids catching urls that start with locale key but are not actual locale prefix', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/enigma')).toBe('en')
  })

  it('handles locale prefix at root', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/es')).toBe('es')
    expect(getLocale('/en')).toBe('en')
  })

  it('handles URL objects', async () => {
    const { getLocale } = await import('../getLocale')
    const url = new URL('https://example.com/fr/about')
    expect(getLocale(url)).toBe('fr')
  })

  it('handles .html extension', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/es/about.html')).toBe('es')
  })

  it('returns defaultLocale for home page without locale', async () => {
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/')).toBe('en')
  })

  it('works with BASE_URL prefix', async () => {
    mock.default.BASE_URL = '/base'
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/base/es/about')).toBe('es')
    expect(getLocale('/base/about')).toBe('en')
  })

  it('works with BASE_URL and locale at root', async () => {
    mock.default.BASE_URL = '/base'
    const { getLocale } = await import('../getLocale')
    expect(getLocale('/base/es')).toBe('es')
    expect(getLocale('/base/en')).toBe('en')
  })
})
