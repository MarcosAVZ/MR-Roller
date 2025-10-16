import { Router } from 'express'
import { CortinaController } from '../controllers/controller-cortina.js'
import { ImagenController } from '../controllers/controller-imagen.js'

export const CreateCortinaRouter = ({ cortinaModel, imagenModel }) => {
  const cortinasRouter = Router()

  const cortinaController = new CortinaController({ cortinaModel })
  const imagenController = new ImagenController({ imagenModel })

  cortinasRouter.get('/', cortinaController.getAll)
  cortinasRouter.get('/:id', cortinaController.getById)
  cortinasRouter.post('/', cortinaController.create)
  cortinasRouter.patch('/:id', cortinaController.update)
  cortinasRouter.delete('/:id', cortinaController.delete)

  // imágenes vinculadas a una cortina
  cortinasRouter.get('/:cortinaId/imagenes', imagenController.getByCortinaId)

  return cortinasRouter
}
