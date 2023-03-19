import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VGrid',
      fileName: 'vgrid',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
