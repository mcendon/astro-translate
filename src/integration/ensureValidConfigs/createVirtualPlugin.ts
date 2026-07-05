import type { Plugin } from 'vite'

// documentation https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

export function createVirtualPlugin(
  virtualModuleId: string,
  json: unknown
): Plugin {
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin:' + virtualModuleId, // required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(json)}`
      }
      return null
    },
  }
}
