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

vi.mock('virtual:@mcendon/astro-translate', () => mock)

beforeEach(() => {
  mock.default.trailingSlash = 'never'
  mock.default.BASE_URL = '/'
  mock.default.defaultLocale = 'en'
  vi.resetModules()
})

describe('getAllLocaleUrls', () => {
  it('returns all locale urls for non-default locale input', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/es/about')
    expect(result).toEqual({
      en: '/about',
      es: '/es/about',
      fr: '/fr/about',
    })
  })

  it('returns all locale urls for default locale input', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/about')
    expect(result).toEqual({
      en: '/about',
      es: '/es/about',
      fr: '/fr/about',
    })
  })

  it('handles locale root path', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/es')
    expect(result).toEqual({
      en: '/',
      es: '/es',
      fr: '/fr',
    })
  })

  it('returns all locale urls for root', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/')
    expect(result).toEqual({
      en: '/',
      es: '/es',
      fr: '/fr',
    })
  })

  it('handles URL objects', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const url = new URL('https://example.com/fr/about')
    const result = getAllLocaleUrls(url)
    expect(result).toEqual({
      en: '/about',
      es: '/es/about',
      fr: '/fr/about',
    })
  })

  it('strips .html extension', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/es/about.html')
    expect(result).toEqual({
      en: '/about',
      es: '/es/about',
      fr: '/fr/about',
    })
  })

  it('works with BASE_URL prefix', async () => {
    mock.default.BASE_URL = '/base'
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/base/es/about')
    expect(result).toEqual({
      en: '/base/about',
      es: '/base/es/about',
      fr: '/base/fr/about',
    })
  })

  it('avoids catching urls that look like locale prefix', async () => {
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/enigma')
    expect(result).toEqual({
      en: '/enigma',
      es: '/es/enigma',
      fr: '/fr/enigma',
    })
  })

  it('includes trailing slashes when config is always', async () => {
    mock.default.trailingSlash = 'always'
    const { getAllLocaleUrls } = await import('../getAllLocaleUrls')
    const result = getAllLocaleUrls('/es/about')
    expect(result).toEqual({
      en: '/about/',
      es: '/es/about/',
      fr: '/fr/about/',
    })
  })
})
