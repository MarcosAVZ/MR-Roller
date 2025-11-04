import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { ImagenController } from '../controllers/controller-imagen.js'

export const CreateImagenRouter = ({ imagenModel }) => {
  const imagenesRouter = Router()

  const imagenController = new ImagenController({ imagenModel })

  imagenesRouter.get('/', imagenController.getAll)
  imagenesRouter.get('/:id', imagenController.getById)
  imagenesRouter.post('/', upload.single('file'), imagenController.create)
  imagenesRouter.patch('/:id', upload.single('file'), imagenController.update)
  imagenesRouter.delete('/:id', imagenController.delete)

  return imagenesRouter
}
