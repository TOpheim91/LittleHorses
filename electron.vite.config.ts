import { resolve } from 'path'
import { defineConfig } from 'electron-vite'

const sharedAlias = {
  '@shared': resolve(__dirname, 'src/shared'),
  '@three': resolve(__dirname, 'src/three')
}

export default defineConfig({
  main: {
    resolve: { alias: sharedAlias },
    build: {
      outDir: 'out/main',
      rollupOptions: {
        input: resolve(__dirname, 'src/main/main.ts')
      }
    }
  },
  preload: {
    resolve: { alias: sharedAlias },
    build: {
      outDir: 'out/preload',
      rollupOptions: {
        input: resolve(__dirname, 'src/main/preload.ts')
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    resolve: { alias: sharedAlias },
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.html')
      }
    }
  }
})
