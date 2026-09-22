import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // Jangan bundle file .mp4 sebagai modul — biarkan diakses sebagai path statis dari /public/videos/
  assetsInclude: [],
  build: {
    assetsInlineLimit: 0,
  }
})
