import { defineConfig } from 'tsdown'

export default defineConfig(async (options) => {
  return {
    ...options,
    clean: true,
    dts: false,
    entry: [
      'src/integration/index.ts',
      'src/edge-runtime/index.ts',
      'src/middleware/index.ts',
    ],
    format: ['esm', 'cjs'],
    // FUTURE: incremental builds when implemented https://github.com/egoist/tsup/issues/615
    // incremental: !options.watch,
    onSuccess:
      'tsc --emitDeclarationOnly --declaration --declarationMap --declarationDir ./dist',
    outDir: 'dist',
    shims: true,
    sourcemap: false,
  }
})
