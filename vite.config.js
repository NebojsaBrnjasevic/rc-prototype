import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages serves the app from a sub-folder (/rc-prototype/).
// The deploy workflow sets BASE_PATH; local dev and preview stay on '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
