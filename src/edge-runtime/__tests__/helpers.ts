export interface MockVirtualConfig {
  trailingSlash: 'always' | 'never' | 'ignore'
  BASE_URL: string
  defaultLocale: string
  locales: Record<string, string>
  redirectDefaultLocale: boolean | number
  build: { format: string }
}

export const defaultMockConfig: MockVirtualConfig = {
  trailingSlash: 'never',
  BASE_URL: '/',
  defaultLocale: 'en',
  locales: { en: 'English', es: 'Español', fr: 'Français' },
  redirectDefaultLocale: false,
  build: { format: 'directory' },
}
