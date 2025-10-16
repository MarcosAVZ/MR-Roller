import express, { json } from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CreateCortinaRouter } from './routes/routes-cortinas.js'
import { CreateImagenRouter } from './routes/routes-imagenes.js'
import { CreateCategoriaRouter } from './routes/routes-categorias.js'
import { CreateTelaRouter } from './routes/routes-telas.js'
import { corsMiddleware } from './middleware/cors.js'

export const CreateApp = ({ cortinaModel, imagenModel, categoriaModel, telaModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware({ acceptedOrigins: ['http://localhost:8080', 'http://localhost:1234'] }))

  // ▶️ calcula __dirname en ESM
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // sirve estáticos
  app.use(express.static(path.join(__dirname, 'public'))) // opcional (sirve /, /uploads, etc)
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))) // explícito

  app.use('/cortinas', CreateCortinaRouter({ cortinaModel, imagenModel }))
  app.use('/imagenes', CreateImagenRouter({ imagenModel }))
  app.use('/categorias', CreateCategoriaRouter({ categoriaModel }))
  app.use('/telas', CreateTelaRouter({ telaModel }))

  const PORT = process.env.PORT || 1234
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}
