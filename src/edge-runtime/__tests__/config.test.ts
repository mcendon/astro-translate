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

describe('config', () => {
  it('exports trailingSlash', async () => {
    const { trailingSlash } = await import('../config')
    expect(trailingSlash).toBe('never')
  })

  it('exports BASE_URL defaulting to /', async () => {
    const { BASE_URL } = await import('../config')
    expect(BASE_URL).toBe('/')
  })

  it('uses BASE_URL from config when set', async () => {
    mock.default.BASE_URL = '/base'
    const { BASE_URL } = await import('../config')
    expect(BASE_URL).toBe('/base')
  })

  it('exports defaultLocale', async () => {
    const { defaultLocale } = await import('../config')
    expect(defaultLocale).toBe('en')
  })

  it('exports locales', async () => {
    const { locales } = await import('../config')
    expect(locales).toEqual({ en: 'English', es: 'Español', fr: 'Français' })
  })

  it('exports localeKeys derived from locales', async () => {
    const { localeKeys } = await import('../config')
    expect(localeKeys).toEqual(['en', 'es', 'fr'])
  })

  it('exports redirectDefaultLocale', async () => {
    const { redirectDefaultLocale } = await import('../config')
    expect(redirectDefaultLocale).toBe(false)
  })

  it('exports build', async () => {
    const { build } = await import('../config')
    expect(build).toEqual({ format: 'directory' })
  })
})
