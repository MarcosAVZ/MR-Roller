import { randomUUID } from 'crypto'
import { pool } from '../Conexion/Sql.js'

const mapRow = (r) => ({
  ID: r.id,
  Nombre: r.nombre,
  Descripcion: r.descripcion
})

export class CategoriaModel {
  static async getAll () {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion FROM categoria ORDER BY nombre ASC'
    )
    return rows.map(mapRow)
  }

  static async getById (id) {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion FROM categoria WHERE id = ? LIMIT 1',
      [String(id)]
    )
    return rows.length ? mapRow(rows[0]) : null
  }

  static async create (input) {
    const id = randomUUID()

    // aceptar lower y Upper
    const nombre = input?.nombre ?? input?.Nombre ?? null
    const descripcion = input?.descripcion ?? input?.Descripcion ?? null

    await pool.execute(
      'INSERT INTO categoria (id, nombre, descripcion) VALUES (?, ?, ?)',
      [id, nombre, descripcion]
    )

    return await this.getById(id)
  }

  static async delete (id) {
    const [result] = await pool.execute(
      'DELETE FROM categoria WHERE id = ?',
      [String(id)]
    )
    return result.affectedRows > 0
  }
}
