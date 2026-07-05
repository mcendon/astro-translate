import { defaultLocale } from './config'
import virtualTranslations from 'virtual:@mcorg/astro-translate/translations'

type TranslationMap = Record<string, string>

const translationsByLocale: Record<string, TranslationMap> = {}

// The virtual module 'virtual:@mcorg/astro-translate/translations' is a glob import
// handled by the integration's virtual module plugin.
// It resolves to the user's translation files.
const modules = virtualTranslations as Record<
  string,
  { default: TranslationMap }
>

for (const [filePath, module] of Object.entries(modules)) {
  // Extract filename without extension as the locale name (e.g., "../i18n/en.json" -> "en")
  const locale = filePath.split('/').pop()?.replace('.json', '')
  if (locale) {
    translationsByLocale[locale] = module.default
  }
}

// Default fallback locale.
const DEFAULT_LOCALE = defaultLocale

/**
 * Resolves a key (either flat or nested) from a translations object.
 */
function getTranslationValue(
  translations: TranslationMap | undefined,
  key: string
): unknown {
  if (!translations) return undefined

  // 1. Try flat key match first
  if (translations[key] !== undefined) {
    return translations[key]
  }

  // 2. Try nested path traversal (e.g. "hello.message")
  const parts = key.split('.')
  let current: TranslationMap | string = translations
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Replaces double curly-brace placeholders with params.
 * e.g., "Hello {{name}}" with { name: 'World' } -> "Hello World"
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params || typeof template !== 'string') return template
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

/**
 * Helper factory that takes a locale and returns a translation function.
 *
 * @param locale - The locale code (e.g. "en", "es")
 * @returns The translation function `t`
 */
export function getTranslateHelper(locale: string) {
  // Retrieve the translation map for the specified locale
  let translations = translationsByLocale[locale]

  // If target translation file is missing, fall back to default locale
  if (!translations && locale !== DEFAULT_LOCALE) {
    translations = translationsByLocale[DEFAULT_LOCALE]
  }

  return function t(
    key: string,
    params?: Record<string, string | number>
  ): string {
    let val = getTranslationValue(translations, key)

    // If key is not found in the target locale, try falling back to the default locale file
    if (val === undefined && locale !== DEFAULT_LOCALE) {
      const defaultTranslations = translationsByLocale[DEFAULT_LOCALE]
      val = getTranslationValue(defaultTranslations, key)
    }

    // If still not found, return the key itself
    if (val === undefined) {
      return key
    }

    if (typeof val === 'string') {
      return interpolate(val, params)
    }

    // If resolved value is an object or other type, fallback to key
    return key
  }
}
