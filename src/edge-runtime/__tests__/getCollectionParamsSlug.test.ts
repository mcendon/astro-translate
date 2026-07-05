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

describe('getCollectionParamsSlug', () => {
  it('strips defaultLocale prefix from slugs', async () => {
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    const entries = [{ slug: 'en/about' }, { slug: 'en/products/item' }]
    const result = getCollectionParamsSlug(entries)
    expect(result).toEqual([
      { params: { slug: 'about' } },
      { params: { slug: 'products/item' } },
    ])
  })

  it('skips entries without slug property', async () => {
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    const entries = [
      { slug: 'en/about' },
      { name: 'test' },
      { slug: 'en/contact' },
    ]
    const result = getCollectionParamsSlug(entries)
    expect(result).toEqual([
      { params: { slug: 'about' } },
      { params: { slug: 'contact' } },
    ])
  })

  it('skips entries with non-string slug', async () => {
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    const entries = [{ slug: 'en/about' }, { slug: 123 }, null, undefined]
    const result = getCollectionParamsSlug(entries)
    expect(result).toEqual([{ params: { slug: 'about' } }])
  })

  it('returns empty array for empty input', async () => {
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    expect(getCollectionParamsSlug([])).toEqual([])
  })

  it('handles slugs without locale prefix', async () => {
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    const entries = [{ slug: 'about' }]
    const result = getCollectionParamsSlug(entries)
    expect(result).toEqual([{ params: { slug: 'about' } }])
  })

  it('respects custom defaultLocale', async () => {
    mock.default.defaultLocale = 'fr'
    const { getCollectionParamsSlug } =
      await import('../getCollectionParamsSlug')
    const entries = [{ slug: 'fr/apropos' }, { slug: 'en/about' }]
    const result = getCollectionParamsSlug(entries)
    expect(result).toEqual([
      { params: { slug: 'apropos' } },
      { params: { slug: 'en/about' } },
    ])
  })
})
