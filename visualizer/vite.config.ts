import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/nutrition/',
  plugins: [react()],
  server: {
    // nutrition.csv lives at the repo root, one level above the Vite root
    fs: { allow: ['..'] },
  },
})
