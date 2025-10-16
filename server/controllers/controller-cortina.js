import { validateCortina, validatePartialCortina } from '../Schemas/cortina.js'

export class CortinaController {
  constructor ({ cortinaModel }) {
    this.CortinaModel = cortinaModel
  }

  getAll = async (req, res) => {
    try {
      const { tipo, categorias } = req.query
      const filtros = {
        tipo: typeof tipo === 'string' && tipo.trim() !== '' ? tipo.trim() : undefined,
        categorias
      }
      const data = await this.CortinaModel.getAll(filtros)
      return res.status(200).json(data)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ message: 'Error listando', detail: e.message })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const cortina = await this.CortinaModel.getById({ id })
      if (!cortina) {
        return res.status(404).send('<h1>Cortina no encontrada</h1>')
      }
      return res.status(200).json(cortina)
    } catch (e) {
      console.error(e)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  create = async (req, res) => {
    try {
      const result = validateCortina(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.issues })
      }

      const nuevaCortina = await this.CortinaModel.create(result.data)
      return res.status(201).json(nuevaCortina)
    } catch (e) {
      console.error('create Cortina error:', e)
      return res.status(500).json({ error: 'Error en el servidor', detail: e.message })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const result = validatePartialCortina(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.issues })
      }

      const cortinaActualizada = await this.CortinaModel.update({
        id,
        input: result.data
      })

      if (!cortinaActualizada) {
        return res.status(404).send('<h1>Cortina no encontrada</h1>')
      }

      return res.status(200).json(cortinaActualizada)
    } catch (e) {
      console.error(e)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const ok = await this.CortinaModel.delete({ id })
      if (!ok) {
        return res.status(404).send('<h1>Cortina no encontrada</h1>')
      }

      return res.status(204).send()
    } catch (e) {
      console.error(e)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }
}
