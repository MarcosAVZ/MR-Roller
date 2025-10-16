import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { TelaController } from '../controllers/controller-tela.js'

export const CreateTelaRouter = ({ telaModel }) => {
  const telasRouter = Router()

  const telaController = new TelaController({ telaModel })

  telasRouter.get('/', telaController.getAll)
  telasRouter.get('/:id', telaController.getById)
  telasRouter.post('/', upload.single('file'), telaController.create)
  telasRouter.patch('/:id', upload.single('file'), telaController.update)
  telasRouter.delete('/:id', telaController.delete)

  return telasRouter
}
