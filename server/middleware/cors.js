import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173', // Cliente Vite
  'http://localhost:1234', // Servidor
  'https://movies.com',
  'https://midu.dev'
]
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (!origin || acceptedOrigins.includes(origin)) {
      callback(null, true)
    }
  }
})
