export class ImagenController {
  constructor ({ imagenModel }) {
    this.ImagenModel = imagenModel
  }

  getAll = async (req, res) => {
    try {
      const resultado = await this.ImagenModel.getAll()
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

      const imagen = await this.ImagenModel.getById({ id })
      if (!imagen) return res.status(404).send('<h1>Imagen no encontrada</h1>')

      return res.status(200).json(imagen)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  getByCortinaId = async (req, res) => {
    try {
      const { cortinaId } = req.params
      if (!cortinaId) return res.status(400).json({ error: 'Falta el parámetro cortinaId' })

      const imagenes = await this.ImagenModel.getByCortinaId({ cortinaId })
      return res.status(200).json(imagenes)
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }

  create = async (req, res) => {
    try {
      const nuevaImagen = await this.ImagenModel.create({
        body: req.body,
        file: req.file ?? null
      })
      return res.status(201).json(nuevaImagen)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: error.message })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const updated = await this.ImagenModel.update({
        id,
        input: req.body,
        file: req.file || null
      })
      if (!updated) return res.status(404).json({ message: 'Imagen no encontrada' })
      return res.json(updated)
    } catch (e) {
      return res.status(500).json({ message: 'Error actualizando imagen', detail: e.message })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Falta el parámetro id' })

      const ok = await this.ImagenModel.delete({ id })
      if (!ok) return res.status(404).send('<h1>Imagen no encontrada</h1>')

      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(500).send('<h1>Error en el servidor</h1>')
    }
  }
}
