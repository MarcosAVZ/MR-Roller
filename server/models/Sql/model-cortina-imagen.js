// models/Sql/model-cortina-imagen.js
import { pool } from '../Conexion/Sql.js'

export class CortinaImagenModel {
  static async attach ({ cortinaId, imagenIds = [] }) {
    if (!cortinaId || !Array.isArray(imagenIds) || imagenIds.length === 0) {
      const err = new Error('cortinaId e imagenIds son requeridos')
      err.status = 400
      throw err
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [c] = await conn.query('SELECT 1 FROM cortina WHERE id = ? LIMIT 1', [String(cortinaId)])
      if (!c.length) {
        await conn.rollback()
        const err = new Error('Cortina no encontrada')
        err.status = 404
        throw err
      }

      // opcional: podrías validar que todas las imágenes existan
      for (const imagenId of imagenIds) {
        await conn.execute(
          'INSERT IGNORE INTO cortina_imagen (id_imagen, id_cortina) VALUES (?, ?)',
          [String(imagenId), String(cortinaId)]
        )
      }

      await conn.commit()
      return { cortinaId, attached: imagenIds }
    } catch (e) {
      await conn.rollback()
      const err = new Error(e.sqlMessage || e.message)
      err.status = 500
      throw err
    } finally {
      conn.release()
    }
  }

  // Desvincular una imagen de una cortina
  static async delete ({ cortinaId, imagenId }) {
    if (!cortinaId || !imagenId) return false
    const [res] = await pool.execute(
      'DELETE FROM cortina_imagen WHERE id_cortina = ? AND id_imagen = ?',
      [String(cortinaId), String(imagenId)]
    )
    return res.affectedRows > 0
  }

  // (Opcional) Listar imágenes vinculadas — útil si querés centralizar acá también
  static async getByCortina ({ cortinaId }) {
    const [rows] = await pool.query(
      `
      SELECT i.id, i.nombre, i.src
      FROM imagen i
      JOIN cortina_imagen ci ON ci.id_imagen = i.id
      WHERE ci.id_cortina = ?
      ORDER BY i.nombre ASC
      `,
      [String(cortinaId)]
    )
    return rows.map(r => ({ ID: r.id, Nombre: r.nombre, SRC: r.src }))
  }
}
