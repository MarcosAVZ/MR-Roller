// app.js
import express, { json } from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CreateCortinaRouter } from './routes/routes-cortinas.js'
import { CreateImagenRouter } from './routes/routes-imagenes.js'
import { CreateTelaRouter } from './routes/routes-telas.js'

import { corsMiddleware } from './middleware/cors.js'

// importa el modelo que vas a inyectar
import { CortinaImagenModel } from './models/Sql/model-cortina-imagen.js'

export const CreateApp = ({ cortinaModel, imagenModel, categoriaModel, telaModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware())

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  app.use(express.static(path.join(__dirname, 'public')))
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

  app.use('/cortinas', CreateCortinaRouter({ cortinaModel, cortinaImagenModel: CortinaImagenModel }))

  app.use('/imagenes', CreateImagenRouter({ imagenModel }))
  app.use('/telas', CreateTelaRouter({ telaModel }))

  const PORT = process.env.PORT || 1234
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}
