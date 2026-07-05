/// <reference types="vite/client" />

declare module 'virtual:@mcorg/astro-translate' {
  const virtualConfig: import('./shared').VirtualAstroi18nautConfig
  export default virtualConfig
}

declare module 'virtual:@mcorg/astro-translate/translations' {
  const translations: Record<string, { default: Record<string, string> }>
  export default translations
}
