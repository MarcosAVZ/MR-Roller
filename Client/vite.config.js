import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'development'
    ? {
        port: 5173,
        proxy: {
          '/api/cortinas': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/api/imagenes': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/api/categorias': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/api/telas': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/api/uploads': {
            target: 'http://localhost:1234',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }
    : undefined
}))
