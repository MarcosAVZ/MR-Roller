// routes/routes-cortinas.js
import { Router } from 'express'
import { CortinaController } from '../controllers/controller-cortina.js'
import { CortinaImagenController } from '../controllers/controller-cortina-imagen.js'

export const CreateCortinaRouter = ({ cortinaModel, cortinaImagenModel }) => {
  const cortinasRouter = Router()

  const cortinaController = new CortinaController({ cortinaModel })
  const cortinaImagenController = new CortinaImagenController({ cortinaImagenModel })

  // Rutas de cortinas
  cortinasRouter.get('/', cortinaController.getAll)
  cortinasRouter.get('/:id', cortinaController.getById)
  cortinasRouter.post('/', cortinaController.create)
  cortinasRouter.patch('/:id', cortinaController.update)
  cortinasRouter.delete('/:id', cortinaController.delete)

  // Rutas de imágenes asociadas a cortinas
  cortinasRouter.get('/:id/imagenes', cortinaImagenController.list)
  cortinasRouter.post('/:id/imagenes/link', cortinaImagenController.link)
  cortinasRouter.delete('/:id/imagenes/:imagenId', cortinaImagenController.unlink)

  return cortinasRouter
}
