// ImagenModel.js (ESM) — versión SQL sin punto y coma
import { randomUUID } from 'crypto'
import { pool } from '../Conexion/Sql.js'

// Mapea columnas SQL -> shape que ya usaba tu API (ID, Nombre, SRC)
const mapRow = r => ({
  ID: r.id,
  Nombre: r.nombre,
  SRC: r.src
})

// campos permitidos para PATCH
const ALLOWED_FIELDS = new Set([
  'Nombre', 'SRC',
  'nombre', 'src'
])

function toDbFields (input = {}) {
  const out = {}
  if ('nombre' in input || 'Nombre' in input) out.nombre = input.nombre ?? input.Nombre
  if ('src' in input || 'SRC' in input) out.src = input.src ?? input.SRC
  return out
}

export class ImagenModel {
  static async getAll () {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nombre,
        src
      FROM imagen
      ORDER BY nombre ASC
      `
    )
    return rows.map(mapRow)
  }

  static async getById ({ id }) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nombre,
        src
      FROM imagen
      WHERE id = ?
      LIMIT 1
      `,
      [String(id)]
    )
    return rows.length ? mapRow(rows[0]) : null
  }

  static async create ({ body, file }) {
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:1234'
    if (!file) throw new Error('No se recibió ninguna imagen')

    const imageUrl = `${PUBLIC_BASE_URL}/uploads/${file.filename}`
    const id = randomUUID()

    await pool.execute(
      `
      INSERT INTO imagen (id, nombre, src)
      VALUES (?, ?, ?)
      `,
      [id, body?.nombre ?? null, imageUrl]
    )

    return await this.getById({ id })
  }

  static async update ({ id, input = {}, file = null }) {
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:5173'
    if (!id) return null

    // filtrar campos permitidos del payload
    const clean = {}
    for (const k of Object.keys(input)) {
      if (ALLOWED_FIELDS.has(k)) clean[k] = input[k]
    }

    // si viene archivo, prioriza nuevo src generado por el upload
    // ej: multer guardó en public/uploads y aquí armamos la url pública
    if (file) {
      clean.src = `${PUBLIC_BASE_URL}/uploads/${file.filename}`
    }

    const data = toDbFields(clean)
    const cols = Object.keys(data)
    const vals = Object.values(data)

    if (cols.length === 0) {
      // nada para actualizar
      const [rows] = await pool.query(
        'SELECT id, nombre, src FROM imagen WHERE id = ? LIMIT 1',
        [String(id)]
      )
      return rows.length ? mapRow(rows[0]) : null
    }

    const setSql = cols.map(c => `${c} = ?`).join(', ')
    const sql = `UPDATE imagen SET ${setSql} WHERE id = ?`

    const [res] = await pool.execute(sql, [...vals, String(id)])
    if (res.affectedRows === 0) return null

    const [rows] = await pool.query(
      'SELECT id, nombre, src FROM imagen WHERE id = ? LIMIT 1',
      [String(id)]
    )
    return rows.length ? mapRow(rows[0]) : null
  }

  static async delete ({ id }) {
    // Si tenés FK con ON DELETE CASCADE en cortina_imagen,
    // las relaciones se borran automáticamente
    const [res] = await pool.execute(
      `
      DELETE FROM imagen
      WHERE id = ?
      `,
      [String(id)]
    )
    return res.affectedRows > 0
  }
}
