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

describe('filterCollectionByDefaultLocale', () => {
  it('returns true for entry with slug starting with defaultLocale', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ slug: 'en/about' })).toBe(true)
  })

  it('returns false for entry with slug not starting with defaultLocale', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ slug: 'es/about' })).toBe(false)
  })

  it('returns false for entry with slug that does not have locale prefix', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ slug: 'about' })).toBe(false)
  })

  it('returns false for non-object entries', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale('string')).toBe(false)
    expect(filterCollectionByDefaultLocale(42)).toBe(false)
    expect(filterCollectionByDefaultLocale(null)).toBe(false)
    expect(filterCollectionByDefaultLocale(undefined)).toBe(false)
  })

  it('returns false for entries without slug property', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ name: 'test' })).toBe(false)
  })

  it('returns false for entries with non-string slug', async () => {
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ slug: 123 })).toBe(false)
  })

  it('respects custom defaultLocale', async () => {
    mock.default.defaultLocale = 'fr'
    const { filterCollectionByDefaultLocale } =
      await import('../filterCollectionByDefaultLocale')
    expect(filterCollectionByDefaultLocale({ slug: 'fr/about' })).toBe(true)
    expect(filterCollectionByDefaultLocale({ slug: 'en/about' })).toBe(false)
  })
})
