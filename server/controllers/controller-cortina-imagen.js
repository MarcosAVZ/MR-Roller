// controllers/controller-cortina-imagen.js
export class CortinaImagenController {
  constructor ({ cortinaImagenModel }) {
    this.CortinaImagenModel = cortinaImagenModel
  }

  // POST /cortinas/:id/imagenes/link
  link = async (req, res) => {
    try {
      const { id } = req.params
      const { imagenIds } = req.body
      const out = await this.CortinaImagenModel.attach({ cortinaId: id, imagenIds })
      return res.status(201).json(out)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // GET /cortinas/:id/imagenes
  list = async (req, res) => {
    try {
      const { id } = req.params
      const data = await this.CortinaImagenModel.getByCortina({ cortinaId: id })
      return res.status(200).json(data)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // DELETE /cortinas/:id/imagenes/:imagenId
  unlink = async (req, res) => {
    try {
      const { id, imagenId } = req.params
      const ok = await this.CortinaImagenModel.delete({ cortinaId: id, imagenId })
      if (!ok) return res.status(404).json({ error: 'Vínculo no encontrado' })
      return res.status(204).send()
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }
}
