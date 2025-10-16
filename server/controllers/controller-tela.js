import { validateTela, validatePartialTela } from '../Schemas/tela.js'

export class TelaController {
  constructor ({ telaModel }) {
    this.TelaModel = telaModel
  }

  getAll = async (req, res) => {
    try {
      const resultado = await this.TelaModel.getAll()
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

      const tela = await this.TelaModel.getById({ id })
      if (!tela) return res.status(404).send('<h1>Tela no encontrada</h1>')

      return res.status(200).json(tela)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  create = async (req, res) => {
    try {
      const result = validateTela(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.issues })
      }

      const nueva = await this.TelaModel.create({
        body: result.data,
        file: req.file
      })
      return res.status(201).json(nueva)
    } catch (e) {
      return res.status(500).json({ message: 'Error creando tela', detail: e.message })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const parsed = validatePartialTela(req.body || {})
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.issues })
      }

      const noTexto = Object.keys(parsed.data).length === 0
      const noArchivo = !req.file
      if (noTexto && noArchivo) {
        return res.status(400).json({ message: 'Debes enviar nombre y/o un archivo' })
      }

      const input = { ...parsed.data }
      if (typeof input.nombre === 'string') input.nombre = input.nombre.trim()

      const updated = await this.TelaModel.update({
        id,
        input,
        file: req.file || null
      })
      if (!updated) return res.status(404).json({ message: 'Tela no encontrada' })
      return res.json(updated)
    } catch (e) {
      return res.status(500).json({ message: 'Error actualizando tela', detail: e.message })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const ok = await this.TelaModel.delete({ id })
      if (!ok) return res.status(404).send('<h1>Tela no encontrada</h1>')

      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }
}
