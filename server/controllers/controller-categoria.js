import { validateCategoria, validatePartialCategoria } from '../Schemas/categoria.js'

export class CategoriaController {
  constructor ({ categoriaModel }) {
    this.CategoriaModel = categoriaModel
  }

  getAll = async (req, res) => {
    try {
      const resultado = await this.CategoriaModel.getAll()
      return res.status(200).json(resultado)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const categoria = await this.CategoriaModel.getById(id)
      if (!categoria) {
        return res.status(404).send('<h1>Categoría no encontrada</h1>')
      }
      return res.status(200).json(categoria)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  // controller
  create = async (req, res) => {
    try {
      const result = validateCategoria(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.issues })
      }

      const nuevaCategoria = await this.CategoriaModel.create(result.data)
      return res.status(201).json(nuevaCategoria)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const result = validatePartialCategoria(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.issues })
      }

      const categoriaActualizada = await this.CategoriaModel.update(id, { data: result.data })
      if (!categoriaActualizada) {
        return res.status(404).send('<h1>Categoría no encontrada</h1>')
      }

      return res.status(200).json(categoriaActualizada)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const result = await this.CategoriaModel.delete(id)
      if (result === false) {
        return res.status(404).send('<h1>Categoría no encontrada</h1>')
      }

      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }
}
