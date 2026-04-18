import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        credentials: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/system-diagnostic-v2': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
