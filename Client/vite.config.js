import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/cortinas': 'http://localhost:1234',
      '/imagenes': 'http://localhost:1234',
      '/categorias': 'http://localhost:1234',
      '/telas': 'http://localhost:1234',
      '/uploads': 'http://localhost:1234'
    }
  }
})
