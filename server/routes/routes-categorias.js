import { Router } from 'express'
import { CategoriaController } from '../controllers/controller-categoria.js'

export const CreateCategoriaRouter = ({ categoriaModel }) => {
  const categoriasRouter = Router()

  const categoriaController = new CategoriaController({ categoriaModel })

  categoriasRouter.get('/', categoriaController.getAll)
  categoriasRouter.get('/:id', categoriaController.getById)
  categoriasRouter.post('/', categoriaController.create)
  categoriasRouter.patch('/:id', categoriaController.update)
  categoriasRouter.delete('/:id', categoriaController.delete)

  return categoriasRouter
}
