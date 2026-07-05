import { describe, it, expect, vi } from 'vitest'

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

describe('index exports', () => {
  it('re-exports config values', async () => {
    const mod = await import('../index')
    expect(mod.defaultLocale).toBe('en')
    expect(mod.locales).toEqual({
      en: 'English',
      es: 'Español',
      fr: 'Français',
    })
    expect(mod.localeKeys).toEqual(['en', 'es', 'fr'])
    expect(mod.trailingSlash).toBe('never')
    expect(mod.BASE_URL).toBe('/')
    expect(mod.build).toEqual({ format: 'directory' })
  })

  it('re-exports functions', async () => {
    const mod = await import('../index')
    expect(typeof mod.filterCollectionByDefaultLocale).toBe('function')
    expect(typeof mod.getCollectionParamsSlug).toBe('function')
    expect(typeof mod.getAllLocaleUrls).toBe('function')
    expect(typeof mod.getLocale).toBe('function')
    expect(typeof mod.getLocaleUrl).toBe('function')
    expect(typeof mod.getLocaleUrlPrefix).toBe('function')
    expect(typeof mod.getUrlWithoutLocale).toBe('function')
    expect(typeof mod.resolveTrailingSlash).toBe('function')
    expect(typeof mod.getTranslateHelper).toBe('function')
  })

  it('re-exports types', async () => {
    const mod = await import('../index')
    expect(mod.defaultI18nConfig).toBeDefined()
  })
})
