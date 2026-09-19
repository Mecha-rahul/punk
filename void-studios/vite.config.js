import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Frontend calls /api/v1/*; in dev the Vite server forwards those to the
    // Express backend on :8000 — same-origin from the browser's view, so the
    // httpOnly JWT cookies Just Work without any CORS setup.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
