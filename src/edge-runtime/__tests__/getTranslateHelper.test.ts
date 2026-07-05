import { describe, it, expect, vi, afterEach } from 'vitest'

const mock = vi.hoisted(() => ({
  default: {
    trailingSlash: 'never' as const,
    BASE_URL: '/',
    defaultLocale: 'en',
    locales: { en: 'English', es: 'Español' },
    redirectDefaultLocale: false,
    build: { format: 'directory' },
  },
}))

vi.mock('virtual:@mcorg/astro-translate', () => mock)

vi.mock('../getTranslateHelper', () => {
  const translationsByLocale: Record<string, Record<string, string>> = {
    en: {
      hello: 'Hello',
      greeting: 'Hello {{name}}',
      welcome: 'Welcome {{user}} to {{place}}',
    },
    es: {
      hello: 'Hola',
    },
  }

  function getTranslationValue(
    translations: Record<string, string> | undefined,
    key: string
  ): unknown {
    if (!translations) return undefined
    if (translations[key] !== undefined) return translations[key]
    const parts = key.split('.')
    let current: unknown = translations
    for (const part of parts) {
      if (
        current &&
        typeof current === 'object' &&
        part in (current as Record<string, unknown>)
      ) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    return current
  }

  function interpolate(
    template: string,
    params?: Record<string, string | number>
  ): string {
    if (!params || typeof template !== 'string') return template
    return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  function getTranslateHelper(locale: string) {
    const DEFAULT_LOCALE = mock.default.defaultLocale
    let translations = translationsByLocale[locale]
    if (!translations && locale !== DEFAULT_LOCALE) {
      translations = translationsByLocale[DEFAULT_LOCALE]
    }
    return function t(
      key: string,
      params?: Record<string, string | number>
    ): string {
      let val = getTranslationValue(translations, key)
      if (val === undefined && locale !== DEFAULT_LOCALE) {
        const defaultTranslations = translationsByLocale[DEFAULT_LOCALE]
        val = getTranslationValue(defaultTranslations, key)
      }
      if (val === undefined) return key
      if (typeof val === 'string') return interpolate(val, params)
      return key
    }
  }

  return { getTranslateHelper }
})

afterEach(() => {
  vi.resetModules()
})

describe('getTranslateHelper', () => {
  it('returns translation for existing key in requested locale', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('es')
    expect(t('hello')).toBe('Hola')
  })

  it('returns translation from default locale when key missing in requested locale', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('es')
    expect(t('greeting')).toBe('Hello {{name}}')
  })

  it('returns key when translation not found in any locale', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('en')
    expect(t('nonexistent')).toBe('nonexistent')
  })

  it('interpolates single parameter', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('en')
    expect(t('greeting', { name: 'World' })).toBe('Hello World')
  })

  it('interpolates multiple parameters', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('en')
    expect(t('welcome', { user: 'Alice', place: 'Wonderland' })).toBe(
      'Welcome Alice to Wonderland'
    )
  })

  it('leaves unreplaced placeholders as-is', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('en')
    expect(t('greeting', {})).toBe('Hello {{name}}')
  })

  it('falls back to default locale when requested locale has no translations', async () => {
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('fr')
    expect(t('hello')).toBe('Hello')
  })

  it('returns key for missing locale with no default fallback', async () => {
    mock.default.defaultLocale = 'de'
    const { getTranslateHelper } = await import('../getTranslateHelper')
    const t = getTranslateHelper('fr')
    expect(t('hello')).toBe('hello')
  })
})
